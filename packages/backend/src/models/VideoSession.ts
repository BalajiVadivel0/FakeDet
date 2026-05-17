import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    verdict: { type: String, required: true },
    overallConfidence: { type: Number, required: true },
    aiScore: { type: Number, required: true },
    forensicScore: { type: Number, required: true },
    processingTime: { type: Number, required: true },
    explanation: { type: [String], required: true },
    metadata: {
      modelVersion: { type: String, required: true },
      processingDate: { type: Date, required: true },
      totalFramesAnalyzed: { type: Number, required: true },
      averageProcessingTime: { type: Number, required: true },
      systemMetrics: {
        cpuUsage: { type: Number, required: true },
        memoryUsage: { type: Number, required: true },
        processingSpeed: { type: Number, required: true }
      }
    },
    frameAnalysis: { type: [mongoose.Schema.Types.Mixed], required: false }
  },
  { _id: false }
);

const metadataSchema = new mongoose.Schema(
  {
    resolution: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    codec: { type: String, required: true },
    bitrate: { type: Number, required: true },
    fps: { type: Number, required: true }
  },
  { _id: false }
);

const videoSessionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    filename: { type: String, required: true },
    fileSize: { type: Number, required: true },
    duration: { type: Number, required: true },
    totalFrames: { type: Number, required: true },
    status: { type: String, required: true },
    result: { type: resultSchema, required: true },
    metadata: { type: metadataSchema, required: true }
  },
  {
    timestamps: true
  }
);

export const VideoSession = mongoose.model('VideoSession', videoSessionSchema);
