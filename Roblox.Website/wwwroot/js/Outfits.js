typeof Roblox == "undefined" && (Roblox = {}), Roblox.InitializeOutfits = function() {
    function t() {
        function a(t) {
            var i = String.format("<p>{0}</p><table style='margin: auto'><tbody><tr><td><label class='form-label'>{1}</label></td><td><input class='outfitNameTextBox text-box text-box-large'></td></tr></tbody></table>", Roblox.Outfits.Resources.createText, Roblox.Outfits.Resources.outfitNameTextBoxLabel),
                r = function() {
                    var i = $(".outfitNameTextBox").val();
                    $(t).data("outfit-name", i), n("/outfits/create", $(t))
                },
                u = $("#ctl00_ctl00_cphRoblox_cphMyRobloxContent_AvatarThumbnail > img").attr("src");
            return Roblox.GenericConfirmation.open({
                titleText: Roblox.Outfits.Resources.createTitle,
                bodyContent: i,
                acceptText: Roblox.Outfits.Resources.createConfirm,
                declineText: Roblox.Outfits.Resources.createCancel,
                acceptColor: Roblox.GenericConfirmation.blue,
                declineColor: Roblox.GenericConfirmation.gray,
                imageUrl: u,
                onAccept: r,
                allowHtmlContentInBody: !0,
                dismissable: !0,
                xToCancel: !0,
                fieldValidationRequired: !0
            }), !1
        }
        var f, e, s, h, c, l, u;
        Roblox.require("Widgets.AvatarImage", function(n) {
            n.populate()
        }), Roblox.require("Widgets.DropdownMenu", function(n) {
            n.InitializeDropdown()
        }), f = $("#CreateNewOutfit"), f.click(function() {
            $(this).hasClass("disabled") || a($(this))
        }), e = $("#OutfitsTab .outfit-avatar,#OutfitsTab .wear-outfit"), e.click(function() {
            n("/outfits/wear", this, function() {
                refreshAllUpdatePanels()
            })
        }), s = $("#OutfitsTab .download-outfit"), s.click(function() {
            r($(this).data("target-useroutfit-id"))
        }), h = $("#OutfitsTab .delete-outfit"), h.click(function() {
            var t = $(this),
                i = $(t).parentsUntil(".outfit-container").find(".roblox-avatar-image img").attr("src");
            Roblox.GenericConfirmation.open({
                titleText: Roblox.Outfits.Resources.deleteTitle,
                bodyContent: Roblox.Outfits.Resources.deleteText,
                acceptText: Roblox.Outfits.Resources.deleteConfirm,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: function() {
                    n("/outfits/delete", t)
                },
                declineText: Roblox.Outfits.Resources.deleteCancel,
                imageUrl: i,
                allowHtmlContentInBody: !0,
                dismissable: !0
            })
        }), c = $("#OutfitsTab .rename-outfit"), c.click(function() {
            o($(this))
        }), l = $("#OutfitsTab .update-outfit"), l.click(function() {
            var t = $(this),
                i = $(t).parentsUntil(".outfit-container").find(".roblox-avatar-image img").attr("src");
            Roblox.GenericConfirmation.open({
                titleText: Roblox.Outfits.Resources.updateTitle,
                bodyContent: Roblox.Outfits.Resources.updateText,
                acceptText: Roblox.Outfits.Resources.updateConfirm,
                declineText: Roblox.Outfits.Resources.updateCancel,
                acceptColor: Roblox.GenericConfirmation.blue,
                declineColor: Roblox.GenericConfirmation.gray,
                imageUrl: i,
                onAccept: function() {
                    n("/outfits/update", t)
                },
                allowHtmlContent: !1,
                dismissable: !0,
                xToCancel: !0
            })
        }), $("#OutfitsTab .outfits-previous").click(function() {
            i(this, -1)
        }), $("#OutfitsTab .outfits-next").click(function() {
            i(this, 1)
        }), $("#OutfitsTab .outfit-hover .outfit-dropdown").show(), $("#OutfitsTab .button.gear").click(function() {
            $(this).hasClass("active") || $("#OutfitsTab .button.gear.active").each(function() {
                $(this).removeClass("active"), $(this).siblings(".dropdown-list").hide()
            })
        }), u = $(".status-confirm"), u.is(":visible") && setTimeout(function() {
            u.fadeOut(500)
        }, 5e3)
    }

    function f(n) {
        var t = $(".outfits-error");
        t.text(n).show(), setTimeout(function() {
            t.fadeOut(500)
        }, 3e3)
    }

    function e(n) {
        return n.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val(), n
    }

    function i(n, i) {
        var r = $(n).data("view"),
            u = parseInt($(n).data("page-num")) + i;
        $("#OutfitsTab").load("/outfits/fetch?DisplayedUserID=" + $(n).data("displayed-user-id") + "&PageNum=" + u, function() {
            t(r)
        })
    }

    function o(n) {
        var t = String.format("<p>{0}</p><table style='margin: auto'><tbody><tr><td><label class='form-label'>{1}</label></td><td><input class='outfitNameTextBox text-box text-box-large'></td></tr></tbody></table>", Roblox.Outfits.Resources.renameText, Roblox.Outfits.Resources.outfitNameTextBoxLabel),
            i = function() {
                var t = $(".outfitNameTextBox").val();
                s(n, t, function() {})
            },
            r = $(n).parentsUntil(".outfit-container").find(".roblox-avatar-image img").attr("src");
        return Roblox.GenericConfirmation.open({
            titleText: Roblox.Outfits.Resources.renameTitle,
            bodyContent: t,
            acceptText: Roblox.Outfits.Resources.renameConfirm,
            declineText: Roblox.Outfits.Resources.renameCancel,
            onAccept: i,
            imageUrl: r,
            allowHtmlContentInBody: !0,
            dismissable: !0,
            fieldValidationRequired: !0
        }), !1
    }

    function s(t, i) {
        $(t).data("outfit-name", i), n("/outfits/rename", t)
    }

    function h(n) {
        $(n).parentsUntil(".outfits-container").find(".outfit-loading-image").show()
    }

    function c(n) {
        $(n).parentsUntil(".outfits-container").find(".outfit-loading-image").hide()
    }

    function n(n, i, r) {
        var o = $(i).data("view"),
            u;
        $(i).data("target-useroutfit-id") && h(i), u = e({
            targetUserOutfitID: $(i).data("target-useroutfit-id"),
            displayedUserID: $(i).data("displayed-user-id"),
            pageNum: $(i).data("page-num"),
            outfitName: $(i).data("outfit-name")
        }), $("#OutfitsTab").load(n, u, function(n, u) {
            u == "error" ? (f("An error occurred"), $(i).data("target-useroutfit-id") && c(i)) : t("Outfits"), r()
        })
    }

    function l(n) {
        var t = $(".tab-container div.tab.active");
        t.removeClass("active"), $("#" + t.data("id")).hide(), n.addClass("active"), $("#" + n.data("id")).show()
    }

    function r(n) {
        var t = {
            overlayClose: !0,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            }
        };
        $("#ProcessingView").modal(t), $.ajax("/outfit-thumbnail/json", {
            cache: !1,
            crossDomain: !0,
            xhrFields: {
                withCredentials: !0
            },
            data: {
                userOutfitId: n,
                width: 352,
                height: 352,
                format: "png"
            },
            dataType: "json",
            type: "GET",
            success: function(t) {
                t.Final ? ($.modal.close(), window.location = "/outfits/download?userOutfitId=" + n) : setTimeout(function() {
                    r(n)
                }, 1e3)
            }
        })
    }
    var u = !1;
    $(function() {
        u = $("#OutfitsTab").data("isiosapp") == "true", t("Outfits"), $("div.tab").bind("click", function() {
            l($(this))
        })
    })
}();