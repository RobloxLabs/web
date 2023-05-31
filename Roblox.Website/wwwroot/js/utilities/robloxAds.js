"use strict";

var Roblox = Roblox || {};
Roblox.AdsHelper = Roblox.AdsHelper || {};

Roblox.AdsLibrary = {};
Roblox.AdsLibrary.adsIdList = ["Skyscraper-Abp-Left", "Skyscraper-Abp-Right", "Leaderboard-Abp",
                                "GamePageAdDiv1", "GamePageAdDiv2", "GamePageAdDiv3",
                                "ProfilePageAdDiv1", "ProfilePageAdDiv2"];
Roblox.AdsLibrary.adsParameters = {
    "Skyscraper-Abp-Left": {
        element: $("#Skyscraper-Abp-Left"),
        template: null,
        fitTwoAds: true,
        fitOneAd: false,
        isSkyscraper: true
    },
    "Skyscraper-Abp-Right": {
        element: $("#Skyscraper-Abp-Right"),
        tempalte: null,
        fitTwoAds: true,
        fitOneAd: true,
        isSkyscraper: true
    },
    "Leaderboard-Abp": {
        element: $("#Leaderboard-Abp"),
        tempalte: null,
        fitTwoAds: true,
        fitOneAd: true,
        isLeaderboard: true
    },
    "GamePageAdDiv1": {
        element: $("#GamePageAdDiv1"),
        template: null,
        isPageAd: true
    },
    "GamePageAdDiv2": {
        element: $("#GamePageAdDiv2"),
        template: null,
        isPageAd: true
    },
    "GamePageAdDiv3": {
        element: $("#GamePageAdDiv3"),
        template: null,
        isPageAd: true
    },
    "ProfilePageAdDiv1": {
        element: $("#ProfilePageAdDiv1"),
        template: null,
        isPageAd: true
    },
    "ProfilePageAdDiv2": {
        element: $("#ProfilePageAdDiv2"),
        template: null,
        isPageAd: true
    }
};

Roblox.AdsHelper.AdRefresher = function () {
    var _adIds = new Array();

    var browserScrollbarWidth = 20;
    var defaultWidth = 970;
    var skyscraperWidth = 160;
    var leaderboardWidth = 728;
    var refreshWaitTimeMSec = 100;
    var refreshRetryInterval = 16;
    // include 970px default width + two side ads width + gaps(24px * 2)
    var maxWidthIncludeTwoAds = $("[data-max-width-for-two-ads]").attr('data-max-width-for-two-ads') || (defaultWidth + skyscraperWidth * 2 + 12 * 4 - browserScrollbarWidth);
    // include 970px default width + two side ads width + gaps(24px * 2)
    var maxWidthIncludeOneAd = $("[data-max-width-for-one-ads]").attr('data-max-width-for-one-ads') || defaultWidth + skyscraperWidth + 12 * 2 - browserScrollbarWidth;

    // side ads for page level
    var gamesPageWidth = 1024;
    var maxWidthIncludeSideAds = gamesPageWidth - browserScrollbarWidth;

    function isEmpty(elm) {
        return !elm || !$.trim($(elm).html());    
    }

    function registerAd(id) {
        _adIds.push(id);
    }


    function isPubadsReady() {
        return googletag.pubadsReady;
    }

    function refreshAds(retryCount) {
        if (typeof retryCount == "undefined") {
            retryCount = refreshRetryInterval;
        }
        var gptAdRefreshNeeded = false;
        for (var id in _adIds) {
            var selector = '#' + _adIds[id] + ' [data-js-adtype]';
            var adElem = $(selector);

            if (typeof (adElem) === 'undefined') {
                return;
            }
            if (adElem.attr('data-js-adtype') === 'iframead') {
                iFrameRefresh(adElem);
            } else if (adElem.attr('data-js-adtype') === 'gptAd') {
                if (isPubadsReady()) {
                    gptAdRefreshNeeded = true;
                }else {
                    if (retryCount > 0) {
                        setTimeout(function () { refreshAds(--retryCount); }, refreshWaitTimeMSec);
                        break;
                    }
                }
            }
        }

        if (gptAdRefreshNeeded) {
            googletag.cmd.push(function () {
                googletag.pubads().refresh();
            });
        }
    };
    
    function iFrameRefresh(ifr) {
        // Changing src of iframe in IE adds to history: http://nirlevy.blogspot.com/2007/09/avoding-browser-history-when-changing.html
        // Thus we change the location
        var oldSrc = ifr.attr("src");
        // Can't called indexOf on undefined, so return if oldSrc is undefined
        if (typeof oldSrc !== 'string') {
            return;
        }
        var paramSeparator = (oldSrc.indexOf('?') < 0) ? '?' : '&';
        var newSrc = oldSrc + paramSeparator + 'nocache=' + new Date().getMilliseconds().toString();
        if (typeof ifr[0] === "undefined") {
            return;
        }

        var docEl = ifr[0].contentDocument;
        if (docEl === undefined) {
            docEl = ifr[0].contentWindow;
        }

        // Adblock fix: Adblock replaces location of iframes
        // causing errors when trying to replace
        if (docEl && docEl.location.href !== "about:blank") {
            docEl.location.replace(newSrc);
        }
    };

    function getAds(template, id, elm) {
        if (elm.length && isEmpty(elm)) {
            elm.append(template);
            refreshAds();
        }
    };

    function adjustAdsFitScreen() {
        var currentWidth = $(window).width();
        for (var i = 0; i < Roblox.AdsLibrary.adsIdList.length; i++) {
            var adId = Roblox.AdsLibrary.adsIdList[i];
            var adParam = Roblox.AdsLibrary.adsParameters[adId];
            // save ads dom for later when the window size fits and restore the html mark up
            if (adParam && !adParam.template) {
                var adElm = adParam.element;
                adParam.template = adElm.html();
            }
        }

        for (var i = 0; i < Roblox.AdsLibrary.adsIdList.length; i++) {
            var adId = Roblox.AdsLibrary.adsIdList[i];
            var adParam = Roblox.AdsLibrary.adsParameters[adId];
            if (!adParam) {
                continue; 
            }
            if (adParam.isSkyscraper) {
                if (currentWidth >= maxWidthIncludeTwoAds && adParam.fitTwoAds) {
                    getAds(adParam.template, adId, adParam.element);
                } else if (currentWidth < maxWidthIncludeTwoAds && currentWidth >= maxWidthIncludeOneAd) {
                    if (adParam.fitOneAd) {
                        getAds(adParam.template, adId, adParam.element);
                    }
                    else {
                        adParam.element.empty();
                    }
                }else {
                    adParam.element.empty();
                }
            } else if (adParam.isLeaderboard) {
                if (currentWidth < leaderboardWidth) {
                    adParam.element.empty();
                } else {
                    getAds(adParam.template, adId, adParam.element);
                }
            } else if (adParam.isPageAd) {
                if (currentWidth < maxWidthIncludeSideAds) {
                    adParam.element.empty();
                } else {
                    getAds(adParam.template, adId, adParam.element);
                }
            }
        }
    };
  
    return {
        registerAd: registerAd,
        refreshAds: refreshAds,
        adjustAdsFitScreen: adjustAdsFitScreen,
        getAds: getAds
    };
}();

Roblox.AdsHelper.DynamicAdCreator = function () {
    function populateNewAds() {
        //get all the unpopulated ads
        var adsToPopulate = $(".dynamic-ad").filter(".unpopulated");

        //iterate over each element and populate it
        adsToPopulate.each(function (idx, el) {
            var jel = $(el);
            var adSlot = jel.attr('data-ad-slot');
            var adWidth = parseInt(jel.attr('data-ad-width'));
            var adHeight = parseInt(jel.attr('data-ad-height'));
            var adId = jel.children('.ad-slot').attr('id');
            googletag.cmd.push(function () {
                var slot = googletag.defineSlot(adSlot, [adWidth, adHeight], adId)
                    .addService(googletag.pubads());
                googletag.display(adId);
                googletag.pubads().refresh([slot]);
            });
            jel.removeClass('unpopulated');
        });
    }

    // Public 
    return {
        populateNewAds: populateNewAds
    }

}();

$(function () {
    $(window).resize(function () {
        Roblox.AdsHelper.AdRefresher.adjustAdsFitScreen();
    });
});