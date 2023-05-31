var Roblox = Roblox || {};

if (typeof Roblox.Plugins === "undefined") {
    Roblox.Plugins = {};
}

Roblox.Plugins.Manage = function () {

    var installedPlugins = [];

    var init = function () {
        var installedPluginJson = window.external.GetInstalledPlugins();

        var count = 0;

        if (installedPluginJson.length > 0) {
            installedPlugins = JSON.parse(window.external.GetInstalledPlugins());

            for (var pluginId in installedPlugins) {
                if (count >= 100) //artificial limit for now
                    break;
                buildPluginDisplay(pluginId, installedPlugins[pluginId].AssetVersion);
                count++;
            }
        }

        if (count == 0) {
            showNoPluginsMessage();
        }
    };

    var buildPluginDisplay = function (id, assetVersionId) {
        var newDiv = $('#assetId').clone();
        newDiv.attr('id', id);
        var toggle = newDiv.find('.switch');
        toggle.click(function (e) {
            e.preventDefault();
            var value;
            if ($(this).hasClass('active')) {
                $(this).removeClass('active').addClass('inactive');
                $(this).text('Inactive');
                value = false;
            } else {
                $(this).removeClass('inactive').addClass('active');
                $(this).text('Active');
                value = true;
            }
            togglePlugin(id, value);
        });
        if (installedPlugins[id].Enabled) {
            toggle.removeClass('inactive').addClass('active');
            toggle.text('Active');
        } else {
            toggle.removeClass('active').addClass('inactive');
            toggle.text('Inactive');
        }
        $('#assetId').after(newDiv);

        newDiv.find('.close-x').click(function (e) {
            e.preventDefault();
            var pluginTitle = newDiv.find('.plugin-title');
            if (pluginTitle.length > 0) {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.Plugins.Manage.Resources.removePluginTitle,
                    bodyContent: Roblox.Plugins.Manage.Resources.removePluginText.replace('{0}', pluginTitle.text().replace(/\$/g, "&#36;")),
                    acceptColor: Roblox.GenericConfirmation.blue,
                    acceptText: Roblox.Plugins.Manage.Resources.accept,
                    declineText: Roblox.Plugins.Manage.Resources.decline,
                    dismissable: false,
                    onAccept: function () {
                        removePlugin(newDiv);
                    }
                });
            }
        });

        //load the details for this asset
        $.ajax({
            type: 'GET',
            url: newDiv.data('thumbnail-url') + "?assetId=" + id,
            success: function (data) {
                newDiv.prepend(data);
                Roblox.Plugins.PluginInfo.init(newDiv.find('.more-less'));
                var latestAssetVersionId = newDiv.find('.asset-version-id').val();
                if (latestAssetVersionId > assetVersionId) {
                    var updateButton = newDiv.find('.update-button');
                    updateButton.click(function (e) {
                        e.preventDefault();
                        $(this).unbind('click');
                        $(this).addClass('btn-disabled-neutral');
                        $(this).text(Roblox.Plugins.Manage.Resources.updatingText);
                        window.external.PluginInstallComplete.connect(pluginUpdateComplete);
                        window.external.InstallPlugin(id, latestAssetVersionId);
                    });
                    newDiv.find('span.no-updates').hide();
                    newDiv.find('span.updates').css('display', 'inline-block').show();
                    updateButton.show();
                }
            }
        });

        newDiv.show();
    };

    var pluginUpdateComplete = function (success, id) {
        var pluginDiv = $('#' + id);
        var updateButton = pluginDiv.find('.update-button');
        if (success) {
            updateButton.removeClass('btn-disabled-neutral').addClass('btn-disabled-primary');
            updateButton.text(Roblox.Plugins.Manage.Resources.updatedText);
            pluginDiv.find('span.updates').hide();
        } else {
            updateButton.removeClass('btn-disabled-neutral');
            updateButton.text(Roblox.Plugins.Manage.Resources.updateText);
            updateButton.click(function (e) {
                e.preventDefault();
                $(this).unbind('click');
                $(this).addClass('btn-disabled-neutral');
                $(this).text(Roblox.Plugins.Manage.Resources.updatingText);
                window.external.PluginInstallComplete.connect(pluginUpdateComplete);
                window.external.InstallPlugin(id, pluginDiv.find('.asset-version-id').val());
            });
        }
    };

    var removePlugin = function (plugin) {
        delete installedPlugins[plugin.attr('id')];
        window.external.UninstallPlugin(plugin.attr('id'));
        plugin.fadeOut(600, function () {
            var confirmMessage = $('.error-bar').first().clone();
            confirmMessage.find('span').text(Roblox.Plugins.Manage.Resources.pluginRemoveSuccessText);
            plugin.after(confirmMessage);
            plugin.remove();
            confirmMessage.show();
            if ($.map(installedPlugins, function (n, i) { return i; }).length == 0) {
                showNoPluginsMessage();
            }
            setTimeout(function () {
                confirmMessage.fadeOut(1000, function () {
                    confirmMessage.text('');
                    confirmMessage.hide();
                    confirmMessage.remove();
                });
            }, 5000);
        });
    };

    var togglePlugin = function (pluginId, value) {
        window.external.SetPluginEnabled(pluginId, value);
        installedPlugins[pluginId].enabled = value;
    };

    var showNoPluginsMessage = function () {
        var noPluginMessage = $(document.createElement('span'));
        noPluginMessage.html(Roblox.Plugins.Manage.Resources.noPluginsFoundText);
        $('#assetId').after(noPluginMessage);
        noPluginMessage.show();
    };

    return {
        init: init,
        removePlugin: removePlugin,
        togglePlugin: togglePlugin
    };
} ();
