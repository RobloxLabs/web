$(function () {
    Roblox.Payment.originalPrice = parseFloat($('#TotalPrice').html().trim().substr(1, 10)); // As many digits as necessary
    Roblox.Payment.totalPrice = Roblox.Payment.originalPrice;
    Roblox.Payment.RecurrText = "";
    Roblox.Payment.RecurrTextObject = $(Roblox.Payment.RecurrText);
    $("#CCTextBox").filter_input({ regex: "[0-9]" });
    $("#CVVValueTextBox").filter_input({ regex: "[0-9]" });
    Roblox.Payment.checkBoxesIfNeeded();
});

if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.Payment = new function () {
    this.checkBoxesIfNeeded = function () {
        if ((typeof $(".hiddenCheckedBoxesField").attr("value") )=== "undefined") {
            return;
        }
        var checkboxStrArray = $(".hiddenCheckedBoxesField").attr("value").split(";");
        for (var i = 0; i < checkboxStrArray.length; i++) {
            var checkboxOption = checkboxStrArray[i];
            if (parseInt(checkboxOption) != null) {
                $("#SpecialAddOnOffer > ul > li > input#chkAddOn_" + checkboxOption).each(function (i, v) {
                    if ((v != null) && (v.checked === false)) {
                        v.click();
                    }
                });
            }
        }
    };

    this.showConfirmation = function () {
        Roblox.GenericConfirmation.open({
            titleText: Roblox.Payment.Resources.ConfirmTitle,
            bodyContent: Roblox.Payment.Resources.ConfirmBody,
            onAccept: Roblox.Payment.acceptPurchase,
            onDecline: Roblox.Payment.declinePurchase,
            acceptColor: Roblox.GenericConfirmation.gray,
            declineColor: Roblox.GenericConfirmation.blue,
            dismissable: false
        });
    };

    this.acceptPurchase = function () {
        $('#hiddenConfirm').find('input').val("confirmed");
        var target = $("#Pay a");
        target.click();
        //a hack due to inline JS found in the LinkButton (click does not trigger link follow in browsers).
        var href = target.attr('href');
        window.location = href;
    };

    this.declinePurchase = function () {
        Roblox.Payment.declinePurchase = function () {
            $('#hiddenConfirm').find('input').val("");
        };
    };

    this.ItemPurchasePopupPanel = {};

    this.ItemPurchasePopupPanel.close = function () {
        $.modal.close(".ItemPurchasePopupPanel");
    };

    this.ItemPurchasePopupPanel.open = function () {
        var modalProperties = { overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };
        $("#ItemPurchasePopupPanel").modal(modalProperties);
    };

    this.ReferralTip = {};

    this.ReferralTip.close = function () {
        $.modal.close(".ReferralTip");
    };

    this.ReferralTip.open = function () {
        var modalProperties = { overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };
        $("#ReferralTip").modal(modalProperties);
    };

    this.ProductSelectChange = function (productID, isChecked, thisProductPrice) {
        var addOnProductDisplayID = 'addOnProductDisplay_' + productID;
        // Get the current hidden field value storing the products they've checked
        // It seems like there's no easy way to do this with ASP: Checkboxes...
        var currVals = $('.hiddenCheckedBoxesField').val();

        if (isChecked) {
            Roblox.Payment.totalPrice += thisProductPrice;
            $('#' + addOnProductDisplayID).show();
            // Add to our hidden field
            if (currVals.indexOf(";" + productID) == -1) {
                currVals += ";" + productID;
            }

        } else {
            Roblox.Payment.totalPrice -= thisProductPrice;
            $('#' + addOnProductDisplayID).hide();

            // Remove from our hidden field
            currVals = currVals.replace(';' + productID, '');
        }
        // Update hidden field value
        $('.hiddenCheckedBoxesField').val(currVals);

        $('#TotalPrice').html('$' + Roblox.Payment.totalPrice.toFixed(2));
    };


    this.RecurrClick = function (checkBoxClientId) {
        var checked = $("#" + checkBoxClientId)[0].checked;
        if (checked == true) {
            $('.AutoRecurText').show();
        } else if (checked == false) {
            $('.AutoRecurText').hide();
        }
    };
};



