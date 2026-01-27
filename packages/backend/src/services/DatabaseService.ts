import { dbConnection } from '../database/connection';
import { redisClient } from '../cache/RedisClient';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    console.log('Initializing database connections...');

    try {
      // Connect to MongoDB
      await dbConnection.connect();
      console.log('✓ MongoDB connection established');

      // Connect to Redis
      await redisClient.connect();
      console.log('✓ Redis connection established');

      console.log('Database service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    console.log('Shutting down database connections...');

    try {
      await dbConnection.disconnect();
      console.log('✓ MongoDB disconnected');

      await redisClient.disconnect();
      console.log('✓ Redis disconnected');

      console.log('Database service shutdown complete');
    } catch (error) {
      console.error('Error during database service shutdown:', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<{
    mongodb: { status: string; details: any };
    redis: { status: string; details: any };
    overall: string;
  }> {
    const mongoHealth = await dbConnection.healthCheck();
    
    let redisHealth;
    try {
      const ping = await redisClient.ping();
      redisHealth = {
        status: 'healthy',
        details: { ping, connected: true }
      };
    } catch (error) {
      redisHealth = {
        status: 'unhealthy',
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          connected: false 
        }
      };
    }

    const overall = mongoHealth.status === 'healthy' && redisHealth.status === 'healthy' 
      ? 'healthy' 
      : 'unhealthy';

    return {
      mongodb: mongoHealth,
      redis: redisHealth,
      overall
    };
  }
}

export const databaseService = DatabaseService.getInstance();