import { localStorageKey, isLocalStorageAvailable } from '../utils/localStorageUtils';
import { toISOLocale } from '../utils/localeUtils';
import {
  localeMetaTageSelector,
  customLocaleMapping,
  defaultRobloxLocaleCode
} from '../constants/localeConstants';

export function getCurrentLocaleCode() {
  const canUseLocalStorage = isLocalStorageAvailable();
  const localeMetaTag = document.querySelector(localeMetaTageSelector);

  let localeCode;

  // try to get it from meta tag first
  if (localeMetaTag) {
    // try the newest dataset API
    if (localeMetaTag.dataset) {
      localeCode = localeMetaTag.dataset.languageCode;
    } else {
      localeCode = localeMetaTag.getAttribute('data-language-code');
    }
  }

  // try to get it from localStorage second, if it is available
  if (!localeCode && canUseLocalStorage) {
    localeCode = localStorage.getItem(localStorageKey);
  }

  // use the default if all of the above failed
  if (!localeCode) {
    localeCode = defaultRobloxLocaleCode;
  }

  // persist in localstorage, if it is available
  if (canUseLocalStorage) {
    localStorage.setItem(localStorageKey, localeCode);
  }

  return localeCode;
}

// normalize the localeCode to a locale in standard ISO format
export function normalizeToLocale(localeCode) {
  if (Object.prototype.hasOwnProperty.call(customLocaleMapping, localeCode)) {
    // apply overrides to Roblox custom locale. Since Chrome 79, custom locale is
    // no longer supported in the native Intl API, and will result in exceptions
    // if used.
    return toISOLocale(customLocaleMapping[localeCode]);
  }

  return toISOLocale(localeCode);
}
