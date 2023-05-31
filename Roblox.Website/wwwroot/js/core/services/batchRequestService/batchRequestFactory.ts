import {
  BatchRequestProperties,
  BatchIdSerializer,
  BatchItemProcessor,
  DefaultProcessBatchWaitTime,
  DefaultMaxRetryAttempts,
  DefaultCacheProperties,
  DefaultConcurrentRequestCount
} from './batchRequestConstants';
import { createExponentialBackoffCooldown } from './batchRequestUtil';
import BatchRequestProcessor from './batchRequestProcessor';

export class BatchRequestFactory<T> {
  public readonly createExponentialBackoffCooldown = createExponentialBackoffCooldown;

  createRequestProcessor(
    itemsProcessor: BatchItemProcessor<T>,
    itemSerializer: BatchIdSerializer<T>,
    properties: BatchRequestProperties
  ) {
    if (!properties.processBatchWaitTime) {
      properties.processBatchWaitTime = DefaultProcessBatchWaitTime;
    }
    if (!properties.maxRetryAttempts) {
      properties.maxRetryAttempts = DefaultMaxRetryAttempts;
    }
    if (!properties.cacheProperties) {
      properties.cacheProperties = DefaultCacheProperties;
    }
    if (!properties.concurrentRequestCount) {
      properties.concurrentRequestCount = DefaultConcurrentRequestCount;
    }
    return new BatchRequestProcessor(itemsProcessor, itemSerializer, properties);
  }
}

export default new BatchRequestFactory(); // remove after rollout
