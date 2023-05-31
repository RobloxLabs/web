$(function() {
    function o(n) {
        for (var r = n.id, i = 0; i < t.length; i++)
            if (r.indexOf(t[i]) > -1) return !0;
        return !1
    }

    function s(t, i) {
        var r = i.get_postBackElement();
        o(r) === !0 && (n = !0)
    }

    function h() {
        n === !0 && (n = !1, Roblox.ThumbnailView.showSpinner(), Roblox.ThumbnailView.reloadThumbnail())
    }
    var t = ["AssetThumbnailHyperLink", "PlayerAvatarTypeR6", "PlayerAvatarTypeR15", "WearAccoutrementButton", "RemoveAccoutrementButton", "InvalidateThumbnails", "RefreshAllUpdatePanels2", "cmdSetScale"],
        n = !1,
        c = $("#UserAvatar").find("span[data-retry-url]");
    if (c.length > 0 && Roblox.ThumbnailView.showSpinner(), Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(s), Sys.WebForms.PageRequestManager.getInstance().add_endRequest(h), $(".AvatarPickerScale").length > 0) {
        function i(n) {
            return (n * 100).toFixed(0) + "%"
        }
        var r = $("#avatar-height .scale-input"),
            l = $("#avatar-height .scale-label"),
            u = $("#avatar-width .scale-input"),
            a = $("#avatar-width .scale-label");

        function f() {
            var n = r.val(),
                t = u.val();
            l.text(i(n)), a.text(i(t))
        }

        function v() {
            f();
            var n = r.val(),
                t = u.val();
            setScale(n, t)
        }

        function e() {
            var n = $(".playerAvatarType.selected > input").val(),
                t = n === "PlayerAvatarTypeR15";
            t ? ($(".scale-input").removeAttr("disabled"), $(".scale-holder").removeClass("disabled")) : ($(".scale-input").attr("disabled", "true"), $(".scale-holder").addClass("disabled"))
        }
        e(), $(".scale-input").change(v);
        $(".scale-input").on("input", f);
        $(document).on("click", ".playerAvatarType", e)
    }
});