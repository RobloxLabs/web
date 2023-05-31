import { EnvironmentUrls } from 'Roblox';

const { metricsApi } = EnvironmentUrls;

export const getBatchMetricsUrl = () => {
  return `${metricsApi}/v1/performance/measurements`;
};

export const DefaultBatchSize = 100;

export const DefaultProcessBatchWaitTime = 10000;

export interface Measure {
  taskId?: number;
  featureName: string;
  measureName: string;
  value?: number;
  metricsType: 'Counter' | 'Sequence';
  excludeCountry?: boolean;
}

export interface MetricsResult {
  [key: string]: boolean;
}
