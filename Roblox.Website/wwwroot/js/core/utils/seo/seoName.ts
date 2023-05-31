const formatSeoName = (name: string): string => {
  if (!name) {
    return null;
  }
  return (
    name
      .replace(/'/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/^(COM\d|LPT\d|AUX|PRT|NUL|CON|BIN)$/i, '') || 'unnamed'
  );
};

export default {
  formatSeoName
};
