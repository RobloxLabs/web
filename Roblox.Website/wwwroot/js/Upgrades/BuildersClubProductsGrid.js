$(function () {
    $("a.product-button").click(function () {

        var selectedProductId = $(this).data("pid");
        var isAuth = $("#UserDataInfo").attr("data-auth");
        var context = "membershipPage";

        if (Roblox.FormEvents) {
            Roblox.FormEvents.SendInteractionFocus(context, "selectedProductId_" + selectedProductId);
        }
        // Not logged in, send to login
        if (isAuth == "false") {
            window.location.href = Roblox.Endpoints.getAbsoluteUrl("/NewLogin?ReturnUrl=") + encodeURIComponent(location.pathname + location.search);
        } else {
            // To the payment page!
            window.location.href = Roblox.Endpoints.getAbsoluteUrl("/Upgrades/purchase?ap=") + selectedProductId;
        }
    });

});
