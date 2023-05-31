var Roblox = Roblox || {};

if (typeof Roblox.Plugins === "undefined") {
    Roblox.Plugins = {};
}

Roblox.Plugins.Init = function () {

    var itemPurchaseAjaxData = $("#ItemPurchaseAjaxData");
    var isEconomyApiEnabled = (itemPurchaseAjaxData.attr('data-is-economy-api-enabled') === "True");

    var intl = new Roblox.Intl();
    var pluginsResources = Roblox.Lang.PluginsResources;

    function init() {
        var installButtons = $('.InstallButton');

        if (Roblox.Client && Roblox.Client.isIDE()) {
            // In Studio, Install button does actual installation
            installButtons.each(function (index, htmlElem) {
                var btn = $(htmlElem);

                btn.off();

                if (!btn.hasClass('btn-disabled-primary')) {
                    btn.click(function () {
                        installPlugin(htmlElem);
                        return false;
                    });
                }
            });

            checkInstalledPlugins();
            $(".btn-disabled-primary").removeClass("Button").tipsy({ gravity: 's' }).attr("href", "javascript: return false;");
        }
        else {
            // In browser, Install button just opens Studio
            installButtons.each(function (index, htmlElem) {
                var btn = $(htmlElem);

                btn.off();

                if (!btn.hasClass('btn-disabled-primary')) {
                    btn.click(function () {
                        openPluginInStudio(htmlElem);
                    });
                }
            });
        }
    }

    function redirectToLogin() {
        window.location.href = Roblox.Endpoints.getAbsoluteUrl("/newlogin?returnUrl=" + encodeURIComponent(location.href));
    }

    function checkInstalledPlugins() {
        var reinstallText = pluginsResources["Label.Reinstall"];
        var updateText = pluginsResources["Label.UpdateText"];
        var installButton = $('.InstallButton');
        if (installButton.is(":visible")) {
            var installedPlugins = JSON.parse(window.external.GetInstalledPlugins());

            //json logic, check to see if the plugin is in the list. If so, make the button say reinstall or update
            if (installedPlugins.hasOwnProperty(installButton.data('item-id'))) {
                var assetVersion = installedPlugins[installButton.data('item-id')].AssetVersion;
                if (assetVersion != "undefined" && assetVersion < installButton.data('item-version-id')) {
                    installButton.text(updateText);
                    installButton.unbind();
                    installButton.removeClass('InstallButton').addClass('UpdateButton');
                    $('.PluginMessageContainer').show();
                    $('.UpdateButton').click(function () {
                        var htmlElem = $(this);
                        if (!htmlElem.hasClass('btn-disabled-primary')) {
                            updatePlugin(htmlElem);
                        }
                        return false;
                    });
                } else {
                    installButton.text(reinstallText);
                    installButton.unbind();
                    installButton.removeClass('InstallButton').addClass('ReinstallButton');
                    $('.ReinstallButton').click(function () {
                        var htmlElem = $(this);
                        if (!htmlElem.hasClass('btn-disabled-primary')) {
                            reinstallPlugin(htmlElem);
                        }
                        return false;
                    });
                }
            }
        }
    }

    function openPluginInStudio(elem) {
        var target = $(elem);

        if (target.hasClass('btn-disabled-primary')) {
            return;
        }

        if (target.data('authenticateduser-isnull') === "True") {
            redirectToLogin();
            return;
        }

        // In browser, Install button for plugin is enabled only when Studio can be launched via
        // protocol handler. See Item.cshtml.
        Roblox.GameLauncher.openPluginInStudio(target.data("item-id"));
    }

    function installPlugin(elem) {

        showProcessingModal("InstallingPluginView");
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        if (target.data('authenticateduser-isnull') === "True") {
            redirectToLogin();
            return;
        }

        $.ajax({
            type: "POST",
            url: target.data('install-url'),
            success: function () {
                window.external.PluginInstallComplete.connect(pluginInstallComplete);
                window.external.InstallPlugin(target.data('item-id'), target.data('item-version-id'));
            },
            error: function () {
                pluginInstallComplete(false);
            }
        });
    }

    function pluginInstallComplete(success) {
        $.modal.close(".InstallingPluginView");
        if (success) {
            var target = $('.InstallButton');
            if (target.length == 0) {
                target = $('.ReinstallButton');
            }
            takePlugin(target);
            Roblox.Dialog.open({
                titleText: pluginsResources["Label.SuccessTitle"],
                bodyContent: intl.f(pluginsResources["Label.SuccessBody"], { item: target.data('item-name') }),
                onAccept: function () {
                    window.location.reload();
                },
                acceptColor: Roblox.Dialog.blue,
                acceptText: pluginsResources["Label.Ok"],
                declineColor: Roblox.Dialog.none,
                dismissable: false
            });
        } else {
            Roblox.Dialog.open({
                titleText: pluginsResources["Label.ErrorTitle"],
                bodyContent: pluginsResources["Label.ErrorBody"],
                imageUrl: Roblox.Plugins.Resources.alertImageUrl,
                acceptColor: Roblox.Dialog.blue,
                acceptText: pluginsResources["Label.Ok"],
                declineColor: Roblox.Dialog.none,
                dismissable: false
            });
        }
    }

    function pluginUpdateComplete(success) {
        $.modal.close(".UpdatingPluginView");
        if (success) {
            var target = $('.UpdateButton');
            takePlugin(target);
            Roblox.Dialog.open({
                titleText: pluginsResources["Label.UpdateSuccessTitle"],
                bodyContent: intl.f(pluginsResources["Label.UpdateSuccessBody"], { item: target.data('item-name') }),
                onAccept: function () {
                    window.location.reload();
                },
                acceptColor: Roblox.Dialog.blue,
                acceptText: pluginsResources["Label.Ok"],
                declineColor: Roblox.Dialog.none,
                dismissable: false
            });
        } else {
            Roblox.Dialog.open({
                titleText: pluginsResources["Label.UpdateErrorTitle"],
                bodyContent: pluginsResources["Label.UpdateErrorBody"],
                imageUrl: Roblox.Plugins.Resources.alertImageUrl,
                acceptColor: Roblox.Dialog.blue,
                acceptText: pluginsResources["Label.Ok"],
                declineColor: Roblox.Dialog.none,
                dismissable: false
            });
        }
    }

    function takePlugin(target) {
        var productID = target.attr('data-product-id');
        var expPrice = parseInt(target.attr('data-expected-price'));
        var expCurrency = target.attr('data-expected-currency');
        var expPromoId = target.attr('data-placeproductpromotion-id');
        var expSellerId = target.attr('data-expected-seller-id');
        var userAssetID = target.attr('data-userasset-id');

        if (isEconomyApiEnabled) {
            var purchaseUrl = Roblox.EnvironmentUrls.economyApi + "/v1/purchases/products/" + productID;

            var params = {"expectedCurrency": expCurrency, "expectedPrice": expPrice, "expectedSellerId": expSellerId};

            if (expPromoId) {
                params.expectedPromoId = expPromoId;
            }

            if (userAssetID) {
                params.userAssetId = userAssetID;
            }

            $.ajax({
                type: "POST",
                url: purchaseUrl,
                data: JSON.stringify(params),
                processData: false,
                contentType: "application/json; charset=utf-8"
            }); //we don't care if we succeed or not
        } else {
            $.ajax({
                type: "POST",
                url: "/API/Item.ashx?rqtype=purchase&productID=" + productID +
                    "&expectedCurrency=" + expCurrency +
                    "&expectedPrice=" + expPrice +
                    (expPromoId === undefined ? "" : "&expectedPromoID=" + expPromoId) +
                    "&expectedSellerID=" + expSellerId +
                    (userAssetID === undefined ? "" : "&userAssetID=" + userAssetID),
                contentType: "application/json; charset=utf-8"
            }); //we don't care if we succeed or not
        }
    }

    function reinstallPlugin(elem) {
        showProcessingModal("InstallingPluginView");
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        if (target.data('authenticateduser-isnull') === "True") {
            redirectToLogin();
            return;
        }

        $.ajax({
            type: "POST",
            url: target.data('install-url'),
            success: function () {
                window.external.PluginInstallComplete.connect(pluginInstallComplete);
                window.external.InstallPlugin(target.data('item-id'), target.data('item-version-id'));
            },
            error: function () {
                pluginInstallComplete(false);
            }
        });
    }

    function updatePlugin(elem) {
        showProcessingModal("UpdatingPluginView");
        var target = $(elem);
        if (target.hasClass('btn-disabled-primary'))
            return;

        if (target.data('authenticateduser-isnull') === "True") {
            redirectToLogin();
            return;
        }

        $.ajax({
            type: "POST",
            url: target.data('install-url'),
            success: function () {
                window.external.PluginInstallComplete.connect(pluginUpdateComplete);
                window.external.InstallPlugin(target.data('item-id'), target.data('item-version-id'));
            },
            error: function () {
                pluginUpdateComplete(false);
            }
        });
    }

    function showProcessingModal(closeClass) {
        var modalProperties = { overlayClose: false, opacity: 80, overlayCss: { backgroundColor: "#000" }, escClose: false };

        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }

        $("#" + closeClass).modal(modalProperties);
    }

    return {
        init: init,
        redirectToLogin: redirectToLogin,
        pluginUpdateComplete: pluginUpdateComplete,
        pluginInstallComplete: pluginInstallComplete
    };
}();

$(document).ready(function () {
    Roblox.Plugins.Init.init();
});