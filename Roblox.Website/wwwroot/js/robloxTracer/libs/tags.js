import { authenticatedUser } from 'header-scripts';
import configs from '../constants/configs';

const setErrorTag = span => {
  span.setTag('error', 'true');
};

/** Pre-defined certain tags required for XMLHttpRequest  */
const setXHRDefaultTags = (span, tagFields) => {
  const { component, method, url } = tagFields;

  span.setTag('span.kind', 'client');
  span.setTag('component', component);
  span.setTag('http.method', method);
  span.setTag('http.url', url);
  span.setTag('page.name', configs.pageName);
  span.setTag('page.url', window?.location?.href ?? '');
  span.setTag('user.id', authenticatedUser?.id ?? -1);
  span.setTag('user.agent', navigator?.userAgent ?? null);
};

const setXHRRequestTags = (span, tagFields) => {
  setXHRDefaultTags(span, tagFields);
};

const setXHRResponseTags = (span, tagFields) => {
  span.setTag('http.status_code', tagFields?.status);
};

const setXHRResponseErrorTags = (span, tagFields) => {
  setErrorTag(span);
  span.setTag('http.status_code', tagFields?.status);
};

const setPlaceIdTag = (span, placeId) => {
  span.setTag('guid:place_id', placeId);
};

const setDefaultTags = span => {
  span.setTag('span.kind', 'client');
};

export default {
  setErrorTag,
  setXHRRequestTags,
  setXHRResponseTags,
  setXHRResponseErrorTags,
  setPlaceIdTag,
  setDefaultTags
};
