if (typeof (Roblox) === typeof (undefined)) {
    Roblox = {};
}

Roblox.CatalogShared = Roblox.CatalogShared || {};

Roblox.CatalogSharedConstructor = function (document) {
    var CatalogLoadedViaAjaxEventName = "CatalogLoadedViaAjax";
    var ignoreUrlChange = false;

    var currentRequest = 0; // stores a number to track which request is most recent

    function LoadCatalogAjax(url, params, $container, skipNotificationOnComplete, replaceCurrentState) {
        if (url && $container && $container.length !== 0) {
            currentRequest += 1;
            var requestNum = currentRequest;

            if (Roblox.AjaxPageLoadEvent) {

                Roblox.AjaxPageLoadEvent.SendEvent("legacyCatalog", url);
            }

            if ($container.find(".loading").length < 1) {
                $container.find(".right-content").append($("<div class=\"loading\">"));
            }
            $container.find(".subcategories [hover='true']").hide();
            $container.css("cursor", "progress");

            $.ajax({
                method: "GET",
                params: params,
                url: url,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                if (currentRequest == requestNum) {
                    $container.html(data);
                    $container.css("cursor", "default");

                    if (!skipNotificationOnComplete) {
                        var $evt = $.Event(CatalogLoadedViaAjaxEventName, { url: url, replaceCurrentState: replaceCurrentState });
                        $container.trigger($evt);
                    }
                }
            }).fail(function () {
                if ($container.find(".error-message").length < 1) {
                    var error = $("<div>Library temporarily unavailable, please try again later.</div>").addClass("error-message");
                    $container.prepend(error);
                }
                $container.find(".loading").remove();
            });
        }
    }

    function handleURLChange(state) {
        if (!ignoreUrlChange && state.clickTargetID) {
            doNotUpdateHistory = true;

            if (state.clickTargetID === 'catalog') {
                var queryParams;
                if (state.url) {
                    queryParams = state.url.split('?')[1];
                } else {
                    queryParams = document.URL.split('?')[1];
                }

                if (queryParams && Roblox.CatalogValues && Roblox.CatalogValues.CatalogContentsUrl) {
                    var container = $('#' +Roblox.CatalogValues.ContainerID);
                    Roblox.CatalogShared.LoadCatalogAjax(Roblox.CatalogValues.CatalogContentsUrl + '?' +queryParams, null, container, true);
                } else {
                    window.location.href = state.url; // we're navigation to /catalog, we need to load that page
                }
            }
            else {
                $("#" +state.clickTargetID).click(); //complete the click like usual
            }

            doNotUpdateHistory = false;
        }
    }

    function handleCatalogLoadedViaAjaxEvent($evt) {
        if (Roblox.AdsHelper && Roblox.AdsHelper.AdRefresher) {
            Roblox.AdsHelper.AdRefresher.refreshAds();
        }

        if ($evt.url) {
            var queryParams = $evt.url.split('?')[1];
            if (queryParams) {
                var currentUrl = document.URL.split('?')[0].toLowerCase();
                currentUrl = currentUrl.indexOf('#') === -1 ? currentUrl : currentUrl.split('#')[0];
                currentUrl = currentUrl.replace("catalog/default.aspx", "catalog/");
                if (currentUrl.indexOf('browse.aspx') < 0 && currentUrl.indexOf('/develop/library') < 0)
                {
                    // if the url doesn't end with "/" then add it
                    var urlLength = currentUrl.length;
                    var endsWithSlash = currentUrl.lastIndexOf("/") === urlLength - 1;
                    currentUrl += !endsWithSlash ? '/browse.aspx' : 'browse.aspx';
                }

                var historyUrl = currentUrl + '?' + queryParams;

                //store query params in DOM
                // develop page changes the url without changing the page, and we need a way to recreate the url on browser 'back'
                $("#LibraryTabLink").attr('data-query-params', queryParams);

                var eventUrl;
                if (currentUrl.indexOf("/develop/library") >= 0) {
                    eventUrl = "/develop/library/?" + queryParams;
                }
                else {
                    eventUrl = "/catalog/?" + queryParams;
                }

                GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual(eventUrl);

                ignoreUrlChange = true;
                if ($evt.replaceCurrentState) {
                    History.replaceState({ clickTargetID: "catalog", url: historyUrl
                    }, document.title, historyUrl);
                } else {
                    History.pushState({ clickTargetID: "catalog", url: historyUrl }, document.title, historyUrl);
                }
                ignoreUrlChange = false;
            }
        }
    }

    return {
        LoadCatalogAjax: LoadCatalogAjax
        , CatalogLoadedViaAjaxEventName: CatalogLoadedViaAjaxEventName
        , handleURLChange: handleURLChange
        , handleCatalogLoadedViaAjaxEvent: handleCatalogLoadedViaAjaxEvent
    }
};

Roblox.CatalogShared = Roblox.CatalogSharedConstructor(document);