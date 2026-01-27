export interface FrameAnalysis {
  sessionId: string;
  frameNumber: number;
  aiConfidence: number;
  forensicScore: number;
  combinedScore: number;
  anomalies: AnomalyDetection[];
  processingTime: number;
  thumbnail: string;
  metadata: FrameMetadata;
  createdAt: Date;
}

export interface FrameResult {
  frameNumber: number;
  confidence: number;
  anomalies: AnomalyDetection[];
  thumbnail: string;
  processingTime?: number;
  timestamp?: number;
}

export interface AnalysisResult {
  verdict: 'Real' | 'Fake';
  overallConfidence: number;
  processingTime: number;
  frameAnalysis: FrameResult[];
  forensicScore: number;
  aiScore: number;
  explanation: string[];
  metadata: AnalysisMetadata;
}

export interface AnalysisMetadata {
  modelVersion: string;
  processingDate: Date;
  totalFramesAnalyzed: number;
  averageProcessingTime: number;
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    processingSpeed: number;
  };
}

export interface AnomalyDetection {
  frameNumber: number;
  type: 'eye_blink' | 'temporal' | 'compression' | 'geometry' | 'lighting';
  confidence: number;
  region?: BoundingBox;
  severity: 'low' | 'medium' | 'high';
  description?: string;
  evidence?: string[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FrameMetadata {
  resolution: {
    width: number;
    height: number;
  };
  timestamp: number;
  fileSize: number;
  format?: string;
  colorSpace?: string;
}

export interface ProcessingState {
  currentFrame: number;
  totalFrames: number;
  processingSpeed: number;
  confidence: number;
  suspiciousFrames: number[];
  anomalies: AnomalyDetection[];
  startTime: Date;
  estimatedTimeRemaining?: number;
}

export interface ConfidenceScore {
  overall: number;
  ai: number;
  forensic: number;
  temporal: number;
  frameWise: number[];
}

export interface TemporalAnalysis {
  frameSequence: number[];
  confidenceTrend: number[];
  anomalySpikes: number[];
  consistencyScore: number;
}