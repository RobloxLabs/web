var Roblox = Roblox || {};

Roblox.PublishAs = function () {
    var getVisibleAssetCount = function () {
        return $("div.asset:not(#newasset):visible").length;
    };

    var buildLoadGamesUrl = function (loadNext, groupId) {
        var url = "/ide/placelist" + (groupId ? "/" + groupId : "");

        if (loadNext) {
            var nextPageParams = "?startRow=" + getVisibleAssetCount();
            url += nextPageParams;
        }
        return url;
    };

    var buildLoadModelsUrl = function (loadNext, groupId) {
        var url = "/ide/publish/listmodels" + (groupId ? "/" + groupId : "");
        if (loadNext) {
            var nextPageParams = "?startRow=" + getVisibleAssetCount();
            url += nextPageParams;
        }
        return url;
    };

    var buildLoadAnimationsUrl = function (loadNext, groupId) {
        var url = "/studio/animations" + (groupId ? "/" + groupId : "");
        if (loadNext) {
            var nextPageParams = "?startRow=" + getVisibleAssetCount();
            url += nextPageParams;
        }
        return url;
    }

    var buildLoadPluginsUrl = function (loadNext, groupId) {
        var url = "/studio/plugins" + (groupId ? "/" + groupId : "");
        if (loadNext) {
            var nextPageParams = "?startRow=" + getVisibleAssetCount();
            url += nextPageParams;
        }
        return url;
    }

    var loadNextPage = function (moreGamesButton, url) {
        $.ajax({
            url: url,
            cache: false,
            dataType: "html",
            success: function (html) {
                var result = $(html);
                moreGamesButton.parent().append(result); // append to parent of the button that was clicked
                moreGamesButton.remove(); // remove old button, new one is included in html
                result.animate({ opacity: 1 }, "fast"); // fade them into view
                var newThumbs = result.find("a[data-retry-url]");
                newThumbs.loadRobloxThumbnails(); 		// load thumbnails for the new page                
            }
        });
    };

    var initialize = function () {
        $('#closeButton').click(function () {
            window.close();
            return false;
        });

        $("#assetList,#groupAssetList").on("click", "#load-more-assets", function () {
            var moreLink = $(this);
            var group = Number($("#groupAssetList .group-select select:visible").val()) || 0;
            var assetType = moreLink.data("asset-type");
            if (assetType === "model") {
                loadNextPage(moreLink.parent(), buildLoadModelsUrl(true, group));
            } else if (assetType === "animation") {
                loadNextPage(moreLink.parent(), buildLoadAnimationsUrl(true, group));
            } else if (assetType === "plugin") {
                loadNextPage(moreLink.parent(), buildLoadPluginsUrl(true, group));
            } else {
                loadNextPage(moreLink.parent(), buildLoadGamesUrl(true, group));
            }
            return false;
        });

        $('#assetList .app-place').on("click", function (event) {
            event.preventDefault();
            var target = $(this);
            Roblox.GenericConfirmation.open({
                titleText: Roblox.PublishAs.Resources.appStudioTitle,
                bodyContent: Roblox.PublishAs.Resources.appStudioBody,
                acceptText: Roblox.PublishAs.Resources.continueText,
                acceptColor: Roblox.GenericConfirmation.blue,
                declineText: Roblox.PublishAs.Resources.decline,
                imageUrl: "/images/Icons/img-alert.png",
                onAccept: function () {
                    var url;
                    if (target.is('a')) {
                        url = target.attr('href');
                    } else {
                        url = target.find('a').attr('href');
                    }
                    window.location = url;
                }
            });
        });

        $('.group-select').on("change", "select", function () {
            var select = $(this);
            var id = select.find(':selected').val();
            var url = select.data('url');
            var container = $("#groupAssetList .content");
            if (!container.find(".loading").length ) {
                container.append("<div class='loading'></div>");
            }
            
            $.ajax({
                url: url + "/" + id,
                cache: false,
                dataType: "html",
                success: function (html) {
                    container.find('.gameplace, .list-item, #MoreGames, .loading').remove();
                    container.append($(html));  			    // append them
                    $(html).animate({ opacity: 1 }, "fast");    // fade them into view
                    var newThumbs = $(html).find("a[data-retry-url]");
                    newThumbs.loadRobloxThumbnails(); 		    // load thumbnails for the new page
                }
            });
        });

        $('#groupAssetList').on('click', '#newasset', function () {
            var groupId = $('#groupAssetList select').find(":selected").val();
            var url = $(this).data('url');
            // TODO: Investigate why UniverseID has anything to do with uploading an asset from the publish window. Badges, and GamePasses should be the only game assets and they don't get published from here. WEBAPI-1283
            var universeId = $('#UniverseID').val();
            window.location.href = url + "/" + groupId + "?universeId=" + universeId;
        });

        $('#gameAssetList').on('click', '#newasset', function () {
            var url = $(this).data('url');          
            window.location.href = url;            
        });
    };

    return {
        Initialize: initialize
    };
} ();