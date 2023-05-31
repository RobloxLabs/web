import TranslationResourceProvider from './lib/translationResourceProvider';

const Roblox = window.Roblox || {};
Roblox.TranslationResourceProvider = TranslationResourceProvider;
window.Roblox = Roblox;

export default TranslationResourceProvider;
