if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Resources === "undefined") {
    Roblox.Resources = {};
}
if (typeof Roblox.Resources.PaymentPage === "undefined") {
    Roblox.Resources.PaymentPage = {};
}

Roblox.MvcPaymentPage = $(function () {
    var context = "creditCardPaymentPage";
    var supercharge = $("input[name=supercharge]");
    var submitButton = $("#submit-btn");

    $("#FirstName").focus();

    // Form events tracking
    if (typeof Roblox.FormEvents !== 'undefined') {
        var elem = $("#payment-container input[type=text], #payment-container select");

        elem.focus(function () {
            Roblox.FormEvents.SendInteractionFocus(context, $(this).attr("name"));
        });

        elem.blur(function () {
            Roblox.FormEvents.SendInteractionOffFocus(context, $(this).attr("name"));
        });
    }

    $(".PreviewGiftCard").click(function () {
        var windowProperties = 'height=830,width=640,left=10,top=10,resizable=1,scrollbars=1,toolbar=1,menubar=0,location=0,directories=no,status=yes';
        var url = 'GiftCard.ashx?action=preview&id=' + $(this).data('lookupid');
        var pdfWindow = window.open(url, 'pdfWindow', windowProperties);
        pdfWindow.title = "Preview Certificate.pdf";
    });

    supercharge.change(function () {
        var id = $(this).attr("id");
        var fullId = "product-" + id;
        var field = $(this).attr("name");
        var name = $(this).val();
        var price = $(this).data("price");
        var longTextVisibility;
        var animated = false;

        // only one can be checked at a time
        var previouslyCheckedElement = $("input[name=supercharge]").filter(":checked").not(this);
        if (previouslyCheckedElement.length > 0) {
            animated = true;
            previouslyCheckedElement.removeAttr("checked");
            removeProduct();
        }

        if ($(this).is(":checked")) {
            longTextVisibility = true;
            populateHiddenUpsellProduct(id);
            if (animated) {
                setTimeout(function () {
                    addProduct(fullId, name, price);
                    recalculateTotal();
                    updateSelectedProduct(true);
                }, 450);
            } else {
                addProduct(fullId, name, price);
                updateSelectedProduct(true);
            }
        } else {
            longTextVisibility = false;
            removeProduct();
            resetHiddenUpsellProduct();
            updateSelectedProduct(false);
        }

        if (!$('#submit-button-notes').hasClass('long-legal-default')) {
            legalTextVisibility(longTextVisibility, price);
        }

        recalculateTotal();

        if (typeof Roblox.FormEvents !== 'undefined') {
            Roblox.FormEvents.SendInteractionClick(context, field + "_" + name);
        }
    });

    // If we are returned to this page we need to display the selected upsell product
    var selectedUpsellProductId = $("#SelectedUpsellProductId").val();
    if (selectedUpsellProductId.length > 0 && selectedUpsellProductId != 0) {
        $("input[name=supercharge]#" + selectedUpsellProductId).prop('checked', true);
        $("input[name=supercharge]#" + selectedUpsellProductId).trigger("change");
    }

    $("#CreditCard_Number, #CreditCard_SecurityCode, #Phone").keypress(function (event) {
        if (!isNumberKey(event)) {
            return false;
        }
        return true;
    });

    var initialCCval = $("#CreditCard_Number").val();
    if (initialCCval.length == 16) {
        toggleCreditCardType(initialCCval);
    }

    $("#CreditCard_Number").keyup(function () {
        toggleCreditCardType($(this).val());
    });

    submitButton.click(submit);
    function submit (e) {
        submitButton.off("click");
        if (submitButton.hasClass("btn-disabled-primary")) {
            return;
        }

        if (typeof Roblox.FormEvents !== 'undefined') {
            Roblox.FormEvents.SendInteractionClick(context, $(this).attr("id"));
        }
        if (validateForm()) {
            submitButton.addClass("btn-disabled-primary").removeClass("btn-primary");
            $("#payment-form").submit();
        }
        else {
            submitButton.click(submit);
        }
    }

var displayDoublePurchase = $("#payment-container").data("displayDoublePurchase");
if (displayDoublePurchase == "True") {
    var doublePurchaseProperties = {
        titleText: Roblox.Resources.PaymentPage.ConfirmTitle,
        bodyContent: Roblox.Resources.PaymentPage.ConfirmBody,
        onAccept: acceptDoublePurchase,
        onDecline: declineDoublePurchase,
        acceptColor: Roblox.Dialog.gray,
        declineColor: Roblox.Dialog.blue,
        dismissable: false
    };
    Roblox.Dialog.open(doublePurchaseProperties);
}

function acceptDoublePurchase() {
    $('#DoublePurchaseConfirmed').val("True");
    if (validateForm()) {
        $("#payment-form").submit();
    }
}

function legalTextVisibility(isVisible, price) {
    if (isVisible === true) {
        $('#submit-button-notes .price-info').text(price);
        $('#submit-button-notes-small-legal').addClass('hidden');
        $('#submit-button-notes').removeClass('hidden');
    }
    else {
        $('#submit-button-notes-small-legal').removeClass('hidden');
        $('#submit-button-notes').addClass('hidden');
    }
}

function declineDoublePurchase() {
    // placeholder
};

function populateHiddenUpsellProduct(text) {
    $("#SelectedUpsellProductId").val(text);
}

function resetHiddenUpsellProduct() {
    $("#SelectedUpsellProductId").val("0");
}

function isNumberKey(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function toggleCreditCardType(text) {
    if (text.length == 0) {
        hideCreditCardType();
        populateHiddenCreditCardType("4", "front");
    }
    if (text.length == 1) {
        displayCreditCardType(text);
    }
    else {
        var first = text.substring(0, 1);
        displayCreditCardType(first);
    }
}

function populateHiddenCreditCardType(typeId) {
    $("#CreditCard_CardType").val(typeId);
}

function displayCreditCardType(firstDigit) {
    switch (firstDigit) {
        case "3":
            displayCreditCardTypeImage("americanExpress");
            populateHiddenCreditCardType("AmericanExpress");
            updateSecurityCodeInstructions("4", "front");
            break;
        case "4":
            displayCreditCardTypeImage("visa");
            populateHiddenCreditCardType("Visa");
            updateSecurityCodeInstructions("3", "back");
            break;
        case "5":
            displayCreditCardTypeImage("masterCard");
            populateHiddenCreditCardType("MasterCard");
            updateSecurityCodeInstructions("3", "back");
            break;
        case "6":
            displayCreditCardTypeImage("discover");
            populateHiddenCreditCardType("Discover");
            updateSecurityCodeInstructions("3", "back");
            break;
        default:
            break;
    }
}

function updateSecurityCodeInstructions(codeLength, codeLocation) {
    if (codeLength.length != 0 && codeLocation != 0) {
        $("#cardSecurityCodeDigits").text(codeLength);
        $("#cardSecurityCodeLocation").text(codeLocation);
    }
}

function displayCreditCardTypeImage(type) {
    var image = $("#credit-card-type");
    $(image).addClass(type);
    $(image).css({ opacity: 0, display: "inline-block" }).animate({ opacity: 1 }, 400);
}

function hideCreditCardType() {
    var image = $("#credit-card-type");
    $(image).removeClass();
    $(image).animate({ opacity: 0 }, 400);
}

function addProduct(id, name, price) {
    $(".supercharge-name").text(name);
    $(".supercharge-price").text(price);
    $("#product-addon").fadeIn(300);
}

function removeProduct() {
    $("#product-addon").fadeOut(300);
    $("#cart .supercharge-name").text("");
    $("#cart .supercharge-price").text("");
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

function FormatPricing(id, total) {
    if (id == Roblox.LocalPricing.SpainEuroCurrencyTypeId && Roblox.LocalPricing.IsDesktopLocalPricing) {
        $("#total-balance .price").text(total.toLocaleString("es-ES", { style: "currency", currency: "EUR" }));
    }
    else {
        $("#total-balance .price").text("$" + total.toFixed(2));
    }
}

function recalculateTotal() {
    var total = Roblox.LocalPricing.selectedProductPrice || 0;
        var selectedProduct = $("#supercharge-product .supercharge-name").text();
        Roblox.LocalPricing.UpsellProducts.forEach(function (upsellProduct) {
            if (selectedProduct == upsellProduct.Name) total += upsellProduct.Price;
        });
        FormatPricing(Roblox.LocalPricing.CountryCurrencyTypeId, total);
    }

function creditCardSprite() {
    $("#credit-card-type").fadeIn(300);
}
});

/******* Validation.js ********/
function validateForm() {
    var requiredElements = $("[data-required]");
    var expirationMonth = $("#CreditCard_ExpirationMonth");
    var expirationYear = $("#CreditCard_ExpirationYear");
    var email = $("#Email");
    var emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    var filledOutElements = $(requiredElements).filter(function () {
        return $(this).val().trim() !== "";
    });
    var emptyElements = $(requiredElements).filter(function () {
        return $(this).val().trim() === "";
    });

    var result = true;

    // add error class to all empty
    if (emptyElements.length > 0) {
        result = false;
        $(emptyElements).each(function () {
            $(this).addClass("form-error");
            if (typeof Roblox.FormEvents !== 'undefined') {
                Roblox.FormEvents.SendValidationFailed("creditCardPaymentPage", $(this).attr("name"), "", "required");
            }
        });
    }
    // remove error class from all filled out
    if (filledOutElements.length > 0) {
        $(filledOutElements).each(function () {
            $(this).removeClass("form-error");
        });
    }

    // email validation
    if (!emailRegex.exec(email.val())) {
        result = false;
        $("#Email").addClass("form-error");
        if (typeof Roblox.FormEvents !== 'undefined') {
            Roblox.FormEvents.SendValidationFailed("creditCardPaymentPage", email.attr("name"), email.val(), "invalid");
        }
    }

    // validation for expiration date
    if (typeof Roblox.FormEvents !== 'undefined') {
        if (expirationMonth.hasClass("select-form-error")) {
            Roblox.FormEvents.SendValidationFailed("creditCardPaymentPage", expirationMonth.attr("name"), "[Redacted]", "invalid");
        }
        if (expirationYear.hasClass("select-form-error")) {
            Roblox.FormEvents.SendValidationFailed("creditCardPaymentPage", expirationYear.attr("name"), "[Redacted]", "invalid");
        }
    }


    var expireYear = parseInt($("#CreditCard_ExpirationYear option:selected").val());
    var expireMonth = parseInt($("#CreditCard_ExpirationMonth option:selected").val());
    var serverYear = parseInt($("#CreditCard_ServerExpirationYear").val());
    var serverMonth = parseInt($("#CreditCard_ServerExpirationMonth").val());
    if (expireYear < serverYear || (expireYear === serverYear && expireMonth < serverMonth)) {
        result = false;
        $("#CreditCard_ExpirationMonth").addClass("select-form-error");
        $("#CreditCard_ExpirationYear").addClass("select-form-error");
    } else {
        $("#CreditCard_ExpirationMonth").removeClass("select-form-error");
        $("#CreditCard_ExpirationYear").removeClass("select-form-error");
    }

    return result;
}