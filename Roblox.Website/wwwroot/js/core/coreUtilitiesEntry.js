import accessibility from './utils/accessibility/accessibility';
import batchRequestFactory, {
  BatchRequestFactory
} from './services/batchRequestService/batchRequestFactory';

import clipboard from './utils/clipboard/clipboard';
import cursorPaginationConstants from './cursorPagination/cursorPaginationConstants';
import CursorPager from './cursorPagination/CursorPager';
import dateService from './services/dateService';
import defer from './utils/deferred';
import downloadFile from './utils/downloadFile';
import { httpRequestMethods, httpResponseCodes, httpService } from './http/http';
import ListFilterProvider from './utils/ListFilterProvider';
import PaginationCache from './cursorPagination/PaginationCache';
import pageName from './pageNames/pageNameProvider';
import ready from './utils/ready';
import urlService from './services/urlService';
import regex from './utils/regex';
import abbreviateNumber from './utils/abbreviate/abbreviateNumber';
import quote from './utils/textFormat/quote';
import concatTexts from './utils/textFormat/concatTexts';
import numberFormat from './utils/numberFormat/numberFormat';
import seoName from './utils/seo/seoName';

window.CoreUtilities = {
  accessibility,
  batchRequestFactory, // deprecated remove after rollout
  BatchRequestFactory,
  clipboard,
  CursorPager,
  cursorPaginationConstants,
  dateService,
  defer,
  downloadFile,
  httpRequestMethods,
  httpResponseCodes,
  httpService,
  ListFilterProvider,
  PaginationCache,
  pageName,
  ready,
  urlService,
  regex,
  abbreviateNumber,
  quote,
  concatTexts,
  numberFormat,
  seoName
};
