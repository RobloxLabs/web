import { CurrentUser } from 'Roblox';
import { httpService } from '../http/http';
import localStorageService from '../services/localStorageService/localStorageService';
import localStorageNames from '../services/localStorageService/localStorageNames';
import userInfoConstants from '../services/userInfoService/userInfoConstants';

const {
  getUserProfileUrl,
  getUserFriendsUrl,
  getUserFollowersUrl,
  getUserFollowingsUrl,
  getUserRequestUrl,
  getUsersPresenceUrl
} = userInfoConstants;

const BATCH_LIMIT = 100;

const URL_MAP = {
  friends: getUserFriendsUrl,
  followers: getUserFollowersUrl,
  followings: getUserFollowingsUrl,
  friendrequests: getUserRequestUrl
};

function removeFriendsDictCache(type) {
  document.addEventListener('Roblox.Logout', function() {
    localStorageService.removeLocalStorage(localStorageNames.friendsDict(type));
  });
}

function tryFetchFromCache(type, expirationMS) {
  const cache = localStorageService.fetchNonExpiredCachedData(
    localStorageNames.friendsDict(type),
    expirationMS
  );
  return cache ? cache.data : null;
}

export function fetchFromNetwork(friendsDict, type, cacheEnabled) {
  const friendsApi = {
    url: URL_MAP[type](CurrentUser.userId),
    retryable: true,
    withCredentials: true
  };

  const presenceApi = {
    url: getUsersPresenceUrl(),
    retryable: true,
    withCredentials: true
  };

  return httpService.get(friendsApi).then(result => {
    const friends = result.data.data || result;
    const userIds = [];
    friendsDict[type] = {};

    friends.forEach(friend => {
      let userId = friend.id;
      userIds.push(userId);
      friend.profileUrl = getUserProfileUrl(userId);
      friendsDict[type][userId] = friend;
    });

    return httpService.buildBatchPromises(userIds, BATCH_LIMIT, presenceApi, true).then(data => {
      if (data && data.length > 0) {
        let presences = [];
        data.forEach(({ data: { userPresences } }) => {
          presences = presences.concat(userPresences);
        });

        presences.forEach(presence => {
          friendsDict[type][presence.userId].presence = presence;
        });
      }

      if (cacheEnabled) {
        localStorageService.saveDataByTimeStamp(
          localStorageNames.friendsDict(type),
          friendsDict[type]
        );
        removeFriendsDictCache(type);
      }

      return friendsDict[type];
    });
  });
}

export function listenToPresenceUpdate(type, cacheData) {
  if (cacheData) {
    document.addEventListener('Roblox.Presence.Update', function(event, args) {
      if (args) {
        setTimeout(function() {
          args.forEach(function(presence) {
            let {userId} = presence;
            if (cacheData[userId]) {
              cacheData[userId].presence = presence;
            }
          });
          localStorageService.saveDataByTimeStamp(localStorageNames.friendsDict(type), cacheData);
        });
      }
    });
  }
}

export function fetchUsersList(friendsDict, type, cacheCriteria) {
  const { expirationMS, isEnabled: cacheEnabled } = cacheCriteria;
  if (cacheEnabled) {
    const cacheData = tryFetchFromCache(type, expirationMS);
    if (cacheData) {
      return new Promise(function(resolve) {
        resolve(cacheData);
      });
    }
  }

  return fetchFromNetwork(friendsDict, type, cacheEnabled);
}
