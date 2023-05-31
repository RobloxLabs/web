var Roblox = Roblox || {};

/*
purchaseConfirmationCallback(obj) - function is run after purchase. Takes in the same obj as openPurchaseConfirmationView
*/

Roblox.ItemPurchase = function (purchaseConfirmationCallback, purchaseCallback, shouldShowFeedbackBanner) {

    if (!(this instanceof Roblox.ItemPurchase)) {
        return new Roblox.ItemPurchase(purchaseConfirmationCallback, purchaseCallback, shouldShowFeedbackBanner);
    }

    purchaseCallback = (typeof purchaseCallback === 'undefined') ? false : purchaseCallback;

    var intl = new Roblox.Intl();
    var langKeys = Roblox.Lang.PurchaseDialogResources;
    var itemPurchaseAjaxData = $("#ItemPurchaseAjaxData");
    var authenticatedUserIsNull = itemPurchaseAjaxData.attr('data-authenticateduser-isnull');
    var userBalanceRobux = itemPurchaseAjaxData.attr('data-user-balance-robux');
    var userBC = itemPurchaseAjaxData.attr('data-user-bc');
    var alertImageUrl = itemPurchaseAjaxData.attr('data-alerturl');
    var inSufficentFundsurl = itemPurchaseAjaxData.attr('data-inSufficentFundsurl');
    var isBcOnlyRequirementEnabled = (itemPurchaseAjaxData.attr('data-is-bc-only-requirement-enabled'));
    var isPlace = false;
    var hasCurrencyOperationError = (itemPurchaseAjaxData.attr("data-has-currency-service-error") === "True");
    var currencyOperationErrorMessage = itemPurchaseAjaxData.attr("data-currency-service-error-message");
    var isModalFooterCenteredEnabled = (itemPurchaseAjaxData.attr("data-is-modal-footer-centered-enabled") === "True");
    var robloxName = "Roblox";
    var purchaseTypes = {
        buy: "buy",
        rent: "rent",
        get: "get"
    }

    var twoStepVerificationFlow = new Roblox.TwoStepVerificationFlow("RobuxSpend");
    var paymentFlowAnalyticsService = CoreRobloxUtilities.paymentFlowAnalyticsService;

    function addCommasToMoney(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
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
        window.location.href = Roblox.Endpoints.getAbsoluteUrl("/login/Default.aspx") + "?ReturnUrl=" + encodeURIComponent(location.pathname + location.search);
    }

    function formatSellerName(name) {
        if (name.toLowerCase() === robloxName.toLowerCase()) {
            return robloxName;
        }
        return name;
    }

    function getAssetAcquiredAnalyticsVariables(itemId) {
        if (!Roblox) {
            return null
        }

        var userId = Roblox.CurrentUser ? Roblox.CurrentUser.userId : null;

        var urlParametersObject = Roblox.UrlParser.getParametersAsObject();

        return {
            assetId: itemId,
            category: urlParametersObject["Category"],
            creatorId: urlParametersObject["CreatorId"],
            genre: urlParametersObject["GenreCsv"],
            page: urlParametersObject["Page"],
            position: urlParametersObject["Position"],
            searchKeyword: urlParametersObject["SearchKeyword"],
            sortAggregation: urlParametersObject["SortAggregation"],
            sortType: urlParametersObject["SortType"],
            userId: userId,
            searchId: urlParametersObject["SearchId"],
        }
    }

    function purchaseItem(elem, CssClass) {
        var target = $(elem);
        if (target.attr('data-modal-field-validation-required') === 'true') {
            // Don't close the purchase verification modal
            CssClass = "";
        }
        Roblox.Dialog.toggleProcessing(true);

        if (target.hasClass('btn-disabled-primary'))
            return;

        var productID = target.attr('data-product-id');
        var expPrice = parseInt(target.attr('data-expected-price'));
        var expCurrency = target.attr('data-expected-currency');
        var expPromoId = target.attr('data-placeproductpromotion-id');
        var expSellerId = target.attr('data-expected-seller-id');
        var userAssetID = target.attr('data-userasset-id');
        var context = Roblox.MetaDataValues && Roblox.MetaDataValues.getPageName() || "";
        var isLibrary = context == "LibraryItem";
        var passProductPurchasingApiUrl = Roblox.EnvironmentUrls.passProductPurchasingApi + "/v1/products/" + productID + "/purchase";
        var bundlesProductPurchasingApiUrl = Roblox.EnvironmentUrls.bundlesProductPurchasingApi + "/v1/products/" + productID + "/purchase";
        var economyApiUrl = Roblox.EnvironmentUrls.economyApi + "/v1/purchases/products/" + productID;

        if (purchaseCallback) {
            return purchaseCallback({
                productId: productID,
                expectedPrice: expPrice,
                expectedCurrency: expCurrency,
                expectedPromoId: expPromoId,
                expectedSellerId: expSellerId,
                userAssetId: userAssetID
            });
        }

        var params = { "expectedCurrency": parseInt(expCurrency), "expectedPrice": parseInt(expPrice), "expectedSellerId": parseInt(expSellerId) };

        if (expPromoId) {
            params.expectedPromoId = parseInt(expPromoId);
        }

        if (userAssetID) {
            params.userAssetId = parseInt(userAssetID);
        }

        var purchaseWithUrl = function (urlString) {
            $.ajax({
                type: "POST",
                url: urlString,
                data: JSON.stringify(params),
                cache: false,
                processData: false,
                contentType: "application/json; charset=utf-8",
                success: function (msg) {
                    if (msg.statusCode === 500) {
                        Roblox.Dialog.toggleProcessing(false, CssClass);
                        if (msg.showDivID === undefined) {
                            msg.showDivID = msg.showDivId;
                        }
                        if (msg.AssetID === undefined) {
                            msg.AssetID = msg.assetId;
                        }
                        openErrorView(msg);
                    } else {
                        Roblox.Dialog.toggleProcessing(false, CssClass);

                        if (isLibrary && Roblox && Roblox.EventStream && Roblox.UrlParser) {
                            var obj = getAssetAcquiredAnalyticsVariables(msg.assetId);
                            Roblox.EventStream.SendEventWithTarget("LibraryAssetAcquired", "Marketplace", obj, Roblox.EventStream.TargetTypes.WWW);
                        }

                        if (shouldShowFeedbackBanner) {
                            showSuccessBanner();
                        } else {
                            msg = {
                                AssetId: msg.assetId,
                                AssetIsWearable: msg.assetIsWearable,
                                AssetName: msg.assetName,
                                AssetType: msg.assetType,
                                AssetTypeDisplayName: msg.assetTypeDisplayName,
                                Currency: msg.currency,
                                IsMultiPrivateSale: msg.isMultiPrivateSale,
                                Price: msg.price,
                                ProductId: msg.productId,
                                Purchased: msg.purchased,
                                Reason: msg.reason,
                                SellerName: msg.sellerName,
                                TransactionVerb: msg.transactionVerb,
                            }
                            openPurchaseConfirmationView(msg);
                        }
                    }
                },
                error: function (msg) {
                    Roblox.Dialog.toggleProcessing(false, CssClass);
                    $.modal.close(".ProcessingView");
                    if (msg.responseText === "Bad Request") {
                        Roblox.Dialog.open({
                            titleText: langKeys["Heading.ErrorOccured"],
                            bodyContent: langKeys["Message.PurchasingUnavailable"],
                            imageUrl: alertImageUrl,
                            acceptText: langKeys["Action.Ok"],
                            acceptColor: Roblox.Dialog.white,
                            declineColor: Roblox.Dialog.none,
                            dismissable: true,
                            allowHtmlContentInBody: true
                        });
                    } else {
                        var errorObj = $.parseJSON(msg.responseText);
                        openErrorView(errorObj);
                    }
                }
            });
        };

        $.ajax({
            type: "GET",
            url: Roblox.EnvironmentUrls.economyApi + "/v2/metadata/nextgen-purchase-status",
            success: function (data) {
                // TODO: cleanup metadata flag https://jira.rbx.com/browse/VP-3825
                if (data.isNextGenPassProductPurchasingEnabled && (target.attr('data-asset-type') === "Game Pass")) {
                    purchaseWithUrl(passProductPurchasingApiUrl);
                } else if (data.isNextGenBundlesProductPurchasingEnabled && (target.attr('data-asset-type') === "Package")) {
                    purchaseWithUrl(bundlesProductPurchasingApiUrl);
                } else {
                    purchaseWithUrl(economyApiUrl);
                }
            },
            error: function(data) {
                purchaseWithUrl(economyApiUrl);
            }
        });
    }

    function startPaymentFlowAndSendModalEvent(targetData) {
      if (paymentFlowAnalyticsService && targetData) {
        paymentFlowAnalyticsService.startRobuxUpsellFlow(
          targetData.assetType,
          !!targetData.userassetId,
          false,
          false
        );
        paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
          paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT.WEB_CATALOG_ROBUX_UPSELL,
          true,
          paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBUX_UPSELL,
          paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.VIEW_SHOWN
        );
      }
    }

  function onInsufficientFundsViewCancel() {
    if (paymentFlowAnalyticsService) {
      paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
        paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT.WEB_CATALOG_ROBUX_UPSELL,
        true,
        paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBUX_UPSELL,
        paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
        paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.CANCEL
      );
    }
  }

    function showInsufficientFundsView(errorObj) {
      startPaymentFlowAndSendModalEvent(errorObj.targetData);
      var robuxNeeded = "<span class='icon-robux-16x16'></span><span class='text-robux'>" + Roblox.NumberFormatting.commas(errorObj.shortfallPrice) + "</span>";
      Roblox.Dialog.open({
        titleText: langKeys["Heading.InsufficientFunds"],
        bodyContent: intl.f(langKeys["Message.InsufficientFunds"], { robux: robuxNeeded }),
        declineText: langKeys["Action.Cancel"],
        acceptText: langKeys["Action.BuyRobux"],
        acceptColor: Roblox.Dialog.green,
        onAccept: function () {
          if (paymentFlowAnalyticsService && errorObj.targetData) {
            paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
              paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT.WEB_CATALOG_ROBUX_UPSELL,
              true,
              paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBUX_UPSELL,
              paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
              paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.BUY_ROBUX
            );
          }
          window.location = Roblox.Endpoints.getAbsoluteUrl("/Upgrades/Robux.aspx") + "?ctx=" + errorObj.source;
          return false; //return false is needed to keep the dialog open while being redirected
        },
        onCancel: onInsufficientFundsViewCancel,
        onDecline: onInsufficientFundsViewCancel,
        imageUrl: inSufficentFundsurl,
        allowHtmlContentInBody: true,
        allowHtmlContentInFooter: false,
        fieldValidationRequired: true,
        dismissable: true,
        xToCancel: true
      });
    }

    function openErrorView(errorObj) {
        if (errorObj.showDivID === "TransactionFailureView") {
            Roblox.Dialog.open({
                titleText: errorObj.title,
                bodyContent: errorObj.errorMsg,
                imageUrl: alertImageUrl,
                acceptText: langKeys["Action.Ok"],
                acceptColor: Roblox.Dialog.white,
                declineColor: Roblox.Dialog.none,
                dismissable: true,
                allowHtmlContentInBody: true
            });
        } else if (errorObj.showDivID === "InsufficientFundsView") {
            if (Roblox.ItemPurchaseUpsellService && Roblox.ItemPurchaseUpsellService.showExceedLargestInsufficientRobuxModal) {
              Roblox.ItemPurchaseUpsellService.showExceedLargestInsufficientRobuxModal(
                errorObj.shortfallPrice,
                errorObj.targetData,
                function () {
                  showInsufficientFundsView(errorObj);
                }
              );
            } else {
              showInsufficientFundsView(errorObj);
            }
        } else if (errorObj.showDivID === "PriceChangedView") {
            var elem;

            if ('targetSelector' in errorObj) {
                elem = $(errorObj.targetSelector)
            } else {
                elem = $('.PurchaseButton[data-item-id=' + errorObj.AssetID + '][data-expected-currency=' +
                    errorObj.expectedCurrency + '][data-expected-price=' + errorObj.expectedPrice + ']');
            }

            var acceptPurchase = function () {
                elem.attr('data-expected-price', errorObj.currentPrice);
                elem.attr('data-expected-currency', errorObj.currentCurrency);
                purchaseItem(elem, 'PurchaseVerificationView');
            };

            var robuxBefore = "<span class='icon-robux-gray-16x16'></span>" + errorObj.expectedPrice;
            var robuxAfter = "<span class='icon-robux-gray-16x16'></span>" + errorObj.currentPrice;
            var robuxBalance = "<span class='icon-robux-gray-16x16'></span>" + errorObj.balanceAfterSale;

            Roblox.Dialog.open({
                titleText: langKeys["Heading.PriceChanged"],
                bodyContent: intl.f(langKeys["Message.PriceChanged"], { robuxBefore: robuxBefore, robuxAfter: robuxAfter }),
                acceptText: langKeys["Action.BuyNow"],
                acceptColor: Roblox.Dialog.green,
                onAccept: acceptPurchase,
                declineText: langKeys["Action.Cancel"],
                footerText: intl.f(langKeys["Message.BalanceAfter"], { robuxBalance: robuxBalance }),
                allowHtmlContentInBody: true,
                allowHtmlContentInFooter: true,
                dismissable: true,
                checkboxAgreementText: langKeys["Label.AgreeAndPay"],
                checkboxAgreementRequired: true
            });

        } else if (errorObj.showDivID === "TwoStepVerificationRequiredView") {
            twoStepVerificationFlow.start();
        }
    }

    function openPurchaseVerificationView(elem, source) {
        source = typeof source !== 'undefined' ? source : 'item';
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        if (hasCurrencyOperationError) {
            openErrorView({
                showDivID: "TransactionFailureView",
                title: "Error",
                errorMsg: currencyOperationErrorMessage
            });
            return;
        }

        if (isBcOnlyRequirementEnabled === "True") {
            var bcRequirement = target.attr('data-bc-requirement');
            if (bcRequirement > userBC && authenticatedUserIsNull === "False") {
                showBCOnlyModal("BCOnlyModal");
                return;
            }
        }

        var itemNameAttr = target.attr('data-item-name');
        var assetName = itemNameAttr ? itemNameAttr.escapeHTML() : "";
        var expPrice = parseInt(target.attr('data-expected-price'));
        var expCurrency = target.attr('data-expected-currency');
        var sellerName = formatSellerName(target.attr('data-seller-name')).escapeHTML();
        var assetType = target.attr('data-asset-type');
        var assetTypeDisplayName = target.attr('data-asset-type-display-name');
        if (assetType === 0 || assetType === '0') {
            assetType = target.attr('data-item-type');
        }
        var assetID = target.attr('data-item-id');
        var footerTextObj = $('#ItemPurchaseAjaxData').attr('data-footer-text');
        var overriddenFooterText = (footerTextObj == null) ? "" : footerTextObj;
        $('#ItemPurchaseAjaxData').attr('data-footer-text', null);
        isPlace = assetType == "Place";

        if (authenticatedUserIsNull === "True") {
            redirectToLogin();
            return;
        }
        var balanceAfter = parseInt(userBalanceRobux) - expPrice;

        var buyType = "";
        var purchaseTitleText = "";
        var messageText = "";
        var acceptButtonText = "";
        if (expPrice === 0) {
            buyType = purchaseTypes.get;
            purchaseTitleText = langKeys["Heading.GetItem"];
            acceptButtonText = langKeys["Action.GetNow"];
        } else {
            buyType = purchaseTypes.buy;
            purchaseTitleText = langKeys["Heading.BuyItem"];
            acceptButtonText = langKeys["Action.BuyNow"];
        }
        if (balanceAfter < 0) {
            var errorObj = {
                shortfallPrice: (0 - balanceAfter),
                currentCurrency: expCurrency,
                showDivID: "InsufficientFundsView",
                isPlace: isPlace,
                source: source,
                targetData: target.data()
            };
            if (Roblox.ItemPurchaseUpsellService) {
              var itemDetail = { expectedItemPrice: expPrice, assetName: assetName, buyButtonElementDataset: target.data() };
              Roblox.ItemPurchaseUpsellService.startItemUpsellProcess(errorObj, itemDetail, openErrorView);
            } else {
              openErrorView(errorObj);
            }
            return;
        }
        var itemUrl = $('#ItemPurchaseAjaxData').attr('data-imageurl');

        var currencyContent = "<span class='icon-robux-16x16'></span><span class='text-robux'>" + Roblox.NumberFormatting.commas(expPrice) + "</span>";
        var footerCurrencyText = "";
        footerCurrencyText += addCommasToMoney(balanceAfter);

        var acceptPurchase = function () {
            return purchaseItem(elem, 'PurchaseVerificationView');
        };

        var titleText = target.attr('data-purchase-title-text');
        titleText = titleText ? titleText : purchaseTitleText;

        var assetNameFormatted = "<span class='font-bold'>" + assetName + "</span>";
        var messagePrompt;
        var assetInfo = { assetName: assetNameFormatted, assetType: assetTypeDisplayName, seller: sellerName };
        if (expPrice === 0) {
            messagePrompt = isPlace ? "Message.PromptGetFreeAccess" : "Message.PromptGetFree";
            assetInfo.freeTextStart = "<span class='text-robux'>";
            assetInfo.freeTextEnd = "</span>";
        } else {
            messagePrompt = isPlace ? "Message.PromptBuyAccess" : "Message.PromptBuy";
            assetInfo.robux = currencyContent;
        }
        messageText = intl.f(langKeys[messagePrompt], assetInfo);

        var bodyContent = target.attr('data-purchase-body-content');
        var bodyContentI18N = messageText;
        bodyContent = bodyContent ? bodyContent.format(currencyContent) : bodyContentI18N;
        var fieldValidationRequired = (target.attr('data-modal-field-validation-required') === 'true');

        var buyAccessText = langKeys["Action.BuyAccess"];
        if (overriddenFooterText.length === 0) {
            footerCurrencyText = "<span class='icon-robux-gray-16x16'></span>" + footerCurrencyText;
        }
        var balanceText = intl.f(langKeys["Message.BalanceAfter"], { robuxBalance: footerCurrencyText });

        Roblox.Dialog.open({
            titleText: titleText,
            bodyContent: bodyContent,
            imageUrl: itemUrl,
            xToCancel: true,
            acceptText: isPlace ? buyAccessText : acceptButtonText,
            acceptColor: Roblox.Dialog.green,
            onAccept: acceptPurchase,
            declineText: langKeys["Action.Cancel"],
            footerText: overriddenFooterText.length === 0 ? balanceText : overriddenFooterText.format(footerCurrencyText),
            footerMiddleAligned: isModalFooterCenteredEnabled,
            allowHtmlContentInBody: true,
            allowHtmlContentInFooter: true,
            dismissable: true,
            fieldValidationRequired: fieldValidationRequired,
            cssClass: "need-padding",
            onOpenCallback: function () {
                $('.modal-confirmation .roblox-item-image').attr('data-item-id', assetID);
                Roblox.require('Widgets.ItemImage', function (item) {
                    item.load($('.modal-confirmation .roblox-item-image'));
                });

                if (Roblox.ModalEvents && target) {
                    var buttonType = target.attr('data-button-type');

                    if (buttonType) {
                        Roblox.ModalEvents.SendAssetPurchaseConfirmationShown("assetPurchaseConfirmation", buttonType);
                    }
                }
            }
        });
    }

    function showSuccessBanner() {
        var successBanner = $(".system-feedback .alert-success");

        if (successBanner.length > 0 && Roblox.BootstrapWidgets) {
            Roblox.BootstrapWidgets.ToggleSystemMessage(successBanner, 100, 1000);
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    }

    function openPurchaseConfirmationView(obj) {

        var currencyContent;
        if (obj.Price == 0) {
            var freeLabel = langKeys["Label.Free"];
            currencyContent = "<span class='text-robux'>" + freeLabel + "</span>";
        } else {
            currencyContent = "<span class='icon-robux-16x16'></span><span class='text-robux'>" + obj.Price + "</span>";
        }

        var itemUrl = $('#ItemPurchaseAjaxData').attr('data-imageurl');

        var continueShopping = function () {
            var continueShoppingUrl = $('#ItemPurchaseAjaxData').attr('data-continueshopping-url');
            if (continueShoppingUrl != undefined && continueShoppingUrl != "") {
                document.location.href = continueShoppingUrl;
            }
        };

        var customizeAvatar = function () {
            var customizeAvatarUrl = Roblox.Endpoints.getAbsoluteUrl("/my/avatar");
            if (customizeAvatarUrl != undefined && customizeAvatarUrl != "") {
                document.location.href = customizeAvatarUrl;
            }
        };

        var acceptText = "";
        var declineText = langKeys["Action.Continue"];
        var acceptColor = Roblox.Dialog.none;
        var acceptFunc;
        if (obj.AssetType === "Private Server") {
            acceptText = langKeys["Action.Configure"];
            declineText = langKeys["Action.NotNow"];
            acceptColor = Roblox.Dialog.blue;
            acceptFunc = continueShopping;
        } else if (obj.AssetIsWearable) {
            acceptText = langKeys["Action.Customize"];
            acceptColor = Roblox.Dialog.white;
            declineText = langKeys["Action.NotNow"];
            acceptFunc = customizeAvatar;
        }

        var assetName = "<span class='font-bold'>" + obj.AssetName.escapeHTML() + "</span>";
        var assetTypeDisplayName = obj.AssetTypeDisplayName ? obj.AssetTypeDisplayName : obj.AssetType;
        var assetInfo = { assetName: assetName, assetType: assetTypeDisplayName, seller: obj.SellerName.escapeHTML(), robux: currencyContent };
        var messagePrompt;
        if (obj.TransactionVerb === "bought") {
            messagePrompt = isPlace ? "Message.SuccessfullyBoughtAccess" : "Message.SuccessfullyBought";
        } else {
            messagePrompt = isPlace ? "Message.SuccessfullyAcquiredAccess" : "Message.SuccessfullyAcquired";
        }
        var bodyContent = intl.f(langKeys[messagePrompt], assetInfo);

        Roblox.Dialog.open({
            titleText: langKeys["Heading.PurchaseComplete"],
            bodyContent: bodyContent,
            imageUrl: itemUrl,
            acceptText: acceptText,
            declineText: declineText,
            xToCancel: true,
            onAccept: acceptFunc,
            onDecline: function () { window.location.reload(); },
            acceptColor: acceptColor,
            declineColor: Roblox.Dialog.white,
            allowHtmlContentInBody: true,
            dismissable: true,
            onOpenCallback: function () {
                $('.modal-confirmation .roblox-item-image').html('').attr('data-item-id', obj.AssetId);
                Roblox.require('Widgets.ItemImage',
                    function (item) {
                        item.load($('.modal-confirmation .roblox-item-image'));
                    });
            }
        });
        purchaseConfirmationCallback(obj);
    }

    return {
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

Roblox.ItemPurchase.ModalClose = function (popup) {
    $.modal.close('.' + popup);
};

Roblox.TwoStepVerificationFlow = function (actionType) {
    var path;
    var eventType;
    if (actionType === "RobuxSpend") {
        path = "spend-friction";
        eventType = "2svRobuxSpend";
    } else {
        path = "resale-friction";
        eventType = "2svResale";
    }

    var langKeys = Roblox.Lang.PurchaseDialogResources;
    var itemPurchaseAjaxData = $("#ItemPurchaseAjaxData");
    var alertImageUrl = itemPurchaseAjaxData.attr('data-alerturl');
    var twoStepChallengeToken = "";
    var numberOfFailedTwoStepVerificationChallengeAttempts = 0;

    var properties = {
        userId: Roblox.CurrentUser ? Roblox.CurrentUser.userId : null,
        challengeToken: "",
        verificationToken: "",
        code: "",
        actionType: actionType,
        supportPageUrl: Roblox.Endpoints.getAbsoluteUrl("/info/account-safety"),
        supportLink: ""
    }

    function renderTwoStepVerificationModal() {
        $.ajax({
            type: "POST",
            url: Roblox.EnvironmentUrls.economyApi + "/v2/" + path + "/two-step-verification/generate",
            success: function (challengeToken) {
                twoStepChallengeToken = challengeToken;

                Roblox.AccountIntegrityChallengeService.TwoStepVerification.renderChallenge({
                    containerId: '2sv-popup-container',
                    userId: properties.userId,
                    challengeId: challengeToken,
                    actionType: actionType,
                    renderInline: false,
                    shouldShowRememberDeviceCheckbox: false,
                    shouldDynamicallyLoadTranslationResources: false,
                    onChallengeCompleted: redeemWebviewVerificationChallenge,
                    onChallengeInvalidated: handleInvalidatedTwoStepVerificationChallenge,
                    onModalChallengeAbandoned: $.noop
                }
                ).catch(function () {
                    showErrorBanner();
                });
            },
            error: function () { showErrorBanner(); }
        });
    }

    function start() {
        var redirectToSettings = function () {
            window.location.href = Roblox.Endpoints.getAbsoluteUrl("/my/account#!/security");
        }

        var settingsRedirectModalProperties = {
            titleText: langKeys["Heading.TwoStepVerificationRequiredV3"],
            bodyContent: langKeys["Message.TwoStepVerificationRequiredV4"],
            imageUrl: alertImageUrl,
            acceptText: langKeys["Action.GoToSecurity"],
            acceptColor: Roblox.Dialog.green,
            onAccept: redirectToSettings,
            declineText: langKeys["Action.Cancel"],
            dismissable: true,
            allowHtmlContentInBody: true,
            onOpenCallback: function () {
                sendClickEvents();
            }
        }

        // If user does not have 2SV enabled, show the settings redirect modal. If user does have 2SV enabled, show the code input modal
        $.ajax({
            type: "GET",
            url: Roblox.EnvironmentUrls.twoStepVerificationApi + "/v1/users/" + properties.userId + "/configuration",
            success: function (result) {
                var isTwoStepVerificationEnabled = false;
                if (result && result.methods) {
                    for (var i = 0; i < result.methods.length; i++) {
                        if (result.methods[i].enabled) {
                            isTwoStepVerificationEnabled = true;
                            break;
                        }
                    }
                }
                if (isTwoStepVerificationEnabled === false) {
                    sendFrictionEvent("settingsRedirectModalTriggered");
                    Roblox.Dialog.open(settingsRedirectModalProperties);
                } else {
                    sendFrictionEvent("codeInputModalTriggered");
                    renderTwoStepVerificationModal();
                }
            },
            error: function () {
                sendFrictionEvent("settingsRedirectModalTriggered");
                Roblox.Dialog.open(settingsRedirectModalProperties); // on error, default to settings redirect modal
            }
        });
    }

    function showSuccessful2SVBanner() {
        $.modal.close();
        var successBanner = $(".system-feedback .alert-success");
        var successMessage = langKeys["Response.SuccessfulVerificationV2"];
        if (successBanner.length > 0 && Roblox.BootstrapWidgets) {
            Roblox.BootstrapWidgets.ToggleSystemMessage(successBanner, 100, 6000, successMessage);
        }
    }

    function showErrorBanner() {
        $.modal.close();
        var errorBanner = $(".system-feedback .alert-warning");
        var errorMessage = langKeys["Response.VerificationError"];
        if (errorBanner.length > 0 && Roblox.BootstrapWidgets) {
            Roblox.BootstrapWidgets.ToggleSystemMessage(errorBanner, 100, 6000, errorMessage);
        }
    }

    function redeemWebviewVerificationChallenge(tokenData) {
        var params = {
            "challengeToken": twoStepChallengeToken,
            "verificationToken": tokenData.verificationToken
        }

        $.ajax({
            type: "POST",
            url: Roblox.EnvironmentUrls.economyApi + "/v2/" + path + "/two-step-verification/redeem",
            data: params,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (result) {
                if (result) {
                    showSuccessful2SVBanner();
                } else {
                    showErrorBanner();
                }
            },
            error: function () {
                showErrorBanner();
            }
        });
    }

    function handleInvalidatedTwoStepVerificationChallenge() {
        var maxRetryAttempts = 3;
        // Allow the user to try again once if the session is invalidated. If this doesn't work don't show again.
        if (numberOfFailedTwoStepVerificationChallengeAttempts < maxRetryAttempts) {
            renderTwoStepVerificationModal();
        }
        numberOfFailedTwoStepVerificationChallengeAttempts += 1;
    };

    function sendFrictionEvent(eventName) {
        if (Roblox.EventStream) {
            Roblox.EventStream.SendEvent(eventName, eventType, {});
        }
    }

    function sendClickEvents() {
        $(".modal-btns #confirm-btn").click(function () {
            sendFrictionEvent("goToSecurity");
        });

        $(".modal-btns #decline-btn").click(function () {
            sendFrictionEvent("closeSettingsRedirectModal");
        });
    }

    return {
        start: start
    };
};
