"use strict";

Roblox = Roblox || {};

Roblox.LazyLoad = (function () {
    var imageSelector = "img[data-delaysrc]";
    var iframeSelector = "iframe[data-delaysrc]:not('.src-replaced')";
    var loginSelectors = "#head-login, #header-login";

    function updateSrc(element) {
        if (element) {
            var delaySrc = element.attr("data-delaysrc");
            if (typeof delaySrc !== "undefined") {
                element.attr("src", delaySrc).addClass("src-replaced");
            }
        }
    }

    function setupLazyLoad() {
        window.addEventListener("load", function () {
            $(imageSelector + ", " + iframeSelector).each(function () {
                updateSrc($(this));
            });
        }, false);
    }

    function addLoginButtonListenerToUpdateIframeSrc() {
        $(loginSelectors).one("click touchstart", function () {
            var loginIframe = $("#iframe-login:not('.src-replaced')");
            updateSrc(loginIframe);
        });
    }

    function init() {
        setupLazyLoad();
        addLoginButtonListenerToUpdateIframeSrc();
    }

    $(document).ready(function () {
        init();
    });
})();