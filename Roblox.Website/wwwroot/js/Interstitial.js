$(function () {
    $('a.roblox-interstitial').on('click', function (event) {
        event.preventDefault();
        var currentUrlHost = window.location.host;
        var newUrl = $(this).attr('href');
        var newUrlHost = newUrl.split('/')[2];
        Roblox.GenericConfirmation.open({
            titleText: "Leaving Roblox",
            bodyContent: "You are now leaving " + currentUrlHost + " to go to " + newUrlHost + ".<br /><br />Remember, other websites have their own Terms of Service and Privacy Policy.",
            acceptText: "Continue",
            declineText: "Return",
            acceptColor: Roblox.GenericConfirmation.blue,
            declineColor: Roblox.GenericConfirmation.gray,
            onAccept: function () { document.location.href = newUrl; },
            allowHtmlContentInBody: true,
            dismissable: true,
            xToCancel: true
        });
    });
});
