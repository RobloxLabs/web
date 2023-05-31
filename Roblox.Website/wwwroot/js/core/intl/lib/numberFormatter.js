// this class currently is only a wrapper on top of the old implementation
class NumberFormatter {
  constructor(locale, currency) {
    this.locale = locale;
    this.currency = currency;
  }

  // simple implementation from old implementation
  getCustomNumber(number, options) {
    try {
      return new Intl.NumberFormat(this.locale, options).format(number);
    } catch (error) {
      return number;
    }
  }
}

export default NumberFormatter;
