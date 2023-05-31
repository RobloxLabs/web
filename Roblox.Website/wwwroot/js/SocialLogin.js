var Roblox = Roblox || {};

if (typeof (Roblox.SocialLogin) === 'undefined') {
    Roblox.SocialLogin = new function () {
        function updateLoginStatus() {
            gigya.socialize.getUserInfo({
                callback: callLogin
            });
        }

        function callLogin(userInfo) {
            var loginUrl = $('#SocialIdentitiesInformation').data('rbx-login');
            $.ajax({
                url: loginUrl,
                method: "POST",
                data: { currentUid: userInfo.UID },
                success: showConnectionsUi,
                error: hideConnectionsUi
            });
        }

        function hideConnectionsUi() {
            $('.connect-button[data-rbx-provider]').each(function () {
                var provider = $(this).data('rbx-provider');
                var container = $('#connect-' + provider);
                container.text("Sorry, an error occurred. Please try again later.");
            });
        }

        function showConnectionsUi() {
            gigya.socialize.getUserInfo({
                callback: populateConnectionsUi
            });
        }

        function populateConnectionsUi(evt) {
            var pageProviders = [];
            $('.connect-button[data-rbx-provider]').each(function () {
                pageProviders.push($(this.valueOf()).data('rbx-provider'));
            });
            //Connected providers with gigya will be covered here
            $(pageProviders).each(function () {
                var provider = this.valueOf();
                var containerId = "connect-" + provider;
                if (evt.user.identities.hasOwnProperty(provider))
                {
                    //Identities here are for connected providers 
                    $('#' + containerId + ' .connect-button').hide();
                    $('#' + containerId + ' .nickname').text(evt.user.identities[provider].nickname);
                    $('#' + containerId + ' .disconnect-link').html("Disconnect");

                    if (provider === "facebook" && $("#FacebookConnectCard").length) {
                        //This would only run on Home page
                        $("#FacebookConnectCard p").html("You've successfully connected as: <b>" + evt.user.nickname + "</b>");
                        $("#FacebookConnectCard #connect-facebook").hide();
                        $("#FacebookConnectCard").fadeOut(5000);
                    }
                } else {
                    $('#' + containerId + ' .nickname').html("");
                    $('#' + containerId + ' .disconnect-link').html("");
                    $('#' + containerId + ' .connect-button').show();
                }
            });
        }

        function addConnection(provider) {
            gigya.socialize.addConnection({
                provider: provider, callback: function () {
                    var updateUrl = $('#SocialIdentitiesInformation').data('rbx-update');
                    var statusBarId = 'socialStatusBar';
                    $.ajax({
                        url: updateUrl,
                        method: "POST",
                        success: function () {
                            showConnectionsUi();
                        },
                        error: function(data) {
                            $('#' + statusBarId).html(JSON.parse(data.responseText).message);
                            $('#' + statusBarId).show().delay(5000).fadeOut(1000);
                        }
                    });
                }
            });
        }

        function removeConnection(provider) {
            var disconnectUrl = $('#SocialIdentitiesInformation').data('rbx-disconnect');
            var statusBarId = 'socialStatusBar';
            $.ajax({
                url: disconnectUrl,
                method: "POST",
                data: { provider: provider },
                success: function() {
                    showConnectionsUi();
                },
                error: function (data) {
                    $('#' + statusBarId).html(JSON.parse(data.responseText).message);
                    $('#' + statusBarId).show().delay(5000).fadeOut(1000);
                }
            });
        }

        function login(provider, displayMode) {
            var returnUrl = $('#SocialIdentitiesInformation').data('rbx-login-redirect-url');

            if (typeof (returnUrl) === 'undefined') {
                return;
            }
            var fullUrl = "https://" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + returnUrl;
            var params = {
                provider: provider,
                authFlow: displayMode,
                redirectMethod: "post",
                redirectURL: fullUrl
            };

            gigya.socialize.login(params);
        }        

        return {
            updateLoginStatus: updateLoginStatus,
            showConnectionsUi: showConnectionsUi,
            addConnection: addConnection,
            removeConnection: removeConnection,
            login: login
        };        
    }();
}

$(function () {
    var socialLoginSelector = ".social-login";
    var socialIdentitiesInformationSelector = "#SocialIdentitiesInformation";

    if (typeof ($('#SocialIdentitiesInformation').data('user-is-authenticated')) != "undefined") {
        Roblox.SocialLogin.updateLoginStatus();
    }

    $('.connect-button').click(function () {
        Roblox.SocialLogin.addConnection($(this).data('rbx-provider'));
    });

    $('.disconnect-link').click(function () {
        Roblox.SocialLogin.removeConnection($(this).data('rbx-provider'));
    });

    $('body').on('click', socialLoginSelector, function (event) {
        var socialIdentitiesInformationElement = $(socialIdentitiesInformationSelector);
        var context = socialIdentitiesInformationElement.data('context');
        var fbButtonName = "fbLoginSubmit";

        if (Roblox.FormEvents && context) {
            Roblox.FormEvents.SendInteractionClick(context, fbButtonName);
        }

        if (typeof (socialIdentitiesInformationElement.data('force-use-redirect')) !== "undefined") {
            Roblox.SocialLogin.login($(this).data('rbx-provider'), "redirect");
        } else {
            Roblox.SocialLogin.login($(this).data('rbx-provider'), "popup");
        }

        event.preventDefault();
    });
});