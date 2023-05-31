; // ~/jS/Home/Home.js
$(function() {
    function t() {
        if ($("#txtStatusMessage").prop("disabled"))
			return false;
        $("#shareButton").hide(), $("#loadingImage").show(), $.post($("#HomeContainer").data("update-status-url"), 
		{
			status: $("#txtStatusMessage").val(),
			sendToFacebook: $("#sendToFacebook").is(":checked")
		},
		function(n) {
			if (n.success)
			{
				$("#txtStatusMessage").val(n.message);
				fetchFeed();
			}
			else
			{
				$("#txtStatusMessage").val("");
			}
			
			$("#txtStatusMessage").blur();
			$("#shareButton").show();
			$("#loadingImage").hide();
        });
    }
	
	function fetchFeed() {	
		$.get($("#HomeContainer").data("get-feed-url"), function(n) {
       $("#AjaxFeed").html(n);
		}).fail(function() {
			$("#AjaxFeedError").show(), $("#AjaxFeed").hide();
		});
	}

    Roblox.require("Pagelets.BestFriends", function(n) {
        n.init("#bestFriendsContainer")
    });
	$.getJSON("/GetRecentlyVisitedPlaces.ashx", {
        GameType: "All",
        m: "RecentlyVisited",
        p: 0,
        PageSize: 5
    },
	function(n) {
        if (n.Count > 0)
		{
			$(n.Items).each(function(n, t) {
            var i = $("#RecentlyVisitedPlaceTemplate").clone().removeAttr("id").show();
            i.find(".recent-place-thumb").append('<img src="' + t.ThumbnailUrl + '" alt="' + t.Name.escapeHTML() + '" class="recent-place-thumb-img" />');
			i.find(".recent-place-name").append('<a href="' + t.NavigateUrl + '">' + fitStringToWidth(t.Name, 200, "recent-place-name") + " </a>");
			t.PersonalPlaceOverlay.Url != null && i.find(".recent-place-name").append('<img border="0" alt="Personal Server" src="/images/icons/personal_server.png" class="recent-place-thumb-ps-overlay" />');
			i.find(".recent-place-players-online").html(t.Stats.CurrentPlayersCount + " players online");
			$("#RecentlyVisitedPlaces").append(i);
			});
		}
		else
		{
			($("#PlayGames").show(), $("#SeeMore").hide());
		}
    });
	$("#btnFacebookShare").click(function() {
        $.post($("#HomeContainer").data("facebook-share"), function(n) {
            $("#btnFacebookShare").removeClass();
			n.success ? $("#facebookShareResult").addClass("status-confirm") : $("#facebookShareResult").addClass("status-error");
			$("#facebookShareResult").text(n.message);
			$("#facebookShareResult").fadeIn().delay(5e3).fadeOut();
        })
    });
	$.get("/feedifications/get", function(n) {
		$("#FeedificationsContainer").html(n);
		$("#FeedificationsContainer .feedification").length == 0 && $("#FeedificationsContainer").removeClass("feed-container");
	}).fail(function() {
		$("#FeedificationsLoadingIndicator").hide();
		$("#FeedificationsLoadingError").show();
	});	
	fetchFeed();
	$("span[data-retry-url]").loadRobloxThumbnails();
	$("#shareButton").click(function() {
        t();
    });
	$("#txtStatusMessage").keypress(function(n) {
        n.which == "13" && t();
    });
});