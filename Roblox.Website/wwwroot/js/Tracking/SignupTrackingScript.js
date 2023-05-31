var Roblox = Roblox || {};
Roblox.SignupTrackingScript = function () {
    function trackingScript(age, gender) {
        RobloxEventManager.triggerEvent('rbx_evt_signup', { age: age, gender: gender });
    }

    return {
        trackingScript: trackingScript
    };
}();