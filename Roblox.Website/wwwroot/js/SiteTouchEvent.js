if (typeof Roblox == "undefined") {
    Roblox = {};
}

Roblox.SiteTouchEvent = (function () {
    var key = 'LastActivity';

    function getLastActivity() {
        if (localStorage == null) return new Date(0);
        var lastActivity;
        if (typeof localStorage != "undefined") {
            // assume localStorage is available (IE >= 8, and modern browsers)
            lastActivity = localStorage.getItem(key);
        }
        if (typeof lastActivity == "undefined" || lastActivity === null) {
            // get from cookie
            lastActivity = $.cookie(key);
        }
        var lastActivityTicks = Date.parse(lastActivity);
        if (lastActivity && !isNaN(lastActivityTicks)) {
            return new Date(lastActivityTicks);
        }
        else {
            // no value found, definitely fire an event
            return new Date(0); // Jan 1 1970 00:00:00 GMT
        }
    }

    function setLastActivity(lastActivity) {
        if (localStorage == null) return;
        if (typeof lastActivity == "undefined") {
            lastActivity = new Date(); // default to current date
        }
        // clear the unused storage location, in case we have switched locations
        if (typeof localStorage != "undefined") {
            if (my.useLocalStorage) {
                $.cookie(key, null);
            }
            else {
                localStorage.removeItem(key);
            }
        }
        // write the data
        if (my.useLocalStorage && typeof localStorage != "undefined") {
            // assume localStorage is available (IE >= 8, and modern browsers)
            localStorage.setItem(key, lastActivity);
        }
        else {
            // store in cookie
            $.cookie(key, lastActivity, { expires: 100 }); // 100 days
        }
    }

    function updateLastActivityAndFireEvent() {
        var lastActivity = getLastActivity();
        // 3600000ms = 1 hr
        if (Math.floor(((new Date()) - lastActivity) / 3600000) >= my.dateDiffThresholdInHours) {
            // send an event
            RobloxEventManager.triggerEvent('rbx_evt_sitetouch');
        }
        setLastActivity();
    }

    var my = {
        updateLastActivityAndFireEvent: updateLastActivityAndFireEvent,
        getLastActivity: getLastActivity,
        setLastActivity: setLastActivity,
        dateDiffThresholdInHours: 3,
        useLocalStorage: false
    };

    return my;
})();