"use strict";

var Roblox = Roblox || {};

Roblox.PresenceService = (function () {
    function getPresences(data) {
        var userPresenceUrl = Roblox.EnvironmentUrls.presenceApi + "/v1/presence/users";

        $.ajax({
            method: "POST",
            url: userPresenceUrl,
            data: data,
            success: function (data) {
                $(document).trigger("Roblox.Presence.Update", [data.userPresences]);
            }
        });
    }

    function initializeRealTimeSubscriptions() {
        if (Roblox && Roblox.RealTime) {
            var realTimeClient = Roblox.RealTime.Factory.GetClient();
            // presenceBulkNotifications
            var presenceBulkNotifications = Roblox.Constants.realTimeNotifications.presenceBulkNotifications.name;
            var presenceBulkTypes = Roblox.Constants.realTimeNotifications.presenceBulkNotifications.types;
            realTimeClient.Subscribe(presenceBulkNotifications, function (data) {
                data.forEach(function (each) {
                    switch (each.Type) {
                        case presenceBulkTypes.presenceChanged:
                            var userIdData = { userIds: [] };
                            userIdData.userIds.push(each.UserId);
                            Roblox.PresenceService.getPresences(userIdData);
                            break;
                    }
                });
            });
        }
    }

    function init () {
        Roblox.PresenceService.initializeRealTimeSubscriptions();
    }

    $(function () {
        if (Roblox.CurrentUser && Roblox.CurrentUser.isAuthenticated) {
            Roblox.PresenceService.init();
        }
    });

    return {
        init: init,
        initializeRealTimeSubscriptions: initializeRealTimeSubscriptions,
        getPresences: getPresences
    }
})();