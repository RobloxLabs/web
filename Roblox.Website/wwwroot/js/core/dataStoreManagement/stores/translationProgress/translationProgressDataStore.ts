import { AxiosPromise } from 'axios';
import
    * as
    GameInternationalizationProvider
    from '../../providers/gameInternationalization/gameInternationalizationProvider';

const gameLocalizationStatusApiInstance = new GameInternationalizationProvider.GameLocalizationStatusApi();
enum LanguageOrLocaleTypeEnum {
    Language = 'Language',
    Locale = 'Locale',
};

const getTranslationProgress = (universeIds: number[], languageCode: string): AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiGetTranslationCountsForLanguageOrLocaleResponse> =>{
    return gameLocalizationStatusApiInstance.v1GameLocalizationStatusTranslationCountsForLanguageOrLocaleGet(universeIds, languageCode, LanguageOrLocaleTypeEnum.Language, { withCredentials: true });
}

export default {
    getTranslationProgress
};