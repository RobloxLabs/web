var Roblox = Roblox || {};

$(function() {
    if (Roblox.AjaxPageLoadEvent) {
        var context = "premium-payout";
        var url = window.location.href;
        var fromCtx = getParamFromUrl('ctx');
        Roblox.AjaxPageLoadEvent.SendEvent(context, url, {from: fromCtx});
    }

    function getParamFromUrl(paramName) {
        var url = window.location.href;
        var keyword = paramName + '=';
        if (url.indexOf(keyword) > 0) {
            var regexPattern = '[&|?]' + paramName + '=(\\w+)[&?]?';
            var regex = new RegExp(regexPattern, 'g');
            var match = regex.exec(url);
            if (match && match.length > 0) {
                return match[1];
            }
        }
        return '';
    }
});