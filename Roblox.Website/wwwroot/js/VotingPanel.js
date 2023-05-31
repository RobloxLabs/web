;// VotingPanel.js
var Roblox = Roblox || {};
Roblox.Voting = function() {
    var i = function(n) {
            return n.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val(), n
        },
        u = function(n, t, r) {
            $(".voting-panel .loading").show(), $.ajax({
                type: "POST",
                url: "/voting/vote?assetId=" + n + "&vote=" + t,
                data: i({}),
                success: function(n) {
                    $(".voting").html(n), r()
                },
                error: function(n) {
                    $(".voting").html(n), r()
                }
            })
        },
        f = function(n, t) {
            $(".voting-panel .loading").show(), $.ajax({
                type: "POST",
                url: "/voting/unvote?assetId=" + n,
                data: i({}),
                success: function(n) {
                    $(".voting").html(n), t()
                },
                error: function(n) {
                    $(".voting").html(n), t()
                }
            })
        },
        t = function(t, i) {
            var r, u;
            if (Roblox.Voting.CanVote(), r = $(".voting-panel").attr("data-vote-modal"), r != undefined && r.length > 0) switch (r) {
                case "EmailIsVerified":
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.Voting.Resources.emailVerifiedTitle,
                        bodyContent: Roblox.Voting.Resources.emailVerifiedMessage,
                        onAccept: function() {
                            window.location.href = "/my/account?confirmemail=1"
                        },
                        acceptColor: Roblox.GenericConfirmation.blue,
                        acceptText: Roblox.Voting.Resources.verify,
                        declineText: Roblox.Voting.Resources.cancel,
                        allowHtmlContentInBody: !0
                    });
                    return;
                case "PlayGame":
                    Roblox.GenericModal.open(Roblox.Voting.Resources.playGameTitle, null, Roblox.Voting.Resources.playGameMessage);
                    return;
                case "UseModel":
                    Roblox.GenericModal.open(Roblox.Voting.Resources.useModelTitle, null, Roblox.Voting.Resources.useModelMessage);
                    return;
                case "InstallPlugin":
                    Roblox.GenericModal.open(Roblox.Voting.Resources.installPluginTitle, null, Roblox.Voting.Resources.installPluginMessage);
                    return;
                case "BuyGamePass":
                    Roblox.GenericModal.open(Roblox.Voting.Resources.buyGamePassTitle, null, Roblox.Voting.Resources.buyGamePassMessage);
                    return
            } else u = $(".voting-panel").data("asset-id"), t.hasClass("selected") ? Roblox.Voting.Unvote(u, n) : Roblox.Voting.Vote(u, i, n)
        },
        n = function() {
            $(".users-vote .upvote").unbind().click(function() {
                t($(this), !0)
            }), $(".users-vote .downvote").unbind().click(function() {
                t($(this), !1)
            });
            var i = parseInt($(".voting-panel").data("total-up-votes")),
                r = parseInt($(".voting-panel").data("total-down-votes")),
                n;
            isNaN(i) || isNaN(r) || (n = i === 0 ? 0 : r === 0 ? 100 : Math.floor(i / (i + r) * 100), n > 100 && (n = 100), $(".voting-panel .visual-container .percent").css("width", n + "%")), $("#VisitButtonContainer .btn-primary").click(function() {
                setTimeout(Roblox.Voting.CanVote, 1e4)
            })
        },
        r = function() {
            var n = $(".voting-panel").data("asset-id");
            $.ajax({
                type: "GET",
                url: "/voting/canvote?assetId=" + n,
                success: function(n) {
                    n.success ? $(".voting-panel").removeAttr("data-vote-modal") : n.message === "PlayGame" && setTimeout(Roblox.Voting.CanVote, 1e4)
                },
                error: function() {
                    setTimeout(Roblox.Voting.CanVote, 1e4)
                }
            })
        };
    return {
        Vote: u,
        Unvote: f,
        Initialize: n,
        CanVote: r
    }
}();