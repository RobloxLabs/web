var Roblox = Roblox || {};
Roblox.AsyncGoogleOnScript = function () {
    function googleGoalFire(age, gender) {
        GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent(['Signup', 'Signup - Roblox', age, gender]);
    }

    return {
        googleGoalFire: googleGoalFire
    };
}();