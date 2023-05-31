/*
    Responsible for showing/hiding loading spinners on thumbnails
*/
Roblox = Roblox || {};
Roblox.ThumbnailSpinner = (function () {

    var spinnerHtml = '<div class="thumbnail-loader"><span class="spinner spinner-default"></span></div>';
    var selector = ".thumbnail-loader";

    return {
        show: function (div) {
            if (div.find(selector).length > 0) {
                return;
            }
            var spinner = $(spinnerHtml);
            div.append(spinner);
        },

        hide: function (div) {
            div.find(selector).remove();
        }
    };

})();