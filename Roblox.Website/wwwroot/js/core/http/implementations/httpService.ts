import { AxiosPromise, AxiosResponse, CancelTokenSource } from 'axios';
import httpClient from './httpClient';
import HttpRequestMethods from './httpRequestMethods';
import UrlConfig from '../interfaces/UrlConfig';

function buildCustomizedConfig(urlConfig: UrlConfig): UrlConfig {
  const config = { ...urlConfig };
  if (urlConfig.noCache) {
    config.headers = {
      ...config.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0
    };
  }
  if (urlConfig.authBearerToken) {
    config.headers = {
      ...config.headers,
      'X-Auth-Bearer-Token': urlConfig.authBearerToken
    };
  }

  return config;
}

function buildRequest(urlConfig: UrlConfig): AxiosPromise {
  if (!urlConfig) {
    Promise.reject(new Error('No config found'));
  }
  return httpClient(buildCustomizedConfig(urlConfig));
}

function buildGetRequest(urlConfig: UrlConfig, params?: URLSearchParams | object): AxiosPromise {
  return buildRequest({
    method: HttpRequestMethods.GET,
    url: urlConfig.url,
    ...urlConfig,
    params
  });
}

function buildPostRequest(
  urlConfig: UrlConfig,
  data?: Document | BodyInit | object | null
): AxiosPromise {
  return buildRequest({
    method: HttpRequestMethods.POST,
    url: urlConfig.url,
    ...urlConfig,
    data
  });
}

function buildPatchRequest(urlConfig: UrlConfig, data?: Document | BodyInit | null): AxiosPromise {
  return buildRequest({
    method: HttpRequestMethods.PATCH,
    url: urlConfig.url,
    ...urlConfig,
    data
  });
}

function buildDeleteRequest(urlConfig: UrlConfig): AxiosPromise {
  return buildRequest({
    method: HttpRequestMethods.DELETE,
    url: urlConfig.url,
    ...urlConfig
  });
}

function buildBatchPromises(
  arrayNeedsBatch: string[],
  cutOff: number,
  urlConfig: UrlConfig,
  isPost: boolean,
  paramsKey: string
): Promise<AxiosResponse[]> {
  const promises: AxiosPromise[] = [];
  let startIndex = 0;
  let subArray = arrayNeedsBatch.slice(startIndex, cutOff);
  const key = paramsKey || 'userIds';
  while (subArray.length > 0) {
    const params: Record<string, string[]> = {};
    params[key] = subArray;
    if (isPost) {
      promises.push(buildPostRequest(urlConfig, params));
    } else {
      promises.push(buildGetRequest(urlConfig, params));
    }
    startIndex += 1;
    subArray = arrayNeedsBatch.slice(startIndex * cutOff, startIndex * cutOff + cutOff);
  }
  return Promise.all(promises);
}

function createCancelToken(): CancelTokenSource {
  return httpClient.CancelToken.source();
}

function isCancelled(error: any): boolean {
  return httpClient.isCancel(error);
}

export default {
  methods: HttpRequestMethods,
  get: buildGetRequest,
  post: buildPostRequest,
  delete: buildDeleteRequest,
  patch: buildPatchRequest,
  buildBatchPromises,
  createCancelToken,
  isCancelled
};
