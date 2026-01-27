import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() { }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deepfake-detector';

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false // Disable mongoose buffering
      });

      this.isConnected = true;
      console.log('Connected to MongoDB successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
        this.isConnected = true;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnectionActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnectionState(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }

  public async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      if (!this.isConnectionActive()) {
        return {
          status: 'unhealthy',
          details: {
            state: this.getConnectionState(),
            error: 'Database not connected'
          }
        };
      }

      // Perform a simple query to test the connection
      if (mongoose.connection.db) {
        const adminDb = mongoose.connection.db.admin();
        const result = await adminDb.ping();

        return {
          status: 'healthy',
          details: {
            state: this.getConnectionState(),
            ping: result,
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
          }
        };
      } else {
        return {
          status: 'unhealthy',
          details: {
            state: this.getConnectionState(),
            error: 'Database connection not available'
          }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          state: this.getConnectionState(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance();