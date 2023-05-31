const opentracing = require('opentracing');

const httpRequestCarrier = span => {
  const carrier = {};
  opentracing.globalTracer().inject(span, opentracing.FORMAT_HTTP_HEADERS, carrier);
  return carrier;
};

const textMapCarrier = span => {
  const carrier = {};
  opentracing.globalTracer().inject(span, opentracing.FORMAT_TEXT_MAP, carrier);
  return carrier;
};

export default {
  httpRequestCarrier,
  textMapCarrier
};
