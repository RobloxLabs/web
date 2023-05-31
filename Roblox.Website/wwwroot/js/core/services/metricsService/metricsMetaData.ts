const getTimeSpanFromString = (timeSpan: string) => {
  if (!timeSpan) return 0;
  const timeSpanFormat = timeSpan.split(':');
  return (
    (parseInt(timeSpanFormat[0], 10) * 60 * 60 +
      parseInt(timeSpanFormat[1], 10) * 60 +
      parseInt(timeSpanFormat[2], 10)) *
    1000
  );
};

export default {
  getMetaData: () => {
    const metaElement = document.getElementsByName('performance')[0];
    if (metaElement) {
      return {
        performanceMetricsBatchWaitTime: getTimeSpanFromString(
          metaElement.getAttribute('data-ui-performance-metrics-batch-wait-time')
        ),
        performanceMetricsBatchSize: parseInt(
          metaElement.getAttribute('data-ui-performance-metrics-batch-size'),
          10
        )
      };
    }
    return {};
  }
};
