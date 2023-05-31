import httpService from '../../../http/implementations/httpService';
import { BatchRequestFactory } from '../../../services/batchRequestService/batchRequestFactory';
import {
  getUsersUrl,
  DefaultUserBatchSize,
  DefaultUserProcessBatchWaitTime,
  UserObject,
  UserQueueItem
} from './userDataConstants';

const batchRequestFactory = new BatchRequestFactory<UserQueueItem>();

const userBatchRequestProcessor = batchRequestFactory.createRequestProcessor(
  items => {
    const urlConfig = {
      url: getUsersUrl(),
      retryable: true,
      withCredentials: true
    };
    const userIds = items.map(({ data: { userId } }) => userId);
    return httpService
      .post(urlConfig, { userIds, excludeBannedUsers: true })
      .then(({ data: { data: users } }) => {
        const results: { [key: number]: UserObject } = {};
        users.forEach((user: UserObject) => {
          results[user.id] = user;
        });
        return results;
      });
  },
  ({ userId }: UserQueueItem) => userId?.toString(),
  {
    batchSize: DefaultUserBatchSize,
    processBatchWaitTime: DefaultUserProcessBatchWaitTime
  }
);

export default userBatchRequestProcessor;
