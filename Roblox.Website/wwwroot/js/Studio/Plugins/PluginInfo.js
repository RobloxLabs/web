var Roblox = Roblox || {};

if (typeof Roblox.Plugins === "undefined") {
    Roblox.Plugins = {};
}

Roblox.Plugins.PluginInfo = function () {

    var init = function (moreLessBlock) {
        // The height of the content block when it's not expanded
        var adjustheight = "75";
        // The "more" link text
        var moreText = Roblox.Plugins.PluginInfo.Resources.moreText;
        // The "less" link text
        var lessText = Roblox.Plugins.PluginInfo.Resources.lessText;

        var moreBlock = moreLessBlock.find('.more-block');
        var adjust = moreLessBlock.find('.adjust');

        // Sets the .more-block div to the specified height and hides any content that overflows
        moreBlock.height(adjustheight).css('overflow', 'hidden');

        // Set the "More" text
        if (moreBlock[0].scrollHeight > moreBlock.innerHeight()) {
            adjust.text(moreText);
            adjust.show();
            adjust.toggle(function () {
                moreBlock.css('height', 'auto').css('overflow', 'visible');
                $(this).text(lessText);
            }, function () {
                moreBlock.css('height', adjustheight).css('overflow', 'hidden');
                $(this).text(moreText);
            });
        }
    };

    return {
        init: init
    };
} ();