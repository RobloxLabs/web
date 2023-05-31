const opentracing = require('opentracing');

const httpRequestCarrier = carrier => {
  return opentracing.globalTracer().extract(opentracing.FORMAT_HTTP_HEADERS, carrier);
};

const textMapCarrier = carrier => {
  return opentracing.globalTracer().extract(opentracing.FORMAT_TEXT_MAP, carrier);
};

export default {
  httpRequestCarrier,
  textMapCarrier
};
