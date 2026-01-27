export interface SystemMetrics {
  timestamp: Date;
  processingSpeed: number; // frames per second
  queueLength: number;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  throughput: number;
  latency: number;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  uptime: number;
  version: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error?: string;
  bytesUploaded?: number;
  totalBytes?: number;
  uploadSpeed?: number;
}

export interface ProcessingQueue {
  sessionId: string;
  frameNumber: number;
  frameData: Buffer;
  priority: number;
  timestamp: Date;
  retryCount?: number;
  estimatedProcessingTime?: number;
}

export interface SessionState {
  sessionId: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  currentFrame: number;
  totalFrames: number;
  processingSpeed: number;
  websocketConnections: string[];
  startTime: Date;
  lastUpdate: Date;
  progress: number;
  estimatedCompletion?: Date;
}

export interface ResourceUsage {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    available: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connectionsActive: number;
  };
}

export interface PerformanceMetrics {
  timestamp: Date;
  service: string;
  metrics: {
    requestsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
    successRate: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
}