(function (window, undefined) {

    function isIE10() {
        return navigator.userAgent.indexOf("MSIE 10.0") != -1;
    }

    function isActiveXEnabled() {
        try {
            return !!new ActiveXObject("htmlfile");
        } catch (e) {
            return false;
        }
    }

    var waitForRoblox = Roblox.Client.WaitForRoblox;
    Roblox.Client.WaitForRoblox = function (continuation) {
        if (isIE10() && !isActiveXEnabled()) {
            $('#IEMetroInstructions').modal({
                overlayClose: true,
                escClose: true,
                opacity: 80,
                overlayCss: {
                    backgroundColor: "#000"
                }
            });
            return false;
        }

        return waitForRoblox(continuation);
    };

})(window);