if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.PushNotificationEventPublishers === "undefined") {
    Roblox.PushNotificationEventPublishers = {};
}

Roblox.PushNotificationEventPublishers.RegistrationEventTypes = {
    promptShown: 'promptShown',
    promptAccepted: 'promptAccepted',
    propmtDismissed: 'promptDismissed',
    settingsPageEnabled: 'settingsPageEnabled',
    settingsPageDisabled: 'settingsPageDisabled'
};

Roblox.PushNotificationEventPublishers.Registration = function (platformType) {
    "using strict";

    this.Publish = function (eventType, notificationType) {
        try {
            var details = {
                platformType: platformType
            };
            if (notificationType) {
                details.notificationType = notificationType;
            }

            Roblox.EventStream.SendEvent('pushNotificationRegistration', eventType, details);
        }
        catch (e) {
        }
    };
};