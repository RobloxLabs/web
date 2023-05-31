import configs from '../constants/configs';

const isHostnameValid = url => {
  const { hostnames } = configs;
  const testUrl = url || window.location?.hostname;
  return testUrl.indexOf(hostnames.prod) > -1 || testUrl.indexOf(hostnames.dev) > -1;
};

const listOfAvailableApiSites = configs.metaData.apiSitesRequestAllowList.split(',');
const isApiSiteAvailableForTracing = url => {
  // make sure the current site and testing url are coming from roblox domain
  if (!isHostnameValid() || !isHostnameValid(url)) {
    return false;
  }

  if (listOfAvailableApiSites.length) {
    return listOfAvailableApiSites.some(apisite => {
      return url.includes(apisite);
    });
  }

  return false;
};

export default {
  isApiSiteAvailableForTracing
};
