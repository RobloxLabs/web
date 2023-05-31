Roblox = Roblox || {};

Roblox.DeviceFeatureDetection = (function () {
    var isTouch = false;
    var containerMain = $(".container-main");

    function detectTouch() {
        if ((!containerMain.hasClass("in-studio")) &&
            ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0))
        {
            isTouch = true;
            containerMain.addClass("touch");
        }
    }

    detectTouch();

    return {
        isTouch: isTouch
    }
})();