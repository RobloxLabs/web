var Roblox = Roblox || {};

Roblox.AjaxPageLoadEvent = (function () {

    var sendEvent = function (context, url, additionalParams) {
        if (!Roblox.EventStream) {
            return;
        }
        var defaultParams = {
            Url: url
        }
        if (additionalParams) {
            Object.assign(defaultParams, additionalParams);
        }

        Roblox.EventStream.SendEventWithTarget("ajaxPageLoad", context, defaultParams, Roblox.EventStream.TargetTypes.WWW);
    }

    return {
        SendEvent: sendEvent
    }

})();