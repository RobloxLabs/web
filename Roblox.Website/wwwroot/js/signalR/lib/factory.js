import { RealTimeSettings, CurrentUser, LocalStorage } from 'Roblox';
import signalRSource from '../sources/signalRSource';
import hybridSource from '../sources/hybridSource';
import crossTabReplicatedSource from '../sources/crossTabReplicatedSource';
import realtimeClient from './client';

const realtimeFactory = (function () {
    let client = null;

    const getClient = function () {
        if (client === null) {
            client = initialiseSingletonClient();
        }
        return client;
    };

    var initialiseSingletonClient = function () {
        const sources = [];
        if (hybridSource) {
            sources.push(hybridSource);
        }
        if (crossTabReplicatedSource) {
            sources.push(crossTabReplicatedSource);
        }
        if (signalRSource) {
            sources.push(signalRSource);
        }

        return new realtimeClient(sources);
    };

    const parseToIntOrNull = function (raw) {
        const parsed = parseInt(raw);
        if (!isNaN(parsed)) {
            return parsed;
        }
        return null;
    };

    let settings = null;
    const getSettings = function () {
        if (settings === null) {
            settings = {};
            if (RealTimeSettings) {
                settings.notificationsUrl = RealTimeSettings.NotificationsEndpoint;
                settings.maxConnectionTimeInMs = parseInt(RealTimeSettings.MaxConnectionTime); // six hours
                settings.isEventPublishingEnabled = RealTimeSettings.IsEventPublishingEnabled;
                settings.isDisconnectOnSlowConnectionDisabled =
                    RealTimeSettings.IsDisconnectOnSlowConnectionDisabled;
                settings.userId = CurrentUser ? parseInt(CurrentUser.userId) : -1;
                settings.isSignalRClientTransportRestrictionEnabled =
                    RealTimeSettings.IsSignalRClientTransportRestrictionEnabled;
                settings.isLocalStorageEnabled = RealTimeSettings.IsLocalStorageInRealTimeEnabled;
            } else {
                settings.notificationsUrl = 'https://realtime.roblox.com';
                settings.maxConnectionTimeInMs = 21600000; // six hours
                settings.isEventPublishingEnabled = false;
                settings.isDisconnectOnSlowConnectionDisabled = false;
                settings.userId = CurrentUser ? parseInt(CurrentUser.userId) : -1;
                settings.isSignalRClientTransportRestrictionEnabled = false;
                settings.isLocalStorageEnabled = false;
            }
        }
        return settings;
    };

    const getNotificationsUrl = function () {
        return getSettings().notificationsUrl;
    };

    const getMaximumConnectionTime = function () {
        return getSettings().maxConnectionTimeInMs;
    };

    const isEventPublishingEnabled = function () {
        return getSettings().isEventPublishingEnabled;
    };

    const isLocalStorageEnabled = function () {
        if (LocalStorage) {
            return LocalStorage.isAvailable() && getSettings().isLocalStorageEnabled;
        }
        return localStorage && getSettings().isLocalStorageEnabled;
    };

    const getUserId = function () {
        return getSettings().userId;
    };

    return {
        GetClient: getClient,
        GetNotificationsUrl: getNotificationsUrl,
        GetMaximumConnectionTime: getMaximumConnectionTime,
        IsEventPublishingEnabled: isEventPublishingEnabled,
        IsLocalStorageEnabled: isLocalStorageEnabled,
        GetUserId: getUserId,
        GetSettings: getSettings
    };
})();

export default realtimeFactory;