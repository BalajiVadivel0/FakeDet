import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { ForensicAnalyzer } from './analyzer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Setup multer for memory storage (processing frames in memory)
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const analyzer = new ForensicAnalyzer();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'forensic-verification',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Forensic analysis endpoint
// Accepts an image file (frame)
app.post('/forensic/analyze-frame', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await analyzer.analyzeFrame(req.file.buffer);

    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: 'Internal processing error' });
  }
});

app.listen(PORT, () => {
  console.log(`Forensic engine running on port ${PORT}`);
});
