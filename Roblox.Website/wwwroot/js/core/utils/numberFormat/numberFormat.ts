const getNumberFormat = (
  value: number,
  locale?: string,
  style?: string,
  currency?: string
): string => {
  try {
    return new Intl.NumberFormat(locale, { style, currency }).format(value);
  } catch {
    return value.toString();
  }
};

export default {
  getNumberFormat
};
