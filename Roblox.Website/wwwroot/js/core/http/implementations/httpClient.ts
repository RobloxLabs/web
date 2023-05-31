import axios, { AxiosPromise } from 'axios';
import { XsrfToken } from 'Roblox';
import {
  instrumentation,
  tags,
  logs,
  inject,
  apiSiteRequestValidator,
  isTracerEnabled,
  tracerConstants
} from 'roblox-tracer';
import UrlConfig from '../interfaces/UrlConfig';
import ResponseConfig from '../interfaces/ResponseConfig';
import ErrorResponse from '../interfaces/ErrorResponse';
import HttpResponseCodes from './httpResponseCodes';
import HttpRequestMethods from './httpRequestMethods';

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_INVALID_RESPONSE_CODE = HttpResponseCodes.forbidden;

// TODO: figure out how to get theres from data attr on page #http-retry-dat
const HTTP_RETRY_BASE_TIMEOUT = 1000;
const HTTP_RETRY_MAX_TIMEOUT = 8000;
const HTTP_RETRY_MAX_TIMES = 3;

let currentToken = XsrfToken.getToken();

axios.interceptors.request.use((config: UrlConfig) => {
  const { method, noCache, headers, url } = config;
  const newConfig = { ...config };
  // if type is post or delete add XsrfToken to header.
  if (
    method === HttpRequestMethods.POST ||
    method === HttpRequestMethods.PATCH ||
    method === HttpRequestMethods.DELETE
  ) {
    if (!currentToken) {
      currentToken = XsrfToken.getToken();
    }
    if (noCache) {
      newConfig.headers = headers || {};
      newConfig['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      newConfig.Pragma = 'no-cache';
      newConfig.Expires = 0;
    }
    newConfig.headers[CSRF_TOKEN_HEADER] = currentToken;
  }

  // instrument roblox tracer
  if (isTracerEnabled && apiSiteRequestValidator.isApiSiteAvailableForTracing(url)) {
    const requestSpan = instrumentation.createAndGetSpan(
      tracerConstants.operationNames.httpRequest
    );
    tags.setXHRRequestTags(requestSpan, { component: `axios`, method, url });
    logs.setXHRRequestLogs(requestSpan);
    const headerCarriers = inject.httpRequestCarrier(requestSpan);
    Object.keys(headerCarriers).forEach(key => {
      newConfig.headers[key] = headerCarriers[key];
    });
    newConfig.tracerConfig = {
      requestSpan
    };
  }
  return newConfig;
}, null);

axios.interceptors.response.use(
  (response: ResponseConfig) => {
    const {
      status,
      config: { url, tracerConfig }
    } = response;

    if (tracerConfig && apiSiteRequestValidator.isApiSiteAvailableForTracing(url)) {
      const { requestSpan } = tracerConfig;
      tags.setXHRResponseTags(requestSpan, {
        status
      });
      logs.setXHRResponseSuccessLogs(requestSpan);
      instrumentation.finalizeSpan(requestSpan);
    }
    return response;
  },
  (error: ErrorResponse): AxiosPromise => {
    const { config: responseConfig, response } = error;
    if (response) {
      const { status, headers, config } = response;
      const newToken: string = headers[CSRF_TOKEN_HEADER];

      if (status === CSRF_INVALID_RESPONSE_CODE && newToken) {
        config.headers[CSRF_TOKEN_HEADER] = newToken;
        currentToken = newToken;
        XsrfToken.setToken(newToken);
        return axios.request(config);
      }

      if (
        config?.tracerConfig &&
        apiSiteRequestValidator.isApiSiteAvailableForTracing(config.url)
      ) {
        const { requestSpan } = config.tracerConfig;
        tags.setXHRResponseErrorTags(requestSpan, {
          status
        });
        logs.setXHRResponseErrorLogs(requestSpan);
        instrumentation.finalizeSpan(requestSpan);
      }
    }
    if (responseConfig?.fullError || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    return Promise.reject(response);
  }
);

export default axios;
