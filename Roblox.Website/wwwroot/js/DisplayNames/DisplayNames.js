Roblox = Roblox || {};

Roblox.DisplayNames = function () {
    "use strict";

    function isEnabled() {
        var config = $("#roblox-display-names");
        if (config.length) {
            return config.data("enabled");
        }
        return false;
    }

    return {
        Enabled: isEnabled
    };
}();