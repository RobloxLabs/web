Roblox.define('Pages.Catalog', ['Widgets.ItemImage', 'Widgets.HierarchicalDropdown', 'Pages.CatalogShared'], function (itemImage, dropdown) {

    var pagestate; /* Keeps track of what's already selected on the page */
    var creatorName;
    var saveFiltersEnabled = false;

    function init(pagestateInit, totalNumberOfPagesInit, saveFilters) {
        saveFiltersEnabled = saveFilters;
        itemImage.populate();
        $(".roblox-item-image[data-retry-url]").loadRobloxThumbnails();
        pagestate = pagestateInit;
        pagestate.TotalNumberOfPages = totalNumberOfPagesInit;
        pagestate.EmptyStringSearchEnabled = $("#catalog").data("empty-search-enabled");
        /* Enable enter keys on the various things */
        LoadPagingState();
        $('.Paging_Input').keypress(function (e) {
            if (e.which == '13') {
                ChangePageOnPagingInput();
            }
        });

        $('#keywordTextbox').keypress(function (e) {
            if (e.which == '13') {
                SearchOnKeyword();
                return false;
            }
        });
        $('#creatorTextbox').keypress(function (e) {
            if (e.which == '13') {
                SubmitCreator();
                return false;
            }
        });
        $('.pxInput').keypress(function (e) {
            if (e.which == '13') {
                SubmitPriceRange();
                return false;
            }
        });

        $('select#categoriesForKeyword').change(function () {
            if (pagestate.EmptyStringSearchEnabled) {
                SearchOnKeyword(false);
            }
        });

        var legendExpanded = $('#legendcontent').css('display') != 'none';
        $('#legendheader').click(function () {
            if (legendExpanded) {
                $('#legendcontent').hide();

                $(this).removeClass('expanded');
            }
            else {
                $('#legendcontent').show();
                $(this).addClass('expanded');
            }
            legendExpanded = !legendExpanded;
        });

        /* Filters */

        $('.assetTypeFilter').on('click', function () {
            var tryCategory = $(this).data('category');
            var tryKeepFilters = $(this).data('keepfilters');
            if (tryCategory !== undefined) {
                if (tryKeepFilters !== undefined)
                    Clear({ types: true, category: true });
                else
                    ClearAll();
                pagestate.Category = tryCategory;
            }
            var trySubcategory = $(this).data('types');
            if (trySubcategory !== undefined) {
                pagestate.Subcategory = trySubcategory;
            }
            UpdateCatalog(false);
            return false;
        });

        $('.gearFilter').click(function () {
            var tryTypes = $(this).data('types');
            var tryCategory = $(this).data('category');

            // browse dropdown has data-category
            if (tryCategory !== undefined) {
                ClearAll();
                pagestate.Category = tryCategory;
                if (tryTypes != "All") {
                    pagestate.Gears = tryTypes;
                }
            }
            else { // left nav menu
                pagestate.Gears = (tryTypes == "All") ? null : tryTypes;
            }
            UpdateCatalog(false);
        });

        $('.genreFilter').click(function () {
            pagestate.Genres = $('input.genreFilter:checked').map(function () { return $(this).data('genreid'); }).get().toString().split(',');
            if (pagestate.Genres == "") {
                pagestate.Genres = null;
            }
            UpdateCatalog(false);
            return true;
        });

        $('.creatorFilter').click(function () {
            var tryCreator = $(this).data('creatorid');
            pagestate.CreatorID = tryCreator;
            UpdateCatalog(false);
        });

        $('.breadCrumbFilter').click(function () {
            var filter = $(this).data('filter');
            switch (filter) {
                case "category":
                    Clear({ types: true, gears: true, genres: true, creator: true, prices: true, keyword: true });
                    break;
                case "subcategory":
                    Clear({ gears: true, genres: true, creator: true, prices: true, keyword: true });
                    break;
                case "gears":
                    Clear({ genres: true, creator: true, prices: true, keyword: true });
                    break;
                case "genres":
                    Clear({ creator: true, prices: true, keyword: true });
                    break;
                case "creator":
                    Clear({ prices: true, keyword: true });
                    break;
                case "px":
                    Clear({ keyword: true });
                    break;
                case "keyword":
                    // always last, clear nothing
                    break;
            }
            UpdateCatalog(false);
        });

        $('.priceFilter').click(function () {
            pagestate.CurrencyType = $(this).data('currencytype');
            UpdateCatalog(false);
        });

        /* BUTTONS */

        $('#submitCreatorButton').click(SubmitCreator);

        $('#creatorTextbox').focus(function () {
            if ($(this).val() == "Name") $(this).val("");
            $(this).removeClass("Watermark");
        });
        $('#creatorTextbox').blur(function () {
            if ($(this).val() == "") {
                $(this).val('Name');
                $(this).addClass("Watermark");
            }
        });
        $('.pxInput').focus(function () {
            if ($(this).val() == "Min" || $(this).val() == "Max") $(this).val("");
            $(this).removeClass("Watermark");
        });
        $('.pxInput').blur(function () {
            var watermarkStr = $(this).data('watermarktext');
            if ($(this).val() == "") {
                $(this).val(watermarkStr);
                $(this).addClass("Watermark");
            }
        });

        $('#submitPxButton').click(SubmitPriceRange);
        $('a#submitSearchButton').click(SearchOnKeyword);
        $('select#SortMain').change(function () {
            pagestate.SortType = document.getElementById('SortMain').value;
            UpdateCatalog(false);
        });

        $('select#SortAggregation').change(function () {
            pagestate.SortAggregation = document.getElementById('SortAggregation').value;
            pagestate.SortCurrency = null;
            UpdateCatalog(false);
        });

        $('select#SortCurrency').change(function () {
            pagestate.SortCurrency = document.getElementById('SortCurrency').value;
            pagestate.SortAggregation = null;
            UpdateCatalog(false);
        });

        $('#pagingprevious').click(function () {
            if ($(this).hasClass('disabled')) return;
            pagestate.PageNumber--;
            if (pagestate.PageNumber >= 1) {
                UpdateCatalog(true);
            }
        });

        $('#pagingnext').click(function () {
            if ($(this).hasClass('disabled')) return;
            pagestate.PageNumber++;
            UpdateCatalog(true);
        });

        if (Roblox.AdsHelper != undefined && Roblox.AdsHelper.AdRefresher != undefined)
        {
            Roblox.AdsHelper.AdRefresher.registerAd("AdvertisingLeaderboard");
        }
    }

    function SubmitCreator() {
        creatorName = document.getElementById('creatorTextbox').value;
        if (creatorName != "") {
            pagestate.CreatorID = null;
            UpdateCatalog(false);
        }
    }

    function SubmitPriceRange() {
        pagestate.CurrencyType = $('#submitPxButton').data('currencytype');
        var tryPxMin = document.getElementById('pxMinInput').value;
        var tryPxMax = document.getElementById('pxMaxInput').value;
        var isPriceMaxNaN = isNaN(tryPxMax);
        if (tryPxMin != "" && parseInt(tryPxMin) > 0) {
            pagestate.PxMin = tryPxMin;
        } else {
            pagestate.PxMin = null;
        }
        if (tryPxMax != "" && tryPxMax != "0" && !isPriceMaxNaN) {
            pagestate.PxMax = tryPxMax;
        } else {
            pagestate.PxMax = null;
        }
        UpdateCatalog(false);
    }


    function SearchOnKeyword(saveFilters) {
        saveFilters = (typeof saveFilters === "undefined") ? saveFiltersEnabled: saveFilters;
        pagestate.Keyword = encodeURIComponent(document.getElementById('keywordTextbox').value);
        if (pagestate.Keyword == "" && !pagestate.EmptyStringSearchEnabled) return false;

        var trySearchValue = $('#categoriesForKeyword').val();
        if (saveFilters) {
            if (trySearchValue == "Custom") {
                Clear({ sorts: true });
            } else {
                Clear({ category: true, types: true, gears: true });
                pagestate.Category = trySearchValue;
            }
        }
        else {
            if (trySearchValue == "Custom") {
                Clear({ genres: true, creator: true, prices: true, sorts: true });
            } else {
                Clear({ category: true, types: true, gears: true, genres: true, creator: true, prices: true });
                pagestate.Category = trySearchValue;
            }
        }
        UpdateCatalog(false);
        return false;
    }

    function ClearGenres() {
        Clear({ genres: true });
        UpdateCatalog(false);
    }

    function ClearAll() {
        Clear({ category: true, types: true, gears: true, genres: true, creator: true, prices: true, keyword: true });
    }


    /* If the mask property is set to true, it will get cleared */
    function Clear(mask) {
        if (mask.category) pagestate.Category = "";
        if (mask.types) pagestate.Subcategory = "";
        if (mask.gears) pagestate.Gears = null;
        if (mask.genres) pagestate.Genres = null;
        if (mask.creator) pagestate.CreatorID = null;
        if (mask.prices) {
            pagestate.CurrencyType = null;
            pagestate.PxMin = null;
            pagestate.PxMax = null;
            pagestate.IncludeNotForSale = null;
        }
        if (mask.keyword) pagestate.Keyword = null;
        if (mask.sorts) {
            pagestate.SortType = null;
            pagestate.SortAggregation = null;
            pagestate.SortCurrency = null;
        }
    }

    function LoadPagingState() {
        if (pagestate.PageNumber == 1) {
            $('#pagingprevious').addClass('disabled');
        }
        else if (pagestate.PageNumber == pagestate.TotalNumberOfPages) {
            $('#pagingnext').addClass('disabled');
        }
    }

    function ChangePageOnPagingInput() {
        pagestate.PageNumber = Math.round($('input.Paging_Input').val());
        if (pagestate.PageNumber >= 1) {
            if (pagestate.PageNumber > pagestate.TotalNumberOfPages)
                pagestate.PageNumber = pagestate.TotalNumberOfPages;
            UpdateCatalog(true);
        }
    }

    function UpdateCatalog(rememberPage) {
        var url = "/catalog/browse.aspx?";
        var $container;
        var useAjax = false;

        if (Roblox.CatalogValues) {
            if (Roblox.CatalogValues.CatalogContentsUrl && Roblox.CatalogValues.ContainerID) {
                $container = $("#" + Roblox.CatalogValues.ContainerID);
                if ($container.length !== 0) {
                    url = Roblox.CatalogValues.CatalogContentsUrl + "?";
                    useAjax = true;
                }
            }
            if (Roblox.CatalogValues.CatalogContext !== undefined) {
                url += "CatalogContext=" + Roblox.CatalogValues.CatalogContext + "&"
            }
        }

        if (pagestate.Subcategory != null && pagestate.Subcategory != "")
            url += "Subcategory=" + pagestate.Subcategory + "&";
        if (pagestate.Gears != null) {
            url += "Gears=" + pagestate.Gears + "&";
        }
        if (pagestate.Genres != null)
            for (var i = 0; i < pagestate.Genres.length; i++) {
                url += "Genres=" + pagestate.Genres[i] + "&";
            }
        if (pagestate.CreatorID != null && pagestate.CreatorID != 0) {
            url += "CreatorID=" + pagestate.CreatorID + "&";
        }
        else if (creatorName != null) {
            url += "CreatorName=" + creatorName + "&";
        }
        if (pagestate.Keyword != null && pagestate.Keyword != '') {
            url += "Keyword=" + pagestate.Keyword + "&";
        }
        if (pagestate.CurrencyType != null  && pagestate.CurrencyType !== 0 && pagestate.CurrencyType !== '0') {
            url += "CurrencyType=" + pagestate.CurrencyType + "&";
        }
        if (pagestate.PxMin != null && pagestate.PxMin !== 0 && pagestate.PxMin !== '0') {
            url += "pxMin=" + pagestate.PxMin + "&";
        }
        if (pagestate.PxMax != null && pagestate.PxMax !== 0 && pagestate.PxMax !== '0') {
            url += "pxMax=" + pagestate.PxMax + "&";
        }
        if (pagestate.SortType != null && pagestate.SortType!==0 && pagestate.SortType!=='0') {
            url += "SortType=" + pagestate.SortType + "&";
        }
        if (pagestate.SortAggregation != null) {
            url += "SortAggregation=" + pagestate.SortAggregation + "&";
        }
        if (pagestate.SortCurrency != null && pagestate.SortCurrency !== 0 && pagestate.SortCurrency !== '0') {
            url += "SortCurrency=" + pagestate.SortCurrency + "&";
        }
        if (rememberPage && pagestate.PageNumber >= 0) {
            url += "PageNumber=" + pagestate.PageNumber + "&";
        }
        var legendExpandedString = ($('#legendcontent').css('display') != 'none').toString();
        if (legendExpandedString != 'false') {
            url += "LegendExpanded=" + legendExpandedString + "&";
        }

        //even 0 category is required.
        url += "Category=" + pagestate.Category;

        if (useAjax) {
            Roblox.CatalogShared.LoadCatalogAjax(url, null, $container);
        }
        else {
            window.location = url;
        }
    }

    /* Public interface */
    return {
        ClearGenres: ClearGenres,
        pagestate: pagestate,
        init: init,
		initDropdown: dropdown.InitializeDropdown
    };
});