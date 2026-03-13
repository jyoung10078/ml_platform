export interface ModelParameter {
  id: string;
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  value?: any;
  description?: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  parameters: ModelParameter[];
  status: 'draft' | 'submitted' | 'training' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  timestamp: Date;
}

export interface ModelPerformance {
  modelId: string;
  modelName: string;
  metrics: ModelMetrics[];
  trainingTime: number;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'training' | 'error';
}

export interface PredictionFile {
  id: string;
  filename: string;
  size: number;
  recordCount: number;
  uploadDate: Date;
  modelId: string;
  modelName: string;
  accuracy: number;
  status: 'processing' | 'completed' | 'failed';
}

export type ViewType = 'dashboard' | 'parameters' | 'performance' | 'predictions';