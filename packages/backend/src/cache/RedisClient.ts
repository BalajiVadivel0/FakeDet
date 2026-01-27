import { createClient, RedisClientType } from 'redis';
import { 
  SessionState, 
  ProcessingQueue, 
  SystemMetrics, 
  ProcessingState,
  UploadState 
} from '@deepfake-detector/shared';

export class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  // Session State Management
  async setSessionState(sessionId: string, state: SessionState): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.hSet(key, {
      sessionId: state.sessionId,
      status: state.status,
      currentFrame: state.currentFrame.toString(),
      totalFrames: state.totalFrames.toString(),
      processingSpeed: state.processingSpeed.toString(),
      websocketConnections: JSON.stringify(state.websocketConnections),
      startTime: state.startTime.toISOString(),
      lastUpdate: state.lastUpdate.toISOString(),
      progress: state.progress.toString(),
      estimatedCompletion: state.estimatedCompletion?.toISOString() || ''
    });
    
    // Set expiration to 24 hours
    await this.client.expire(key, 24 * 60 * 60);
  }

  async getSessionState(sessionId: string): Promise<SessionState | null> {
    const key = `session:${sessionId}`;
    const data = await this.client.hGetAll(key);
    
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      sessionId: data.sessionId,
      status: data.status as SessionState['status'],
      currentFrame: parseInt(data.currentFrame),
      totalFrames: parseInt(data.totalFrames),
      processingSpeed: parseFloat(data.processingSpeed),
      websocketConnections: JSON.parse(data.websocketConnections || '[]'),
      startTime: new Date(data.startTime),
      lastUpdate: new Date(data.lastUpdate),
      progress: parseFloat(data.progress),
      estimatedCompletion: data.estimatedCompletion ? new Date(data.estimatedCompletion) : undefined
    };
  }

  async deleteSessionState(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.del(key);
  }

  async updateSessionProgress(sessionId: string, currentFrame: number, progress: number): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.hSet(key, {
      currentFrame: currentFrame.toString(),
      progress: progress.toString(),
      lastUpdate: new Date().toISOString()
    });
  }

  // Processing Queue Management
  async addToProcessingQueue(item: ProcessingQueue): Promise<void> {
    const queueKey = 'queue:frames';
    const queueItem = {
      sessionId: item.sessionId,
      frameNumber: item.frameNumber.toString(),
      priority: item.priority.toString(),
      timestamp: item.timestamp.toISOString(),
      retryCount: (item.retryCount || 0).toString(),
      estimatedProcessingTime: (item.estimatedProcessingTime || 0).toString()
    };

    // Use priority as score for sorted set
    await this.client.zAdd(queueKey, {
      score: item.priority,
      value: JSON.stringify(queueItem)
    });
  }

  async getNextFromProcessingQueue(): Promise<ProcessingQueue | null> {
    const queueKey = 'queue:frames';
    const items = await this.client.zPopMax(queueKey);
    
    if (!items) {
      return null;
    }

    const data = JSON.parse(items.value);
    return {
      sessionId: data.sessionId,
      frameNumber: parseInt(data.frameNumber),
      frameData: Buffer.alloc(0), // Frame data would be stored separately
      priority: parseInt(data.priority),
      timestamp: new Date(data.timestamp),
      retryCount: parseInt(data.retryCount || '0'),
      estimatedProcessingTime: parseInt(data.estimatedProcessingTime || '0')
    };
  }

  async getQueueLength(): Promise<number> {
    const queueKey = 'queue:frames';
    return await this.client.zCard(queueKey);
  }

  async clearProcessingQueue(): Promise<void> {
    const queueKey = 'queue:frames';
    await this.client.del(queueKey);
  }

  // System Metrics Management
  async setSystemMetrics(metrics: SystemMetrics): Promise<void> {
    const key = 'metrics:current';
    await this.client.hSet(key, {
      timestamp: metrics.timestamp.toISOString(),
      processingSpeed: metrics.processingSpeed.toString(),
      queueLength: metrics.queueLength.toString(),
      activeConnections: metrics.activeConnections.toString(),
      memoryUsage: metrics.memoryUsage.toString(),
      cpuUsage: metrics.cpuUsage.toString(),
      errorRate: metrics.errorRate.toString(),
      throughput: metrics.throughput.toString(),
      latency: metrics.latency.toString()
    });

    // Keep metrics for 1 hour
    await this.client.expire(key, 60 * 60);

    // Also store in time series for historical data
    const timeSeriesKey = `metrics:history:${new Date().toISOString().split('T')[0]}`;
    await this.client.lPush(timeSeriesKey, JSON.stringify(metrics));
    await this.client.lTrim(timeSeriesKey, 0, 1440); // Keep 24 hours of minute-by-minute data
    await this.client.expire(timeSeriesKey, 24 * 60 * 60);
  }

  async getSystemMetrics(): Promise<SystemMetrics | null> {
    const key = 'metrics:current';
    const data = await this.client.hGetAll(key);
    
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      timestamp: new Date(data.timestamp),
      processingSpeed: parseFloat(data.processingSpeed),
      queueLength: parseInt(data.queueLength),
      activeConnections: parseInt(data.activeConnections),
      memoryUsage: parseFloat(data.memoryUsage),
      cpuUsage: parseFloat(data.cpuUsage),
      errorRate: parseFloat(data.errorRate),
      throughput: parseFloat(data.throughput),
      latency: parseFloat(data.latency)
    };
  }

  async getHistoricalMetrics(date: string): Promise<SystemMetrics[]> {
    const key = `metrics:history:${date}`;
    const data = await this.client.lRange(key, 0, -1);
    
    return data.map(item => JSON.parse(item));
  }

  // WebSocket Connection Management
  async addWebSocketConnection(sessionId: string, socketId: string): Promise<void> {
    const key = `session:${sessionId}`;
    const connections = await this.client.hGet(key, 'websocketConnections');
    const connectionList = connections ? JSON.parse(connections) : [];
    
    if (!connectionList.includes(socketId)) {
      connectionList.push(socketId);
      await this.client.hSet(key, 'websocketConnections', JSON.stringify(connectionList));
    }
  }

  async removeWebSocketConnection(sessionId: string, socketId: string): Promise<void> {
    const key = `session:${sessionId}`;
    const connections = await this.client.hGet(key, 'websocketConnections');
    
    if (connections) {
      const connectionList = JSON.parse(connections);
      const filteredList = connectionList.filter((id: string) => id !== socketId);
      await this.client.hSet(key, 'websocketConnections', JSON.stringify(filteredList));
    }
  }

  // Upload State Management
  async setUploadState(sessionId: string, state: UploadState): Promise<void> {
    const key = `upload:${sessionId}`;
    await this.client.hSet(key, {
      isUploading: state.isUploading.toString(),
      progress: state.progress.toString(),
      error: state.error || '',
      bytesUploaded: (state.bytesUploaded || 0).toString(),
      totalBytes: (state.totalBytes || 0).toString(),
      uploadSpeed: (state.uploadSpeed || 0).toString()
    });

    // Set expiration to 1 hour
    await this.client.expire(key, 60 * 60);
  }

  async getUploadState(sessionId: string): Promise<UploadState | null> {
    const key = `upload:${sessionId}`;
    const data = await this.client.hGetAll(key);
    
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      isUploading: data.isUploading === 'true',
      progress: parseFloat(data.progress),
      error: data.error || undefined,
      bytesUploaded: parseInt(data.bytesUploaded || '0'),
      totalBytes: parseInt(data.totalBytes || '0'),
      uploadSpeed: parseFloat(data.uploadSpeed || '0')
    };
  }

  // Cache Management
  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    await this.client.set(key, value);
    if (expireInSeconds) {
      await this.client.expire(key, expireInSeconds);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  // Health Check
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  async getInfo(): Promise<string> {
    return await this.client.info();
  }
}

// Singleton instance
export const redisClient = new RedisClient();