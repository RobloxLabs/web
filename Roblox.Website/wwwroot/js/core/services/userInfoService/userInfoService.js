import { fetchUsersList, listenToPresenceUpdate, fetchFromNetwork } from '../../utils/userInfoUtil';

class UserInfoService {
    constructor() {
        this.callbacks = new Set();
        this.friendsDict = {};
    }

    unSubscribe(callback) {
        this.callbacks.delete(callback);
    }

    subscribe(callback, type, cacheCriteria) {
        const isValidCallback = typeof callback === 'function';
        const cacheEnabled = cacheCriteria && cacheCriteria.isEnabled;
        isValidCallback && this.callbacks.add(callback);

        if (cacheEnabled && this.friendsDict[type]) {
            isValidCallback && callback(this.friendsDict[type]);
        } else {
            fetchUsersList(this.friendsDict, type, cacheCriteria).then(data => {
                cacheEnabled && listenToPresenceUpdate(type, data);
                this.friendsDict[type] = data;
                this.callbacks.forEach(func => {
                    func(data);
                });
            });
        }
    }

    refreshCacheData(type, cacheCriteria) {
        const { isEnabled } = cacheCriteria;
        return fetchFromNetwork(this.friendsDict, type, isEnabled);
    }


}

const userInfoService = new UserInfoService();

userInfoService.TYPE = {
    FRIENDS: 'friends',
    FOLLOWERS: 'followers',
    FOLLOWINGS: 'followings',
    FRIENDREQUESTS: 'friendrequests'
};

export default userInfoService;
