import {
  BatchRequestProcessor,
  BatchItemProcessor,
  BatchIdSerializer,
  QueueItem,
  BatchRequestError
} from 'core-utilities';
import { BatchRequestFactory } from '../../../services/batchRequestService/batchRequestFactory';
import { httpService } from '../../../http/http';
import { CacheProperties } from '../../../services/batchRequestService/batchRequestConstants';
import {
  populateFriendsData,
  populatePresenceData,
  getFriendsUrlConfig,
  getPresenceUrlConfig,
  getFriendsParams
} from './userStoreUtil';

import {
  UserDataRequest,
  FriendsRes,
  FriendResult,
  MethodType,
  PresenceObject,
  UserQueueItem
} from './userDataConstants';
import userBatchRequestProcessor from './userBatchRequestProcessor';

const batchRequestFactory = new BatchRequestFactory<UserDataRequest>();

const processors: Map<string, BatchRequestProcessor<UserDataRequest>> = new Map<
  string,
  BatchRequestProcessor<UserDataRequest>
>();

const getIdSerializer = (
  methodName: MethodType,
  { userId, cursor, sortOrder, limit }: UserDataRequest
) => `${methodName}:${userId}:${cursor}:${sortOrder}:${limit}`;

const getUserDataRequestProcessor = (
  methodName: string,
  itemProcessor: BatchItemProcessor<UserDataRequest>,
  idSerializer: BatchIdSerializer<UserDataRequest>
) => {
  if (processors.has(methodName)) return processors.get(methodName);
  const processor = batchRequestFactory.createRequestProcessor(itemProcessor, idSerializer, {
    batchSize: 1
  });
  processors.set(methodName, processor);
  return processor;
};

const getItemProcessor = (methodName: MethodType) => {
  return ([{ key, data: userDataRequest }]: QueueItem<UserDataRequest>[]) => {
    const { userId, isGuest } = userDataRequest;
    const urlConfig = getFriendsUrlConfig(methodName, userId);
    const params = getFriendsParams(userDataRequest);

    return httpService
      .get(urlConfig, params)
      .then((friendsRes: FriendsRes) => {
        const results: { [key: string]: FriendResult } = {};
        if (!friendsRes?.data) {
          results[key] = { userData: [] };
          return results;
        }

        const {
          data: { data: userData, previousPageCursor: prevCursor, nextPageCursor: nextCursor }
        } = friendsRes;
        const friendsData = populateFriendsData(userData);

        if (isGuest) {
          results[key] = { userData, prevCursor, nextCursor };
          return results;
        }

        const presenceUrlConfig = getPresenceUrlConfig();

        const userIds = Object.keys(friendsData).map(id => parseInt(id, 10));
        return httpService
          .post(presenceUrlConfig, { userIds })
          .then((presenceData: PresenceObject) => {
            populatePresenceData(friendsData, presenceData);
            results[key] = { userData, prevCursor, nextCursor };
            return results;
          })
          .catch((error: BatchRequestError) => {
            // do not retry presence call if failed
            console.debug(error);
            results[key] = { userData, prevCursor, nextCursor };
            return results;
          });
      })
      .catch((error: BatchRequestError) => {
        // request will be retried if not successful
        console.debug(error);
        return {};
      });
  };
};

const generateUserDataStoreMethod = (methodName: MethodType) => {
  const userDataProcessor = getUserDataRequestProcessor(
    methodName,
    getItemProcessor(methodName),
    ({ userId }: UserDataRequest) => userId?.toString()
  );

  return (userDataRequest: UserDataRequest, cacheProperties?: CacheProperties) => {
    const requestKey = getIdSerializer(methodName, userDataRequest);

    if (cacheProperties?.refreshCache) {
      userDataProcessor.invalidateItem(userDataRequest, requestKey);
    }
    return userDataProcessor.queueItem(userDataRequest, requestKey, cacheProperties);
  };
};

const clearUserDataStoreCache = () => {
  processors.forEach((processor: BatchRequestProcessor<UserQueueItem>) => {
    processor.clearCache();
  });
};

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export default window.CoreRobloxUtilities?.dataStores?.userDataStoreV2 || {
  getFriends: generateUserDataStoreMethod(MethodType.Friends),
  getFollowers: generateUserDataStoreMethod(MethodType.Followers),
  getFollowings: generateUserDataStoreMethod(MethodType.Followings),
  getFriendsRequests: generateUserDataStoreMethod(MethodType.Requests),
  getUser: (userId: number) => userBatchRequestProcessor.queueItem({ userId }),
  clearUserDataStoreCache
};
