; // Friends.js
var InitializeFriends = function(n) {
    var t = function(u) {
            var s, h, o, f, e;
            Roblox.require("Widgets.AvatarImage", function(n) {
                n.populate()
            }), Roblox.require("Widgets.DropdownMenu", function(n) {
                n.InitializeDropdown()
            }), (u == "Friends" || u == "BestFriends") && (u == "Friends" && (s = $("#" + u + "Tab .add-best-friend"), s.click(function() {
                i("/friends/addbestfriend", this)
            })), h = $("#" + u + "Tab .remove-best-friend"), h.click(function() {
                i("/friends/removebestfriend", this)
            }), o = $("#" + u + "Tab .remove-friend"), o.click(function() {
                var n = $(this);
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.Friends.Resources.RemoveFriend,
                    bodyContent: Roblox.Friends.Resources.RemoveFriendMessage.replace("{0}", n.data("target-user-name")),
                    acceptText: Roblox.GenericConfirmation.Resources.Confirm,
                    declineText: Roblox.GenericConfirmation.Resources.Cancel,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.gray,
                    onAccept: function() {
                        i("/friends/removefriend", n)
                    },
                    allowHtmlContent: !1,
                    dismissable: !0,
                    xToCancel: !0
                })
            })), u == "FriendRequests" && ($("#AcceptAllButton").click(function() {
                var i = $(this),
                    n;
                if (i.attr("disabled") !== undefined) return Roblox.GenericModal.open(Roblox.Friends.Resources.FeatureDisabled, null, Roblox.Friends.Resources.AddFriendsDisabled), !1;
                n = {
                    displayedUserID: i.data("displayed-user-id")
                }, $("#FriendRequestsTab").load("/friends/acceptallfriendrequests", n, function() {
                    $("#FriendsTab").load("/friends/friends?DisplayedUserID=" + n.displayedUserID + "&PageNum=1", function() {
                        t("Friends")
                    })
                })
            }), $("#DeclineAllButton").click(function() {
                var n = {
                    displayedUserID: $(this).data("displayed-user-id")
                };
                $("#FriendRequestsTab").load("/friends/declineallfriendrequests", n, function() {
                    $("#FriendsTab").load("/friends/friends?DisplayedUserID=" + n.displayedUserID + "&PageNum=1", function() {
                        t("Friends")
                    })
                })
            }), f = $("#" + u + "Tab .accept-friend"), f.click(function() {
                i("/friends/acceptfriendrequest", this)
            }), e = $("#" + u + "Tab .decline-friend"), e.click(function() {
                i("/friends/declinefriendrequest", this)
            }), $("#FindUserButton").click(function() {
                var n = $("#Keyword").val();
                n != "" && (window.location = "/user.aspx?username=" + encodeURIComponent(n))
            })), $("#" + u + "Tab .friends-previous").click(function() {
                r(this, -1)
            }), $("#" + u + "Tab .friends-next").click(function() {
                r(this, 1)
            }), n ? $("#" + u + "Tab .friend-hover .friend-dropdown").show() : $("#" + u + "Tab .friend-hover").hover(function() {
                $(this).children(".friend-dropdown").show()
            }, function() {
                $(this).children(".friend-dropdown").hide()
            })
        },
        r = function(n, i) {
            var r = $(n).data("view"),
                u = parseInt($(n).data("page-num")) + i;
            $("#" + r + "Tab").load("/friends/" + r + "?DisplayedUserID=" + $(n).data("displayed-user-id") + "&PageNum=" + u, function() {
                t(r)
            })
        },
        i = function(n, i) {
            var r = $(i).data("view"),
                u = {
                    targetUserID: $(i).data("target-user-id"),
                    displayedUserID: $(i).data("displayed-user-id"),
                    pageNum: $(i).data("page-num"),
                    view: r,
                    invitationID: $(i).data("invitation-id")
                };
            $("#" + r + "Tab").load(n, u, function() {
                t(r), r == "Friends" && $("#BestFriendsTab").load("/friends/bestfriends?DisplayedUserID=" + $(i).data("displayed-user-id") + "&PageNum=1", function() {
                    t("BestFriends")
                }), (r == "BestFriends" || r == "FriendRequests") && $("#FriendsTab").load("/friends/friends?DisplayedUserID=" + $(i).data("displayed-user-id") + "&PageNum=1", function() {
                    t("Friends")
                })
            })
        };
    t("Friends"), t("BestFriends"), t("FriendRequests")
};