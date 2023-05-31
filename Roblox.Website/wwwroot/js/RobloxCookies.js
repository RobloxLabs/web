if (typeof (Roblox) === 'undefined') {
    Roblox = {};
}

if (typeof (Roblox.Cookies) === 'undefined') {
    Roblox.Cookies = {};
}

Roblox.Cookies.getBrowserTrackerId = function() {
    var cookie = $.cookie("RBXEventTrackerV2") || $.cookie("RBXEventTracker");
    if (cookie) {
        var match = cookie.match(/browserid=([^&]*)/i);
        if (match) {
            return match[1];
        }
    }
    return false;
}

Roblox.Cookies.getSessionId = function() {
    var cookie = $.cookie("RBXSessionTracker");
    if (cookie) {
        var match = cookie.match(/sessionid=([^&]*)/i);
        if (match) {
            return match[1];
        }
        return false;
    }
}

Roblox.Cookies.getGuestId = function () {
    var cookie = $.cookie("GuestData");
    if (cookie) {
        var match = cookie.match(/userid=([^&]*)/i);
        if (match) {
            return match[1];
        }
        return false;
    }
}