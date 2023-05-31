var Roblox = Roblox || {};

/*
purchaseConfirmationCallback(obj) - function is run after purchase. Takes in the same obj as openPurchaseConfirmationView
*/

Roblox.ItemPurchase = function (purchaseConfirmationCallback) {

    if (!(this instanceof Roblox.ItemPurchase)) {
        return new Roblox.ItemPurchase(purchaseConfirmationCallback);
    }

    var authenticatedUserIsNull = $('#ItemPurchaseAjaxData').attr('data-authenticateduser-isnull');
    var userBalanceRobux = $('#ItemPurchaseAjaxData').attr('data-user-balance-robux');
    var userBalanceTickets = $('#ItemPurchaseAjaxData').attr('data-user-balance-tickets');
    var userBC = $('#ItemPurchaseAjaxData').attr('data-user-bc');
    var alertImageUrl = $('#ItemPurchaseAjaxData').attr('data-alerturl');
    var buildersClubUrl = $('#ItemPurchaseAjaxData').attr('data-builderscluburl');
    var isPlace = false;


    function addCommasToMoney(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    function formatMoney(money) {
        if (money < 1)
            return money + "";

        if (money < 10000)
            return addCommasToMoney(money);

        if (money >= 1000000) // > Million
        {
            return Math.floor(money / 1000000) + "M+";
        }
        else {
            return Math.floor(money / 1000) + "K+";
        }
    }

    function redirectToLogin() {
        window.location.href = "/login/Default.aspx?ReturnUrl=" + encodeURIComponent(location.pathname + location.search);
    }
    function showProcessingModal(closeClass) {
        var modalProperties = { overlayClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };

        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }

        $("#ProcessingView").modal(modalProperties);
    }

    function purchaseItem(elem, CssClass) {
        showProcessingModal(CssClass);
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        var productID = target.attr('data-product-id');
        var expPrice = parseInt(target.attr('data-expected-price'));
        var expCurrency = target.attr('data-expected-currency');
        var expPromoId = target.attr('data-placeproductpromotion-id');
        var expSellerId = target.attr('data-expected-seller-id');
        var userAssetID = target.attr('data-userasset-id');

        $.ajax({
            type: "POST",
            url: "/API/Item.ashx?rqtype=purchase&productID=" + productID +
                "&expectedCurrency=" + expCurrency +
                "&expectedPrice=" + expPrice +
                (expPromoId === undefined ? "" : "&expectedPromoID=" + expPromoId) +
                "&expectedSellerID=" + expSellerId +
                (userAssetID === undefined ? "" : "&userAssetID=" + userAssetID),
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                if (msg.statusCode == 500) {
                    $.modal.close(".ProcessingView");
                    openErrorView(msg);
                } else {
                    $.modal.close(".ProcessingView");
                    openPurchaseConfirmationView(msg);
                }
            },
            error: function (msg) {
                $.modal.close(".ProcessingView");
                var errorObj = $.parseJSON(msg.responseText);
                openErrorView(errorObj);
            }
        });
    }

    function openErrorView(errorObj) {

        if (errorObj.showDivID === "TransactionFailureView") {
            Roblox.GenericConfirmation.open({
                titleText: errorObj.title,
                bodyContent: errorObj.errorMsg,
                imageUrl: alertImageUrl,
                acceptText: Roblox.ItemPurchase.strings.okText,
                declineColor: Roblox.GenericConfirmation.none,
                dismissable: true
            });
        } else if (errorObj.showDivID === "InsufficientFundsView") {
            var actionButtonText = "";
            var footer = "";
            var allowHtmlInFooter = false;

            if (errorObj.currentCurrency == 1) {
                actionButtonText = Roblox.ItemPurchase.strings.buyText + " Robux";
            } else {
                actionButtonText = Roblox.ItemPurchase.strings.tradeCurrencyText;
            }

            if (errorObj.currentCurrency == 1) {
                allowHtmlInFooter = true;
                footer = Roblox.ItemPurchase.strings.orText + " <a href='/My/Money.aspx?tab=TradeCurrency' style='font-weight:bold'>" + Roblox.ItemPurchase.strings.tradeCurrencyText + "</a>";
            }

            Roblox.GenericConfirmation.open({
                titleText: Roblox.ItemPurchase.strings.insufficientFundsTitle,
                bodyContent: String.format(Roblox.ItemPurchase.strings.insufficientFundsText, "<span class='currency-color CurrencyColor" + errorObj.currentCurrency + "'>" + errorObj.shortfallPrice + "</span>"),
                acceptText: actionButtonText,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: function () { window.location = "/Upgrades/Robux.aspx"; },
                declineText: Roblox.ItemPurchase.strings.cancelText,
                imageUrl: alertImageUrl,
                footerText: footer,
                allowHtmlContentInBody: true,
                allowHtmlContentInFooter: allowHtmlInFooter,
                dismissable: true
            });

        } else if (errorObj.showDivID === "PriceChangedView") {

            var elem = $('.PurchaseButton[data-item-id=' + errorObj.AssetID + '][data-expected-currency=' +
                        errorObj.expectedCurrency + '][data-expected-price=' + errorObj.expectedPrice + ']');

            var acceptPurchase = function () {
                elem.attr('data-expected-price', errorObj.currentPrice);
                elem.attr('data-expected-currency', errorObj.currentCurrency);
                purchaseItem(elem, 'PurchaseVerificationView');
            };

            Roblox.GenericConfirmation.open({
                titleText: Roblox.ItemPurchase.strings.priceChangeTitle,
                bodyContent: String.format(Roblox.ItemPurchase.strings.priceChangeText, "<span class='currency-color CurrencyColor" + errorObj.expectedCurrency + "'>" + errorObj.expectedPrice + "</span>", "<span class='currency-color CurrencyColor" + errorObj.currentCurrency + "'>" + errorObj.currentPrice + "</span>"),
                acceptText: Roblox.ItemPurchase.strings.buyNowText,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: acceptPurchase,
                declineText: Roblox.ItemPurchase.strings.cancelText,
                footerText: String.format(Roblox.ItemPurchase.strings.balanceText, (errorObj.currentCurrency == 1 ? "R$" : "Tx") + errorObj.balanceAfterSale),
                allowHtmlContentInBody: true,
                dismissable: true
            });
        }
    }

    function openPurchaseVerificationView(elem) {
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        var bcRequirement = target.attr('data-bc-requirement');
        if (bcRequirement > userBC) {
            showBCOnlyModal("BCOnlyModal");
            return;
        }

        var assetName = target.attr('data-item-name');
        var expPrice = parseInt(target.attr('data-expected-price'));
        var expCurrency = target.attr('data-expected-currency');
        var sellerName = target.attr('data-seller-name');
        var assetType = target.attr('data-asset-type');
        var assetID = target.attr('data-item-id');
        isPlace = assetType == "Place";

        if (authenticatedUserIsNull === "True") {
            redirectToLogin();
            return;
        }
        var isRentable = false;
        if (target.hasClass('rentable')) {
            var isRentable = true;
        }

        var userBalance;
        if (expCurrency == "1") { //robux
            userBalance = parseInt(userBalanceRobux);
        } else { //tickets
            userBalance = parseInt(userBalanceTickets);
        }
        var balanceAfter = userBalance - expPrice;

        var buyType = "";
        if (isRentable) {
            buyType = Roblox.ItemPurchase.strings.rentText;
        } else {
            buyType = Roblox.ItemPurchase.strings.buyTextLower;
        }
        if (balanceAfter < 0) {
            var errorObj = {
                shortfallPrice: (0 - balanceAfter),
                currentCurrency: expCurrency,
                showDivID: "InsufficientFundsView"
            };
            openErrorView(errorObj);
            return;
        }
        var itemUrl = $('#ItemPurchaseAjaxData').attr('data-imageurl');

        var currencyContent = "";
        if (expPrice == 0) {
            currencyContent = "<span class='currency CurrencyColorFree'>" + Roblox.ItemPurchase.strings.freeText + "</span>";
        } else {
            currencyContent = "<span class='currency CurrencyColor" + expCurrency + "'>" + expPrice + "</span>";
        }
        var footerCurrencyText = "";
        if (expCurrency == "1") {
            footerCurrencyText = 'R$';
        } else {
            footerCurrencyText = 'Tx';
        }
        footerCurrencyText += addCommasToMoney(balanceAfter);

        var acceptPurchase = function () {
            purchaseItem(elem, 'PurchaseVerificationView');
        };

        Roblox.GenericConfirmation.open({
            titleText: Roblox.ItemPurchase.strings.buyItemTitle,
            bodyContent: String.format(Roblox.ItemPurchase.strings.buyItemText, buyType, assetName, assetType, sellerName, currencyContent, isPlace ? Roblox.ItemPurchase.strings.accessText : ""),
            imageUrl: itemUrl,
            acceptText: isPlace ? Roblox.ItemPurchase.strings.buyAccessText : Roblox.ItemPurchase.strings.buyNowText,
            acceptColor: Roblox.GenericConfirmation.green,
            onAccept: acceptPurchase,
            declineText: Roblox.ItemPurchase.strings.cancelText,
            footerText: String.format(Roblox.ItemPurchase.strings.balanceText, footerCurrencyText),
            allowHtmlContentInBody: true,
            dismissable: true,
            onOpenCallback: function () {
                $('.ConfirmationModal .roblox-item-image').html('').attr('data-item-id', assetID);
                Roblox.require('Widgets.ItemImage', function (item) {
                    item.load($('.ConfirmationModal .roblox-item-image'));
                });
            }
        });
    }

    function openPurchaseConfirmationView(obj) {

        var currencyContent;
        if (obj.Price == 0) {
            currencyContent = "<span class='currency CurrencyColorFree'>" + Roblox.ItemPurchase.strings.freeText + "</span>";
        } else {
            currencyContent = "<span class='currency CurrencyColor" + obj.Currency + "'>" + obj.Price + "</span>";
        }

        var itemUrl = $('#ItemPurchaseAjaxData').attr('data-imageurl');

        var continueShopping = function () {
            var continueShoppingUrl = $('#ItemPurchaseAjaxData').attr('data-continueshopping-url');
            if (continueShoppingUrl != undefined && continueShoppingUrl != "") {
                document.location.href = continueShoppingUrl;
            }
        };

        var allowFooterHtml = false;
        var footer = "";

        if (obj.AssetIsWearable) {
            footer = "<a class='CustomizeCharacterLink' href='/My/Character.aspx'>" + Roblox.ItemPurchase.strings.customizeCharacterText + "</a>";
            allowFooterHtml = true;
        }

        Roblox.GenericConfirmation.open({
            titleText: Roblox.ItemPurchase.strings.purchaseCompleteTitle,
            bodyContent: String.format(Roblox.ItemPurchase.strings.purchaseCompleteText, obj.TransactionVerb, obj.AssetName, obj.AssetType, obj.SellerName, currencyContent, isPlace ? Roblox.ItemPurchase.strings.accessText : ""),
            imageUrl: itemUrl,
            acceptText: Roblox.ItemPurchase.strings.continueShoppingText,
            xToCancel: true,
            onAccept: continueShopping,
            onCancel: function () { if (obj.IsMultiPrivateSale) { window.location.reload(); } },
            declineColor: Roblox.GenericConfirmation.none,
            footerText: footer,
            allowHtmlContentInBody: true,
            allowHtmlContentInFooter: allowFooterHtml,
            dismissable: true,
            onOpenCallback: function () {
                $('.ConfirmationModal .roblox-item-image').html('').attr('data-item-id', obj.AssetID);
                Roblox.require('Widgets.ItemImage', function (item) {
                    item.load($('.ConfirmationModal .roblox-item-image'));
                });
            }
        });

        purchaseConfirmationCallback(obj);
    }

    return {
        showProcessingModal: showProcessingModal,
        purchaseItem: purchaseItem,
        openPurchaseVerificationView: openPurchaseVerificationView,
        openPurchaseConfirmationView: openPurchaseConfirmationView,
        redirectToLogin: redirectToLogin,
        purchaseConfirmationCallback: purchaseConfirmationCallback,
        openErrorView: openErrorView,
        addCommasToMoney: addCommasToMoney,
        formatMoney: formatMoney
    };

};

Roblox.ItemPurchase.ModalClose = function(popup) {
    $.modal.close('.' + popup);
};
