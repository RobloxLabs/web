// PLEASE DON'T USE THESE FORMATS BELOW ANYMROE
export const deprecatedDateFormats = {
  short: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  },
  full: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  },
  time: {
    hour: '2-digit',
    minute: '2-digit'
  }
};

/**
 * Mock dates used for caculation
 */
export const mockMonth = '8';
export const mockDay = '17';
export const mockYear = '2003';
export const mockDate = new Date('Aug 17 2003');

/**
 * Shared constants used for calculation
 */
export const pivotYear = 2017;
export const pivotMonth = 4; // May
// consider a range utility function?
export const daysInWeek = [1, 2, 3, 4, 5, 6, 7];
export const monthsInYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Used by DateTimeFormatter API
 */
export const fullDateFormat = [
  { year: 'numeric', month: 'short', day: 'numeric' },
  { hour: 'numeric', minute: 'numeric', hour12: true }
];
export const filteredOutPartType = 'literal';
export const defaultDelimiter = ' | ';
export const defaultDateOrder = {
  month: 0,
  day: 1,
  year: 2
};

/**
 * Used by get weekday/month list API
 */
export const validDayFormats = ['narrow', 'short', 'long'];
export const validMonthFormats = ['numeric', '2-digit', 'narrow', 'short', 'long'];
