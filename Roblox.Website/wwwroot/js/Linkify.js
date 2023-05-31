Roblox = Roblox || {};

Roblox.Linkify = function () {
    "use strict";
    var options = {
        enabled: false,
        hasProtocolRegex: /(https?:\/\/)/,
        defaultProtocol: "http://",
        cssClass: "rbx-link"
    };

    var isMobile = (Roblox.FixedUI && Roblox.FixedUI.isMobile);

    var config = $("#roblox-linkify");
    if (config.length) {
        var regexString = config.data("regex");
        var flags = config.data("regex-flags");

        var extendedOptions = {
            enabled: config.data("enabled"),
            regex: new RegExp(regexString, flags)
        };

        setOptions(extendedOptions);
    }

    function setOptions(extendedOptions) {
        $.extend(options, extendedOptions);
    }

    function alreadyLinkified(str) {
        return ($("<div>" + str + "</div>").find("a").length > 0);
    }

    function replaceAmpersandEntity(str) {
        return str.replace(/\&amp;/g, "&");
    }

    // http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
    function outerHtml(elem) {
        return elem.clone().wrap("<div>").parent().html();
    }

    function addProtocolIfMissing(str) {
        if (!str.match(options.hasProtocolRegex)) {
            str = options.defaultProtocol + str;
        }
        return str;
    }

    function makeLink(match) {
        match = replaceAmpersandEntity(match); //input is often HTML encoded
        var text = match;
        var href = addProtocolIfMissing(match);

        var link = $("<a></a>");
        link.addClass(options.cssClass);
        link.attr("href", href);
        link.text(text);
        if (!isMobile) { //mobile links have to open in same tab
            link.attr("target", "_blank");
        }
        
        return outerHtml(link);
    }

    function linkifyString(str) {
        if (options.enabled && !alreadyLinkified(str)) {
            str = str.replace(options.regex, makeLink);
        }
        return str;
    }

    return {
        String: linkifyString,
        SetOptions: setOptions
    };
}();

$.fn.linkify = function() {
    return this.each(function() {
        var element = $(this);
        var html = element.html();
        if (typeof html !== "undefined" && html !== null) {
            var newHtml = Roblox.Linkify.String(html);
            element.html(newHtml);
        }
    });
};

$(function () {
    $(".linkify").linkify();
});