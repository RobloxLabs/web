import { AxiosPromise } from 'axios';
import localStorageService from '../../../services/localStorageService/localStorageService';
import 
    * as
    LocaleProvider
 from '../../providers/locale/localeProvider';

const localeApiInstance = new LocaleProvider.LocaleApi();

const enum localeStorageCacheKeys {
    getLocales = 'Roblox.Api.Locales.getLocales'
};

const getLocales = (): AxiosPromise<LocaleProvider.ApiArrayResponseSupportedLocaleLocus> => {
    return localeApiInstance.v1LocalesGet({ withCredentials: true });
};

const getUserLocale = (): AxiosPromise<LocaleProvider.UserLocalizationLocusLocalesResponse> => {
    return localeApiInstance.v1LocalesUserLocalizationLocusSupportedLocalesGet({ withCredentials: true });
}

const setUserLocale = (localeCode: string): AxiosPromise<LocaleProvider.SuccessResponse> => {
    const payload: LocaleProvider.SetSupportedLocaleForUserRequest = {
        supportedLocaleCode: localeCode
    };
    return localeApiInstance.v1LocalesSetUserSupportedLocalePost(payload, { withCredentials: true });
};

const requestDataFromCacheOrNetwork = (networkCaller: Function, localeStorageKey: string, cacheDurationInMs: number) => {
    return new Promise((resolve, reject) => {
        const localStorageData = localStorageService.fetchNonExpiredCachedData(localeStorageKey, cacheDurationInMs);
        if(!localStorageData){
            networkCaller().then((response: any) => {
                localStorageService.saveDataByTimeStamp(localeStorageKey, response.data);
                resolve(response.data);
            }, (error: Error) => reject(error));
        } else {
            resolve(localStorageData.data);
        }
    });
}

const getLocalesWithCache = (cacheDurationInMs: number) => {
    return requestDataFromCacheOrNetwork(getLocales, localeStorageCacheKeys.getLocales, cacheDurationInMs);
};

export default {
    getLocales,
    getUserLocale,
    setUserLocale,
    getLocalesWithCache
};
