const getMetaData = () => {
  const metaTag = document.querySelector('meta[name="roblox-tracer-meta-data"]');
  const sampleRate = Number.isNaN(metaTag?.dataset?.sampleRate)
    ? 0
    : parseInt(metaTag?.dataset?.sampleRate, 10);
  return {
    accessToken: metaTag?.dataset?.accessToken,
    serviceName: metaTag?.dataset?.serviceName ?? 'Web',
    tracerEnabled: metaTag?.dataset?.tracerEnabled === 'true',
    apiSitesRequestAllowList: metaTag?.dataset?.apiSitesRequestAllowList ?? '',
    sampleRate,
    isInstrumentPagePerformanceEnabled:
      metaTag?.dataset?.isInstrumentPagePerformanceEnabled === 'true' ?? false
  };
};

const getPageName = () => {
  const metaTag = document.querySelector('meta[name="page-meta"]');
  return metaTag?.dataset?.internalPageName ?? null;
};

const configs = {
  environments: {
    dev: 'Development',
    prod: 'Production'
  },
  metaData: getMetaData(),
  pageName: getPageName(),
  hostnames: {
    prod: 'roblox.com',
    dev: 'robloxlabs.com'
  }
};

export default configs;
