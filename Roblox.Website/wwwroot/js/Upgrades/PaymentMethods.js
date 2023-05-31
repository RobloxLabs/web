Roblox = Roblox || {}

Roblox.PaymentMethodPage = (function () {
    var context = "paymentMethods";
    var supercharge, paymentMethod, paymentButton;
    // If they history back then it needs to be enabled by default
    var selectedValue;
    var xsollaSelectors = "[id^='xsolla']";

    function init()
    {
        paymentMethod = $("input[name=paymentMethod]");
        paymentButton = $("#payment-method-button a");
        selectedValue = $("input[name=paymentMethod]:checked").val();
        if (selectedValue != null) {
            togglePaymentButton(true);
        } else {
            togglePaymentButton(false);
        }

        supercharge = $("input[name=supercharge]");
        supercharge.change(function () {
            var id = $(this).attr("id");
            var field = $(this).attr("name");
            var upsellName = $(this).val();
            var upsellPrice = $(this).data("price");

            // only one can be checked at a time
            var previouslyCheckedElement = $("input[name=supercharge]").filter(":checked").not(this);
            if (previouslyCheckedElement.length > 0) {
                previouslyCheckedElement.removeAttr("checked");
                removeSupercharge();
            }

            if ($(this).is(":checked")) {
                $("#selectedUpsellProductId").val(id);
                addSupercharge(upsellName, upsellPrice);
                updateSelectedProduct(true);
                updateXsollaPaymentMethods(true);
            } else {
                $("#selectedUpsellProductId").val("0");
                removeSupercharge();
                updateSelectedProduct(false);
                updateXsollaPaymentMethods(false);
            }
            
            calculateTotalDue();

            if (typeof Roblox.FormEvents !== 'undefined') {
                Roblox.FormEvents.SendInteractionClick(context, field + "_" + upsellName);
            }
        });

        // If we are returned to this page we need to display the selected upsell product   
        var selectedUpsellProductId = $("#selectedUpsellProductId").val();
        if (selectedUpsellProductId.length > 0 && selectedUpsellProductId != 0) {
            $("input[name=supercharge]#" + selectedUpsellProductId).prop('checked', true);
            $("input[name=supercharge]#" + selectedUpsellProductId).trigger("change");
        }

        paymentMethod.click(function () {
            togglePaymentButton(true);
            displayFraudMessage();
            if (Roblox && Roblox.FormEvents) {
                Roblox.FormEvents.SendInteractionClick(context, $(this).attr("name") + "_" + $(this).val());
            }
        });
        displayFraudMessage();
        sendPaymentMethodPageLoadStreamEvent();
    }

    function addSupercharge(name, price) {
        $("#selected-product").removeClass("addon-hidden");
        $(".supercharge-name").text(name);
        $(".supercharge-price").text(price);
    }

    function removeSupercharge() {
        $("#cart .supercharge-name").text("");
        $("#cart .supercharge-price").text("");
        $("#selected-product").addClass("addon-hidden");
    }

    function FormatPricing(currencySymbol, total) {
        $("#total-balance .price").text(currencySymbol + priceWithCommas(total.toFixed(2)));
    }    

    function priceWithCommas(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function calculateTotalDue() {
        var total = Roblox.LocalPricing.selectedProductPrice || 0;
        var selectedProduct = $("#supercharge-product .supercharge-name").text();
        var currencySymbol = Roblox.LocalPricing.Currency.CurrencySymbol;
        Roblox.LocalPricing.UpsellProducts.forEach(function (upsellProduct) {
            if (selectedProduct == upsellProduct.Name) {
                total += upsellProduct.Price;
            }
        });
        FormatPricing(currencySymbol, total);
    }

    function updateXsollaPaymentMethods(isUpsellSelected) {
        var elements = $(xsollaSelectors);
        if (isUpsellSelected) {
            //hide OXXO if any upsell was selected
            elements.each(function () {
                $(this).parent().addClass("hide-option").removeClass("show-option");
            });
        }
        else {
            elements.each(function () {
                $(this).parent().addClass("show-option").removeClass("hide-option");
            });
        }
    }

    function submit()
    {
        var selectedPaymentMethod = $("input[name=paymentMethod]:checked").val();

        if (typeof Roblox.FormEvents !== 'undefined') {
            Roblox.FormEvents.SendInteractionClick(context, "continueButton");
        }

        if (selectedPaymentMethod != null) {
            $("#payment-method-form").submit();
            if (Roblox && Roblox.FormEvents) {
                Roblox.FormEvents.SendInteractionClick(context, "selectedPaymentMethod_" + selectedPaymentMethod);
            }
            sendPaymentMethodContinueStreamEvent();
        }
    }

    function sendPaymentMethodPageLoadStreamEvent() {
        var mainProductId = $("input[name=productid]").val();
        if (Roblox && Roblox.EventStream) {
            Roblox.EventStream.SendEventWithTarget("ajaxPageLoad",
                context,
                { pid: mainProductId },
                Roblox.EventStream.TargetTypes.WWW);
        }
    }

    function sendPaymentMethodContinueStreamEvent() {
        var mainProductId = $("input[name=productid]").val();
        var upsellProductId = $("#selectedUpsellProductId").val();
        if (Roblox && Roblox.EventStream) {
            Roblox.EventStream.SendEventWithTarget("paymentMethodContinue",
                context,
                { pid: mainProductId, upsellid: upsellProductId },
                Roblox.EventStream.TargetTypes.WWW);
        }
    }

    function togglePaymentButton(isEnabled) {
        //fire a custom event toggleButton
        paymentButton.trigger(jQuery.Event(Roblox.SubmitButton.submitToggleEvent), isEnabled);
    }

    function displayFraudMessage() {
        var selectedPaymentMethod = $("input[name=paymentMethod]:checked").val();
        var fraudMessageElem = $("#fraud-message");
        if (Roblox.CurrentUser && Roblox.CurrentUser.isUnder13 &&
           (selectedPaymentMethod === "debitCard" || selectedPaymentMethod === "creditCard"))
        {
            fraudMessageElem.removeClass("hidden");
        }
        else {
            fraudMessageElem.addClass("hidden");
        }
    }

    function updateSelectedProduct(toBcVersion) {
        var bcVersionElem = $("#selectedBcProduct");
        var productElem = $("#selectedProduct");

        if (bcVersionElem.length > 0) {
            var bcProductName = $("#selectedBcProduct .product-name").text();
            var nbcProductName = $("#selectedProduct .product-name").text();
            if (toBcVersion) {
                productElem.addClass("hidden");
                bcVersionElem.removeClass("hidden");
                $("#selected-product .name").text(bcProductName);
            }
            else {
                bcVersionElem.addClass("hidden");
                productElem.removeClass("hidden");
                $("#selected-product .name").text(nbcProductName);
            }
        }
    }

    return {
        init: init,
        submit: submit
    }
})();

$(function () {
    Roblox.PaymentMethodPage.init();
});