import { AxiosPromise } from 'axios';
import 
    * as
    InventoryProvider
 from '../../providers/inventory/inventoryProvider';

const assetsApiInstance = new InventoryProvider.AssetsApi();

const getRecommendations = (assetTypeId: number, numItems?: number, contextAssetId?: number): AxiosPromise<InventoryProvider.ApiLegacyPageResponseRecommendationViewModelV2A> => {
    return assetsApiInstance.v2RecommendationsAssetTypeIdGet(assetTypeId, numItems, contextAssetId);
}

export default {
    getRecommendations
};
