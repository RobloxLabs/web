export const PresenceTypes = {
    Offline: 0,
    Online: 1,
    InGame: 2,
    InStudio: 3
} as const;

export default {
    realtimeNotificationType: 'PresenceBulkNotifications',
    realtimeEventTypes: {
        presenceChanged: 'PresenceChanged'
    }
};