import $ from 'jquery';
import xsrfToken from './xsrfToken';

const inputName = "CsrfToken";

const maxTokenAgeInSeconds = 60 * 5;

function fetchLatestXsrfToken(callback) {
    $.ajax({
        method: "GET",
        url: "/XsrfToken",
        success: function (output, status, xhr) {
            const token = xhr.getResponseHeader("X-CSRF-TOKEN");
            callback(token);
        },
        error: function () {
            callback(null);
        }
    });
}

function attachToken(form) {
    $("<input />").attr("type", "hidden")
        .attr("name", inputName)
        .attr("value", xsrfToken.getToken())
        .appendTo(form);
}

function isUnobtrusiveAjaxForm(form) {
    return form.dataset.ajax === "true";
}

function formRequiresXsrf(form) {
    return xsrfToken.requiresXsrf(form.getAttribute("method"), form.getAttribute("action"))
        && xsrfToken.getToken()
        && $(form).children("input[name='" + inputName + "']").length === 0;
}

function isTokenStale() {
    const tokenTimestamp = xsrfToken.getTokenTimestamp();
    if (tokenTimestamp === null) {
        return true;
    }

    const differenceInMs = new Date() - tokenTimestamp;
    const differenceInSeconds = differenceInMs / 1000;
    return differenceInSeconds > maxTokenAgeInSeconds;
}

function overrideSubmit(event) {
    const form = event ? event.target : this;

    if (isUnobtrusiveAjaxForm(form)) {
        // Unobtrusive ajax forms don't use regular form submissions, so we don't need to inject the token
        // We also don't need to re-submit the form either.
        return;
    }

    if (!formRequiresXsrf(form)) {
        form._submit();
        return;
    }

    if (!isTokenStale()) {
        attachToken(form);
        form._submit();
    }
    else {
        // Pre-fetch XSRF token before re-submitting the form when it's stale
        // example: if someone has the page open for 30+ minutes
        fetchLatestXsrfToken(function (newToken) {
            if (newToken) {
                xsrfToken.setToken(newToken);
            }
            attachToken(form);
            form._submit();
        });

        // Prevent the form from submitting until we get the new token
        return false;
    }
}

function initialize() {
    window.addEventListener('submit', overrideSubmit, true);
    HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = overrideSubmit;
}

const xsrfTokenFormInjector = {
    initialize: initialize
};

export default xsrfTokenFormInjector;