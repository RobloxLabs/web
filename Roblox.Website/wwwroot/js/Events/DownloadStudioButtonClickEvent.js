var Roblox = Roblox || {};

Roblox.DownloadStudioButtonClickEvent = (function () {

    var sendEvents = function (pageName, suffix) {
        typeof GoogleAnalyticsEvents !== "undefined" && GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent([pageName + suffix, "DownloadStudioButtonClick"]);
        Roblox.EventStream.SendEvent("downloadStudioButtonClick", pageName + suffix, {});
    }

    var init = function () {
        if (!Roblox.EventStream) {
            return;
        }

        var pageName = "unknown";
        var rbxBody = $("#rbx-body");
        if (rbxBody.length > 0 && rbxBody.data("internal-page-name")) {
            pageName = rbxBody.data("internal-page-name");
        }

        $(".studio-launch").on("click", function () { sendEvents(pageName, "") });

        $(".studio-launch-header").on("click", function () { sendEvents(pageName, "-header") });

        $(".studio-launch-image").on("click", function () { sendEvents(pageName, "-image") });

        $(".studio-launch-footer").on("click", function () { sendEvents(pageName, "-footer") });
    };

    return {
        Init: init
    }

})();

$(function () {
    Roblox.DownloadStudioButtonClickEvent.Init();
});