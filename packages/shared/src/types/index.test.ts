import { describe, it, expect } from 'vitest';
import { 
  VideoSession, 
  AnalysisResult, 
  AnomalyDetection, 
  SystemMetrics,
  ProcessingState,
  VideoUploadProps,
  ContributingFactor
} from './index';

describe('Shared Types', () => {
  it('should export VideoSession interface', () => {
    const session: VideoSession = {
      id: 'test-id',
      userId: 'user-123',
      filename: 'test.mp4',
      fileSize: 1024,
      duration: 60,
      totalFrames: 1800,
      status: 'processing',
      createdAt: new Date()
    };
    
    expect(session.id).toBe('test-id');
    expect(session.status).toBe('processing');
  });

  it('should export AnalysisResult interface', () => {
    const result: AnalysisResult = {
      verdict: 'Fake',
      overallConfidence: 0.85,
      processingTime: 1500,
      frameAnalysis: [],
      forensicScore: 0.7,
      aiScore: 0.9,
      explanation: ['High AI confidence', 'Temporal inconsistencies detected']
    };
    
    expect(result.verdict).toBe('Fake');
    expect(result.overallConfidence).toBe(0.85);
  });

  it('should export AnomalyDetection interface', () => {
    const anomaly: AnomalyDetection = {
      frameNumber: 100,
      type: 'eye_blink',
      confidence: 0.8,
      severity: 'high'
    };
    
    expect(anomaly.type).toBe('eye_blink');
    expect(anomaly.confidence).toBe(0.8);
  });

  it('should export SystemMetrics interface', () => {
    const metrics: SystemMetrics = {
      timestamp: new Date(),
      processingSpeed: 30,
      queueLength: 5,
      activeConnections: 3,
      memoryUsage: 0.75,
      cpuUsage: 0.45,
      errorRate: 0.01
    };
    
    expect(metrics.processingSpeed).toBe(30);
    expect(metrics.queueLength).toBe(5);
  });

  it('should export ProcessingState interface', () => {
    const state: ProcessingState = {
      currentFrame: 150,
      totalFrames: 1800,
      processingSpeed: 25,
      confidence: 0.85,
      suspiciousFrames: [45, 120, 150],
      anomalies: []
    };
    
    expect(state.currentFrame).toBe(150);
    expect(state.suspiciousFrames).toHaveLength(3);
  });

  it('should export UI component interfaces', () => {
    const uploadProps: VideoUploadProps = {
      onUpload: () => {},
      maxSize: 100 * 1024 * 1024, // 100MB
      acceptedFormats: ['.mp4', '.avi', '.mov']
    };
    
    expect(uploadProps.maxSize).toBe(100 * 1024 * 1024);
    expect(uploadProps.acceptedFormats).toContain('.mp4');
  });

  it('should export ContributingFactor interface', () => {
    const factor: ContributingFactor = {
      factor: 'AI Confidence',
      score: 0.9,
      weight: 0.6,
      importance: 0.54
    };
    
    expect(factor.factor).toBe('AI Confidence');
    expect(factor.score).toBe(0.9);
  });
});