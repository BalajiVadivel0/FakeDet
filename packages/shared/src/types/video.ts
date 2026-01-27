import { FrameResult, AnalysisResult } from './analysis';

export interface VideoSession {
  id: string;
  userId: string;
  filename: string;
  fileSize: number;
  duration: number;
  totalFrames: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  result?: AnalysisResult;
  metadata?: VideoMetadata;
  uploadProgress?: number;
  errorMessage?: string;
}

export interface VideoMetadata {
  resolution: {
    width: number;
    height: number;
  };
  codec: string;
  bitrate: number;
  fps: number;
  format?: string;
  duration?: number;
  hasAudio?: boolean;
}

export interface VideoUploadInfo {
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  checksum?: string;
}