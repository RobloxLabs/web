export const DefaultProcessBatchWaitTime = 10;

export const DefaultExpirationWindowMS = 30000; // 30s

export const DefaultCooldown = 1000;

export const DefaultMaxRetryAttempts = 2;

export const DefaultBatchSize = 100;

export const DefaultConcurrentRequestCount = 1;

export const DefaultCacheProperties = {
  useCache: false,
  expirationWindowMS: DefaultExpirationWindowMS
};

export enum BatchRequestError {
  processFailure = 'processFailure',
  unretriableFailure = 'unretriableFailure',
  maxAttemptsReached = 'maxAttemptsReached'
}

export type CacheObject = {
  data: any;
};

// remove number after rollout
export type BatchIdSerializer<T> = (item: T | number) => string;

export type BatchItemProcessor<T> = (ids: Array<QueueItem<T>>) => Promise<ItemProcessorResult>;

export type FailureCooldownProcessor = (attempts: number) => number;

export type ItemExpirationProcessor = (key: string) => any;

export interface CacheProperties {
  useCache?: boolean;
  expirationWindowMS?: number;
  refreshCache?: boolean;
}
export interface BatchRequestProperties {
  getFailureCooldown?: FailureCooldownProcessor;
  maxRetryAttempts?: number;
  batchSize: number;
  processBatchWaitTime?: number;
  getItemExpiration?: ItemExpirationProcessor;
  cacheProperties?: CacheProperties;
  debugMode?: boolean;
  concurrentRequestCount?: number;
}

export interface QueueItem<T> {
  key: string;
  itemId?: T | number; // deprecated remove after rollout
  data: T;
  retryAttempts: number;
  queueAfter: number;
  startTime: Date;
  cacheProperties: CacheProperties;
  resolve: QueueResolver;
  reject: QueueRejecter;
}

export type QueueResolver = (item: any) => any;
export type QueueRejecter = (error: BatchRequestError) => any;

export type ItemProcessorResult = { [key: string]: any };

export const CacheStorePrefix = 'CacheStore:BatchRequestProcessor:';
