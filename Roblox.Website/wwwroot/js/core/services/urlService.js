import url from 'url';
import queryString from 'query-string';
import { Endpoints } from 'Roblox';

const parseQueryString = (searchString = window.location.search) => queryString.parse(searchString);

const getQueryParam = paramName => parseQueryString()[paramName];

const composeQueryString = (queryParams = {}) => queryString.stringify(queryParams);

const getAbsoluteUrl = targetUrl => {
  if (Endpoints) {
    return Endpoints.getAbsoluteUrl(targetUrl);
  }
  return targetUrl;
};

const getGameDetailReferralUrls = queryParams => {
  return getAbsoluteUrl(`/games/refer?${composeQueryString(queryParams)}`);
};

const getUrlWithQueries = (path, queryParams) => {
  return getAbsoluteUrl(`${path}?${composeQueryString(queryParams)}`);
};

// Note: Docs for `url` and `querystring` modules can be found on
// url - https://github.com/defunctzombie/node-url
// querystring - https://github.com/sindresorhus/query-string
export default {
  getAbsoluteUrl,
  parseQueryString,
  composeQueryString,
  getQueryParam,
  formatUrl: url.format,
  resolveUrl: url.resolve,
  parseUrl: url.parse,
  parseUrlAndQueryString: queryString.parseUrl,
  extractQueryString: queryString.extract,
  getGameDetailReferralUrls,
  getUrlWithQueries
};
