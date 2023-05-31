var Roblox = Roblox || {};
Roblox.PlaceProductPromotion = function () {
    var intl = new Roblox.Intl();
    var itemResources = Roblox.Lang.ItemResources;
    var messages = {
        promoteItem: itemResources["Heading.PromoteItem"],
        add: itemResources["Action.Add"],
        cancel: itemResources["Action.Cancel"],
        messageText: function (placeName) {
            return intl.f(itemResources["Response.GearAddSuccess"], { placeName: placeName });
        }
    }

    var container = $("#promote-gear-container");

    function AddAntiForgeryToken(data) {
        data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
        return data;
    }

    function showSuccessBanner(placeName) {
        var successBanner = $(".system-feedback .alert-success");
        var placeNameHtml = "<span class='font-bold'>" + placeName + "</span>";
        var text = messages.messageText(placeNameHtml);

        if (successBanner.length > 0 && Roblox.BootstrapWidgets) {
            Roblox.BootstrapWidgets.ToggleSystemMessage(successBanner, 100, 2000, text);
        }
    }

    function showErrorBanner(message) {
        var errorBanner = $(".system-feedback .alert-warning");

        if (errorBanner.length > 0 && Roblox.BootstrapWidgets) {
            Roblox.BootstrapWidgets.ToggleSystemMessage(errorBanner, 100, 2000, message);
        }
    }

    function AddPlaceProductPromotion() {
        var placeId = $("#promote-gear .product-promo-place").val();


        $.ajax({
            type: "POST",
            url: "/Games/AddProductPromotionToPlace?placeId=" + placeId + "&productId=" + Roblox.PlaceProductPromotionData.ProductID,
            data: AddAntiForgeryToken({}),
            dataType: "json",
            success: function (response) {
                if (response.ErrorMsg) {
                    showErrorBanner(response.ErrorMsg);
                } else {
                    showSuccessBanner(response.PlaceName);
                }
            },
            error: function (msg) {
                showErrorBanner(response.ErrorMsg);
            }
        });
    }

    function handleDeleteGearFailure() {
        Roblox.Dialog.open({
            titleText: Roblox.PlaceProductPromotion.Resources.error,
            bodyContent: Roblox.PlaceProductPromotion.Resources.sorryWeCouldnt,
            allowHtmlContentInBody: true
        });
    }

    function handleDeleteGearSuccess(promoId) {
        var item = $('.icon-alert[data-delete-promotion-id="' + promoId + '"]');
        var removedText = item.attr("data-delete-item-removed");
        Roblox.Dialog.open({
            titleText: Roblox.PlaceProductPromotion.Resources.success,
            bodyContent: removedText,
            allowHtmlContentInBody: true
        });

        // hide the deleted gear element
        item.parents(".list-item").hide();
    }

    // used exclusively in new game details page
    function DeleteGear(promoId) {
        $.ajax({
            type: "POST",
            url: "/Games/DeletePlaceProductPromotion?promotionId=" + promoId,
            data: AddAntiForgeryToken({}),
            success: function () {
                handleDeleteGearSuccess(promoId);
            },
            error: handleDeleteGearFailure
        });
    }

    function SetUpAddPlaceProductPromotion() {
        $("body").on('change', '#promote-gear .product-promo-group', function () {
            var groupId = this.value;
            $("#promote-gear .product-promo-place").load("/Games/ProductPromotionPlaceDropDown?groupId=" + groupId);
        });
        Roblox.require('Widgets.ItemImage', function (item) {
            item.populate(container.find('.roblox-item-image'));
        });
        $("#promote-gear-btn").on("click", function () {
            Roblox.Dialog.open({
                titleText: messages.promoteItem,
                bodyContent: $("#promote-gear-template").clone().attr("id", "promote-gear").removeClass("hidden"),
                onAccept: function () {
                    AddPlaceProductPromotion();
                },
                imageUrl: container.data("asset-image-url"),
                acceptText: messages.add,
                declineText: messages.cancel,
                xToCancel: true,
                dismissable: true,
                fieldValidationRequired: true,
                allowHtmlContentInBody: true
            });
        });
    }

    return {
        SetUpAddPlaceProductPromotion: SetUpAddPlaceProductPromotion,
        DeleteGear: DeleteGear
    };
} ();
