import { AxiosPromise } from 'axios';
import * as CatalogProvider from '../../providers/catalog/catalogProvider';
import { RobloxCatalogApiMultigetItemDetailsRequestModel } from '../../providers/catalog/catalogProvider';

const bundleApiInstance = new CatalogProvider.BundleApi();
const catalogApiInstance = new CatalogProvider.CatalogApi();
const recommendationsApiInstance = new CatalogProvider.RecommendationsApi();

const getAssetRecommendations = (
  assetTypeId: number,
  numItems?: number,
  contextAssetId?: number
): AxiosPromise<CatalogProvider.RobloxWebWebAPIModelsApiLegacyPageResponseRobloxCatalogApiRecommendationViewModelV2> => {
  return recommendationsApiInstance.v1RecommendationsAssetAssetTypeIdGet(
    assetTypeId,
    numItems,
    contextAssetId
  );
};

const getBundleRecommendations = (
  bundleId: number,
  numItems?: number
): AxiosPromise<CatalogProvider.RobloxWebWebAPIModelsApiArrayResponseRobloxCatalogApiBundleDetailsModel> => {
  return bundleApiInstance.v1BundlesBundleIdRecommendationsGet(bundleId, numItems, {
    withCredentials: true
  });
};

const postItemDetails = (
  model: RobloxCatalogApiMultigetItemDetailsRequestModel
): AxiosPromise<CatalogProvider.RobloxWebWebAPIModelsApiArrayResponseRobloxCatalogApiCatalogSearchDetailedResponseItem> => {
  return catalogApiInstance.v1CatalogItemsDetailsPost(model, { withCredentials: true });
};

export default {
  getAssetRecommendations,
  getBundleRecommendations,
  postItemDetails
};
