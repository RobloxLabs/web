$(function () {
    $(document).bind('GamecardSuccess', function () {
        $("#success").delay(5000).fadeOut(400);

        validateForm();
    });

    $("#submit-button-wrapper a").click(function () {
        if (validateForm()) {
            $("#submit-button-wrapper a").off("click");
            $("#submit-button-wrapper a").addClass("btn-disabled-primary").removeClass("btn-primary");
            $("#payment-form").submit();
        }
        return false;
    });
    
    function calculateBalance(currentCredit, productPrice) {
        var newBalance = currentCredit - productPrice;
        var newBalanceDisplay = parseFloat(newBalance).toFixed(2);
        return newBalanceDisplay;
    }

    function updateBalance(newBalance) {
        if (newBalance >= 0) {
            $("#total-balance .price").html("$" + newBalance).removeClass("negative");
            $("#submit-button-wrapper a").removeClass("btn-disabled-primary").addClass("btn-primary").prop("disabled",false);
        } else {
            var positiveFixed = Math.abs(newBalance).toFixed(2);
            $("#total-balance .price").html("-$" + positiveFixed).addClass("negative");
        }
    }

    function validateForm() {
        var currentCredit = moneyTextToFloat($("#roblox-credit-container .price").html());
        var productPrice = 0;
        $("#added-products .price").each(function () {
            var addedProductPrice = moneyTextToFloat($(this).html());
            productPrice += addedProductPrice;
        });
        productPrice = Math.abs(productPrice);
        var newBalance = calculateBalance(currentCredit, productPrice);
        updateBalance(newBalance);
        return newBalance >= 0;
    }

    // Form event tracking
    if (typeof Roblox.FormEvents !== 'undefined') {
        var context = "redeemPage";
        var pinInput = $("#pin-input input");
        var redeemButton = $("#redeem-btn");
        var submitButton = $("#submit-btn");

        pinInput.focus(function () {
            Roblox.FormEvents.SendInteractionFocus(context, $(this).attr("id"));
        });

        pinInput.blur(function () {
            Roblox.FormEvents.SendInteractionOffFocus(context, $(this).attr("id"));
        });

        redeemButton.click(function () {
            Roblox.FormEvents.SendInteractionClick(context, $(this).attr("id"));
        });

        submitButton.click(function() {
           Roblox.FormEvents.SendInteractionClick(context, $(this).attr("id")); 
        });
    }

    function moneyTextToFloat(val) {
        return parseFloat(val.split(',').join('').replace('$',''));
    }
});