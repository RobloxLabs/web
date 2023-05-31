var Roblox = Roblox || {};

Roblox.UrlParser = (function () {
    var getParameterValueByName = function (name, paramNameCaseSensitive) {
        if (typeof (paramNameCaseSensitive) === "undefined") {
            paramNameCaseSensitive = true;
        }
        else if (paramNameCaseSensitive === false) {
            name = name.toLowerCase();
        }

        var url = decodeURIComponent(window.location.search.substring(1));
        var urlParameters = url && url.split('&');

        if (!urlParameters) {
            return null;
        }

        for (var i = 0; i < urlParameters.length; i++) {
            var parameter = urlParameters[i];
            var indexOfSeparator = parameter.indexOf("=");
            var namePart = parameter.substring(0, indexOfSeparator);
            var valuePart = parameter.substring(indexOfSeparator+1);

            if (paramNameCaseSensitive === false) {
                namePart = namePart.toLowerCase();
            }

            if (namePart === name) {
                return valuePart;
            }
        }

        return null;
    }

    var addOrUpdateQueryStringParameter = function (uri, paramName, paramValue) {
        var re = new RegExp("([?&])" + paramName + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + paramName + "=" + paramValue + '$2');
        }
        else {
            return uri + separator + paramName + "=" + paramValue;
        }
    }

    return {
        getParameterValueByName: getParameterValueByName,
        addOrUpdateQueryStringParameter: addOrUpdateQueryStringParameter
    }
})();