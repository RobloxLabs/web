if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.ThumbnailView = (function () {
    var initialized = false;
    var thumbnailPanel;
    var thumbnailSpan;
    var currentLoader;
    var thumbnailHolderSelector = ".thumbnail-holder";
    var thumbnailSpanSelector = ".thumbnail-span";

    var spinnerUrl = "/images/Spinners/ajax_loader_blue_300.gif";

    // http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
    function supports3D() {
        try {
            var canvas = document.createElement("canvas");
            return !!window.WebGLRenderingContext && (
                canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
        } catch (e) {
            return false;
        }
    };

    function enabledOnPage() {
        if ($(thumbnailHolderSelector).data("3d-thumbs-enabled") !== undefined) {
            return true;
        }
        return false;
    }

    var useThreeDeeThumbsKey = "RobloxUse3DThumbnailsV2";

    function is3DEnabled() {
        return loadBool(useThreeDeeThumbsKey) === true;
    };

    function is2DEnabled() {
        if (typeof localStorage !== "undefined" && localStorage != null) {
            var result = localStorage.getItem(useThreeDeeThumbsKey);
            return (result == "false") || false;
        }
        return false;
    }

    function set3DEnabled(value) {
        saveBool(useThreeDeeThumbsKey, value);
    }

    function saveBool(key, value) {
        if (typeof localStorage !== "undefined" && localStorage != null) {
            localStorage.setItem(key, value);
        }
    }

    function loadBool(key) {
        if (typeof localStorage !== "undefined" && localStorage != null) {
            var result = localStorage.getItem(key);
            return (result == "true") || false;
        }
        return false;
    }

    function disable3DButton() {
        var button = $(".enable-three-dee");
        button.text("Error loading 3D thumbnail");
        button.addClass("disabled");
    }

    function initialize3DEnabledButton() {
        if (enabledOnPage() && supports3D()) {
            function updateButtonText(use3D) {
                if (use3D === true) {
                    button.text("Disable 3D");
                } else {
                    button.text("Enable 3D");
                }
            }

            var using3D = is3DEnabled();
            var button = $(".enable-three-dee");
            updateButtonText(using3D);
            button.css('visibility', 'visible');

            button.on("click", function () {
                if (button.hasClass("disabled")) {
                     return;
                }
                if (using3D == false) {
                    GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent(['3D Thumbnails', 'Enable 3D Button Clicked']);
                } else {
                    GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent(['3D Thumbnails', 'Disable 3D Button Clicked']);
                }

                using3D = !using3D;

                set3DEnabled(using3D);

                if (using3D === false) {
                    show2DThumbnail();
                } else {
                    show3DThumbnail();
                }
                updateButtonText(using3D);
            });
        }
    }

    function reloadThumbnail() {
        if (!initialized) return;
        var thumbnailHolder = thumbnailPanel.find(thumbnailHolderSelector);
        var url = thumbnailHolder.data("url");
        url = url + "&_=" + $.now(); // bust IE caching
        thumbnailPanel.load(url, function () {
            thumbnailSpan = thumbnailPanel.find(thumbnailSpanSelector);
            load2DOr3DThumbnail();
        });
    }

    function load2DOr3DThumbnail() {
        if (supports3D() && (is3DEnabled()) && enabledOnPage()) {
            show3DThumbnail();
            initialize3DEnabledButton();
        } else {
            show2DThumbnail();
            initialize3DEnabledButton();
        }
    }

    function show3DThumbnail() {
        hide2DThumbnail();
        currentLoader = thumbnailSpan.load3DThumbnail(function (canvas) {
            GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent(['3D Thumbnail Loading', "Load succeeded"]);
            thumbnailPanel.find("canvas").not(canvas).remove();
        }, function () {
            GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent(['3D Thumbnail Loading', "Load failed"]);
            disable3DButton();
            show2DThumbnail();
        });
    }

    function cancel3DThumbnailIfLoading() {
        if (currentLoader !== undefined) {
            currentLoader.cancel();
        }
    }

    function hide3DThumbnail() {
        cancel3DThumbnailIfLoading();
        thumbnailPanel.find("canvas").remove();
        thumbnailPanel.find(".thumbnail-spinner").remove();
    }

    function hide2DThumbnail() {
        var img = thumbnailPanel.find(thumbnailSpanSelector + " > img");
        img.hide();
    }

    function showSpinner() {
        if (!initialized) return; 
        thumbnailSpan.find(" > img").attr("src", spinnerUrl);
    }

    function show2DThumbnail() {
        hide3DThumbnail();
        thumbnailSpan.find(" > img").show();
        var avatarToReload = thumbnailPanel.find("span[data-retry-url]");
        if (avatarToReload.length > 0) {
            showSpinner();
            avatarToReload.loadRobloxThumbnails();
        }
    }

    $(function () {
        if ($(thumbnailHolderSelector).length > 0) {

            // vlad wants 3D thumbs to be disabled each page load by default for throttling
            // so comment this out when we're ready
            if ($(thumbnailHolderSelector).data("reset-enabled-every-page") !== undefined) {
                if (!is2DEnabled()) {
                    set3DEnabled(true);
                }
            }

            thumbnailPanel = $(thumbnailHolderSelector).parent();
            thumbnailSpan = thumbnailPanel.find(thumbnailSpanSelector);
            load2DOr3DThumbnail();
            initialized = true;
        }
    });



    return {
        showSpinner: showSpinner,
        reloadThumbnail: reloadThumbnail
    }
})();