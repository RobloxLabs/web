$(document).on("click", "#logout-button", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(document).triggerHandler("Roblox.Logout");
    var elem = $(this);
    $.post(elem.attr('data-bind'), {}, function (data) {
        var url = Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/") : "/";
        window.location.href = url;
    });
});
