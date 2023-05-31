$(document).ready(function () {
    $('.PurchaseButton').each(function (index, htmlElem) {
        $(htmlElem).unbind().click(function () {
            Roblox.PlaceItemPurchase.openPurchaseVerificationView(htmlElem);
            return false;
        });
    });

    Roblox.PlaceItemPurchase = new Roblox.ItemPurchase(function (obj) {
        $('.PurchaseButton[data-item-id=' + obj.AssetID + ']').each(function (index, htmlElem) {
            $('.PurchaseContainer[data-item-id=' + obj.AssetID + ']').hide();
            $('.VisitButtonContainer[data-item-id=' + obj.AssetID + ']').show();
        });
    });
});