function addDays(curr, diff) {
  const newDay = new Date(curr.toISOString());
  newDay.setDate(curr.getDate() + diff);
  return newDay;
}

function subDays(curr, diff) {
  return addDays(curr, -diff);
}

function addMonths(curr, diff) {
  const newDay = new Date(curr.toISOString());
  newDay.setMonth(curr.getMonth() + diff);
  return newDay;
}

function subMonths(curr, diff) {
  return addMonths(curr, -diff);
}

function addYears(curr, diff) {
  const newDay = new Date(curr.toISOString());
  newDay.setYear(curr.getFullYear() + diff);
  return newDay;
}

function subYears(curr, diff) {
  return addYears(curr, -diff);
}

function startOfToday() {
  const current = new Date();
  current.setHours(0, 0, 0, 0);
  return current;
}

function endOfToday() {
  // return a Date object to 23:59:59:999 (lcoal time)
  const current = new Date();
  current.setHours(23, 59, 59, 999);
  return current;
}

function getUtcQueryString(localDate) {
  if (!localDate) {
    return '';
  }
  // return date string in UTC, YYYY-MM-DD format
  const utcMonth = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const utcDate = localDate
    .getUTCDate()
    .toString()
    .padStart(2, '0');
  const queryString = `${localDate.getUTCFullYear()}-${utcMonth}-${utcDate}`;
  return queryString;
}

const dateService = {
  getUtcQueryString,
  endOfToday,
  startOfToday,
  addYears,
  subYears,
  addMonths,
  subMonths,
  addDays,
  subDays
};

export default dateService;
