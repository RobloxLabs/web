var Roblox = Roblox || {};

$(function () {
    //page setup
    $('#pin').keydown(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            Roblox.GameCard.redeemCode();
        }
    });
});

Roblox.GameCard = new function () {
    function forceRedraw(obj) {
        if (obj.is(":visible")) {
            obj.hide();
            obj.show();
        }
    }

    function showError(error) {
        $("#errorText").html(error);
        $("#error").show();
        if (typeof Roblox.FormEvents !== 'undefined') {
            Roblox.FormEvents.SendValidationFailed("redeemPage", "redeemButton", "[Redacted]", error);
        }
    }
    
    function handleInvalidPin() {
        $("#busy").css("visibility", "hidden");
        showError(Roblox.GameCard.Resources.unrecognizedPin);
    }

    function activateFunCaptcha() {
        var funCaptchaSetting = {
            id: Roblox.CaptchaConstants.ids.gameCardRedeem,
            isActivated: false,
            cType: Roblox.CaptchaConstants.types.gameCardRedeem,
            successCb: function () {
                Roblox.GameCard.redeemCode();
                Roblox.FunCaptcha.dismissFunCaptchaModal();
            },
            errorCb: function () {
                Roblox.FunCaptcha.dismissFunCaptchaModal();
                showError(Roblox.GameCard.Resources.unexpectedError);
            },
            shownCb: Roblox.FunCaptcha.showFunCaptchaInModal,
            showInModal: true
        };
        Roblox.FunCaptcha.render(Roblox.CaptchaConstants.ids.gameCardRedeem, funCaptchaSetting);
    }
    function handleFailure(jqXHR, textStatus, errorThrown) {
        $("#busy").css("visibility", "hidden");
        if (jqXHR.responseJSON && jqXHR.responseJSON.errorMsg !== null && jqXHR.responseJSON.errorMsg !== "") {
            if (jqXHR.responseJSON.errorMsg === Roblox.GameCard.Resources.NeedCaptcha) {
                activateFunCaptcha();
            }
            showError(jqXHR.responseJSON.errorMsg);
        } else {
            showError(Roblox.GameCard.Resources.unexpectedError);
        }
    }

    function handleFailureViaCode(req) {
        $("#busy").css("visibility", "hidden");
        
        var messages = Roblox.GameCard.Resources;
        var errorMessage = messages.unexpectedError;
        if (req.responseJSON.errors || req.responseJSON.errors[0] || req.responseJSON.errors[0].code) {
            
            errorMessage = Roblox.GameCard.MessageMappings[req.responseJSON.errors[0].code] || messages.unexpectedError;
        }
        if (errorMessage === Roblox.GameCard.Resources.NeedCaptcha) {
            activateFunCaptcha();
        }
        else {
            showError(errorMessage);
        }
    }

    function handleSuccess(data) {
        $("#busy").css("visibility", "hidden");
        $("#busy").hide();
        if (data.errorMsg === "Captcha") {
            activateFunCaptcha();
            return;
        }
        if ((typeof data.errorMsg !== "undefined" && data.errorMsg == "") || (typeof data.error !== "undefined" && data.error == "")) {
            $("#pin").val("");
            $("#balance").html(data.balance);
            $("span.currency").html(data.balance);
            $("#SuccessMessage").html(data.successMsg);
            $("#SuccessMessageSubText").html(data.successSubText);
            $("#success").show();
            $("#buyStuff").show();
            if (typeof data.bonusMsg !== "undefined" && data.bonusMsg != "") {
                $("#Message").html(data.bonusMsg);
                $("#Message").show();
            } else {
                $("#Message").hide();
            }
            if (typeof data.callBack !== "undefined" && data.callback != "") {
                eval(data.callback);
            }
        } else {
            if (typeof data.errorMsg !== "undefined") {
                showError(data.errorMsg);
            } else if (typeof data.error !== "undefined") {
                showError(data.error);
            }
        }
        if ($.browser.msie) {
            forceRedraw($("#buyStuff"));
            forceRedraw($("#MoreInfo"));
        }
        $(document).trigger('GamecardSuccess');
    }

    function checkPINIsNumeric(pin) {
        if (pin.match(/^\d+$/)) {
            return true;
        }
        return false;
    }

    function handleXsollaBlackhawk(pin) {
        $.ajax({
            type: "POST",
            url: Roblox.GameCard.RedeemGamecardEndpoint,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ pinCode: pin }),
            dataType: "json",
            success: handleSuccess,
            error: handleFailureViaCode
        });
    }

    return {
        redeemCode: function (disallowRobuxRedemptions) {
            var pin = $("#pin").val().replace(/\./g, '').replace(/ /g, '');

            $("#busy").css("visibility", "visible");
            $("#busy").show();
            $("#success").hide();
            $("#error").hide();
            if ($.browser.msie) {
                forceRedraw($("#buyStuff"));
                forceRedraw($("#MoreInfo"));
            }
            if (window.location.href.indexOf('rixty') != -1) {
                if (!checkPINIsNumeric(pin)) {
                    handleInvalidPin();
                    return;
                }
                $.ajax({
                    type: "GET",
                    url: "/RixtyPin/RixtyPinHandler.ashx",
                    contentType: "application/json; charset=utf-8",
                    data: {
                        pin: pin
                    },
                    dataType: "json",
                    success: handleSuccess,
                    error: handleFailure
                });
            } else if (window.location.href.indexOf('promocode') != -1) {
                $.ajax({
                    type: "POST",
                    url: "/promocodes/redeem?code=" +pin,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: handleSuccess,
                    error: handleFailure
                });
            } else if (pin.length === 12 || pin.length === 15) {
                if (disallowRobuxRedemptions && pin.length === 15) {
                    $("#busy").css("visibility", "hidden");
                    showError("Please redeem this code at <a href=\"https://www.roblox.com/redeem\">roblox.com/redeem</a>");
                    return;
                }

                $.ajax(
                    {
                        type: "GET",
                        url: "/Upgrades/GiftCard.ashx",
                        contentType: "application/json; charset=utf-8",
                        data: { action: 'redeem', code: pin },
                        dataType: "json",
                        success: handleSuccess,
                        error: handleFailure
                    });
            } else if (pin.length === 10) {
                if (!checkPINIsNumeric(pin)) {
                    handleInvalidPin();
                    return;
                }
                var cachebuster = Math.floor(Math.random() * 9001);
                $.ajax(
                    {
                        type: "GET",
                        url: "/Gamecard/InCommHandler.ashx",
                        contentType: "application/json; charset=utf-8",
                        data: { pin: pin, cachebuster: cachebuster },
                        dataType: "json",
                        success: handleSuccess,
                        error: handleFailure
                    });
            
            } else if (pin.length === 16) {
                handleXsollaBlackhawk(pin);
            } else {
                handleInvalidPin();
            }
        }
    };
};