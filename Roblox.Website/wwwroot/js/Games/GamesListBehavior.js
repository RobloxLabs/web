; // Games/GamesListBehavior.js
var Roblox = Roblox || {};
Roblox.GamesListBehavior = {}, Roblox.GamesListBehavior.ExtraHeightToShowHover = 50, Roblox.GamesListBehavior.MaxNumberOfGamesToLoadPerRequest = 200, Roblox.GamesListBehavior.NumberOfGamesToAppendInHScrollMode = 20;
Roblox.GamesListBehavior.GamesListObject = function(n, t, i, r) {
    this.divId = n;
	this.isShown = !1;
	this.sortFilter = t;
	this.gameFilter = i;
	this.siteFilter = "Roblonium";
	this.timeFilter = 0;
	this.minBCLevel = r;
	this.genreId = 1;
	this.numberOfRowsToOccupy = 0;
	this.numberOfGamesToFetch = 0;
	this.numberOfGamesOnScreen = 0;
	this.startIndex = 0;
	this.jqxhr = null;
	this.reachedHorizontalScrollMax = !1;
	this.numberOfGamesOnLastRow = 0;
	this.attachHoverHandlers();
	this.attachScrollHandlers();
    $("#" + this.divId).on("click", ".games-filter-changer", Roblox.GamesPageContainerBehavior.handleGamesFilterChangerClick)
}, Roblox.GamesListBehavior.GamesListObject.prototype = {
    populateGamesList: function(n) {
        var t = this,
            u, f, i, r;
        t.jqxhr && jqxhr.abort();
		u = Roblox.GamesPageContainerBehavior.getURLBasedOnSortFilter(t.sortFilter);
		t.numberOfGamesToFetch = Math.min(n, Roblox.GamesListBehavior.MaxNumberOfGamesToLoadPerRequest);
		t.numberOfGamesOnLastRow = 0, f = Roblox.GamesPageContainerBehavior.isTopRatedDefaultToWeeklyEnabled();
		i = Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode();
		f && i && t.sortFilter == 11 && (t.timeFilter = 2);
		t.reachedHorizontalScrollMax = !1;
		$("#" + t.divId + " .scroller.next").removeClass("hidden");
		r = {
            SortFilter: t.sortFilter,
            TimeFilter: t.timeFilter,
            GenreID: t.genreId,
            GameFilter: t.gameFilter,
			SiteFilter: t.siteFilter,
            MinBCLevel: t.minBCLevel,
            StartRows: t.startIndex,
            MaxRows: t.numberOfGamesToFetch,
            IsUserLoggedIn: Roblox.GamesPageContainerBehavior.IsUserLoggedIn,
            NumberOfRowsToOccupy: t.numberOfRowsToOccupy,
            NumberOfColumns: Roblox.GamesPageContainerBehavior.getNumberOfColumns(),
            IsInHorizontalScrollMode: i
        };
		t.showLoadingIndicator();
		t.jqxhr = $.get(u, r, function(n) {
            var u, i, r;
            t.jqxhr = null, u = $("<div></div>").append(n), Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() || t.hideExtraGames(u), i = $("#" + t.divId + " .games-list"), $(i).find(".game-item,.games-list-column").remove(), i = Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() ? $("#" + t.divId + " .horizontally-scrollable") : i, i.append(u.html()), t.numberOfGamesOnScreen = $(i).find(".game-item").length, t.hideLoadingIndicator(), Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() && (r = $("#" + t.divId + " .horizontally-scrollable"), r.length > 0 && ($(r).css("left", 0), $(r).siblings(".scroller.prev").addClass("hidden")), t.noMoreGamesToLoad = t.numberOfGamesOnScreen < t.numberOfGamesToFetch)
        })
    },
    appendToGamesList: function(n) {
        var t, u, f, i, r;
        this.jqxhr || Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() && this.reachedHorizontalScrollMax || (t = this, u = Roblox.GamesPageContainerBehavior.getURLBasedOnSortFilter(t.sortFilter), n = Math.min(n, Roblox.GamesListBehavior.MaxNumberOfGamesToLoadPerRequest), f = Roblox.GamesPageContainerBehavior.isTopRatedDefaultToWeeklyEnabled(), i = Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode(), f && i && t.sortFilter == 11 && (t.timeFilter = 2), t.unhideGames(), r = {
            SortFilter: t.sortFilter,
            TimeFilter: t.timeFilter,
            GenreID: t.genreId,
            GameFilter: t.gameFilter,
			SiteFilter: t.siteFilter,
            MinBCLevel: t.minBCLevel,
            StartRows: t.numberOfGamesOnScreen,
            MaxRows: n,
            IsUserLoggedIn: Roblox.GamesPageContainerBehavior.IsUserLoggedIn,
            NumberOfRowsToOccupy: t.numberOfRowsToOccupy,
            NumberOfColumns: Roblox.GamesPageContainerBehavior.getNumberOfColumns(),
            IsInHorizontalScrollMode: i
        }, t.showLoadingIndicator(), t.jqxhr = $.get(u, r, function(i) {
            var u, r;
            t.jqxhr = null, u = $("<div></div>").append(i), Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() || t.hideExtraGames(u), r = Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() ? $("#" + t.divId + " .horizontally-scrollable") : $("#" + t.divId + " .games-list"), r.append(u.html()), t.numberOfGamesOnScreen = $(r).find(".game-item").length, t.hideLoadingIndicator(), Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() && (t.noMoreGamesToLoad = $(i).find(".game-item").length < n, t.reachedHorizontalScrollMax = t.numberOfGamesOnScreen > Roblox.GamesPageContainerBehavior.MaxNumberOfGamesToFetchInHScrollMode)
        }))
    },
    show: function(n) {
        n && $("#" + this.divId + " .games-list").find(".game-item,.games-list-column").remove(), this.isShown = !0, $("#" + this.divId).removeClass("hidden"), n ? $("#" + this.divId + " .show-in-multiview-mode-only").removeClass("hidden") : $("#" + this.divId + " .show-in-multiview-mode-only").addClass("hidden")
    },
    hide: function() {
        this.isShown = !1, this.numberOfRowsToOccupy = 0, $("#" + this.divId).addClass("hidden")
    },
    updateHeight: function() {
        $("#" + this.divId).height(this.maxHeight()), Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() && $("#" + this.divId.games + " .horizontally-scrollable").height(this.numberOfRowsToOccupy * Roblox.GamesPageContainerBehavior.RowHeightIncludingPadding)
    },
    showOverflow: function() {
        $("#" + this.divId).removeClass("overflow-hidden"), $("#" + this.divId).addClass("overflow-visible")
    },
    hideOverflow: function() {
        $("#" + this.divId).removeClass("overflow-visible"), $("#" + this.divId).addClass("overflow-hidden")
    },
    attachHoverHandlers: function() {
        $("#" + this.divId).on({
            mouseenter: function() {
                $(this).children(".show-on-hover-only").show(), $(this).siblings(".hover-shown").show()
            },
            mouseleave: function() {
                $(this).children(".show-on-hover-only").hide(), $(this).siblings(".hover-shown").hide()
            }
        }, ".always-shown")
    },
    attachScrollHandlers: function() {
        var n = this;
        $("#" + this.divId).on("click", ".scroller", function() {
            var i = this,
                t = "next";
            i && (i.className.indexOf("prev") !== -1 && (t = "prev"), n.handleHorizontalScroll(t))
        })
    },
    handleHorizontalScroll: function(n) {
        var i = $("#" + this.divId + " .horizontally-scrollable"),
            r, t, u, f;
        i.length > 0 && ($(i).stop("", !0, !0), r = parseInt($(i).css("left")) || 0, r = this.getClosestColumnBoundary(r), n === "prev" ? (t = r + this.getLeftBoundaryOfLastVisibleColumn(), t = Math.min(t, 0), $("#" + this.divId + " .scroller.next").removeClass("hidden")) : (t = r - this.getLeftBoundaryOfLastVisibleColumn(), this.appendToGamesList(Roblox.GamesListBehavior.NumberOfGamesToAppendInHScrollMode), (this.noMoreGamesToLoad || this.reachedHorizontalScrollMax) && !this.isAvailableWidthFullyOccupied(t) && $("#" + this.divId + " .scroller.next").addClass("hidden")), $(i).animate({
            left: t + "px"
        }), Roblox.AdsHelper.AdRefresher.refreshAds(), u = $("#GamesRightColumn")[0], u != null && u.contentWindow.Roblox.RightColumnBehavior.refreshAds(), f = t < 0, f ? $(i).siblings(".scroller.prev").removeClass("hidden") : $(i).siblings(".scroller.prev").addClass("hidden"))
    },
    showLoadingIndicator: function() {
        Roblox.GamesPageContainerBehavior.isInHorizontalScrollMode() || $("#" + this.divId).css("cursor", "wait")
    },
    hideLoadingIndicator: function() {
        $("#" + this.divId).css("cursor", "auto")
    },
    resetStartIndex: function() {
        this.startIndex = 0, $("#" + this.divId + " .previous").addClass("disabled"), $("#" + this.divId + " .next").removeClass("disabled")
    },
    hideExtraGames: function(n) {
        var r = $(n).find(".game-item").length,
            t = Roblox.GamesPageContainerBehavior.getNumberOfColumns() * this.numberOfRowsToOccupy - this.numberOfGamesOnLastRow,
            i = 0;
        r > t && $(n).find(".game-item").each(function() {
            i++ >= t && $(this).addClass("hidden")
        })
    },
    maxHeight: function() {
        var n = 0;
        return this.isShown && (n += this.numberOfRowsToOccupy * Roblox.GamesPageContainerBehavior.RowHeightIncludingPadding, n += Roblox.GamesPageContainerBehavior.GamesListHeaderHeight, n += Roblox.GamesListBehavior.ExtraHeightToShowHover), n
    },
    unhideGames: function() {
        var n = $("#" + this.divId + " .game-item.hidden").length;
        this.numberOfGamesOnLastRow = n % Roblox.GamesPageContainerBehavior.getNumberOfColumns(), $("#" + this.divId + " .game-item.hidden").each(function() {
            $(this).removeClass("hidden")
        })
    },
    getClosestColumnBoundary: function(n) {
        var t = Math.abs(n % Roblox.GamesPageContainerBehavior.ColumnWidthIncludingPadding);
        return n + t
    },
    getLeftBoundaryOfLastVisibleColumn: function() {
        var t = $("#" + this.divId + " .games-list").width(),
            n = Math.floor(t / Roblox.GamesPageContainerBehavior.ColumnWidthIncludingPadding);
        return n * Roblox.GamesPageContainerBehavior.ColumnWidthIncludingPadding
    },
    isAvailableWidthFullyOccupied: function(n) {
        var r = $("#" + this.divId + " .games-list").width(),
            i = Math.ceil(r / Roblox.GamesPageContainerBehavior.ColumnWidthIncludingPadding),
            t = Math.abs(n / Roblox.GamesPageContainerBehavior.ColumnWidthIncludingPadding);
        return this.numberOfGamesOnScreen >= t + i
    }
};