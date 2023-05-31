Roblox = Roblox || {};

if (typeof Roblox.UpsellAdModal === "undefined") {
    Roblox.UpsellAdModal = function() {
        var open = function() {
            var options = {
                titleText: Roblox.UpsellAdModal.Resources.title,
                bodyContent: Roblox.UpsellAdModal.Resources.body,
                footerText: "",
                overlayClose: true,
                escClose: true,
                acceptText: Roblox.UpsellAdModal.Resources.accept,
                declineText: Roblox.UpsellAdModal.Resources.decline,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: function () { window.location.href = '/premium/membership'; },
                imageUrl: '/images/BuildersClub-110x110_small.png'
            };

            Roblox.GenericConfirmation.open(
                options
            );
        };

        return {
            open: open
        };
    } ();
}

$(function () {
    $('a.UpsellAdButton').click(function () {
        Roblox.UpsellAdModal.open();
        return false;
    });
});