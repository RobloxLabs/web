import IntlMessageFormat from '../vendors/core';
import defaultLocale from '../vendors/en';
import { getCurrentLocaleCode, normalizeToLocale } from './localeInitializer';
import DateTimeFormatter from './dateTimeFormatter';
import NumberFormatter from './numberFormatter';
import getLanguageSensitiveStringComparer from './languageSensitiveStringComparer';
import { toRobloxLocale, toISOLocale, isAsianLanguage } from '../utils/localeUtils';
import { getFormattedDate, getMonths } from '../utils/dateTimeUtils';
import {
  deprecatedDateFormats,
  pivotMonth,
  pivotYear,
  validDayFormats,
  validMonthFormats,
  daysInWeek,
  monthsInYear
} from '../constants/dateTimeConstants';
import numberConstants from '../constants/numberConstants';

// eslint-disable-next-line no-underscore-dangle
IntlMessageFormat.__addLocaleData(defaultLocale);
IntlMessageFormat.defaultLocale = 'en';

export default class International {
  constructor(localeCode, timeZone, currencyCode) {
    const currLocaleCode = localeCode || getCurrentLocaleCode();

    this.locale = normalizeToLocale(currLocaleCode);
    this.defaultLocale = [this.locale];
    this.timeZone = timeZone || 'America/Los_Angeles';
    this.currency = currencyCode || 'USD';
    this.monthsList = {};
    this.weekdaysList = {};

    // setup language sensitive compare function
    this.langSensitiveCompare = getLanguageSensitiveStringComparer(this.locale);

    // date formatter cache
    this.dateTimeFormatter = null;

    // number formatter cache
    this.numberFormatter = null;
  }

  getLocale() {
    return toISOLocale(this.locale);
  }

  getRobloxLocale() {
    return toRobloxLocale(this.locale);
  }

  getTimeZone() {
    return this.timeZone;
  }

  getCurrency() {
    return this.currency;
  }

  getDateTimeFormatter() {
    if (!this.dateTimeFormatter) {
      this.dateTimeFormatter = new DateTimeFormatter(this.locale);
    }

    return this.dateTimeFormatter;
  }

  getNumberFormatter() {
    if (!this.numberFormatter) {
      this.numberFormatter = new NumberFormatter(this.defaultLocale, this.currency);
    }

    return this.numberFormatter;
  }

  // setup supported locale helper functions
  isAsianLanguage() {
    return isAsianLanguage(this.locale);
  }

  getFormattedDateString(date, dateModifier) {
    return getFormattedDate(this.locale, date, dateModifier);
  }

  getMonthsI18n(monthFormat, modifier) {
    const format = validMonthFormats.indexOf(monthFormat) > -1 ? monthFormat : 'short'; // default to short

    // use pre-built list if it exists
    if (!(this.monthsList[format] && this.monthsList[format].length > 0)) {
      this.monthsList[format] = getMonths(this.locale, format, modifier);
    }

    return this.monthsList[format];
  }

  /*
   * Get Localized Message
   * @param message {string} An interpolatable string based on ICU standards to support pluralization (if needed)
   * @param params {object} key value map of values needed for interpolation
   * @returns string
   */
  f(message, params, options) {
    if (typeof message !== 'string') {
      throw new TypeError("'message' must be a string");
    }

    const formatter = new IntlMessageFormat(message, this.locale, options);
    return formatter.format(params);
  }

  /*
   * Get localized date string
   * @param {date} dateObj
   * @param {string|object} options. When passing string use "full" or "short", otherwise
   * pass options object as defined for Intl.DateTimeFormat
   * @returns {string}
   */
  d(dateObj, options) {
    // eslint-disable-next-line no-console
    console.warn(
      'This method has been deprecated in favor of the new DateTimeFormatter API, please do not use it anymore!'
    );

    // This is most likely an issue with the rule itself
    // eslint-disable-next-line no-prototype-builtins
    if (typeof dateObj !== 'object' || !Date.prototype.isPrototypeOf(dateObj)) {
      throw new TypeError("'dateObj' must be a JavaScript date object");
    }

    let formatOptions;
    if (typeof options === 'string' || options === undefined) {
      formatOptions = deprecatedDateFormats[options] || deprecatedDateFormats.short; // default to short
    } else if (typeof options === 'object') {
      formatOptions = options;
    } else {
      throw new TypeError(
        "'options' must be either of type string or object based on Intl.DateTimeFormat"
      );
    }

    // delegate to the new API, all code above is the old implementation
    return this.getDateTimeFormatter().getCustomDateTime(dateObj, formatOptions);
  }

  /*
   * Get localized number string
   * @param {number} number
   * @param {string|object} options. When passing string use "currency" or "percent" otherwise
   * pass options object as defined for Intl.NumberFormat
   * @returns {string}
   */
  n(number, options) {
    if (Number.isNaN(number)) {
      throw new TypeError("The argument 'number' must be of type number");
    }

    const definedNumberFormats = numberConstants.getDefinedNumberFormats(this.currency);

    let formatOptions;
    if (typeof options === 'string' || options === undefined) {
      formatOptions = definedNumberFormats[options] || definedNumberFormats.decimal; // default to decimal
    } else if (typeof options === 'object') {
      formatOptions = options;
    } else {
      throw new TypeError("'options' must be of type string or object based on Intl.NumberFormat");
    }

    return this.getNumberFormatter().getCustomNumber(number, formatOptions);
  }

  /*
   * Get localized list of weekdays
   * @param {dayFormat} string - valid values are based on official Intl.DateTimeFormat 'weekday' options
   * For example "short" for Mon, Tue,... and "long" for Monday, Tuesday ...
   * @returns {array of objects}
   */
  getWeekdaysList(dayFormat) {
    const format = validDayFormats.indexOf(dayFormat) > -1 ? dayFormat : 'short'; // default to short

    // use pre-built list if it exists
    if (this.weekdaysList[format] && this.weekdaysList[format].length > 0) {
      return this.weekdaysList[format];
    }

    // Build a list of weekdays by dynamically creating dates for each day - using May 2017 as pivot since Monday starts on 1st
    const days = daysInWeek.map(index => new Date(pivotYear, pivotMonth, index));

    this.weekdaysList[format] = days.map((item, index) => ({
      value: index + 1,
      name: Intl.DateTimeFormat(this.locale, {
        weekday: format
      }).format(item)
    }));
    return this.weekdaysList[format];
  }

  /*
   * Get localized list of months
   * @param {monthFormat} string - valid values are based on official Intl.DateTimeFormat month options
   * For example "short" for Jan, Feb,... and "long" for January, February, ...
   * @returns {array of objects}
   */
  getMonthsList(monthFormat) {
    const format = validMonthFormats.indexOf(monthFormat) > -1 ? monthFormat : 'short'; // default to short

    // use pre-built list if it exists
    if (this.monthsList[format] && this.monthsList[format].length > 0) {
      return this.monthsList[format];
    }

    // Build a list of months by dynamically creating dates for each month - use any year for pivot
    const months = monthsInYear.map(index => new Date(pivotYear, index - 1));

    this.monthsList[format] = months.map((item, index) => ({
      value: index + 1,
      name: Intl.DateTimeFormat(this.locale, {
        month: format
      }).format(item)
    }));
    return this.monthsList[format];
  }
}
