if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.PushNotificationRegistrationUtilities = function () {

    var getRegistrationEndpoint = function (subscription) {
        return subscription.endpoint || null;
    };

    var getRegistrationToken = function (subscription) {
        if(!subscription.endpoint || typeof(subscription.endpoint) !== "string") {
            return null;
        }
        return subscription.endpoint.substr(subscription.endpoint.lastIndexOf('/') + 1);
    };

    return {
        getRegistrationEndpoint: getRegistrationEndpoint,
        getRegistrationToken: getRegistrationToken
    };
}();