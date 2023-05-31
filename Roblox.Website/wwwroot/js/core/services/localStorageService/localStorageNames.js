import { CurrentUser } from 'Roblox';
const { userId } = CurrentUser || {};
const USER_TYPE_KEY = {
  friends: 'Friends',
  followers: 'Followers',
  requests: 'Requests',
  followings: 'Followings'
};

export default {
  friendsDict: function(type) {
    return `Roblox.${USER_TYPE_KEY[type]}Dict.UserId${userId || 0}`;
  }
};
