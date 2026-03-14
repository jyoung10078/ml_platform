import {
  SageMakerClient,
  ListTrainingJobsCommand,
  DescribeTrainingJobCommand,
  ListTransformJobsCommand,
  DescribeTransformJobCommand,
  ListModelsCommand,
  CreateTrainingJobCommand,
} from '@aws-sdk/client-sagemaker';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { ModelPerformance, ModelMetrics, PredictionFile, ModelParameter } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStatsData {
  activeModels: number;
  totalPredictions: number;
  avgAccuracy: number;
  avgProcessingTimeSec: number;
}

export interface ActivityItem {
  id: string | number;
  type: 'model_trained' | 'model_training' | 'prediction_batch' | 'model_deployed' | 'alert';
  title: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

// ---------------------------------------------------------------------------
// Credential helpers
// ---------------------------------------------------------------------------

export function isAwsConfigured(): boolean {
  return !!(
    import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  );
}

const REGION = () => import.meta.env.VITE_AWS_REGION ?? 'us-east-1';

function makeCredentials() {
  return {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
    ...(import.meta.env.VITE_AWS_SESSION_TOKEN
      ? { sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN as string }
      : {}),
  };
}

function makeSageMakerClient() {
  return new SageMakerClient({ region: REGION(), credentials: makeCredentials() });
}

function makeS3Client() {
  return new S3Client({ region: REGION(), credentials: makeCredentials() });
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function trainingStatusToPerf(s: string): ModelPerformance['status'] {
  if (s === 'InProgress') return 'training';
  if (s === 'Completed') return 'active';
  if (s === 'Failed') return 'error';
  return 'inactive';
}

function transformStatusToFile(s: string): PredictionFile['status'] {
  if (s === 'InProgress') return 'processing';
  if (s === 'Completed') return 'completed';
  return 'failed';
}

// Maps the variety of SageMaker metric names to our ModelMetrics fields
const METRIC_MAP: Record<string, keyof Omit<ModelMetrics, 'timestamp'>> = {
  accuracy: 'accuracy',
  'train:accuracy': 'accuracy',
  'validation:accuracy': 'accuracy',
  'test:accuracy': 'accuracy',
  precision: 'precision',
  'validation:precision': 'precision',
  recall: 'recall',
  'validation:recall': 'recall',
  f1: 'f1Score',
  f1_score: 'f1Score',
  'validation:f1': 'f1Score',
  'validation:f1-score': 'f1Score',
  rmse: 'rmse',
  'validation:rmse': 'rmse',
  mae: 'mae',
  'validation:mae': 'mae',
  r2: 'r2Score',
  r_squared: 'r2Score',
  'validation:r2': 'r2Score',
};

function extractMetrics(
  finalMetrics: Array<{ MetricName?: string; Value?: number; Timestamp?: Date }>,
  fallbackTime: Date
): ModelMetrics {
  const partial: Partial<ModelMetrics> = {};
  for (const m of finalMetrics) {
    const key = METRIC_MAP[m.MetricName?.toLowerCase() ?? ''];
    if (key && m.Value !== undefined) (partial as Record<string, number>)[key] = m.Value;
  }
  return {
    accuracy: partial.accuracy ?? 0,
    precision: partial.precision ?? 0,
    recall: partial.recall ?? 0,
    f1Score: partial.f1Score ?? 0,
    rmse: partial.rmse,
    mae: partial.mae,
    r2Score: partial.r2Score,
    timestamp: fallbackTime,
  };
}

// ---------------------------------------------------------------------------
// Mock data — used when AWS is unconfigured or a call fails
// ---------------------------------------------------------------------------

const MOCK_PERFORMANCE_DATA: ModelPerformance[] = [
  {
    modelId: 'customer-churn',
    modelName: 'Customer Churn Prediction',
    trainingTime: 45,
    lastUpdated: new Date('2024-01-15T10:30:00'),
    status: 'active',
    metrics: [
      { accuracy: 0.942, precision: 0.934, recall: 0.928, f1Score: 0.931, timestamp: new Date('2024-01-15T10:00:00') },
      { accuracy: 0.938, precision: 0.931, recall: 0.925, f1Score: 0.928, timestamp: new Date('2024-01-14T10:00:00') },
      { accuracy: 0.935, precision: 0.928, recall: 0.922, f1Score: 0.925, timestamp: new Date('2024-01-13T10:00:00') },
      { accuracy: 0.933, precision: 0.925, recall: 0.919, f1Score: 0.922, timestamp: new Date('2024-01-12T10:00:00') },
      { accuracy: 0.930, precision: 0.922, recall: 0.916, f1Score: 0.919, timestamp: new Date('2024-01-11T10:00:00') },
    ],
  },
  {
    modelId: 'sales-forecast',
    modelName: 'Sales Forecasting',
    trainingTime: 67,
    lastUpdated: new Date('2024-01-15T09:15:00'),
    status: 'active',
    metrics: [
      { accuracy: 0.887, precision: 0.881, recall: 0.874, f1Score: 0.877, rmse: 125.4, mae: 98.2, r2Score: 0.834, timestamp: new Date('2024-01-15T09:00:00') },
      { accuracy: 0.883, precision: 0.878, recall: 0.871, f1Score: 0.874, rmse: 128.1, mae: 101.3, r2Score: 0.829, timestamp: new Date('2024-01-14T09:00:00') },
      { accuracy: 0.880, precision: 0.875, recall: 0.868, f1Score: 0.871, rmse: 130.7, mae: 104.1, r2Score: 0.825, timestamp: new Date('2024-01-13T09:00:00') },
    ],
  },
  {
    modelId: 'fraud-detection',
    modelName: 'Fraud Detection',
    trainingTime: 23,
    lastUpdated: new Date('2024-01-15T08:45:00'),
    status: 'training',
    metrics: [
      { accuracy: 0.965, precision: 0.958, recall: 0.951, f1Score: 0.954, timestamp: new Date('2024-01-14T08:00:00') },
      { accuracy: 0.962, precision: 0.955, recall: 0.948, f1Score: 0.951, timestamp: new Date('2024-01-13T08:00:00') },
    ],
  },
];

const MOCK_PREDICTION_FILES: PredictionFile[] = [
  { id: '1', filename: 'customer_churn_predictions_2024-01-15.csv', size: 2.4, recordCount: 15420, uploadDate: new Date('2024-01-15T14:30:00'), modelId: 'customer-churn', modelName: 'Customer Churn Prediction', accuracy: 0.942, status: 'completed' },
  { id: '2', filename: 'sales_forecast_Q1_2024.csv', size: 1.8, recordCount: 8760, uploadDate: new Date('2024-01-15T13:15:00'), modelId: 'sales-forecast', modelName: 'Sales Forecasting', accuracy: 0.887, status: 'completed' },
  { id: '3', filename: 'fraud_detection_batch_001.csv', size: 5.2, recordCount: 25000, uploadDate: new Date('2024-01-15T12:00:00'), modelId: 'fraud-detection', modelName: 'Fraud Detection', accuracy: 0.965, status: 'processing' },
  { id: '4', filename: 'customer_segments_analysis.csv', size: 3.1, recordCount: 12000, uploadDate: new Date('2024-01-14T16:45:00'), modelId: 'customer-churn', modelName: 'Customer Churn Prediction', accuracy: 0.938, status: 'completed' },
  { id: '5', filename: 'monthly_sales_predictions.csv', size: 0.9, recordCount: 3000, uploadDate: new Date('2024-01-14T11:30:00'), modelId: 'sales-forecast', modelName: 'Sales Forecasting', accuracy: 0.883, status: 'failed' },
];

const MOCK_STATS: DashboardStatsData = {
  activeModels: 3,
  totalPredictions: 12847,
  avgAccuracy: 0.942,
  avgProcessingTimeSec: 2.3,
};

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 1, type: 'model_trained', title: 'Customer Churn Model completed training', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'prediction_batch', title: 'Batch prediction job processed 1,200 records', time: '4 hours ago', status: 'success' },
  { id: 3, type: 'model_deployed', title: 'Sales Forecast Model deployed to production', time: '6 hours ago', status: 'success' },
  { id: 4, type: 'alert', title: 'Model accuracy dropped below threshold', time: '1 day ago', status: 'warning' },
];

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Returns SageMaker training jobs mapped to ModelPerformance, or mock data on failure. */
export async function getModelPerformances(): Promise<ModelPerformance[]> {
  if (!isAwsConfigured()) return MOCK_PERFORMANCE_DATA;

  try {
    const client = makeSageMakerClient();
    const { TrainingJobSummaries: jobs = [] } = await client.send(
      new ListTrainingJobsCommand({ MaxResults: 20, SortBy: 'CreationTime', SortOrder: 'Descending' })
    );

    const detailed = await Promise.all(
      jobs.slice(0, 10).map(j =>
        client.send(new DescribeTrainingJobCommand({ TrainingJobName: j.TrainingJobName! })).catch(() => null)
      )
    );

    return detailed
      .filter((j): j is NonNullable<typeof j> => j !== null)
      .map(job => {
        const start = job.TrainingStartTime;
        const end = job.TrainingEndTime;
        const trainingTime = start && end ? Math.round((end.getTime() - start.getTime()) / 60_000) : 0;
        const ts = job.LastModifiedTime ?? new Date();
        const metrics = job.FinalMetricDataList?.length
          ? [extractMetrics(job.FinalMetricDataList, ts)]
          : [{ accuracy: 0, precision: 0, recall: 0, f1Score: 0, timestamp: ts }];

        return {
          modelId: job.TrainingJobName!,
          modelName: job.TrainingJobName!.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          trainingTime,
          lastUpdated: ts,
          status: trainingStatusToPerf(job.TrainingJobStatus ?? ''),
          metrics,
        } satisfies ModelPerformance;
      });
  } catch (err) {
    console.warn('[B Magic] getModelPerformances failed, using mock:', err);
    return MOCK_PERFORMANCE_DATA;
  }
}

/** Returns SageMaker transform jobs as PredictionFiles, with S3 file sizes where accessible. */
export async function getPredictionFiles(): Promise<PredictionFile[]> {
  if (!isAwsConfigured()) return MOCK_PREDICTION_FILES;

  try {
    const smClient = makeSageMakerClient();
    const s3Client = makeS3Client();

    const [{ TransformJobSummaries: jobs = [] }, accuracyMap] = await Promise.all([
      smClient.send(new ListTransformJobsCommand({ MaxResults: 20, SortBy: 'CreationTime', SortOrder: 'Descending' })),
      buildModelAccuracyMap(smClient),
    ]);

    return Promise.all(
      jobs.map(async (job): Promise<PredictionFile> => {
        let size = 0;
        try {
          const desc = await smClient.send(new DescribeTransformJobCommand({ TransformJobName: job.TransformJobName! }));
          const s3OutputPath = desc.TransformOutput?.S3OutputPath;
          if (s3OutputPath) {
            const withoutScheme = s3OutputPath.replace(/^s3:\/\//, '');
            const slashIdx = withoutScheme.indexOf('/');
            const bucket = withoutScheme.slice(0, slashIdx);
            const prefix = withoutScheme.slice(slashIdx + 1);
            const key = `${prefix}/${job.TransformJobName}.csv.out`.replace(/\/+/g, '/');
            const head = await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key })).catch(() => null);
            if (head?.ContentLength) size = head.ContentLength / (1024 * 1024);
          }
        } catch { /* file metadata unavailable — size stays 0 */ }

        const modelName = job.ModelName ?? 'Unknown Model';
        return {
          id: job.TransformJobName!,
          filename: `${job.TransformJobName}.csv`,
          size,
          recordCount: 0, // not available from SageMaker metadata
          uploadDate: job.CreationTime ?? new Date(),
          modelId: modelName,
          modelName,
          accuracy: accuracyMap.get(modelName) ?? 0,
          status: transformStatusToFile(job.TransformJobStatus ?? ''),
        };
      })
    );
  } catch (err) {
    console.warn('[B Magic] getPredictionFiles failed, using mock:', err);
    return MOCK_PREDICTION_FILES;
  }
}

/** Returns high-level dashboard stats, or mock data on failure. */
export async function getDashboardStatsData(): Promise<DashboardStatsData> {
  if (!isAwsConfigured()) return MOCK_STATS;

  try {
    const client = makeSageMakerClient();
    const [modelsRes, transformsRes, trainingRes] = await Promise.all([
      client.send(new ListModelsCommand({ MaxResults: 100 })),
      client.send(new ListTransformJobsCommand({ MaxResults: 100 })),
      client.send(new ListTrainingJobsCommand({ MaxResults: 10, StatusEquals: 'Completed', SortBy: 'CreationTime', SortOrder: 'Descending' })),
    ]);

    const activeModels = modelsRes.Models?.length ?? 0;
    const totalPredictions = (transformsRes.TransformJobSummaries ?? []).filter(j => j.TransformJobStatus === 'Completed').length;

    // Average accuracy across recent completed training jobs
    let totalAcc = 0, accCount = 0;
    for (const job of (trainingRes.TrainingJobSummaries ?? []).slice(0, 5)) {
      try {
        const desc = await client.send(new DescribeTrainingJobCommand({ TrainingJobName: job.TrainingJobName! }));
        const accMetric = desc.FinalMetricDataList?.find(m =>
          ['accuracy', 'validation:accuracy', 'test:accuracy'].includes(m.MetricName?.toLowerCase() ?? '')
        );
        if (accMetric?.Value !== undefined) { totalAcc += accMetric.Value; accCount++; }
      } catch { /* skip */ }
    }

    // Average processing time from recent completed transform jobs
    const completedJobs = (transformsRes.TransformJobSummaries ?? []).filter(
      j => j.TransformJobStatus === 'Completed' && j.TransformStartTime && j.TransformEndTime
    );
    const avgProcessingTimeSec = completedJobs.length > 0
      ? completedJobs.slice(0, 10).reduce(
          (sum, j) => sum + (j.TransformEndTime!.getTime() - j.TransformStartTime!.getTime()) / 1000, 0
        ) / Math.min(completedJobs.length, 10)
      : MOCK_STATS.avgProcessingTimeSec;

    return {
      activeModels,
      totalPredictions,
      avgAccuracy: accCount > 0 ? totalAcc / accCount : MOCK_STATS.avgAccuracy,
      avgProcessingTimeSec,
    };
  } catch (err) {
    console.warn('[B Magic] getDashboardStatsData failed, using mock:', err);
    return MOCK_STATS;
  }
}

/** Returns a time-ordered list of recent training and prediction events. */
export async function getRecentActivity(): Promise<ActivityItem[]> {
  if (!isAwsConfigured()) return MOCK_ACTIVITY;

  try {
    const client = makeSageMakerClient();
    const [trainingRes, transformRes] = await Promise.all([
      client.send(new ListTrainingJobsCommand({ MaxResults: 8, SortBy: 'CreationTime', SortOrder: 'Descending' })),
      client.send(new ListTransformJobsCommand({ MaxResults: 8, SortBy: 'CreationTime', SortOrder: 'Descending' })),
    ]);

    type Timed = { time: Date; item: ActivityItem };
    const events: Timed[] = [];

    for (const job of trainingRes.TrainingJobSummaries ?? []) {
      const time = job.TrainingEndTime ?? job.LastModifiedTime ?? new Date();
      const s = job.TrainingJobStatus ?? '';
      events.push({
        time,
        item: {
          id: job.TrainingJobName!,
          type: s === 'Completed' ? 'model_trained' : s === 'InProgress' ? 'model_training' : 'alert',
          title: s === 'Completed'
            ? `${job.TrainingJobName} completed training`
            : s === 'InProgress'
              ? `${job.TrainingJobName} is training`
              : `${job.TrainingJobName} training ${s.toLowerCase()}`,
          time: relativeTime(time),
          status: s === 'Completed' ? 'success' : s === 'Failed' ? 'warning' : 'success',
        },
      });
    }

    for (const job of transformRes.TransformJobSummaries ?? []) {
      const time = job.CreationTime ?? new Date();
      const s = job.TransformJobStatus ?? '';
      events.push({
        time,
        item: {
          id: job.TransformJobName!,
          type: 'prediction_batch',
          title: s === 'Completed'
            ? `Batch job ${job.TransformJobName} completed`
            : s === 'InProgress'
              ? `Batch job ${job.TransformJobName} is processing`
              : `Batch job ${job.TransformJobName} ${s.toLowerCase()}`,
          time: relativeTime(time),
          status: s === 'Completed' ? 'success' : s === 'Failed' ? 'warning' : 'success',
        },
      });
    }

    return events
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 8)
      .map(e => e.item);
  } catch (err) {
    console.warn('[B Magic] getRecentActivity failed, using mock:', err);
    return MOCK_ACTIVITY;
  }
}

/**
 * Submits a SageMaker training job using form parameters.
 * Falls back to a 2-second mock if VITE_SAGEMAKER_ROLE_ARN / VITE_SAGEMAKER_IMAGE_URI / VITE_S3_BUCKET
 * are not configured.
 */
export async function submitTrainingJob(parameters: ModelParameter[]): Promise<{ jobName: string }> {
  const roleArn = import.meta.env.VITE_SAGEMAKER_ROLE_ARN;
  const imageUri = import.meta.env.VITE_SAGEMAKER_IMAGE_URI;
  const s3Bucket = import.meta.env.VITE_S3_BUCKET;

  if (!isAwsConfigured() || !roleArn || !imageUri || !s3Bucket) {
    await new Promise(r => setTimeout(r, 2000));
    return { jobName: `mock-job-${Date.now()}` };
  }

  const client = makeSageMakerClient();
  const jobName = `b-magic-${Date.now()}`;
  const trainingDataPath = parameters.find(p => p.name === 'training_data')?.value
    ?? `s3://${s3Bucket}/training-data/`;

  const hyperParams = Object.fromEntries(
    parameters
      .filter(p => !['training_data', 'model_type'].includes(p.name) && p.value !== undefined && p.value !== '')
      .map(p => [p.name, String(p.value)])
  );

  await client.send(new CreateTrainingJobCommand({
    TrainingJobName: jobName,
    RoleArn: roleArn,
    AlgorithmSpecification: {
      TrainingImage: imageUri,
      TrainingInputMode: 'File',
    },
    HyperParameters: hyperParams,
    InputDataConfig: [{
      ChannelName: 'training',
      DataSource: {
        S3DataSource: {
          S3DataType: 'S3Prefix',
          S3Uri: trainingDataPath,
          S3DataDistributionType: 'FullyReplicated',
        },
      },
    }],
    OutputDataConfig: { S3OutputPath: `s3://${s3Bucket}/output/` },
    ResourceConfig: { InstanceType: 'ml.m5.xlarge', InstanceCount: 1, VolumeSizeInGB: 30 },
    StoppingCondition: { MaxRuntimeInSeconds: 3600 },
  }));

  return { jobName };
}

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

async function buildModelAccuracyMap(client: SageMakerClient): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const { TrainingJobSummaries: jobs = [] } = await client.send(
      new ListTrainingJobsCommand({ MaxResults: 20, StatusEquals: 'Completed', SortBy: 'CreationTime', SortOrder: 'Descending' })
    );
    for (const job of jobs) {
      try {
        const desc = await client.send(new DescribeTrainingJobCommand({ TrainingJobName: job.TrainingJobName! }));
        const acc = desc.FinalMetricDataList?.find(m =>
          ['accuracy', 'validation:accuracy', 'test:accuracy'].includes(m.MetricName?.toLowerCase() ?? '')
        );
        if (acc?.Value !== undefined) map.set(job.TrainingJobName!, acc.Value);
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return map;
}
