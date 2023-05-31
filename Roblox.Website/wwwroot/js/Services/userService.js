"use strict";

var Roblox = Roblox || {};
Roblox.CurrentUser = Roblox.CurrentUser || {};

Roblox.UserService = (function () {
    var metaTag = document.querySelector('meta[name="user-data"]');
    function getUserData() {
        Roblox.CurrentUser.isAuthenticated = true;
        Roblox.CurrentUser.userId = metaTag.dataset.userid;
        Roblox.CurrentUser.name = metaTag.dataset.name;
        Roblox.CurrentUser.isUnder13 = metaTag.dataset.isunder13 === "true";
        Roblox.CurrentUser.is13orOver = !Roblox.CurrentUser.isUnder13;
    }

    function init() {
        if (metaTag) {
            getUserData();
        } else {
            Roblox.CurrentUser.isAuthenticated = false;
        }
    }

    init();
})();