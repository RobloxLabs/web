import {
  fullDateFormat,
  filteredOutPartType,
  defaultDelimiter,
  defaultDateOrder,
  mockDay,
  mockMonth,
  mockYear,
  mockDate
} from '../constants/dateTimeConstants';

class DateTimeFormatter {
  constructor(locale) {
    this.locale = locale;
    this.dateOrdering = {}; // initialize as empty object, as we will be caching the date ordering here
  }

  getTimeZone(options) {
    const formatter = new Intl.DateTimeFormat(this.locale, options);
    return formatter.resolvedOptions().timeZone;
  }

  getShortDate(date) {
    return this.getCustomDateTime(date);
  }

  getFullDate(date, delimiter = defaultDelimiter) {
    const firstHalfOfFullDate = this.getCustomDateTime(date, fullDateFormat[0]);
    const secondHalfOfFullDate = this.getCustomDateTime(date, fullDateFormat[1]);

    return firstHalfOfFullDate + delimiter + secondHalfOfFullDate;
  }

  getCustomDateTime(date = new Date(), options) {
    const formatter = new Intl.DateTimeFormat(this.locale, options);
    try {
      // date may be a utc value or date string in which case we need to format it as new Date object
      if (typeof date === 'string' || typeof date === 'number') {
        return formatter.format(new Date(date));
      }

      return formatter.format(date);
    } catch (error) {
      return '';
    }
  }

  // As of 03/27/2019 Internet Explorer doesn't support formatToParts so we created getDefaultDateOrdering fallback method
  // If you want the polyfill (additional code bloat we decided against using), here it is: https://github.com/tc39/proposal-intl-formatToParts
  // Update 05/22/2019 IE *and* Edge 17 don't support formatToParts and polyfill doesn't actually exist so we're using getDefaultDateOrdering as a fallback
  getOrderedDateParts(options) {
    // check if this.dateOrdering is locally cached
    if (Object.keys(this.dateOrdering).length === 0) {
      const formatter = new Intl.DateTimeFormat(this.locale, options);
      // formatToParts are unsupported in IE, Edge below 18, and Opera so we need to default to getDefaultDateOrdering()
      this.dateOrdering = this.getDefaultDateOrdering();
      if (formatter.formatToParts) {
        // use formatted date parts to extract year/month/day and get the date ordering
        const parts = formatter.formatToParts(new Date());
        const filteredParts = parts.filter(part => part.type !== filteredOutPartType);
        if (filteredParts.length === 3) {
          filteredParts.forEach((part, index) => {
            this.dateOrdering[part.type] = index;
          });
        }
      }
    }
    return this.dateOrdering;
  }

  // Supporting getOrderedDateParts method, we can use getDefaultDateOrdering in all browsers to get date ordering for year/month/day
  getDefaultDateOrdering() {
    const dateOrdering = defaultDateOrder;
    // parse some date and get the index of year/month/day
    const dateToParse = this.getShortDate(mockDate);
    // sort the indices by their formatted order (ascending indices)
    let dateTypes = [
      { type: 'year', index: dateToParse.indexOf(mockYear) },
      { type: 'month', index: dateToParse.indexOf(mockMonth) },
      { type: 'day', index: dateToParse.indexOf(mockDay) }
    ];
    // ensure that we have all 3 date indices represented in the short date for current locale
    if (dateTypes.some(dateType => dateType.index === -1)) {
      return defaultDateOrder;
    }
    // sort array of date types by their formatted index ascending (e.g., If 'year' appears first in format it will be first element of array)
    dateTypes = dateTypes.sort((a, b) => {
      return a.index - b.index;
    });
    // consumers of this method will need each date type to have a corresponding value of 0/1/2 based on its sorted array position.
    dateTypes.forEach((dateObject, i) => {
      dateOrdering[dateObject.type] = i;
    });
    return dateOrdering;
  }
}

export default DateTimeFormatter;
