import { environmentSites } from 'header-scripts';
import configs from '../constants/configs';

const opentracing = require('opentracing');
const lightstep = require('lightstep-tracer');

const isTestSite = environmentSites?.isTestSite;
const envVersion = isTestSite ? configs.environments.dev : configs.environments.prod;
const initTracer = (componentName, isPageLoadInstrumented) => {
  if (!configs.metaData.accessToken) {
    return false;
  }
  const tracer = new lightstep.Tracer({
    access_token: configs.metaData.accessToken,
    component_name: componentName,
    tags: {
      'service.version': envVersion
    },
    instrument_page_load: isPageLoadInstrumented
  });

  opentracing.initGlobalTracer(tracer);

  return tracer;
};

const createAndGetSpan = (name, fields) => {
  return opentracing.globalTracer().startSpan(name, fields);
};

const finalizeSpan = span => {
  if (span) {
    span.finish();
  }
};

export default {
  initTracer,
  createAndGetSpan,
  finalizeSpan
};
