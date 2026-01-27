// Import required types
import { AnalysisResult, AnomalyDetection, FrameResult, ProcessingState } from './analysis';
import { SystemMetrics, ServiceHealth, UploadState } from './system';

// UI Component interfaces for React frontend

export interface VideoUploadProps {
  onUpload: (file: File) => void;
  maxSize: number;
  acceptedFormats: string[];
  disabled?: boolean;
  uploadState?: UploadState;
}

export interface RealTimeProcessingProps {
  sessionId: string;
  processingState: ProcessingState;
  onStop?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

export interface ResultDashboardProps {
  result: AnalysisResult;
  onExport?: () => void;
  onReanalyze?: () => void;
  onDownloadReport?: () => void;
}

export interface FrameVisualizationProps {
  frame: FrameResult;
  isSelected?: boolean;
  onSelect?: (frameNumber: number) => void;
  showThumbnail?: boolean;
  showAnomalies?: boolean;
}

export interface AnomalyAnnotationProps {
  anomaly: AnomalyDetection;
  frameSize: { width: number; height: number };
  color?: string;
  showLabel?: boolean;
}

export interface MetricsDashboardProps {
  metrics: SystemMetrics;
  serviceHealth: ServiceHealth[];
  refreshInterval?: number;
  onRefresh?: () => void;
}

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  estimatedTimeRemaining?: number;
}

export interface ConfidenceVisualizationProps {
  confidence: number;
  threshold?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}