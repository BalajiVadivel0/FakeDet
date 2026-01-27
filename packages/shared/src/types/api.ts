import { AnalysisResult, AnomalyDetection, FrameResult } from './analysis';
import { SystemMetrics, ServiceHealth } from './system';

// Video Processing API
export interface AnalyzeVideoRequest {
  video: File;
  options?: {
    realTime: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    includeFrameAnalysis: boolean;
    maxFrames?: number;
    skipFrames?: number;
  };
}

export interface AnalyzeVideoResponse {
  sessionId: string;
  status: 'processing' | 'completed' | 'failed';
  websocketUrl: string;
  estimatedProcessingTime?: number;
  queuePosition?: number;
}

// WebSocket Events
export interface ProcessingUpdate {
  type: 'frame_processed' | 'analysis_complete' | 'error' | 'progress_update';
  data: {
    frameNumber?: number;
    confidence?: number;
    anomalies?: AnomalyDetection[];
    result?: AnalysisResult;
    error?: string;
    progress?: number;
    estimatedTimeRemaining?: number;
  };
}

// AI Inference Service API
export interface FrameAnalysisRequest {
  frameData: Buffer;
  frameNumber: number;
  sessionId: string;
  options?: {
    modelVersion?: string;
    threshold?: number;
  };
}

export interface FrameAnalysisResponse {
  frameNumber: number;
  confidence: number;
  probability: {
    real: number;
    fake: number;
  };
  processingTime: number;
  modelVersion: string;
  features?: number[];
}

// Forensic Verification API
export interface ForensicAnalysisRequest {
  frames: Buffer[];
  frameNumbers: number[];
  sessionId: string;
  options?: {
    analysisTypes?: ('eye_blink' | 'temporal' | 'compression' | 'geometry' | 'lighting')[];
    sensitivity?: 'low' | 'medium' | 'high';
  };
}

export interface ForensicAnalysisResponse {
  sessionId: string;
  analyses: {
    eyeBlinkScore: number;
    temporalConsistencyScore: number;
    compressionArtifactScore: number;
    geometryConsistencyScore: number;
    lightingConsistencyScore: number;
  };
  anomalies: AnomalyDetection[];
  overallScore: number;
  processingTime: number;
  confidence: number;
}

// Decision Fusion API
export interface DecisionFusionRequest {
  sessionId: string;
  aiScore: number;
  forensicScores: {
    eyeBlink: number;
    temporal: number;
    compression: number;
    geometry: number;
    lighting: number;
  };
  anomalies: AnomalyDetection[];
  frameCount: number;
}

export interface DecisionFusionResponse {
  finalScore: number;
  verdict: 'Real' | 'Fake';
  confidence: number;
  contributingFactors: ContributingFactor[];
  explanation: string[];
  processingTime: number;
}

export interface ContributingFactor {
  factor: string;
  score: number;
  weight: number;
  importance: number;
}

// System API
export interface SystemStatusRequest {
  includeMetrics?: boolean;
  includeHealth?: boolean;
}

export interface SystemStatusResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  metrics?: SystemMetrics;
  version: string;
}

// Session Management API
export interface CreateSessionRequest {
  userId: string;
  filename: string;
  fileSize: number;
  metadata?: {
    originalName: string;
    mimeType: string;
  };
}

export interface CreateSessionResponse {
  sessionId: string;
  uploadUrl: string;
  websocketUrl: string;
  expiresAt: Date;
}

export interface GetSessionRequest {
  sessionId: string;
  includeFrameAnalysis?: boolean;
}

export interface GetSessionResponse {
  session: {
    id: string;
    status: string;
    progress: number;
    result?: AnalysisResult;
    createdAt: Date;
    completedAt?: Date;
  };
  frameAnalysis?: FrameResult[];
}

// Error Response
export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  timestamp: Date;
  details?: any;
}