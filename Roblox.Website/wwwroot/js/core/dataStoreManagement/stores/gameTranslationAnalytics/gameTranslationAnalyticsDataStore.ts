import { AxiosPromise } from 'axios';
import * as GameInternationalizationProvider from '../../providers/gameInternationalization/gameInternationalizationProvider';

const translationAnalyticsApiInstance = new GameInternationalizationProvider.TranslationAnalyticsApi();

const getMetadata = (): AxiosPromise<
  GameInternationalizationProvider.RobloxGameInternationalizationApiTranslationAnalyticsMetadataResponse
> => {
  return translationAnalyticsApiInstance.v1TranslationAnalyticsMetadataGet({ withCredentials: true });
};

const requestReport = (
  gameId: number,
  startDateTime: string,
  endDateTime: string,
  reportType: GameInternationalizationProvider.RobloxGameInternationalizationApiRequestTranslationAnalyticsReportRequestReportTypeEnum,
  reportSubjectTargetId: number
): AxiosPromise<GameInternationalizationProvider.RobloxGameInternationalizationApiRequestTranslationAnalyticsReportResponse> => {
  const requestPayload: GameInternationalizationProvider.RobloxGameInternationalizationApiRequestTranslationAnalyticsReportRequest = {
    startDateTime,
    endDateTime,
    reportType,
    reportSubjectTargetId
  };
  return translationAnalyticsApiInstance.v1TranslationAnalyticsGamesGameIdRequestTranslationAnalyticsReportPost(
    gameId,
    requestPayload,
    { withCredentials: true }
  );
};

const downloadReport = (
  gameId: number,
  startDateTime: string,
  endDateTime: string,
  reportType: GameInternationalizationProvider.RobloxGameInternationalizationApiRequestTranslationAnalyticsReportRequestReportTypeEnum,
  reportSubjectTargetid: number
): AxiosPromise<Object> => {
  return translationAnalyticsApiInstance.v1TranslationAnalyticsGamesGameIdDownloadTranslationAnalyticsReportGet(
    gameId,
    startDateTime,
    endDateTime,
    reportType,
    reportSubjectTargetid,
    { withCredentials: true, responseType: 'arraybuffer' }
  );
};

export default {
  getMetadata,
  requestReport,
  downloadReport
};
