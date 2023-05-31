import { isAsianLanguage } from './localeUtils';
import { localeRequiringSpacesList } from '../constants/localeConstants';
import { pivotYear, monthsInYear } from '../constants/dateTimeConstants';

/**
 * A set of date time related utils
 */
export const getFormattedDate = (locale, date, dateModifier) => {
  if (isAsianLanguage(locale) && dateModifier) {
    if (localeRequiringSpacesList.indexOf(locale) >= 0) {
      return `${date} ${dateModifier}`; // add a space between date and date modifier
    }
    return date + dateModifier; // no space between date and date modifier
  }
  return date;
};

export const getMonths = (locale, format, modifier) => {
  // Build a list of months by dynamically creating dates for each month - use any year for pivot
  const months = monthsInYear.map(index => new Date(pivotYear, index - 1));

  return months.map((item, index) => {
    let monthToReturn;
    if (isAsianLanguage(locale)) {
      monthToReturn = {
        value: index + 1,
        name: getFormattedDate(locale, index + 1, modifier)
      };
    } else {
      monthToReturn = {
        value: index + 1,
        name: Intl.DateTimeFormat(locale, {
          month: format
        }).format(item)
      };
    }
    return monthToReturn;
  });
};
