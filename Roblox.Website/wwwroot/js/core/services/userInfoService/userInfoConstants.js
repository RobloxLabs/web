import { EnvironmentUrls } from 'Roblox';
const {
    friendsApi, presenceApi, websiteUrl
} = EnvironmentUrls;

export default {
    getUserProfileUrl: function (userId) {
        return `${websiteUrl}/users/${userId}/profile`;
    },

    getUserFriendsUrl: function (userId) {
        return `${friendsApi}/v1/users/${userId}/friends`;
    },

    getUsersPresenceUrl: function () {
        return `${presenceApi}/v1/presence/users`;
    },

    getUserFollowersUrl: function (userId) {
        return `${friendsApi}/v1/users/${userId}/followers`;
    },

    getUserFollowingsUrl: function (userId) {
        return `${friendsApi}/v1/users/${userId}/followings`;
    },

    getUserRequestUrl: function () {
        return `${friendsApi}/v1/my/friends/requests`;
    }
}