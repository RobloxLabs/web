; // ~/jS/Home/Home.js
$(function() {
    function n() {
        if ($("#txtStatusMessage").prop("disabled")) return !1;
        var i = $("#HomeContainer").data("update-status-url"),
            r = $("#txtStatusMessage").val(),
            n = $("#sendToFacebook").is(":checked"),
            t = {
                status: r,
                sendToFacebook: n
            };
        $("#shareButton").hide(), $("#loadingImage").show(), $.post(i, t, function(n) {
            n.success ? $("#txtStatusMessage").val(n.message) : $("#txtStatusMessage").val(""), $("#txtStatusMessage").blur(), $("#shareButton").show(), $("#loadingImage").hide()
        })
    }
    var t = $("#HomeContainer").data("facebook-share");
    $("#btnFacebookShare").click(function() {
        $.post(t, function(n) {
            $("#btnFacebookShare").removeClass(), n.success ? $("#facebookShareResult").addClass("status-confirm") : $("#facebookShareResult").addClass("status-error"), $("#facebookShareResult").text(n.message), $("#facebookShareResult").fadeIn().delay(5e3).fadeOut()
        })
    }), $("#HomeContainer *[data-retry-url]").loadRobloxThumbnails(), $("#shareButton").click(function() {
        n()
    }), $("#txtStatusMessage").keypress(function(t) {
        t.which == "13" && n()
    });
    $(document).on("GuttersHidden", function() {
        $("#LeftGutterAdContainer").hide(), $("#RightGutterAdContainer").hide()
    })
});