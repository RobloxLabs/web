import { Hybrid } from 'Roblox';

const {
    Chat,
    Navigation,
    Overlay,
    Game,
    Localization
} = Hybrid || {};

function getCallback(callback) {
    if (typeof callback === 'undefined') {
        return function () { };
    }
    return callback;
}

export default {
    startChatConversation: function (params, callback) { // Android
        if (Chat) {
            Chat.startChatConversation(params, getCallback(callback));
        }
    },

    startWebChatConversation: function (params, callback) { // iOS
        if (Navigation) {
            Navigation.startWebChatConversation(params, getCallback(callback));
        }
    },

    navigateToFeature: function (params, callback) {
        if (Navigation) {
            Navigation.navigateToFeature(params, getCallback(callback));
        }
    },

    openUserProfile: function (params, callback) {
        if (Navigation) {
            Navigation.openUserProfile(params, getCallback(callback));
        }
    },

    close: function (callback) {
        if (Overlay) {
            Overlay.close(getCallback(callback));
        }
    },

    launchGame: function (params, callback) {
        if (Game) {
            Game.launchGame(params, getCallback(callback));
        }
    },

    localization: function(localeCode, callback) {
        if (Localization && Localization.languageChangeTrigger) {
            Localization.languageChangeTrigger(localeCode, getCallback(callback));
        }
    }
}