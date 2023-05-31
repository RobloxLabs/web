var Roblox = Roblox || {};

Roblox.Home = function () {

    function initializeThumbnail() {
        $("#HomeContainer *[data-retry-url]").loadRobloxThumbnails();
    }

    function hideGutterAds() {
        $(document).on("GuttersHidden", function () {
            $('#LeftGutterAdContainer').hide();
            $('#RightGutterAdContainer').hide();
        });
    }
    
    function init() {
        initializeThumbnail();
        hideGutterAds();
    }

    $(function () {
        init();
    });

    return {};
}();