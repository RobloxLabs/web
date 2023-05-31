if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.BuildPage === "undefined") {
    Roblox.BuildPage = {};
}

Roblox.BuildPage.UniverseLoader = (function () {
    var activeOnlyCheckboxSelector = ".active-only-checkbox > input[type='checkbox']";

    function loadUniverses(container, clear) {
        if (clear) {
            container.html("");
        }
        var moreLink = container.find(".load-more-universes").hide();
        var buildPageContent = container.closest(".BuildPageContent");
        var loadingContainer = buildPageContent.find(".build-loading-container").show();
        $.ajax({
            type: "GET",
            url: "/build/universes",
            data: {
                startRow: container.find(">.item-table").length,
                activeOnly: buildPageContent.find(activeOnlyCheckboxSelector).is(":checked"),
                groupId: buildPageContent.data("groupid")
            },
            cache: false,
            dataType: "html",
            success: function (html) {
                moreLink.remove();
                loadingContainer.hide();
                var appendHtml = $(html).hide();
                container.append(appendHtml);
                appendHtml.fadeIn();
                appendHtml.find("a[data-retry-url]").loadRobloxThumbnails();
            },
            fail: function () {
                moreLink.show();
                loadingContainer.hide();
            }
        });
    }

    function init() {
        $("body").on("change", activeOnlyCheckboxSelector, function () {
            loadUniverses($(this).closest(".content-area").find(">.items-container"), true);
        });

        $("body").on("click", ".load-more-universes", function () {
            loadUniverses($(this).parent());
            return false;
        });
    }

    $(init);

    return {
        init: init,
        loadUniverses: loadUniverses
    };
})();

