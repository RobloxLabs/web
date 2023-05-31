import $ from 'jquery';
import xsrfToken from './xsrfToken';

const csrfTokenHeader = "X-CSRF-TOKEN";
const csrfInvalidResponseCode = 403;

function handleAjaxSend(event, jqxhr, settings) {
    // Send CSRF if in our own domain and is a method that requires it
    let currentToken = xsrfToken.getToken();

    if (currentToken !== "" && xsrfToken.requiresXsrf(settings.type, settings.url)) {
        jqxhr.setRequestHeader(csrfTokenHeader, currentToken);
    }
}

function handleAjaxPrefilter(options, originalOptions, jqxhr) {
    if (options.dataType === "jsonp" || options.dataType === "script") {
        // these are most likely remote requests, don't set an error handler
        return;
    }

    if (!xsrfToken.requiresXsrf(options.type, options.url)) {
        return;
    }

    // save the original error callback for later
    if (originalOptions.error) {
        originalOptions._error = originalOptions.error;
    }
    // overwrite *current request* error callback
    options.error = () => { };

    const dfd = $.Deferred();
    // if the request works, return normally
    jqxhr.done(dfd.resolve);

    // if the request fails, do something else, yet still resolve
    jqxhr.fail(function () {
        const args = Array.prototype.slice.call(arguments);
        if (jqxhr.status == csrfInvalidResponseCode && jqxhr.getResponseHeader(csrfTokenHeader) !== null) {
            // this was a token failure, reissue the XHR with the returned token
            const newToken = jqxhr.getResponseHeader(csrfTokenHeader);

            if (newToken == null) {
                dfd.rejectWith(jqxhr, args);
                return;
            }
            xsrfToken.setToken(newToken);

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
    return dfd.promise(jqxhr);
}

function initialize() {
    $(document).ajaxSend(handleAjaxSend);
    $.ajaxPrefilter(handleAjaxPrefilter);
}

const xsrfTokenHeaderInjector = {
    initialize: initialize
};

export default xsrfTokenHeaderInjector;