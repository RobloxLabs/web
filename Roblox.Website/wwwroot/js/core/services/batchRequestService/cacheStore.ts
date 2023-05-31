import localStorageService from '../../services/localStorageService/localStorageService';
import {
  DefaultExpirationWindowMS,
  CacheProperties,
  CacheObject,
  CacheStorePrefix
} from './batchRequestConstants';

class CacheStore {
  private store: Map<string, object> = new Map();
  private useCache: boolean;
  private expirationWindowMS: number;
  private storeKeyPrefix: string;

  constructor(useCache?: boolean, expirationWindowMS?: number) {
    this.useCache = useCache || false;
    this.expirationWindowMS = expirationWindowMS || DefaultExpirationWindowMS;
    this.storeKeyPrefix = `${CacheStorePrefix}:`;
  }

  private getCacheKey(key: string) {
    return `${this.storeKeyPrefix}${key}`;
  }

  public has(key: string, { useCache, expirationWindowMS }: CacheProperties) {
    const storeKey = this.getCacheKey(key);
    if ((useCache || this.useCache) && localStorage) {
      return !!localStorageService.fetchNonExpiredCachedData(
        storeKey,
        expirationWindowMS || this.expirationWindowMS
      );
    }
    return this.store.has(storeKey);
  }

  public set(key: string, data: object, { useCache }: CacheProperties) {
    const storeKey = this.getCacheKey(key);
    if ((useCache || this.useCache) && localStorage) {
      localStorageService.saveDataByTimeStamp(storeKey, data);
    }
    this.store.set(storeKey, data);
    return;
  }

  public get(key: string, { useCache, expirationWindowMS }: CacheProperties) {
    const storeKey = this.getCacheKey(key);
    let cache: CacheObject;
    if ((useCache || this.useCache) && localStorage) {
      cache = localStorageService.fetchNonExpiredCachedData(
        storeKey,
        expirationWindowMS || this.expirationWindowMS
      );
      return cache?.data;
    }
    // Sync up store with cache if it exists.
    // All cached item also exist in store
    // But not all store item exists in cache
    if (cache) {
      this.store.set(storeKey, cache?.data);
    }
    return this.store.get(storeKey);
  }

  public delete(key: string) {
    const storeKey = this.getCacheKey(key);
    if (localStorage) {
      localStorageService.removeLocalStorage(storeKey);
    }
    this.store.delete(storeKey);
  }

  // clear everything in store
  // and localstorage
  public clear() {
    this.store.clear();
    if (localStorage) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const localStorageKey = localStorage.key(i);
        if (localStorageKey.includes(this.storeKeyPrefix)) {
          keysToRemove.push(localStorageKey);
        }
      }
      for (let k = 0; k < keysToRemove.length; k++) {
        localStorage.removeItem(keysToRemove[k]);
      }
    }
  }
}

export default CacheStore;
