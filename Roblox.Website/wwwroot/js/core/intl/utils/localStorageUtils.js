import { LocalStorage } from 'Roblox';

export const localStorageKey = 'RobloxLocaleCode';

export function isLocalStorageAvailable() {
  // localStorage is undefined when intl.js is loaded before the dom (i.e., for service worker)
  if (typeof localStorage !== 'undefined') {
    return LocalStorage
      ? LocalStorage.isAvailable()
      : localStorage && localStorage.getItem && localStorage.setItem;
  }

  return false;
}
