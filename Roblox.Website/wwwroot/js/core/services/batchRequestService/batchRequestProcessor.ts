import {
  BatchRequestProperties,
  BatchIdSerializer,
  BatchRequestError,
  BatchItemProcessor,
  QueueItem,
  ItemProcessorResult,
  ItemExpirationProcessor,
  FailureCooldownProcessor,
  DefaultCooldown,
  CacheProperties
} from './batchRequestConstants';
import CacheStore from './cacheStore';

class BatchRequestProcessor<T> {
  private completeItems: CacheStore;

  private requestQueue: Array<QueueItem<T>> = [];

  private concurrentRequestCount = 1;

  private isQueueActive = false;

  private debug = false;

  private processorId: number;

  private processStartTime: number;

  private processEndTime: number;

  private maxRetryAttempts?: number;

  private getItemExpiration?: ItemExpirationProcessor;

  private batchSize: number;

  private processBatchWaitTime?: number;

  private getFailureCooldown?: FailureCooldownProcessor;

  private cacheProperties?: CacheProperties;

  private itemsProcessor: BatchItemProcessor<T>;

  private itemsSerializer: BatchIdSerializer<T>;

  constructor(
    itemsProcessor: BatchItemProcessor<T>,
    itemsSerializer: BatchIdSerializer<T>,
    properties: BatchRequestProperties
  ) {
    const {
      cacheProperties,
      processBatchWaitTime,
      batchSize,
      maxRetryAttempts,
      getItemExpiration,
      getFailureCooldown,
      debugMode,
      concurrentRequestCount
    } = properties;
    const { useCache, expirationWindowMS } = cacheProperties;
    this.cacheProperties = cacheProperties;
    this.completeItems = new CacheStore(useCache, expirationWindowMS);
    this.processBatchWaitTime = processBatchWaitTime;
    this.batchSize = batchSize;
    this.maxRetryAttempts = maxRetryAttempts;
    this.getItemExpiration = getItemExpiration;
    this.getFailureCooldown = getFailureCooldown;
    this.itemsProcessor = itemsProcessor;
    this.itemsSerializer = itemsSerializer;
    this.debug = debugMode || false;
    this.processorId = Date.now();
    this.concurrentRequestCount = concurrentRequestCount;
  }

  handleBatchResult(batch: Array<QueueItem<T>>, error: BatchRequestError) {
    let minimumCooldown = 0;
    const currentDate = new Date().getTime();
    batch.forEach((request: QueueItem<T>) => {
      if (this.completeItems.has(request.key, request.cacheProperties)) {
        const requestCompleteTime = new Date().getTime();
        request.resolve({
          ...this.completeItems.get(request.key, request.cacheProperties),
          ...{ performance: { duration: requestCompleteTime - request.startTime.getTime() } }
        });
      } else if (this.maxRetryAttempts && error !== BatchRequestError.unretriableFailure) {
        const itemCooldown = this.getFailureCooldown
          ? this.getFailureCooldown(request.retryAttempts)
          : DefaultCooldown;

        if (minimumCooldown > 0) {
          minimumCooldown = Math.min(minimumCooldown, itemCooldown);
        } else {
          minimumCooldown = itemCooldown;
        }

        if (++request.retryAttempts <= this.maxRetryAttempts) {
          request.queueAfter = currentDate + itemCooldown;
          // Put in front of the queue to make sure duplicate items
          // don't get processed without the cooldown time.
          this.requestQueue.unshift(request);
        } else {
          request.reject(BatchRequestError.maxAttemptsReached);
        }
      } else {
        console.debug(error, request);
        request.reject(error);
      }
    });

    this.processEndTime = Date.now();

    if (this.debug) {
      console.debug(`${this.processorId}: process queue ended`, {
        duration: this.processEndTime - this.processStartTime,
        requestQueue: this.requestQueue,
        minimumCooldown,
        processBatchWaitTime: this.processBatchWaitTime
      });
    }

    if (minimumCooldown > 0) {
      setTimeout(() => this.processQueue(), minimumCooldown + this.processBatchWaitTime);
    }
    this.concurrentRequestCount += 1;
    this.processQueue();
  }

  processQueue() {
    if (this.concurrentRequestCount === 0 || this.isQueueActive) {
      return;
    }

    this.processStartTime = Date.now();

    const batch: Array<QueueItem<T>> = [];
    const batchKeys: Map<string, QueueItem<T>> = new Map();
    const requeueRequests: Array<QueueItem<T>> = [];

    const currentDate = new Date().getTime();

    this.isQueueActive = true;

    while (batch.length < this.batchSize && this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request.queueAfter > currentDate) {
        batchKeys.set(request.key, request);
        requeueRequests.push(request);
        continue;
      } else if (this.completeItems.has(request.key, request.cacheProperties)) {
        const requestCompleteTime = new Date().getTime();
        request.resolve({
          ...this.completeItems.get(request.key, request.cacheProperties),
          ...{ performance: { duration: requestCompleteTime - request.startTime.getTime() } }
        });
      } else if (batchKeys.has(request.key)) {
        // Requeue to make sure duplicate requests still get resolved once they're completed.
        requeueRequests.push(request);
      } else {
        batchKeys.set(request.key, request);
        batch.push(request);
      }
    }

    this.requestQueue.push(...requeueRequests);
    this.isQueueActive = false;

    if (batch.length <= 0) {
      return;
    }
    this.concurrentRequestCount -= 1;
    this.processQueue();

    if (this.debug) {
      console.debug(`${this.processorId}: process queue start`, {
        timeSinceLastStart: this.processEndTime ? this.processStartTime - this.processEndTime : 0,
        startTime: this.processStartTime,
        requestQueue: this.requestQueue,
        batch: batch.map(e => e.key)
      });
    }

    this.itemsProcessor(batch).then(
      (data: ItemProcessorResult) => {
        Object.entries(data).forEach(([key, value]) => {
          const request = batchKeys.get(key);
          this.saveCompleteItem(key, value, request?.cacheProperties);
        });

        this.handleBatchResult(batch, BatchRequestError.processFailure);
      },
      error => {
        this.handleBatchResult(batch, error);
      }
    );
  }

  saveCompleteItem(key: string, data: any, cacheProperties?: CacheProperties) {
    this.completeItems.set(key, data, cacheProperties || this.cacheProperties);
    if (this.getItemExpiration) {
      setTimeout(() => {
        this.completeItems.delete(key);
      }, this.getItemExpiration(key));
    }
  }

  queueItem(item: T, key?: string, cacheProperties?: CacheProperties) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        key: key || this.itemsSerializer(item),
        itemId: item, // Deprecated remove after rollout
        data: item,
        retryAttempts: 0,
        queueAfter: 0,
        startTime: new Date(),
        cacheProperties: cacheProperties || this.cacheProperties,
        resolve,
        reject
      });
      setTimeout(() => this.processQueue(), this.processBatchWaitTime);
    });
  }

  invalidateItem(item: T, key?: string) {
    const storeKey = key || this.itemsSerializer(item);
    return this.completeItems.delete(storeKey);
  }

  clearCache() {
    this.completeItems.clear();
  }
}

export default BatchRequestProcessor;
