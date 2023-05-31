if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.StyleguideConversions === "undefined") {
    Roblox.StyleguideConversions = function () {

        function convertMvcErrorToStyleGuide() {
            if ($('.field-validation-error').length > 0) {
                $('.field-validation-error').each(function (i, e) {
                    var element = $(e);
                    element.addClass('tool-tip');
                    var errorText = element.text();
                    element.html('<img src="/images/UI/img-tail-left.png" class="right">' + errorText);
                });
            }
        }
        return {
            convertMvcErrorToStyleGuide: convertMvcErrorToStyleGuide
        };
    } ();
}