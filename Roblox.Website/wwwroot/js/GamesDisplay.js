
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function UpdatePageAndShow() {
    GamesDisplay.SetCurrentPageNum(1);
    if (BCOnlyGamesDisplay != null) {
        BCOnlyGamesDisplay.SetCurrentPageNum(1);
    }
    GamesDisplay.UpdateAddress();
    GamesDisplay.ShowGames();
    if (BCOnlyGamesDisplay != null) {
        BCOnlyGamesDisplay.ShowGames();
    }
}
function GamesPageInit(hideBCGamesOnGenreSearchAB) {
    // These HAVE TO BE FIRST
    $.address.crawlable(true);
    $.address.autoUpdate(false);

    $.address.change(function (event) {
    });

    SetupDisplay(GamesDisplay, "#GamesContent", defaultParamData, defaultSeedData, pageSize);
    if (BCOnlyGamesDisplay != null) {
        $('#ShowBCOnlyGamesAlignmentDiv').addClass('divider-top');
        $('#ShowBCOnlyGamesAlignmentDiv').css('padding-top', '35px');
        SetupDisplay(BCOnlyGamesDisplay, "#BCOnlyGamesContent", defaultBCOnlyParamData, defaultBCOnlySeedData, BCOnlyPageSize);
    }

    //TODO: Fix this
    //Roblox.GamesDisplayShared.hookUpSearch();

    // Bind the Games/Personal server tabs
    $('.GamesType').click(function () {
        var type = $(this).attr('type');
        CreateGamesDisplay.prototype.SetGamesType(type);
        UpdatePageAndShow();
        return false;
    });

    // Bind all of the play/build tabs
    $('.GamesSort').click(function () {
        if ($(this).attr('disabled') == 'disabled')
            return false;
        // Get the sort
        var sortType = $(this).attr("sort");
        CreateGamesDisplay.prototype.SetSortType(sortType);
        UpdatePageAndShow();
        return false;
    });

    // Bind the filter links
    $('.GamesFilter').click(function () {
        if ($(this).attr('disabled') == 'disabled')
            return false;
        // Change the page
        var filterType = $(this).attr('filter');
        CreateGamesDisplay.prototype.SetFilterType(filterType);
        UpdatePageAndShow();

        return false;
    });

    // Bind the genre links
    $('.GamesGenre').click(function () {
        return false;
    });
    $('.GamesGenre').click(function () {
        if ($(this).attr('disabled') == 'disabled')
            return false;
        // Change the page
        var genreType = $(this).attr('genre');
        CreateGamesDisplay.prototype.SetGenreType(genreType);
        UpdatePageAndShow();

        if (hideBCGamesOnGenreSearchAB) {
            if ($(this).attr('genre') === "all") {
                $('#BCOnlyPlaces').show();
                $('[roblox-bc-games-clear]').show();
                $('#ShowBCOnlyGamesAlignmentDiv').addClass('divider-top').css("padding-top", "35px");
                $('#GamePageAdDiv').css('padding-bottom', '0px');
            } else {
                $('#BCOnlyPlaces').hide();
                $('[roblox-bc-games-clear]').hide();
                $('#ShowBCOnlyGamesAlignmentDiv').removeClass('divider-top').css("padding-top", "5px");
                $('#GamePageAdDiv').css('padding-bottom', '30px');
            }
        }
        return false;
    });

    var bcGamesPrevButton = $('#BCOnlyGamesContentPrevNavButton');
    bcGamesPrevButton.click(function () {
        if (!bcGamesPrevButton.hasClass('disabled')) {
            BCOnlyGamesDisplay.ChangePage('Prev');
        }
    });
    var bcGamesNextButton = $('#BCOnlyGamesContentNextNavButton');
    bcGamesNextButton.click(function () {
        if (!bcGamesNextButton.hasClass('disabled')) {
            BCOnlyGamesDisplay.ChangePage('Next');
        }
    });
    var gamesPrevButton = $('#GamesContentPrevNavButton');
    gamesPrevButton.click(function () {
        if (!gamesPrevButton.hasClass('disabled')) {
            GamesDisplay.ChangePage('Prev');
            GamesDisplay.UpdateAddress();
        }
    });
    var gamesNextButton = $('#GamesContentNextNavButton')
    gamesNextButton.click(function () {
        if (!gamesNextButton.hasClass('disabled')) {
            GamesDisplay.ChangePage('Next');
            GamesDisplay.UpdateAddress();
        }
    });

    // Init and change handlers
    $.address.externalChange(function (event) {
        GamesDisplay.LoadFromUrl();
    });

    Roblox.AdsHelper.AdRefresher.registerAd("AdvertisingLeaderboard");
    Roblox.AdsHelper.AdRefresher.registerAd("GamePageAdDiv");
    Roblox.AdsHelper.AdRefresher.registerAd("LeftGutterAdContainer");
    Roblox.AdsHelper.AdRefresher.registerAd("RightGutterAdContainer");
}

/* 
Defined after function, but here for visibility:
CreateGamesDisplay.prototype._gamesType = 'Play';   // Possibles: Play, Build
CreateGamesDisplay.prototype._sortType = { 'Play': 'MostPopular', 'Build': 'MostPopular' }; // Associative array for currently selected tabs
CreateGamesDisplay.prototype._filterType = 'Now';   // Possibles: Now, PastDay, PastWeek, AllTime
CreateGamesDisplay.prototype._genreType = 'all';    // Possibles: All, TownandCity, Fantasy, etc...
*/

function CreateGamesDisplay() {
    // These never get changed
    var _pageSize = 20;
    var _renderTo;
    var _isPageLoad = true;
    var _minBCLevel = 'None';   // Possibles: None, BC, TBC, OBC

    // These record the active state
    var _totalNumPages = []; // Associate array per tab type. Key is the following: gametypesortfiltergenre, generated from CreateGamesDisplay.prototype._GenerateComboKey
    var _currentPageNums = [];   // Associate array per tab type. Key is the following: gametypesortfiltergenre, generated from CreateGamesDisplay.prototype._GenerateComboKey
    var _currentCompleteKey = ""; // Used to avoid concurrency if they change pages before response has returned
    var _data = new Array(); // Games data storage for caching...  Key is the following: gametypesortfiltergenre, generated from CreateGamesDisplay.prototype._GenerateComboKey

    function _GenerateGameObject(game) {
        var p = CreateGamesDisplay.prototype;
        var template = $('#PlaceTemplate').clone();

        var gameName = game.Name;
        gameName = fitStringToWidth(gameName, 160, "GameName"); // Truncate to 160 px with class GameName (bold, 12px)

        template.find(".roblox-thumbnail").attr('href', game.NavigateUrl).html("<img src='" + game.ThumbnailUrl + "'/>");
        template.find(".roblox-game-url").attr('href', game.NavigateUrl).text(gameName);
        template.find(".roblox-plays-count").text(game.Stats.PlaysCount);
        template.find(".roblox-creator-url").attr('href', game.Creator.Url.replace("~", "")).text(game.Creator.Name);
        template.find(".roblox-fav-count").text(game.Stats.FavoritesCount);
        template.find(".roblox-last-update").text(game.Stats.LastUpdated);
        if (game.Purchase)
			if (game.Purchase.ForSale)
				template.find(".robux-price").addClass("robux").text(game.Purchase.Price);


        if (game.Stats.CurrentPlayersCount == 1) {
            template.find(".roblox-player-count").text(game.Stats.CurrentPlayersCount);
            template.find(".roblox-player-text").html("&nbsp;player online");
        } else {
            template.find(".roblox-player-count").text(addCommas(game.Stats.CurrentPlayersCount));
            template.find(".roblox-player-text").html("&nbsp;players online");
        }

        if (game.Stats.CurrentPlayersCount <= 0) {
            var playerCount = template.find('.PlayerCount');
            playerCount.hide();
            playerCount.attr('noplayers', 'true');
        }
        template.find('.GenreIcon').attr('src', game.GenreIcon.Url.replace("~", "")).attr('alt', game.GenreIcon.Alt);
        template.find('.GearIcon').attr('src', game.GearIcon.Url.replace("~", "")).attr('alt', game.GearIcon.Alt);

        if (game.BCOverlay.Url != null) {
            template.find('.AlwaysShown').append('<img class="BCOverlay" src="' + game.BCOverlay.Url + '" alt="' + game.BCOverlay.Alt + '" />');
        }

        if (game.PersonalPlaceOverlay.Url != null) {
            template.find('.AlwaysShown').append('<img class="MegaOverlay" src="' + game.PersonalPlaceOverlay.Url + '" alt="' + game.PersonalPlaceOverlay.Alt + '" />');
        }
        else if (game.MegaOverlay.Url != null) {
            template.find('.AlwaysShown').append('<img class="MegaOverlay" src="' + game.MegaOverlay.Url + '" alt="' + game.MegaOverlay.Alt + '" />');
        }

        template.attr('title', game.Name);

        // Bind hover controls
        template.find('.AlwaysShown').hover(
            function () {
                $(this).children('.CreatorName').show();
                $(this).children('.Price').show();
                var playerCount = $(this).children('.PlayerCount');
                if (playerCount.attr('noplayers') === 'true')
                    playerCount.show();
                $(this).siblings('.HoverShown').show();
            },
            function () {
                $(this).children('.CreatorName').hide();
                $(this).children('.Price').hide();

                var playerCount = $(this).children('.PlayerCount');
                if (playerCount.attr('noplayers') === 'true')
                    playerCount.hide();
                $(this).siblings('.HoverShown').hide();
            }
        );

        // Bind Click Tracking
        template.find('.GameClick').click(
            function () {
                $(this).append('<img src="/Games/LogGameClick?filter=' + p._sortType[p._gamesType] + '&cachebuster=' + $.now() + '" width="1" height="1"/>');
            }
        );
        return template;
    }

    // Refers to everything INCLUDING page number
    function _GenerateCurrentCompleteKey() {
        var p = CreateGamesDisplay.prototype;
        var currComboKey = p._GenerateCurrentComboKey();
        var pageNum = _GetCurrentPageNum();
        return _GenerateCompleteKey(p._gamesType, p._sortType[p._gamesType], p._filterType, p._genreType, pageNum);
    }
    function _GenerateCompleteKey(gamesType, sortType, filterType, genreType, pageNum) {
        return gamesType + sortType + filterType + genreType + pageNum;
    }
    function _GetPageNum(pageNumKey) {

        // If the page num value is not yet set, set it to 1
        if (typeof _currentPageNums[pageNumKey] == 'undefined') {
            _currentPageNums[pageNumKey] = 1;
            return 1;
        }
        else {
            return _currentPageNums[pageNumKey];
        }
    }
    function _GetCurrentPageNum() {

        var pageNumKey = CreateGamesDisplay.prototype._GenerateCurrentComboKey();

        // If the page num value is not yet set, set it to 1
        if (typeof _currentPageNums[pageNumKey] == 'undefined') {
            _currentPageNums[pageNumKey] = 1;
            return 1;
        }
        else {
            return _currentPageNums[pageNumKey];
        }
    }
    function _GetTotalPages(pageNumKey) {
        // If the page num value is not yet set, set it to 1
        if (typeof _totalNumPages[pageNumKey] == 'undefined') {
            _totalNumPages[pageNumKey] = 1;
            return 1;
        }
        else {
            return _totalNumPages[pageNumKey];
        }
    }
    function _SetTotalPages(key, totalPages) {

        _totalNumPages[key] = totalPages;
    }

    // Takes JSON Data and stores it in a JS array of the actual HTML
    // Example: Play, Popular, Now, All page 5 of data would generate a key for Play,
    // Popular, Now, and All, and put the data in the (5-1)*20 = 80 through 99th slots of that array 
    function _StoreJSONData(gamesType, sortType, filterType, genreType, pageNum, data) {
        var completeKey = _GenerateCompleteKey(gamesType, sortType, filterType, genreType, pageNum);
        var comboKey = CreateGamesDisplay.prototype._GenerateComboKey(gamesType, sortType, filterType, genreType);
        _SetTotalPages(comboKey, parseInt(data.TotalPages));

        //        if (typeof _data[completeKey] == 'undefined')
        //            _data[completeKey] = new Array();

        _data[completeKey] = data.Items;
    }
    function _ResultsAreInDataStore(dataAccessKey) {
        return typeof _data[dataAccessKey] != 'undefined' && _data[dataAccessKey].length > 0; // Just make sure there's at least 1 on page in the data store
    }
    function _GetResultsFromDataStore(dataAccessKey) {
        return _data[dataAccessKey];
    }

    function _RenderCurrentView() {
        var html = $(document.createElement('div'));

        var comboKey = CreateGamesDisplay.prototype._GenerateCurrentComboKey();
        var currPageNum = _GetCurrentPageNum();

        var pageNumCounter = $(_renderTo + 'TotalPageNums');
        if (pageNumCounter != null)
            $(pageNumCounter).html(_GetTotalPages(comboKey)); // bind our total page count

        // Disable / Enabled paging arrows
        _UpdatePagingControls();

        var dataAccessKey = _GenerateCurrentCompleteKey();

        if (_ResultsAreInDataStore(dataAccessKey)) {
            var data = _GetResultsFromDataStore(dataAccessKey);
            for (var i = 0; i < data.length; i++) // should always be 20, but possibly less with paging / data corruption
            {
                html.append(_GenerateGameObject(data[i]));
            }
        }

        html.append('<img src="/Games/LogGameImpression?filter=' + CreateGamesDisplay.prototype._sortType[CreateGamesDisplay.prototype._gamesType] + '&cachebuster=' + $.now() + '" width="1" height="1"/>');

        $(_renderTo).html(html);
    }
    function _UpdatePagingControls() {
        // Change the text
        var pageKey = CreateGamesDisplay.prototype._GenerateCurrentComboKey();
        var pageNum = _GetCurrentPageNum();
        var totalPages = _GetTotalPages(pageKey);
        $(_renderTo + 'CurrPageNum').html(pageNum);
        if (totalPages <= 1 && _renderTo != "#BCOnlyGamesContent") {
            $(_renderTo + 'Pager').css('visibility', 'hidden');
        } else {
            $(_renderTo + 'Pager').css('visibility', 'visible');
            if (totalPages <= pageNum)
                $(_renderTo + 'NextNavButton').addClass('disabled');
            else
                $(_renderTo + 'NextNavButton').removeClass('disabled');

            if (pageNum == 1)
                $(_renderTo + 'PrevNavButton').addClass('disabled');
            else
                $(_renderTo + 'PrevNavButton').removeClass('disabled');
        }
    }
    /** Public **/
    this.SetCurrentPageNum = function (pageNum) {
        var pageKey = CreateGamesDisplay.prototype._GenerateCurrentComboKey();
        _currentPageNums[pageKey] = pageNum;

        _UpdatePagingControls();
    };
    this.UpdateAddress = function () {
        var p = CreateGamesDisplay.prototype;

        // Set our current URL params
        $.address.path(p._genreType + "-games");
        $.address.parameter('GameType', p._gamesType);
        var currSort = p._GetCurrentSortType();
        if (currSort == p._defaultSort)
            $.address.parameter('m', '');
        else if (currSort == 'Popular' || currSort == 'MostPopular') // Backwards compatible with MostPopular
            $.address.parameter('m', 'MostPopular');
        else
            $.address.parameter('m', currSort);
        $.address.parameter('t', p._filterType);
        var currPageNum = _GetCurrentPageNum();
        if (currPageNum == 1)
            $.address.parameter('p', '');
        else
            $.address.parameter('p', currPageNum);

        $.address.update();
    };
    this.ShowGames = function () {
        var p = CreateGamesDisplay.prototype;
        // Values could have changed in the above method call
        var gamesType = p._gamesType;
        var pageNum = _GetCurrentPageNum();
        var filterType = p._filterType;
        var genreType = p._genreType;
        var sortType = p._GetCurrentSortType();

        // Set our new key/hash of the current state
        _currentCompleteKey = _GenerateCurrentCompleteKey(); // Used to detect if user has left complete combo by the time the data returns

        // If it's already in cache, just re-fetch it and render
        var dataAccessKey = _currentCompleteKey;
        if (_ResultsAreInDataStore(dataAccessKey)) {
            _RenderCurrentView();
            return;
        }

        // Otherwise tell them we're loading and fetch from server

        var resultController = "GetGames.ashx";
        if (sortType == "RecentlyVisited")
            resultController = "GetRecentlyVisitedPlaces.ashx";

        var nocache = new Date().getMilliseconds().toString();
        $.getJSON(resultController,
            {
                //"nocache": nocache, // odd that is needed b/c page num is changing, but in IE it is for some reason
                GameType: gamesType,
                m: sortType,
                t: filterType,
                g: genreType,
                MinBCLevel: _minBCLevel,
                p: pageNum,
                PageSize: _pageSize
            },
            function (data) {
                // Store the data
                _StoreJSONData(gamesType, sortType, filterType, genreType, pageNum, data);

                var preFetchKey = _GenerateCompleteKey(gamesType, sortType, filterType, genreType, pageNum);

                // Check to see if the user has clicked away
                if (preFetchKey != _currentCompleteKey) {
                    return; // Just break out (we've cached the data for rendering later)
                }

                // Render it
                _RenderCurrentView();
            });
    };
    this.SetPageSize = function (size) {
        _pageSize = size;
    };
    this.LoadFromUrl = function () {
        // This sucks.  Unfortunately Chrome seems to be calling LoadFromUrl twice and the second time we
        // can't access anything from $.address, which is messing up the combo.  So we're using this to make sure we only ever load from the url when appropriate
        if (_isPageLoad) {
            _isPageLoad = false;
            return;
        }

        var genreType = "all";
        // If we're going back to a url of the form: www.roblox.com/medieval-games?t=PastDay we won't have 
        // anything in the $.address library form (no hash, path, etc). So we have to resort to looking at location and query string.
        if ($.address.parameter('g') != null)
            genreType = $.address.parameter('g');
        else if (getParameterByName('g') != '')
            genreType = getParameterByName('g');
        else if ($.address.path() != '/')
            genreType = $.address.path().replace('/', '').replace('-games', '');
        else {
            var location = window.location.href;
            var indexHyphen = location.indexOf("-games");
            var indexOfCom = location.indexOf(".com/");
            if (indexHyphen > 0 && indexOfCom > 0) {
                genreType = location.substr(indexOfCom + 5, indexHyphen - (indexOfCom + 5));
            }
        }

        var filterType = 'Now';
        if ($.address.parameter('t') != null)
            filterType = $.address.parameter('t');
        else if (getParameterByName('t') != '')
            filterType = getParameterByName('t');

        var sortType = this._defaultSort;
        if ($.address.parameter('m') != null)
            sortType = $.address.parameter('m');
        else if (getParameterByName('m') != '')
            sortType = getParameterByName('m');

        if ($.inArray(sortType, CreateGamesDisplay.prototype._possibleSortTypes) == -1) // Backwards compatibility for "RecentlyUpdated"
            sortType = this._defaultSort;

        var pageNum = 1;
        if ($.address.parameter('p') != null)
            pageNum = parseInt($.address.parameter('p'));
        else if (getParameterByName('p') != '')
            pageNum = parseInt(getParameterByName('p'));

        var gamesType = 'Play';

        CreateGamesDisplay.prototype._UpdatePageState(gamesType, sortType, filterType, genreType);
        this.SetCurrentPageNum(pageNum);
        this.ShowGames();
    };
    this.Init = function (seedParams, seedData, renderTo) {
        var gameType = seedParams.GameTypeString;
        var sortType = seedParams.SortString;
        var filterType = seedParams.FilterString;
        var genreType = seedParams.GenreString;
        var pageNum = parseInt(seedParams.PageNumString);

        _minBCLevel = seedParams.MinBCLevelString;
        _renderTo = renderTo;

        _StoreJSONData(gameType, sortType, filterType, genreType, pageNum, seedData);
        CreateGamesDisplay.prototype._SetActiveTab(gameType, sortType);
        CreateGamesDisplay.prototype._SetCurrentCombo(gameType, sortType, filterType, genreType, true);
        this.SetCurrentPageNum(pageNum);
        _RenderCurrentView();
    };
    this.ChangePage = function (direction) {
        if (direction == 'Next') {
            this.SetCurrentPageNum(_GetCurrentPageNum() + 1);
            this.ShowGames();
        }
        else if (direction == 'Prev') {
            this.SetCurrentPageNum(_GetCurrentPageNum() - 1);
            this.ShowGames();
        }
        if (_minBCLevel == "None") // Only refresh ads on non bc-only place paging
        {
            Roblox.AdsHelper.AdRefresher.refreshAds();
        }
    };
}
CreateGamesDisplay.prototype._GetCurrentSortType = function () {
    var p = CreateGamesDisplay.prototype;
    return p._sortType[p._gamesType];
};

// Refers to everything EXCEPT page number
CreateGamesDisplay.prototype._GenerateCurrentComboKey = function () {
    var p = CreateGamesDisplay.prototype;
    return p._GenerateComboKey(p._gamesType, p._sortType[p._gamesType], p._filterType, p._genreType);
};
CreateGamesDisplay.prototype._GenerateComboKey = function (gamesType, sortType, filterType, genreType) {
    return gamesType + sortType + filterType + genreType;
};
CreateGamesDisplay.prototype._SetCurrentCombo = function (gamesType, sortType, filterType, genreType, initialLoad) {
    var p = CreateGamesDisplay.prototype;
    var hasChanged = false;
    var gamesTypeChanged = false;
    if (p._gamesType != gamesType) {
        hasChanged = true;
        gamesTypeChanged = true;
        p._gamesType = gamesType;
    }
    if (p._filterType != filterType) // This has to come before Sort because of TopFavorites not allowing "Now" filter
    {
        hasChanged = true;
        p._filterType = filterType;
        //Toggle the link to bold (remove old selected link)
        $('.SelectedFilter').removeClass('SelectedFilter');
        $('#Timespan').find('[filter="' + p._filterType + '"]').addClass('SelectedFilter');
    }
    if (p._sortType[gamesType] != sortType || gamesTypeChanged || initialLoad) {
        hasChanged = true;
        p._sortType[gamesType] = sortType;
        $('.SelectedSort').removeClass('SelectedSort');
        $('#Sort').find('[sort="' + sortType + '"]').addClass('SelectedSort');
        // Relevance & TopGrossing & Purchased do not support time filters, so hide them
        if ((sortType == "Relevance") || (sortType == "TopGrossing") || (sortType == "Purchased")) {
            $('#Timespan').hide();
        }
        else {
            $('#Timespan').show();
        }
        // TopFavorites does not support the "Now" filter, so we need to disable and change it if it's the current filter
        if (sortType == "TopFavorites") {
            if (p._filterType == "Now") {
                p._filterType = "PastWeek";
                $('.SelectedFilter').removeClass('SelectedFilter');
                $('#Timespan').find('[filter="' + p._filterType + '"]').addClass('SelectedFilter');
            }


            $('#Timespan').find('.DisabledFilter').removeAttr('disabled');
            $('#Timespan').find('.DisabledFilter').removeClass('DisabledFilter');
            $('#Timespan').find('.SelectedFilter').removeClass('SelectedFilter');
            $('#Timespan').find('[filter="' + p._filterType + '"]').addClass('SelectedFilter');

            var now = $('#Timespan').find('[filter="Now"]');
            now.attr('disabled', 'disabled');
            now.addClass('DisabledFilter');
            //now.css('color', 'black');


            $('#Genres').find('.DisabledFilter').removeAttr('disabled');
            $('#Genres').find('.DisabledFilter').removeClass('DisabledFilter');
            $('#Genres').find('[genre="' + p._genreType + '"]').addClass('SelectedGenre');

        }
        else if (sortType == "MyFavorites" || sortType == "RecentlyVisited") {
            $('#Timespan').find('.GamesFilter').addClass('DisabledFilter');
            $('#Timespan').find('.GamesFilter').attr('disabled', 'disabled');
            $('#Timespan').find('.SelectedFilter').removeClass('SelectedFilter');

            $('#Genres').find('.GamesGenre').addClass('DisabledFilter');
            $('#Genres').find('.GamesGenre').attr('disabled', 'disabled');
            $('#Genres').find('.SelectedGenre').removeClass('SelectedGenre');
        }
        else if (sortType == 'Featured') {
            $('#Timespan').find('.GamesFilter').addClass('DisabledFilter');
            $('#Timespan').find('.GamesFilter').attr('disabled', 'disabled');
            $('#Timespan').find('.SelectedFilter').removeClass('SelectedFilter');

            $('#Genres').find('.GamesGenre').addClass('DisabledFilter');
            $('#Genres').find('.GamesGenre').attr('disabled', 'disabled');
            $('#Genres').find('.SelectedGenre').removeClass('SelectedGenre');
        }
        else {
            var now = $('#Timespan').find('[filter="Now"]');
            now.removeAttr('disabled');
            now.removeClass('DisabledFilter');
            //now.css('color', '');

            //remove the class of disabled filter and find the selected filter type and apply that
            $('#Timespan').find('.DisabledFilter').removeAttr('disabled');
            $('#Timespan').find('.DisabledFilter').removeClass('DisabledFilter');
            $('#Timespan').find('.SelectedFilter').removeClass('SelectedFilter');
            $('#Timespan').find('[filter="' + p._filterType + '"]').addClass('SelectedFilter');

            $('#Genres').find('.DisabledFilter').removeAttr('disabled');
            $('#Genres').find('.DisabledFilter').removeClass('DisabledFilter');
            $('#Genres').find('[genre="' + p._genreType + '"]').addClass('SelectedGenre');
        }
    }
    if (p._genreType != genreType) {
        hasChanged = true;
        p._genreType = genreType;

        //Toggle the link to bold (remove old selected link)
        $('.SelectedGenre').removeClass('SelectedGenre');
        $('#Genres').find('[genre="' + p._genreType + '"]').addClass('SelectedGenre');
    }

    // Some hackery to disable all links for Build tab - delete when all filters are working
    if (gamesType == 'Build') {
        p._sortType[gamesType] = this._defaultSort;
        p._filterType = 'Now';

        $('#Sort').find('.GamesSort').addClass('DisabledFilter');
        $('#Sort').find('.GamesSort').attr('disabled', 'disabled');
        $('#Sort').find('.SelectedSort').removeClass('SelectedSort');
        $('#Sort').find('[sort="' + p._sortType[gamesType] + '"]').removeClass('DisabledFilter').addClass('SelectedSort').removeAttr('disabled');

        $('#Timespan').find('.GamesFilter').addClass('DisabledFilter');
        $('#Timespan').find('.GamesFilter').attr('disabled', 'disabled');
        $('#Timespan').find('.SelectedFilter').removeClass('SelectedFilter');
        $('#Timespan').find('[filter="Now"]').removeClass('DisabledFilter').addClass('SelectedFilter');
    }
    else {
        $('#Sort').find('.DisabledFilter').removeAttr('disabled');
        $('#Sort').find('.DisabledFilter').removeClass('DisabledFilter');
    }

    if (!hasChanged)  // Prevents infinite looping
        return;

    // Loop through and update other links
    UpdateSortLinks();
    UpdateGenreLinks();
    UpdateFilterLinks();
};
CreateGamesDisplay.prototype._SetActiveTab = function (gamesType, sortType) {
    var p = CreateGamesDisplay.prototype;
    // Change games type
    if (gamesType != p._gamesType) {
        var oldActiveTab = $('#PlayTabs .GamesType.active');
        var newActiveTab = $('#PlayTabs .GamesType[type=' + gamesType + ']');

        oldActiveTab.removeClass('active');
        newActiveTab.addClass('active');
    }
};

CreateGamesDisplay.prototype._UpdatePageState = function (gamesType, sortType, filterType, genreType) {
    // Change the tabs visually
    CreateGamesDisplay.prototype._SetActiveTab(gamesType, sortType);

    // Set the current combo values
    CreateGamesDisplay.prototype._SetCurrentCombo(gamesType, sortType, filterType, genreType);

    // Refresh Ads
    Roblox.AdsHelper.AdRefresher.refreshAds();
};
CreateGamesDisplay.prototype.SetGamesType = function (gamesType) {
    var p = CreateGamesDisplay.prototype;
    // We're changing between Play / Build
    if (gamesType != p._gamesType) {
        var sortType = p._sortType[gamesType]; // Get the sort type for the specific games type
        var pageNumKey = p._GenerateComboKey(gamesType, sortType, p._filterType, p._genreType);

        p._UpdatePageState(gamesType, sortType, p._filterType, p._genreType);
    }
};
CreateGamesDisplay.prototype.SetSortType = function (sortType) {
    var p = CreateGamesDisplay.prototype;
    // Changing between MostPopular / TopFavorites, etc.
    if (sortType != p._sortType[p._gamesType]) {
        p._UpdatePageState(p._gamesType, sortType, p._filterType, p._genreType);
    }
};
CreateGamesDisplay.prototype.SetFilterType = function (filterType) {
    var p = CreateGamesDisplay.prototype;
    // Changing between Now / Past Day, etc.
    if (filterType != p._filterType) {
        var sortType = p._sortType[p._gamesType]; // Get the sort type for the specific games type
        p._UpdatePageState(p._gamesType, sortType, filterType, p._genreType);
    }
};
CreateGamesDisplay.prototype.SetGenreType = function (genreType) {
    var p = CreateGamesDisplay.prototype;
    // Changing between All / Town and City, etc.
    if (genreType != p._genreType) {
        var sortType = p._sortType[p._gamesType]; // Get the sort type for the specific games type
        p._UpdatePageState(p._gamesType, sortType, p._filterType, genreType);
        // Update the genre description panel
        var genresInfoText = unescape($('.GamesGenre[genre="' + genreType + '"]').attr('genresinfotext'));
        $('#GenreDescriptionPanelGenresInfoText').html(genresInfoText);
    }
};

function GenerateGamesLink(newSort, newGenre, newFilter) {
    var oldPath = $.address.value();

    if (newGenre) {
        $.address.path(newGenre + '-games');
    }
    if (newSort) {
        $.address.parameter('m', newSort);
    }
    if (newFilter) {
        $.address.parameter('t', newFilter);
    }

    var newLink = $.address.value();
    $.address.value(oldPath);

    return newLink;
}

function UpdateSortLinks() {
    $('.GamesSort').each(function () {
        var newSort = $(this).attr('sort');
        var newHash = GenerateGamesLink(newSort, null, null);
        $(this).attr('href', newHash);
    });
}

function UpdateGenreLinks() {
    $('.GamesGenre').each(function () {
        var newGenre = $(this).attr('genre');
        var newHash = GenerateGamesLink(null, newGenre, null);
        $(this).attr('href', newHash);
    });
}

function UpdateFilterLinks() {
    $('.GamesFilter').each(function () {
        var newFilter = $(this).attr('filter');
        var newHash = GenerateGamesLink(null, null, newFilter);
        $(this).attr('href', newHash);
    });
}

function SetupDisplay(display, renderTo, defaultParamData, defaultSeedData, pageSize) {
    var paramJSON = defaultParamData;
    var seedJSON = defaultSeedData;

    display.SetPageSize(pageSize);

    // Set the seed data and render
    display.Init(paramJSON, seedJSON, renderTo);
}

CreateGamesDisplay.prototype._defaultSort = 'Relevance';
CreateGamesDisplay.prototype._gamesType = 'Play';   // Possibles: Play, Build
CreateGamesDisplay.prototype._possibleSortTypes = ['MostPopular', 'TopFavorites', 'Featured', 'Relevance', 'TopGrossing', 'Purchased'];
CreateGamesDisplay.prototype._sortType = { 'Play': CreateGamesDisplay.prototype._defaultSort, 'Build': CreateGamesDisplay.prototype._defaultSort }; // Associative array for currently selected tabs
CreateGamesDisplay.prototype._filterType = 'Now';   // Possibles: Now, PastDay, PastWeek, AllTime
CreateGamesDisplay.prototype._genreType = 'all';    // Possibles: All, TownandCity, Fantasy, etc...
