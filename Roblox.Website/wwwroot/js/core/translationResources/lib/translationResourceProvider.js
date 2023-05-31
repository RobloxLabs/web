import { Lang, LangDynamicDefault, LangDynamic } from 'Roblox';
import Intl from '../../intl/lib/intl';
import TranslationResource from './translationResource';

export default class TranslationResourceProvider {
  static combineTranslationResources(intl, ...translationResources) {
    const resourceMap = translationResources.reduce(
      (newResourceMap, translationResource) =>
        Object.assign(newResourceMap, translationResource.resourceMap),
      {}
    );

    return new TranslationResource(intl, resourceMap, null);
  }

  constructor(intl = new Intl()) {
    this.intl = intl;
  }

  /*
   * Returns a Translation Resource with getter methods
   * @param namespace {string}
   */
  getTranslationResource(namespace) {
    const resourceMap = {
      ...LangDynamicDefault?.[namespace],
      ...Lang?.[namespace],
      ...LangDynamic?.[namespace]
    };

    if (Object.keys(resourceMap).length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`The namespace ${namespace} was not found`);
    }

    return new TranslationResource(this.intl, resourceMap, namespace);
  }

  /*
   * Returns a merged Translation Resource whose namespace is set to null
   * Be care for with the order of all parameters in the case of a key conflict
   * @param translationResources {TranslationResource[]}
   */
  mergeTranslationResources(...translationResources) {
    return TranslationResourceProvider.combineTranslationResources(
      this.intl,
      ...translationResources
    );
  }
}
