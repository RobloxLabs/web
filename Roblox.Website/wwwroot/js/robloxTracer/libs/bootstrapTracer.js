// bootstrap
import configs from '../constants/configs';
import instrumentation from './instrumentation';

const sampleRate = configs?.metaData?.sampleRate;
const randomNumber = Math.floor(Math.random() * 100 + 1);
const isTracerEnabled = configs?.metaData?.tracerEnabled && randomNumber <= sampleRate;
const isInstrumentPagePerformanceEnabled = configs?.metaData?.isInstrumentPagePerformanceEnabled;
const rootTracer = () =>
  isTracerEnabled
    ? instrumentation.initTracer(configs.metaData.serviceName, isInstrumentPagePerformanceEnabled)
    : null;

export default {
  isTracerEnabled,
  rootTracer
};
