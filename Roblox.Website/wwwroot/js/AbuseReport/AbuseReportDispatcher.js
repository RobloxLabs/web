/*

This module binds click event with various 'Report Abuse' links across website
and depending on the Permission Verifier switches, which are passed as data-attributes on 
body tag, opens a Modal (Dialog) on desktop and Opens a new embedded page 
for mobile and in-app view.

Author: Achint Verma
Date: March 05, 2017

*/

var Roblox = Roblox || {};

Roblox.AbuseReportDispatcher = (function () {
    var isInitialized = false;
    /*
      Extract paramater from a URL String
      @function
      @param {String} param 'Name of the parameter'
      @param {String} url 'Complete URL or QueryString'
      @returns {Number|Null|String} 'null, emtpy string or parameter value'
    */
    var getParamFromQueryString = function (param, url) {
        param = param.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);

        if (!results) {
             return null;
        }

        if (!results[2]) {
            return "";
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /*
       Parse URL and if url is valid AbuseReport link redirect to embedded page (mobile), 
       open Modal or redirect on the link depending on the switch from Permission Verifier
       @function 
       @param {String} url 'Link for abusereport must have actionName and id'
    */
    var triggerUrlAction = function (url) {

        if (typeof (url) !== "string") {
            return false;
        }

        url = url.toLowerCase();
        var parts = url.split("?");
        var link = parts[0];
        var action;
        var pvMeta = Roblox.AbuseReportPVMeta;
        var deviceMeta = Roblox.DeviceMeta();
        pvMeta.inApp = deviceMeta.isInApp;

        if(link && typeof(link) === "string") {
            action = link.split("abusereport/")[1];
        }

        if (action) {
            var payload = {
                actionName: action,
                id: getParamFromQueryString("id", url),
                redirectUrl: getParamFromQueryString("redirecturl", url)
            };

            if(getParamFromQueryString("conversationid", url)){
                payload["conversationId"] = getParamFromQueryString("conversationid", url);
            }
            if (getParamFromQueryString("partyguid", url)) {
                payload["partyGuid"] = getParamFromQueryString("partyguid", url);
            }

            if(payload.id && payload.redirectUrl) {
                
                var newQuerystring = $.param(payload);
                var embedUrlPath = "abusereport/embedded/" + action + "?" + newQuerystring;
                var embeddedUrl = Roblox.Endpoints.getAbsoluteUrl("/" + embedUrlPath); // can't add slash above since iOS & Android requires the path without slash in the beginning'

                if(pvMeta.inApp) {
                    if (pvMeta.inAppEnabled) {
                        var params = {
                            urlPath: embedUrlPath,
                            feature: "Abuse Report"
                        };

                        console.debug("Calling navigateToFeature for Hybrid Overlay");
                        Roblox.Hybrid.Navigation.navigateToFeature(params, function (status) {
                            console.debug("navigateToFeature ---- status:" + status);
                        });
                    }
                    else {
                        window.location.href = url;
                    }
                }
                else if (pvMeta.phoneEnabled) {
                    window.location.href = embeddedUrl;
                }
                else {
                    window.location.href = url;
                }
            }
        }
    }

    // Common listener for various report abuse hook links hooks 
    var listener = function (e) {
        e.preventDefault();

        var url = $(this).attr("href");
        if (url) {
            triggerUrlAction(url);
        }
    }

    // Initialize the module to intercept clicks on ReportAbuse links on page
    var initialize = function () {
        if (!isInitialized) {
            $(".abuse-report-modal").click(listener);
            $(".messages-container").on("click", ".abuse-report-modal", listener);
            $("#AjaxCommentsContainer").on("click", ".abuse-report-modal", listener);
            $("#item-context-menu").on("click", ".abuse-report-modal", listener);
            $(".GroupWallPane").on("click", ".abuse-report-modal", listener);
            $(".group-details-container").on("click", ".abuse-report-modal", listener);
            isInitialized = true;
        }
    }

    return {
        triggerUrlAction: triggerUrlAction,
        initialize: initialize
    };
})();

$(document).ready(function () {
    Roblox.AbuseReportDispatcher.initialize();
});
