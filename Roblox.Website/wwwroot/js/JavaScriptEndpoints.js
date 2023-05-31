if (typeof (Roblox) === typeof (undefined)) {
    Roblox = {};
}
Roblox.Endpoints = Roblox.Endpoints || {
    addCrossDomainOptionsToAllRequests: false
};

Roblox.Endpoints.isAbsolute = function (url) {
    var re = new RegExp('^([a-z]+://|//)');
    return re.test(url);
}

Roblox.Endpoints.splitAtQueryString = function (url) {
    var regex = new RegExp("\\?(?!})");
    var result = regex.exec(url);
    if (result === null) {
        return {
            url: url,
            query: ""
        };
    } else {
        return {
            url: url.substring(0, result.index),
            query: url.substring(result.index)
        };
    }
};

Roblox.Endpoints.ajaxPrefilter = function (options, originalOptions, jqxhr) {
    var absoluteUrl = Roblox.Endpoints.generateAbsoluteUrl(options.url, options.data, options.crossDomain);
    options.url = absoluteUrl;
    if (Roblox.Endpoints.addCrossDomainOptionsToAllRequests && options.url.indexOf("rbxcdn.com") < 0 && options.url.indexOf("s3.amazonaws.com") < 0) {
        // as long as we are not requesting something from the CDN or S3,
        // always set crossDomain and withCredentials to true
        options.crossDomain = true;
        options.xhrFields = options.xhrFields || {};
        options.xhrFields.withCredentials = true;
    }
};
// rename to generateEndpoint
Roblox.Endpoints.generateAbsoluteUrl = function (relativeUrl, requestData, isRequestCrossDomain) {
    var splitUrl = Roblox.Endpoints.splitAtQueryString(relativeUrl);
    var relativePath = splitUrl.url.toLowerCase();
    var absoluteUrl = relativePath; //default to keeping the relative path

    if (typeof Roblox.Endpoints.Urls != typeof undefined) {
        // ensure url is absolute
        if (isRequestCrossDomain && typeof Roblox.Endpoints.Urls[relativePath.toLowerCase()] != typeof (undefined)) {
            absoluteUrl = Roblox.Endpoints.getAbsoluteUrl(relativePath);
        }
    }

    if (absoluteUrl.indexOf("{") > -1) {
        //add in any parameters
        $.each(requestData, function (parameter, value) {
            var regex = new RegExp("{" + parameter.toLowerCase() + "(:.*?)?\\??}");
            absoluteUrl = absoluteUrl.replace(regex, value);
        });
    }

    return absoluteUrl + splitUrl.query;

};

Roblox.Endpoints.getAbsoluteUrl = function (relativeUrl) {
    // if JavascriptEndpointsEnabled setting is false, don't do anything
    if (typeof Roblox.Endpoints.Urls === typeof undefined) {
        return relativeUrl;
    }

    // if relativeUrl is empty or already absolute, just return it
    if (relativeUrl.length === 0 || Roblox.Endpoints.isAbsolute(relativeUrl)) {
        return relativeUrl;
    }

    // if relativeUrl does not begin with a /, home it to current directory
    if (relativeUrl.indexOf("/") !== 0) {
        var currentPath = window.location.pathname;
        var currentDirectory = currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
        relativeUrl = currentDirectory + relativeUrl;
    }

    var absoluteUrl = Roblox.Endpoints.Urls[relativeUrl.toLowerCase()];
    if (absoluteUrl === undefined) {
        var defaultDomain = window.location.protocol + "//" + window.location.hostname;
        return defaultDomain + relativeUrl;
    }

    return absoluteUrl;
};

(function () {
    function getSeoName(assetName) {
        if (typeof (assetName) != "string") {
            assetName = "";
        }

        return assetName.replace(/'/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/^(COM\d|LPT\d|AUX|PRT|NUL|CON|BIN)$/i, "") || "unnamed";
    }

    Roblox.Endpoints.getCatalogItemUrl = function (assetId, assetName) {
        return Roblox.Endpoints.getAbsoluteUrl("/catalog/" + assetId + "/" + getSeoName(assetName));
    };

    Roblox.Endpoints.getBadgeDetailsUrl = function (badgeId, badgeName) {
        return Roblox.Endpoints.getAbsoluteUrl("/badges/" + badgeId + "/" + getSeoName(badgeName));
    };
})();

$.ajaxPrefilter(Roblox.Endpoints.ajaxPrefilter);