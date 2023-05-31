import { EnvironmentUrls, RealTime } from 'Roblox';
import { authenticatedUser } from 'header-scripts';
import { httpService } from 'core-utilities';
import presenceStatusConstants from '../constants/presenceStatusConstants';

const presenceStatusUpdateService = (() => {
    function getPresences(presenceChangedUserIds) {
        const userPresenceUrlConfig = {
            url: `${EnvironmentUrls.presenceApi}/v1/presence/users`,
            withCredentials: true
        };

        const data = {
            userIds: presenceChangedUserIds
        };

        httpService
            .post(userPresenceUrlConfig, data)
            .then(result => {
                if (result?.data) {
                    document.dispatchEvent(
                        new CustomEvent('Roblox.Presence.Update', { detail: result.data.userPresences })
                    );
                }
            })
            .catch(error => {
                console.debug(error);
            });
    }

    function initializeRealTimeSubscriptions() {
        if (RealTime) {
            const realTimeClient = RealTime.Factory.GetClient();
            const { realtimeNotificationType, realtimeEventTypes } = presenceStatusConstants;
            realTimeClient.Subscribe(realtimeNotificationType, data => {
                const presenceChangedUserIds = [];
                data.forEach(each => {
                    const changedUserId = each.UserId;
                    switch (each.Type) {
                        case realtimeEventTypes.presenceChanged:
                            if (presenceChangedUserIds.indexOf(changedUserId) < 0) {
                                presenceChangedUserIds.push(changedUserId);
                            }
                            break;
                        default:
                            break;
                    }
                });
                if (presenceChangedUserIds.length) {
                    presenceStatusUpdateService.getPresences(presenceChangedUserIds);
                }
            });
        }
    }

    return {
        initializeRealTimeSubscriptions,
        getPresences
    };
})();

if (authenticatedUser?.isAuthenticated) {
    document.addEventListener('DOMContentLoaded', () => {
        presenceStatusUpdateService.initializeRealTimeSubscriptions();
    });
}