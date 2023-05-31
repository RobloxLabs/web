; // Games/GamesPageContainerBehavior.js
var Roblox = Roblox || {};
Roblox.GamesPageContainerBehavior = function() {
    function pi() {
        var u, f, r, t, i;
        $(".games-list-container").each(function() {
            u = $(this).attr("id");
			f = $(this).data("sortfilter");
			r = $(this).data("gamefilter");
			t = $(this).data("minbclevel");
			i = new Roblox.GamesListBehavior.GamesListObject(u, f, r, t), n.push(i)
        })
    }

    function a() {
        var r, i;
        for (ct = !0, i = 0; i < n.length; i++) n[i].isShown && (r = t ? tr : ki, n[i].populateGamesList(r));
        ot()
    }

    function bi() {
        var t = parseInt($($(".games-list-container")[0]).css("padding-left")),
            n = $("#GamesListsContainer").width();
        n > t ? n -= t : n = 0, pt = Math.floor(n / g)
    }

    function wi() {
        for (var u = -1, e = parseInt($("#GamesListsContainer").css("min-height")) || 0, o = Math.max($(window).height(), e) - (di + (it + nr) * c), f = Math.floor(o / ht), r = t ? 1 : Math.max(1, Math.floor(2 * f / c)), i = 0; i < n.length; i++) n[i].isShown && (n[i].numberOfRowsToOccupy = r, u = i)
    }

    function rr() {
        for (var i = 0; i < n.length; i++) n[i].updateHeight(), !t && n[i].isShown ? n[i].showOverflow() : n[i].hideOverflow()
    }

    function lr() {
        for (var t = 0; t < n.length; t++) $("#" + n[t].divId).css("top", "")
    }

    function cr() {
        for (var r = !0, u = 0, i, t = 0; t < n.length; t++) n[t].isShown && (r ? r = !1 : (i = (u++ + 1) * ir, $("#" + n[t].divId).css("top", "-" + i + "px")));
        i = c > 2 ? 160 : 110, $("#DivToHideOverflowFromLastGamesList").css("top", "-" + i + "px")
    }

    function v() {
        et(), bi(), wi(), rr()
    }

    function ar() {
        var t, n;
        $("div.filter select").each(function() {
            $(this).change(function() {
                t = $(this).attr("id"), n = $(this).val(), n && t && (y(t, n), d || (u = !0, p(), u = !1), a())
            })
        })
    }

    function y(n, t) {
        yr();
        switch (n) {
            case "SortFilter":
                vr(t), hr(t), $("#SortFilter").val(t);
                break;
            case "TimeFilter":
                fr(t), $("#TimeFilter").val(t);
                break;
            case "GenreFilter":
                ur(t), $("#GenreFilter").val(t)
				break;
            case "SiteFilter":
                SFilter(t), $("#SiteFilter").val(t)
        }
    }

    function yr() {
        for (var t = 0; t < n.length; t++) n[t].resetStartIndex()
    }

    function vr(n) {
        $.inArray(n, yt) !== -1 ? $("#TimeFilter").attr("disabled", "disabled") : $("#TimeFilter").removeAttr("disabled"), $.inArray(n, lt) !== -1 ? $("#GenreFilter").attr("disabled", "disabled") : $("#GenreFilter").removeAttr("disabled")
    }

    function hr(n) {
        ii(), lr(), si(n), cr(), v(), $("#GamesPageRightColumnSidebar").length > 0 && (n !== "default" || $("#GamesPageRightColumnSidebar").hasClass(s) || ($("#GamesPageRightColumnSidebar").removeClass(), $("#GamesPageRightColumnSidebar").addClass(s)))
    }

    function fr(n) {
        sr(n)
    }

    function ur(n) {
        er(n)
    }

    function SFilter(t) {
        for (var i = 0; i < n.length; i++) n[i].siteFilter = t
    }

    function er(t) {
        for (var i = 0; i < n.length; i++) n[i].genreId = t
    }

    function sr(t) {
        for (var i = 0; i < n.length; i++) n[i].timeFilter = t
    }

    function or() {
        $("#SortFilter").val($("#SortFilter").data("default")), $("#TimeFilter").val($("#TimeFilter").data("default")), $("#GenreFilter").val($("#GenreFilter").data("default")), $("#SiteFilter").val($("#SiteFilter").data("default"))
    }

    function ai() {
        var n = ft();
        e.replaceState(n.urlStateObject, Roblox.GamesPageContainerBehavior.Resources.pageTitle, "?" + n.urlStateString)
    }

    function p() {
        var n = ft();
        e.pushState(n.urlStateObject, Roblox.GamesPageContainerBehavior.Resources.pageTitle, "?" + n.urlStateString)
    }

    function ft() {
        var r = "",
            u = {},
            i;
        if ($("div.filter select").each(function() {
                filterType = $(this).attr("id"), selectedVal = $(this).val(), selectedVal && filterType && !$(this).attr("disabled") && (r += (r === "" ? "" : "&") + filterType + "=" + selectedVal, u[filterType] = selectedVal)
            }), !t)
            for (i = 0; i < n.length; i++) n[i].isShown && n[i].minBCLevel === 1 && (r += (r === "" ? "" : "&") + "BC=1"), u.BC = 1;
        return {
            urlStateString: r,
            urlStateObject: u
        }
    }

    function ut(n) {
        if (!u) {
            d = !0;
            for (var t in n) y(t, n[t]);
            d = !1, a()
        }
    }

    function ti() {
        $(document).on("GuttersHidden", function() {
            h && (h = !1, Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv1"), Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv2"), i = $("#LeftGutterAdContainer"), r = $("#RightGutterAdContainer"), $("#GamesPageLeftColumn").css("margin", "0 345px 0 10px"), i.hide(), r.hide(), $("#GutterAdStyles").remove(), $("#GamesPageRightColumnSidebar").html("<iframe id='GamesRightColumn' src='/games/rightcolumn' scrolling='no' frameBorder='0' style='height:550px;width:330px;border:0px;overflow:hidden'></iframe>"))
        })
    }

    function dt() {
        $(document).on("FilmStripHidden", function() {
            $("#GamePageAdDiv3").hide(), $("#GamesPageRightColumnSidebar").html("<iframe id='GamesRightColumn' src='/games/rightcolumn' scrolling='no' frameBorder='0' style='height:550px;width:330px;border:0px;overflow:hidden'></iframe>")
        })
    }

    function et() {
        var t, n;
        h && (i = $("#LeftGutterAdContainer"), r = $("#RightGutterAdContainer"), l = i.width(), t = $("body").width(), t <= k ? ($("#GamesPageLeftColumn").css("margin", "0"), i.hide(), r.hide()) : (n = gt(t), i.css("left", n - l + "px"), r.css("right", n - l + "px"), i.show(), r.show(), $("#GamesPageLeftColumn").css("margin", "0 " + (n + 10) + "px 0 " + (n + 10) + "px")))
    }

    function gt(n) {
        return n > k + 20 + 2 * l ? l : Math.max((n - 20 - k) / 2, 0)
    }

    function st(t) {
        for (var i = 0; i < n.length; i++)
            if (n[i].divId === "GamesListContainer" + t) return n[i];
        return null
    }

    function ii() {
        for (var t = 0; t < n.length; t++) n[t].hide();
        c = 0
    }

    function si(n) {
        if (Roblox.GamesPageContainerBehavior.FilterValueToGamesListsIdSuffixMapping.hasOwnProperty(n)) {
            t = !0;
            for (var i = 0; i < Roblox.GamesPageContainerBehavior.FilterValueToGamesListsIdSuffixMapping[n].length; i++) rt(Roblox.GamesPageContainerBehavior.FilterValueToGamesListsIdSuffixMapping[n][i], t);
            $("#DivToHideOverflowFromLastGamesList, #Footer").removeClass("hidden")
        } else t = !1, rt(n, t), $("#DivToHideOverflowFromLastGamesList, #Footer").addClass("hidden")
    }

    function rt(n, t) {
        var i = st(n);
        i && (i.show(t), c++)
    }

    function ci() {
        f = $(window).width(), o = $(window).height(), $("#GamesPageRightColumnSidebar").length > 0 && (at = $("#GamesPageRightColumnSidebar").position().top)
    }

    function oi() {
        return t || !1
    }

    function ui() {
        return pt
    }

    function ri() {
        return nt
    }

    function ni() {
        y("SortFilter", "default"), u = !0, p(), u = !1, a()
    }

    function li() {
        var n = $(window).width() || 0;
        return n >= 980 ? "move-with-window-stick-right" : "move-with-window-min-left"
    }

    function bt() {
        var r = $(this).closest(".games-list-container").attr("id") || "",
            t = r.replace("GamesListContainer", ""),
            i = st(t);
        return i != null && (y("SortFilter", t), u = !0, p(), u = !1, a()), !1
    }

    function fi(n, t) {
        t = typeof t != "undefined" ? t : 1e3, w || (w = !0, n(), clearTimeout(b), b = setTimeout(function() {
            w = !1
        }, t))
    }

    function kt() {
        for (var t = 0; t < n.length; t++) n[t].isShown && n[t].appendToGamesList(n[t].numberOfGamesToFetch)
    }

    function ei(n) {
        return $.inArray(n, vi) !== -1 ? "/games/moreresultsuncached" : "/games/moreresultscached"
    }

    function ot() {
        Roblox.AdsHelper.AdRefresher.refreshAds();
        var n = $("#GamesRightColumn")[0];
        n != null && n.contentWindow.Roblox.RightColumnBehavior.refreshAds()
    }
    var hi = 300,
        gi = 50,
        g = 202,
        di = 240,
        it = 40,
        nr = 40,
        ht = 168,
        ir = 55,
        tr = 40,
        ki = 72,
        yi = 50,
        k = 1010,
        yt = [],
        lt = [],
        vi = [5, 6, 10],
        n = [],
        c = 0,
        pt, f, o, at, s, t, vt = 0,
        e = window.History,
        ct = !1,
        d = !1,
        u = !1,
        wt = !1,
        h = !1,
        i, r, l, tt = 400,
        w = !1,
        nt = !1,
        b;
    return $(function() {
        document.title = Roblox.GamesPageContainerBehavior.Resources.pageTitle, $("#SortFilter [data-hidetimefilter]").each(function(n, t) {
            yt.push($(t).val())
        }), $("#SortFilter [data-hidegenrefilter]").each(function(n, t) {
            lt.push($(t).val())
        }), nt = $("#FiltersAndSort").data("defaultweeklyratings"), pi(), $("#GamesPageRightColumnSidebar").length > 0 && (s = $("#GamesPageRightColumnSidebar").attr("class")), ar(), e.Adapter.bind(window, "statechange", function() {
            ut(e.getState().data)
        }), or(), ai(), Roblox.GamesDisplayShared.hookUpSearch(), ci(), i = $("#LeftGutterAdContainer"), r = $("#RightGutterAdContainer"), h = i.length !== 0, wt = $("#TopAdContainer").length !== 0, $(".games-filter-resetter").click(ni), $(".games-filter-changer").click(bt), h ? (Roblox.AdsHelper.AdRefresher.registerAd("LeftGutterAdContainer"), Roblox.AdsHelper.AdRefresher.registerAd("RightGutterAdContainer")) : (Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv1"), Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv2"), Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv3")), wt && Roblox.AdsHelper.AdRefresher.registerAd("TopAdContainer"), ct || ut(e.getState().data), v();
        $(".scroller, .scroller .arrow, .scroller .arrow img").on("dblclick", function() {
            return window.getSelection ? window.getSelection().removeAllRanges() : document.selection && document.selection.empty(), !1
        });
        ti(), dt()
    }), $(window).resize(function() {
        var i = $(window).width(),
            r = $(window).height(),
            u;
        i > f || r > o ? setTimeout(function() {
            if (v(), !t) {
                for (var u = 0; u < n.length; u++) n[u].isShown && n[u].appendToGamesList(n[u].numberOfGamesToFetch);
                i >= 980 && $("#GamesPageRightColumnSidebar.move-with-window-min-left").toggleClass("move-with-window-min-left move-with-window-stick-right")
            }
            f = i, o = r
        }, hi) : (i < f || r < o) && setTimeout(function() {
            i < f && et(), t ? v() : i < 980 && $("#GamesPageRightColumnSidebar.move-with-window-stick-right").toggleClass("move-with-window-min-left move-with-window-stick-right"), f = i, o = r
        }, gi), tt = r / 2
    }), $(window).scroll(function() {
        var i = $(window).scrollTop(),
            n;
        t || (n = li(), i + 60 > at ? $("#GamesPageRightColumnSidebar").hasClass(n) || ($("#GamesPageRightColumnSidebar").removeClass(), $("#GamesPageRightColumnSidebar").addClass(n)) : $("#GamesPageRightColumnSidebar").hasClass(s) || ($("#GamesPageRightColumnSidebar").removeClass(), $("#GamesPageRightColumnSidebar").addClass(s)), i > vt && !t && $(window).scrollTop() >= $(document).height() - $(window).height() - tt && (kt(), fi(ot(), Roblox.GamesPageContainerBehavior.adRefreshRateMilliSeconds))), vt = i
    }), b = null, {
        GamesListHeaderHeight: it,
        RowHeightIncludingPadding: ht,
        ColumnWidthIncludingPadding: g,
        MaxNumberOfGamesToFetchInHScrollMode: yi,
        getNumberOfColumns: ui,
        handleGamesFilterChangerClick: bt,
        isInHorizontalScrollMode: oi,
        getURLBasedOnSortFilter: ei,
        isTopRatedDefaultToWeeklyEnabled: ri
    }
}();