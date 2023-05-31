import instrumentation from './libs/instrumentation';
import logs from './libs/logs';
import tags from './libs/tags';
import inject from './libs/inject';
import extract from './libs/extract';
import bootstrapTracer from './libs/bootstrapTracer';
import apiSiteRequestValidator from './libs/apiSiteRequestValidator';
import tracerConstants from './constants/tracerConstants';

bootstrapTracer.rootTracer();

window.RobloxTracer = {
  isTracerEnabled: bootstrapTracer.isTracerEnabled,
  instrumentation,
  logs,
  tags,
  inject,
  extract,
  apiSiteRequestValidator,
  tracerConstants
};
