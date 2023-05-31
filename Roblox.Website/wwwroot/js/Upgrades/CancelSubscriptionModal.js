Roblox = Roblox || {};

if (typeof Roblox.CancelSubscriptionModal === "undefined") {
    Roblox.CancelSubscriptionModal = function () {
        var open = function () {
            var options = {
                titleText: Roblox.CancelSubscriptionModal.Resources.title,
                bodyContent: Roblox.CancelSubscriptionModal.Resources.body,
                allowHtmlContentInBody: true,
                footerText: "",
                overlayClose: true,
                escClose: true,
                acceptText: Roblox.CancelSubscriptionModal.Resources.cancel,
                declineText: Roblox.CancelSubscriptionModal.Resources.dontCancel,
                acceptColor: Roblox.GenericConfirmation.gray,
                declineColor: Roblox.GenericConfirmation.green,
                onAccept: function () { $("#Message").hide(); Roblox.CancelSubscriptionModal.process(); },
                onDecline: function () { window.location.href = '/home'; },
                opacity: 80,
                overlayCss: { backgroundColor: "#000" }
            };
            Roblox.GenericConfirmation.open(
                options
            );

            if (Roblox.FormEvents) {
                Roblox.FormEvents.SendInteractionClick("confirmCancelRenewal", { pid: Roblox.CancelSubscriptionModal.Resources.premiumFeatureId });
            }
        };

        var process = function() {
            var url = Roblox.CancelSubscriptionModal.Resources.URL;
            var goHome = function() { window.location.href = "/my/account#!/billing"; };
            $.post(url, function(data) {
                if (data.success) {
                    var options = {
                        titleText: Roblox.CancelSubscriptionModal.Resources.cancelSuccessfulTitle,
                        bodyContent: Roblox.CancelSubscriptionModal.Resources.cancelSuccessfulBody,
                        acceptText: Roblox.CancelSubscriptionModal.Resources.ok,
                        acceptColor: Roblox.GenericConfirmation.blue,
                        declineColor: Roblox.GenericConfirmation.none,
                        onAccept: goHome,
                        allowHtmlContentInBody: true,
                        dismissable: false
                    };
                } else {
                    options = {
                        titleText: Roblox.CancelSubscriptionModal.Resources.cancelFailedTitle,
                        bodyContent: '<p class=\"CancelModalBody\">' + data.message + '</p>',
                        acceptText: Roblox.CancelSubscriptionModal.Resources.ok,
                        acceptColor: Roblox.GenericConfirmation.blue,
                        declineColor: Roblox.GenericConfirmation.none,
                        onAccept: goHome,
                        allowHtmlContentInBody: true,
                        dismissable: false
                    };
                }
                Roblox.GenericConfirmation.open(
                        options
                    );
            });

            if (Roblox.EventStream) {
                Roblox.EventStream.SendEventWithTarget("modalAction", "confirmCancelRenewal", { pid: Roblox.CancelSubscriptionModal.Resources.premiumFeatureId }, Roblox.EventStream.TargetTypes.WWW);
            }
        };

        return {
            open: open,
            process: process
        };
    } ();
}

$(function () {
    $('a.CancelSubscriptionButton').click(function () {
        Roblox.CancelSubscriptionModal.open();
        return false;
    });
});

