if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Forms === "undefined") {
    Roblox.Forms = function () {
        function supportsInputAutoFocus() {
            var i = document.createElement('input');
            return 'autofocus' in i;
        };
        if (!supportsInputAutoFocus()) {
            $(function () { $("input[autofocus='']").first().focus(); });
        }
    } ();
}