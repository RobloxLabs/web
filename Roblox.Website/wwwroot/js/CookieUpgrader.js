if (typeof Roblox == "undefined") { Roblox = {}; }
if (typeof Roblox.CookieUpgrader == "undefined") { Roblox.CookieUpgrader = {} };

/*
 * var cookieSpecs = {
        "RBXSource": { expires: function(cookie) { return Roblox.CookieUpgrader.getExpirationFromCookieValue("rbx_acquisition_time", cookie); } },
        "RBXEventTracker": { newCookieName: "RBXEventTrackerV2", expires: function(cookie) { return getExpirationFromCookieValue("CreateDate", cookie); } },
        "GuestData": { expires: thirtyYearsFromNow },
        "RBXViralAcquisition": { expires: thirtyDaysFromNow }
    };
 * 
 */

Roblox.CookieUpgrader.domain = "";

Roblox.CookieUpgrader.oneMonthInMs = 1000 * 60 * 60 * 24 * 30; // 1000ms * 60secs * 60 minutes * 24 hours * 30 days

Roblox.CookieUpgrader.upgrade = function (name, options) {

    function getCookie(name) {
        // cribbed from jquery.cookie.js, should be replaced
        var cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = cookie.substring(name.length + 1);
                    break;
                }
            }
        }
        return cookieValue;
    }

    if (Roblox.CookieUpgrader.domain === "") {
        // not configured correctly.
        return;
    }
    var originalCookieValue = getCookie(name);
    if (originalCookieValue == null) {
        // cookie doesn't exist
        return;
    }
    try {
        
        var originalCookieLength = document.cookie.length;
        // delete domain-less cookie
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.host;
        if (document.cookie.length === originalCookieLength) {
            // no cookie deleted.  quit early.
            return;
        }
        var newCookieName = name;
        if (typeof options.newCookieName != "undefined") {
            newCookieName = options.newCookieName;
        }
        var cookieValue = getCookie(name);
        if (cookieValue != null) {
            // there already exists a sub-domain-agnostic cookie.  No need to convert.
            if (typeof GoogleAnalyticsEvents != "undefined") {
                GoogleAnalyticsEvents.FireEvent(["CookieUpgrader", "DeletedRedundantCookie", name]);
            }

            var deletedCookieData = {
                cookieName: name,
                cookieValue: cookieValue
            };
            // Fire analytics event for cookie deletion
            if (Roblox.EventStream) {
                Roblox.EventStream.SendEventWithTarget("CookieUpgrader", "DeletedRedundantCookie", deletedCookieData, Roblox.EventStream.TargetTypes.DIAGNOSTIC);
            }
            return;
        }

        var cookie = newCookieName + "=" + originalCookieValue + "; ";
        cookie += "expires=" + options.expires(originalCookieValue).toUTCString() + "; ";
        cookie += "path=/; domain=" + Roblox.CookieUpgrader.domain;
        document.cookie = cookie;
        if (typeof GoogleAnalyticsEvents != "undefined") {
            GoogleAnalyticsEvents.FireEvent(["CookieUpgrader", "ConvertedCookie", name]);            
        }

        var convertedCookieData = {
            cookieName: name, 
            cookieValue: originalCookieValue, 
            newCookieName: newCookieName
        };
        // Fire analytics event for cookie conversion
        if (Roblox.EventStream) {
            Roblox.EventStream.SendEventWithTarget("CookieUpgrader", "ConvertedCookie", convertedCookieData, Roblox.EventStream.TargetTypes.DIAGNOSTIC);
        }
    }
    catch (exp) {
        if (typeof GoogleAnalyticsEvents != "undefined") {
            GoogleAnalyticsEvents.FireEvent(["CookieUpgrader", "ExceptionDuringConvertOf" + name, exp.message]);
        }
    }
};

Roblox.CookieUpgrader.getExpirationFromCookieValue = function getExpirationFromCookieValue(propertyName, originalCookieValue) {
    var acquisitionTimeRegex = new RegExp(propertyName + "=(\\d+)\/(\\d+)\/(\\d+)");
    var originalCookieTimeMatches = originalCookieValue.match(acquisitionTimeRegex);
    // if we can't get the acquisition time from the cookie, default to current time
    var startTime = (new Date()).getTime();
    if (originalCookieTimeMatches != null && originalCookieTimeMatches.length != 0) {
        var originalCookieTime = new Date(originalCookieTimeMatches[3], originalCookieTimeMatches[1]-1, originalCookieTimeMatches[2]);
        if (!isNaN(originalCookieTime.getTime())) {
            startTime = originalCookieTime.getTime();
        }
    }
    return new Date(startTime +Roblox.CookieUpgrader.oneMonthInMs);
};

Roblox.CookieUpgrader.thirtyDaysFromNow = function() {
    return new Date((new Date()).getTime() + Roblox.CookieUpgrader.oneMonthInMs);
};

Roblox.CookieUpgrader.thirtyYearsFromNow = function() {
    return new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365 * 30); // 1000ms * 60secs * 60 minutes * 24 hours * 365 days * 30 years;
};

Roblox.CookieUpgrader.fourHoursFromNow = function() {
    return new Date((new Date()).getTime() + 1000 * 60 * 60 * 4); // 1000ms * 60secs * 60 minutes * 4 hours
};