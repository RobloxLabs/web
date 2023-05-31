import { AxiosPromise } from 'axios';
import
    * as
    GameInternationalizationProvider
    from '../../providers/gameInternationalization/gameInternationalizationProvider';
import
    * as
    LocalizationTablesProvider
    from '../../providers/localizationTables/localizationTablesProvider';

const autoLocalizationApiInstance = new GameInternationalizationProvider.AutolocalizationApi();
const localizationTablesApiInstance = new LocalizationTablesProvider.AutoLocalizationTableApi();

const getAutolocalizationConfiguration = (gameId: number) : AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiGameAutolocalizationInformationResponse> => {
    return autoLocalizationApiInstance.v1AutolocalizationGamesGameIdAutolocalizationtablePost(gameId, { withCredentials: true });
};

const setAutolocalizationConfiguration = (gameId: number, isAutolocalizationEnabled: boolean) : AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiGameAutolocalizationInformationResponse> => {
    const patchPayload: GameInternationalizationProvider.RobloxGameInternationalizationApiSetAutolocalizationSettingsForGameRequest = {
        isAutolocalizationEnabled
    }
    return autoLocalizationApiInstance.v1AutolocalizationGamesGameIdSettingsPatch(gameId, patchPayload, { withCredentials: true });
};

const setUseAutoLocalizationTable = (gameId: number, shouldUseLocalizationTable: boolean) : AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiGameAutolocalizationInformationResponse> => {
    const patchPayload: GameInternationalizationProvider.RobloxGameInternationalizationApiSetAutolocalizationSettingsForGameRequest = {
        shouldUseLocalizationTable,
    }
    return autoLocalizationApiInstance.v1AutolocalizationGamesGameIdSettingsPatch(gameId, patchPayload, { withCredentials: true });
};

const flushAutoLocalizationTable = (gameId: number, maxAgeForFlush: string): AxiosPromise<any> => {
    const cleanupRequest: LocalizationTablesProvider.RobloxLocalizationTablesApiRaiseEventForAutoScrapedEntriesCleanupRequest = {
        maxAgeForFlush
    }
    return localizationTablesApiInstance.v1AutoLocalizationTableGamesGameIdAutoScrapeCleanupRequestPost(gameId, cleanupRequest, { withCredentials: true });
}

const getMetadata = (): AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiAutoLocalizationMetadataResponse> => {
    return autoLocalizationApiInstance.v1AutolocalizationMetadataGet({ withCredentials: true });
}

export default {
    getAutolocalizationConfiguration,
    setAutolocalizationConfiguration,
    setUseAutoLocalizationTable,
    flushAutoLocalizationTable,
    getMetadata
};
