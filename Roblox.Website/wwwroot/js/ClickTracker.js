var ClickTracker = {
    delay: 100,
    logEvent: true,
    logPageview: true,
    eventCategory: "Click",
    eventAction: "Page",
    gaInstance: "",

    ga_trackClickByRef: function ga_trackClickByRef(e) {
        var hrefStr = window.location.href;

        if (this.href) {  // this == element that has ref attribute, not ClickTracker
            hrefStr = this.href;
        }
        else {
            // walk target down to parent, looking for href
            var currentTarget = e.target;
            while (currentTarget != this && currentTarget != document) { // 2nd clause is to prevent infinite loop
                if (currentTarget.href) {
                    hrefStr = currentTarget.href;
                    break;
                }
                else {
                    currentTarget = currentTarget.parentNode;
                }
            }
        }

        var ref = this.getAttribute("ref");
        var href = hrefStr.match(/(https?:\/\/[a-zA-Z0-9.:-]+)([^#?]+)(\?[^#]*)?(#.*)?/);
        if (href) {
            var server = href[1];
            var path = href[2];
            var queryString = href[3] ? href[3] : "";  // null check
            var anchor = href[4] ? href[4] : "";
            if (queryString == "" || queryString == "?") {
                // no queryString
                queryString = "?ref=" + encodeURIComponent(ref);
            }
            else {
                queryString += "&ref=" + encodeURIComponent(ref);
            }
            var newHrefStr = "";
            if (server.indexOf(window.location.host) >= 1) {
                newHrefStr = path + queryString;
            }
            else { // external link
                newHrefStr = server + path + queryString;
            }
        }
        var gaObjectName = ClickTracker.gaInstance;  // Instance should be the object name, or blank for default
        if (gaObjectName != "") {
            gaObjectName += ".";
        }
        if (ClickTracker.logEvent) {
            _gaq.push([gaObjectName + '_trackEvent', ClickTracker.eventCategory, ClickTracker.eventAction, ref]);
        }
        if (ClickTracker.logPageview) {
            _gaq.push([gaObjectName + '_trackPageview', newHrefStr]);
        }
        // This pixel can be used instead of Google Analytics for testing that this works.
        //$(document).append("<img src='/images/pixel.gif?ref=" + encodeURIComponent(ref) + "' />");
        var startTime = (new Date().getTime());
        while ((new Date()).getTime() <= startTime + ClickTracker.delay);
    }
};
