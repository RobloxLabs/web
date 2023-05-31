import { AxiosPromise } from 'axios';
import * as GamesProvider from '../../providers/games/gamesProvider';
import * as GamesV2Provider from '../../providers/gamesV2/gamesV2Provider';

const gamesApiInstance = new GamesProvider.GamesApi();
const gamesV2ApiInstance = new GamesV2Provider.GamesApi();
const gamePassesApiInstance = new GamesProvider.GamePassesApi();

const getUniverseMedia = (
  universeId: number
): AxiosPromise<GamesV2Provider.RobloxWebWebAPIModelsApiArrayResponseRobloxWebResponsesGamesGameMediaItemResponseV2> => {
  return gamesV2ApiInstance.v2GamesUniverseIdMediaGet(universeId, { withCredentials: true });
};

const getPlayabilityStatus = (
  universeIds: number[]
): AxiosPromise<GamesProvider.RobloxGamesApiModelsResponsePlayabilityStatusResponse[]> => {
  return gamesApiInstance.v1GamesMultigetPlayabilityStatusGet(universeIds, {
    withCredentials: true
  });
};

const getPlaceDetails = (
  placeIds: number[]
): AxiosPromise<GamesProvider.RobloxGamesApiModelsResponsePlaceDetails[]> => {
  return gamesApiInstance.v1GamesMultigetPlaceDetailsGet(placeIds, { withCredentials: true });
};

const getProductInfo = (
  universeIds: number[]
): AxiosPromise<GamesProvider.RobloxWebWebAPIModelsApiArrayResponseRobloxGamesApiModelsResponseGameProductResponse> => {
  return gamesApiInstance.v1GamesGamesProductInfoGet(universeIds, { withCredentials: true });
};

const getGameDetails = (
  universeIds: number[]
): AxiosPromise<GamesProvider.RobloxWebWebAPIModelsApiArrayResponseRobloxGamesApiModelsResponseGameDetailResponse> => {
  return gamesApiInstance.v1GamesGet(universeIds, { withCredentials: true });
};

const getGamePasses = (
  universeId: number,
  sortOrder?: 'Asc' | 'Desc',
  limit?: 10 | 25 | 50 | 100,
  cursor?: string
): AxiosPromise<GamesProvider.RobloxWebWebAPIModelsApiPageResponseRobloxGamesApiModelsResponseGamePassResponse> => {
  return gamePassesApiInstance.v1GamesUniverseIdGamePassesGet(universeId, sortOrder, limit, cursor);
};

const getGamesSorts = (
  modelGameSortsContext?:
    | 'GamesDefaultSorts'
    | 'GamesAllSorts'
    | 'HomeSorts'
    | 'ChatSorts'
    | 'UnifiedHomeSorts'
    | 'AbTestSorts'
    | 'GamesPageAbTestSorts1'
    | 'GamesPageAbTestSorts2'
): AxiosPromise<GamesProvider.RobloxGamesApiModelsResponseGameSortsResponse> => {
  return gamesApiInstance.v1GamesSortsGet(modelGameSortsContext);
};

const getGamesList = (
  modelSortToken?: string,
  modelGameFilter?: string,
  modelTimeFilter?: string,
  modelGenreFilter?: string,
  modelExclusiveStartId?: number,
  modelSortOrder?: number,
  modelGameSetTargetId?: number,
  modelKeyword?: string,
  modelStartRows?: number,
  modelMaxRows?: number,
  modelIsKeywordSuggestionEnabled?: boolean,
  modelContextCountryRegionId?: number,
  modelContextUniverseId?: number,
  modelPageId?: string,
  modelSortPosition?: number,
  options?: any
): AxiosPromise<GamesProvider.RobloxGamesApiModelsResponseGamesSearchResponse> => {
  return gamesApiInstance.v1GamesListGet(
    modelSortToken,
    modelGameFilter,
    modelTimeFilter,
    modelGenreFilter,
    modelExclusiveStartId,
    modelSortOrder,
    modelGameSetTargetId,
    modelKeyword,
    modelStartRows,
    modelMaxRows,
    modelIsKeywordSuggestionEnabled,
    modelContextCountryRegionId,
    modelContextUniverseId,
    modelPageId,
    modelSortPosition,
    options
  );
};

export default {
  getUniverseMedia,
  getPlayabilityStatus,
  getPlaceDetails,
  getProductInfo,
  getGameDetails,
  getGamePasses,
  getGamesSorts,
  getGamesList
};
