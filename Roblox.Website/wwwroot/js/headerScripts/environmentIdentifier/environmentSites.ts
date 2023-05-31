const getDataset = (): DOMStringMap | null => {
  const metaTag = document.querySelector<HTMLMetaElement>('meta[name="environment-meta"]');
  return metaTag?.dataset ?? null;
};

const isTestSite = (): boolean => {
  return getDataset()?.isTestingSite === 'true';
};

export default {
  isTestSite: isTestSite()
};
