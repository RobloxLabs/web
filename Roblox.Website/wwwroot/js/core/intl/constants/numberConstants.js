export default {
  getDefinedNumberFormats: currency => ({
    currency: {
      style: 'currency',
      currency
    },
    percent: {
      style: 'percent',
      maximumFractionDigits: 2
    },
    decimal: {
      style: 'decimal',
      maximumFractionDigits: 2
    }
  })
};
