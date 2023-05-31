"use strict";
// after BE is done, we need to redo this part , remove hard code and might remove localstorage as well;
var Roblox = Roblox || {};
Roblox.ThemeUpdate = (function() {
    var themeClasses = { Classic: "light-theme", Dark: "dark-theme", Light: "light-theme"};
    var reskinBodyClassName = ".rbx-body";
    var themeElms = ["#navigation-container", ".container-main", "#chat-container", ".notification-stream-base", "#notification-stream-popover"];
    var currentTheme = "";

    function handleGetThemeSuccess(data) {
        if (currentTheme !== data.themeType) {
            cleanClass();
            setClass(themeClasses[data.themeType]);
            currentTheme = data.themeType;
        }
    }

    function getTheme() {
        var url = Roblox.EnvironmentUrls.accountSettingsApi + "/v1/themes/user";
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            success: handleGetThemeSuccess
        });
    }

    function listenThemeChange() {
        if (Roblox && Roblox.RealTime) {
            var realTimeClient = Roblox.RealTime.Factory.GetClient();
            realTimeClient.Subscribe("UserThemeTypeChangeNotification", getTheme);
        }
        // backup in case realtime connection is not ready due to race condition
        $(document).on("Roblox.ThemeUpdate", getTheme);
    }
    
    function isReskinPage () {
        var reskinBody = $(reskinBodyClassName);
        return reskinBody && reskinBody.length > 0;
    }
    
    function setClass(themeType) {
        if (isReskinPage()) {
            $(reskinBodyClassName).addClass(themeType);
        } else {
            themeElms.forEach(function(elm){
                if ($(elm)) {
                    $(elm).addClass(themeType);
                }
            });
        }
    }
    
    function cleanClass () {
        for (var theme in themeClasses) {
            $(reskinBodyClassName).removeClass(themeClasses[theme]);
            themeElms.forEach(function(elm){
                    if ($(elm)) {
                        $(elm).removeClass(themeClasses[theme]);
                    }
                });
        }
    }
    
    function init () {
        listenThemeChange();
    }
    
    return {
        init: init
    }
})();

$(function () { 
    Roblox.ThemeUpdate.init();
});