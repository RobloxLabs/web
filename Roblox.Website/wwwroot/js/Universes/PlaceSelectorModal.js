var Roblox = Roblox || {};

Roblox.PlaceSelector = function () {
    var placeSelectCallback;
    var urlBuilder;
    function formatPlaceSelectorHtml(obj) {
        var safeName = obj.name.escapeHTML();
        var gameName = obj.gameName;
        if (gameName == '') {
            gameName = "None";
        }
        var template = $('.place-selector.template').clone().removeClass('template');
        template.show();
        var thumbRetryUrl = template.find('.place-image').data('retry-url-template');
        thumbRetryUrl += thumbRetryUrl.indexOf('?') !== -1 ? '&' : '?';
        thumbRetryUrl += 'assetId=' + obj.placeId;
        template.find('.place-image').attr('data-retry-url', thumbRetryUrl);
        template.attr('title', safeName);
        template.attr('data-placeId', obj.placeId);
        template.attr('data-notSelectable', obj.isRootPlace);
        if (obj.isRootPlace) {
            template.removeClass('selectable');
            template.addClass('not-selectable');
            template.find('.root-place').show();
        }
        template.find('.place-name').text(obj.name).attr('title', safeName);
        template.find('.game-name-text').text(gameName).attr('title', gameName.escapeHTML());
        return template;
    }

    function getPlaceSelector(startIndex, maxRows) {
        var reqUrl = $(".place-selector-modal").data("place-loader-url");
        reqUrl = reqUrl + "&startIndex=" + startIndex + "&maxRows=" + maxRows;
        if (urlBuilder !== undefined) {
            reqUrl = urlBuilder(startIndex, maxRows);
        }
        $.ajax({
            type: "GET",
            url: reqUrl,
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (response) {
                Roblox.PlaceSelectorPager.update(response);
            },
            error: function (response) {
                $('#PlaceSelectorItemContainer').addClass('empty').text(anErrorOccurred);
            }
        });
    }

    function formatPlaceSelectorCallback(obj) {
        $("[data-retry-url]").loadRobloxThumbnails();
    }

    function openModal(placeSelectCallbackFunction, urlBuilderFunction) {
        urlBuilder = urlBuilderFunction;
        Roblox.PlaceSelectorPager = new DataPager(0, 5,
                    'PlaceSelectorItemContainer',
                    'PlaceSelectorPagerContainer',
                    Roblox.PlaceSelector.GetPlaceSelector,
                    Roblox.PlaceSelector.FormatPlaceSelectorHTML,
                    Roblox.PlaceSelector.FormatPlaceSelectorCallback,
                    {
                        Paging_PageNumbers_AreLinks: false
                    }
                );
        placeSelectCallback = placeSelectCallbackFunction;
        $(".PlaceSelectorModal").modal({ overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} });
    }
    function closeModal() {
        $.modal.close();
    }

    function init() {
        $(document).on("click", ".place-selector-modal .place-selector", function () {
            var notSelectable = $(this).data("notselectable");
            if (notSelectable) {
                return;
            }

            var placeId = $(this).data("placeid");
            if (placeSelectCallback !== undefined) {
                placeSelectCallback(placeId);
            }
            Roblox.PlaceSelector.Close();
        });
    }

    return {
        Init: init,
        GetPlaceSelector: getPlaceSelector,
        FormatPlaceSelectorHTML: formatPlaceSelectorHtml,
        FormatPlaceSelectorCallback: formatPlaceSelectorCallback,
        Open: openModal,
        Close: closeModal
    };
} ();