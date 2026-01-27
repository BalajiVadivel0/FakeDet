import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { databaseService } from './services/DatabaseService';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await databaseService.healthCheck();

    res.json({
      status: dbHealth.overall === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'backend-api',
      version: '1.0.0',
      database: dbHealth
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'backend-api',
      version: '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

import { VideoSession } from './models/VideoSession';
import { v4 as uuidv4 } from 'uuid';

// ... (existing imports)

// Analyze endpoint
// Configure multer to accept both image and video fields
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

app.post('/api/analyze', uploadFields, async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files['image']?.[0];
    const videoFile = files['video']?.[0];

    const file = imageFile || videoFile;

    if (!file) {
      return res.status(400).json({ error: 'No image or video file provided' });
    }

    req.file = file; // Shim for existing code using req.file

    console.log(`Received file: ${req.file.originalname} (${req.file.size} bytes)`);

    let resultData;
    const isVideo = req.file.mimetype.startsWith('video/');

    if (isVideo) {
      console.log('Processing video file...');
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
      const forensicServiceUrl = process.env.FORENSIC_SERVICE_URL || 'http://localhost:5001';

      const videoFormData = new FormData();
      videoFormData.append('video', req.file.buffer, req.file.originalname);

      // 1. Call AI Service to get frames and AI analysis
      const aiResponse = await axios.post(`${aiServiceUrl}/inference/analyze-video`, videoFormData, {
        headers: { ...videoFormData.getHeaders() },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const aiData = aiResponse.data;
      const frames = aiData.frames || [];
      const frameAnalysis = [];
      let totalForensicScore = 0;

      // 2. Process extracted frames with Forensic Engine
      // We only take the first few frames if too many are returned, but AI service limits to 5-10
      console.log(`Extracted ${frames.length} frames for forensic analysis`);

      for (let i = 0; i < frames.length; i++) {
        const frameBase64 = frames[i]; // "data:image/jpeg;base64,..."
        const base64Data = frameBase64.split(';base64,').pop();

        if (base64Data) {
          const frameBuffer = Buffer.from(base64Data, 'base64');
          const forensicFormData = new FormData();
          forensicFormData.append('image', frameBuffer, `frame_${i}.jpg`);

          try {
            const forensicRes = await axios.post(`${forensicServiceUrl}/forensic/analyze-frame`, forensicFormData, {
              headers: { ...forensicFormData.getHeaders() }
            });

            // Simple scoring: if ELA detected, high forensic score on this frame
            // This is a placeholder logic. Real logic depends on forensic engine output structure.
            // Assuming forensicRes.data has { ela: "...", metadata: ... }
            const frameScore = forensicRes.data.ela ? 0.8 : 0.1;
            totalForensicScore += frameScore;

            frameAnalysis.push({
              frameIndex: i,
              forensic: forensicRes.data
            });
          } catch (err) {
            console.error(`Forensic analysis failed for frame ${i}`, err);
          }
        }
      }

      // 3. Aggregate Results
      const avgForensicScore = frames.length > 0 ? totalForensicScore / frames.length : 0;

      // Clean up frames from resultData if we don't want to send them all back to frontend immediately
      // OR keep them if specific UI needs them. For now, let's keep them in the object.

      resultData = {
        ...aiData,
        forensicScore: avgForensicScore,
        frameAnalysis: frameAnalysis,
        // Ensure strictly typed result matches what frontend expects roughly
      };

      /* End of Video Logic Block */

    } else {
      // Image Logic
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
      const forensicServiceUrl = process.env.FORENSIC_SERVICE_URL || 'http://localhost:5001';

      console.log(`Starting analysis for ${req.file.originalname}`);

      const aiFormData = new FormData();
      aiFormData.append('image', req.file.buffer, req.file.originalname);

      const forensicFormData = new FormData();
      forensicFormData.append('image', req.file.buffer, req.file.originalname);

      const [aiResponse, forensicResponse] = await Promise.all([
        axios.post(`${aiServiceUrl}/inference/analyze-frame`, aiFormData, {
          headers: { ...aiFormData.getHeaders() }
        }).catch(err => ({ data: { error: 'AI Service failed', is_fake: false, confidence: 0, distribution: { real: 0, fake: 0 } } })),
        axios.post(`${forensicServiceUrl}/forensic/analyze-frame`, forensicFormData, {
          headers: { ...forensicFormData.getHeaders() }
        }).catch(err => ({ data: { error: 'Forensic Service failed', metadata: {}, ela: null } }))
      ]);

      resultData = {
        ...aiResponse.data,
        forensic: forensicResponse.data
      };
    }

    // Save to Database
    try {
      const session = new VideoSession({
        id: uuidv4(),
        userId: 'anonymous-user', // Placeholder util auth is added
        filename: req.file.originalname,
        fileSize: req.file.size,
        duration: resultData.duration || 0,
        totalFrames: resultData.framesAnalyzed || 1,
        status: 'completed',
        result: {
          verdict: resultData.is_fake ? 'Fake' : 'Real',
          overallConfidence: resultData.confidence,
          aiScore: resultData.confidence,
          forensicScore: resultData.forensicScore || 0,
          processingTime: 0,
          explanation: ['Automated Analysis'],
          metadata: {
            modelVersion: '1.0.0',
            processingDate: new Date(),
            totalFramesAnalyzed: resultData.framesAnalyzed || 1,
            averageProcessingTime: 0,
            systemMetrics: { cpuUsage: 0, memoryUsage: 0, processingSpeed: 0 }
          },
          frameAnalysis: resultData.frameAnalysis || []
        },
        metadata: {
          resolution: resultData.resolution || { width: 0, height: 0 },
          codec: 'unknown',
          bitrate: 0,
          fps: resultData.fps || 0
        }
      });
      await session.save();
      console.log('Session saved:', session.id);
    } catch (dbError) {
      console.error('Failed to save session:', dbError);
      // Don't fail the request if DB save fails
    }

    res.json(resultData);

  } catch (error: any) {
    console.error('Analysis error:', error.message);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

// History Endpoint
app.get('/api/history', async (req, res) => {
  try {
    const history = await VideoSession.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// API routes placeholder
app.get('/api/status', async (req, res) => {
  try {
    const dbHealth = await databaseService.healthCheck();

    res.json({
      message: 'Deepfake Detection API is running',
      services: {
        backend: 'healthy',
        mongodb: dbHealth.mongodb.status,
        redis: dbHealth.redis.status,
        aiService: process.env.AI_SERVICE_URL || 'http://localhost:5000',
        forensicService: process.env.FORENSIC_SERVICE_URL || 'http://localhost:5001'
      },
      database: dbHealth
    });
  } catch (error) {
    res.status(503).json({
      message: 'Deepfake Detection API is running with issues',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Client ${socket.id} joined session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database connections and start server
async function startServer() {
  try {
    // Initialize database connections
    await databaseService.initialize();

    // Start the server
    server.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`AI Service URL: ${process.env.AI_SERVICE_URL || 'http://localhost:5000'}`);
      console.log(`Forensic Service URL: ${process.env.FORENSIC_SERVICE_URL || 'http://localhost:5001'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await databaseService.shutdown();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      await databaseService.shutdown();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();