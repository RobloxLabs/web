import { httpService } from '../../http/http';
import { BatchRequestFactory } from '../batchRequestService/batchRequestFactory';
import {
  getBatchMetricsUrl,
  Measure,
  MetricsResult,
  DefaultBatchSize,
  DefaultProcessBatchWaitTime
} from './metricsConstants';
import metricsMetaData from './metricsMetaData';

const batchRequestFactory = new BatchRequestFactory<Measure>();
let idCounter = 0;

const {
  performanceMetricsBatchWaitTime,
  performanceMetricsBatchSize
} = metricsMetaData.getMetaData();

const metricsBatchRequestProcessor = batchRequestFactory.createRequestProcessor(
  items => {
    const urlConfig = {
      url: getBatchMetricsUrl(),
      retryable: true,
      withCredentials: true
    };
    const measures = items.map(({ data: { taskId, ...otherKeys } }) => ({ ...otherKeys }));
    return httpService.post(urlConfig, measures).then(() => {
      const results: MetricsResult = {};
      items.forEach(({ key }) => {
        results[key] = true;
      });
      return results;
    });
  },
  ({ taskId }: Measure) => taskId?.toString(),
  {
    batchSize: performanceMetricsBatchSize || DefaultBatchSize,
    processBatchWaitTime: performanceMetricsBatchWaitTime || DefaultProcessBatchWaitTime
  }
);

export default {
  logMeasurement: (measure: Measure) => {
    const taskId = idCounter;
    idCounter += 1;
    return metricsBatchRequestProcessor.queueItem({ taskId, ...measure });
  }
};
