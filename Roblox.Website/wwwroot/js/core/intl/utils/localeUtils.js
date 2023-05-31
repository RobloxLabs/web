import { asianLocaleList } from '../constants/localeConstants';

export const toRobloxLocale = localeCode => localeCode.replace(/-/g, '_');

export const toISOLocale = localeCode => localeCode.replace(/_/g, '-');

export const isAsianLanguage = locale => {
  // index 0 should return true and index -1 should return false, so adding 1 will return the correct truthy/falsey value
  const isLocaleAnAsianLanguage = asianLocaleList.indexOf(locale) + 1;
  return !!(locale && isLocaleAnAsianLanguage);
};
