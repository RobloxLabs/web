export default class TranslationResource {
  constructor(intl, resourceMap, namespace) {
    this.namespace = namespace;
    this.resourceMap = resourceMap;
    this.intl = intl;
  }

  get(key, params) {
    if (!key || typeof key !== 'string') {
      throw new TypeError("Parameter 'key' must be provided and it should be a string");
    }

    let translatedText = this.resourceMap[key] || '';
    // if the key is not found, throw error on dev environments
    if (!translatedText) {
      // eslint-disable-next-line no-console
      console.warn(
        `The translation key '${key}' not found. Please check for a missing string or a typo.`
      );
    }

    // params, when provided, should be a plain object
    if (typeof params !== 'undefined') {
      // need to check for null
      if (params && typeof params === 'object' && !Array.isArray(params)) {
        translatedText = translatedText ? this.intl.f(translatedText, params) : '';
      } else {
        new window.RobloxError(
          'Second parameter must be either a plain object when provided'
        ).throw();
        // avoid raw templated string to be directly returned to the consumer,
        // also enable them to do simple if check
        translatedText = '';
      }
    }

    return translatedText;
  }

  addKeyForDevelopment(key, val) {
    if (this.resourceMap[key]) {
      throw new Error(`'key' ${key} is already present`);
    }
    this.resourceMap[key] = val;
  }
}
