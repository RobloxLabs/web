//If modifying this file, please also modify the corresponding files in the admin and cs sites.

if (typeof Roblox == "undefined") {
    Roblox = {};
}

Roblox.XsrfToken = (function () {
    var xsrfRequestMethods = ["POST", "PUT", "DELETE", "PATCH"];
    var currentToken = "";
    var csrfTokenHeader = "X-CSRF-TOKEN";
    var csrfInvalidResponseCode = 403;

    $(document).ajaxSend(function (event, jqxhr, settings) {
        // Send CSRF if in our own domain and is a method that requires it
        if (currentToken !== "" && xsrfRequestMethods.indexOf(settings.type.toUpperCase()) >= 0) {
            jqxhr.setRequestHeader("X-CSRF-TOKEN", currentToken);
        }
    });

    $.ajaxPrefilter(function (options, originalOptions, jqxhr) {
        if (options.dataType == "jsonp" || options.dataType == "script") {
            // these are most likely remote requests, don't set an error handler
            return;
        }

        // If current token == "" then CSRF protection is disabled on server
        if (currentToken !== "") {
            // save the original error callback for later
            if (originalOptions.error) { 
                originalOptions._error = originalOptions.error;
            }
            // overwrite *current request* error callback
            options.error = $.noop();

            var dfd = $.Deferred();
            // if the request works, return normally
            jqxhr.done(dfd.resolve);

            // if the request fails, do something else, yet still resolve
            jqxhr.fail(function () {
                var args = Array.prototype.slice.call(arguments);
                if (jqxhr.status == csrfInvalidResponseCode && jqxhr.getResponseHeader(csrfTokenHeader) != null) {
                    // this was a token failure, reissue the XHR with the returned token
                    var newToken = jqxhr.getResponseHeader(csrfTokenHeader);

                    if (newToken == null) {
                        dfd.rejectWith(jqxhr, args);
                        return;
                    }
                    currentToken = newToken;

                    $.ajax(originalOptions).then(dfd.resolve, dfd.reject);
                }
                else {
                    // add our _error callback to our promise object
                    if (originalOptions._error) { 
                        dfd.fail(originalOptions._error);
                    }
                    dfd.rejectWith(jqxhr, args);
                }
            });

            // NOW override the jqXHR's promise functions with our deferred
            return dfd.promise(jqxhr)
        }
    });

    function setToken(token) {
        currentToken = token;
    }

    function getToken() {
        return currentToken;
    }

    var my = {
        setToken: setToken,
        getToken: getToken,
    };

    return my;
})();