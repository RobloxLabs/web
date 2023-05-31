/**
* sidebarEffects.js v1.0.0
* http://www.codrops.com
*
* Licensed under the MIT license.
* http://www.nav-opensource.org/licenses/mit-license.php
* 
* Copyright 2013, Codrops
* http://www.codrops.com
*/
$(function () {
    "use strict";
    $('#navigation .notification-icon.tooltip-right').tipsy();
    $('.nav-icon .notification-icon.tooltip-bottom').tipsy();

    var forceMenuOpenWidthThreshold = 1359;
    var forceMenuOpenWidthThresholdWithGutterAds = 1480;
    var windowWidth = Roblox.FixedUI.getWindowWidth();
    var forceMenuOpen = windowWidth >= forceMenuOpenWidthThreshold;

    var searchElem = $('.header-2014 .search');
    var searchInput = $('.header-2014 .search input');
    var navContainer = $('.nav-container');

    if (Roblox.FixedUI.isMobile) {
        $('#navigation').addClass('mobile');
    }

    if (!navContainer.hasClass('no-gutter-ads') && windowWidth < forceMenuOpenWidthThresholdWithGutterAds) {
        forceMenuOpen = false;
    }
        
    if (forceMenuOpen) {
        navContainer.addClass('nav-open-static');
    }
        
    function toggleFlyouts(elementToOpen) {
        var openElements = $('.nav-open');

        if (elementToOpen !== undefined) {
            openElements = openElements.not(elementToOpen);
        }

        openElements = openElements.not('.nav-container');

        if (searchElem.hasClass('nav-open')) {
            searchElem.toggleClass('universal-search-open', false);
            searchElem.addClass("closing").delay(300).queue(function (next) {
                $(this).removeClass("closing");
                next();
            });
        }
        openElements.toggleClass("nav-open");

        if (elementToOpen !== undefined) {
            elementToOpen.toggleClass("nav-open");
        }
    }

    //MENU
    $('.nav-icon').on("click", function (event) {

        if (navContainer.hasClass('nav-open-static')) {
            navContainer.removeClass('nav-open-static');
        }
        else {
            navContainer.toggleClass('nav-open');
        }
    });

    $('.tickets-icon, .robux-icon, .tickets-amount, .robux-amount, .settings-icon').on("click mouseover mouseout", function (event) {
        event.stopPropagation();
        event.preventDefault();
        toggleFlyouts($(this).parent());
    });

    //logout link
    $("#lsLoginStatus").on("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        var elem = $("#lsLoginStatus"),
            form = elem.closest('form');
        if (form.length === 0) {
            form = $("<form></form>").appendTo("body");
        }
        form.attr('action', elem.attr('href'));
        form.attr('method', 'post');
        form.submit();
    });

    //HEADER
    $('.header-2014 .search-icon').on("click", function (event) {
        event.stopPropagation();
        var query = searchInput.val();
        if (query.length > 2 && searchElem.hasClass('universal-search-open')) {
            var selectedOption = $('.header-2014 .search .universal-search-option.selected');
            var searchUrl = selectedOption.data('searchurl');
            window.location = searchUrl + encodeURIComponent(query);
        } else {
            toggleFlyouts(searchElem);
            searchInput.focus();
        }
    });

    $(window).resize(function () {
        var width = Roblox.FixedUI.getWindowWidth();
        var threshold = forceMenuOpenWidthThreshold;
        if (!navContainer.hasClass('no-gutter-ads')) {
            threshold = forceMenuOpenWidthThresholdWithGutterAds;
        }
        if (width >= threshold && !(navContainer.hasClass('nav-open') || navContainer.hasClass('nav-open-static'))) {
            navContainer.addClass('nav-open');
        }
        searchElem.toggleClass('universal-search-open', false);
        toggleFlyouts();
    });

    //SEARCH
    function cycleUniversalSearchSelection (event) {
        var searchOptions = $('.header-2014 .search .universal-search-option');
        var selectedIndex = -1;
        $.each(searchOptions, function (index, elem) {
            if ($(elem).hasClass('selected')) {
                $(elem).removeClass('selected');
                selectedIndex = index;
            }
        });
        if (event.which === 38) {
            selectedIndex += searchOptions.length - 1;
        } else {
            selectedIndex += 1;
        }
        selectedIndex %= searchOptions.length;
        $(searchOptions[selectedIndex]).addClass('selected');
    }

    $('.search input').on('keydown', function (event) {
        var query = $(this).val();
        if ((event.which === 9 || event.which === 38 || event.which === 40) && query.length > 0) {
            event.stopPropagation();
            event.preventDefault();
            cycleUniversalSearchSelection(event);
        }
    });

    $('.search input').on('keyup', function (event) {
        var query = $(this).val();
        if (event.which === 13) {
            event.stopPropagation();
            event.preventDefault();
            var selectedOption = $('.header-2014 .search .universal-search-option.selected');
            var searchUrl = selectedOption.data('searchurl');

            if (query.length > 2) {
                window.location = searchUrl + encodeURIComponent(query);
            }
        }
        else if (query.length > 0) {
            searchElem.toggleClass('universal-search-open', true);
            $('.header-2014 .search .universal-search-dropdown .universal-search-string').text('"' + query + '"');
        } else {
            searchElem.toggleClass('universal-search-open', false);
        }
    });

    $('.header-2014 .search .universal-search-option').on("click touchstart", function (event) {
        event.stopPropagation();
        var query = searchInput.val();
        if (query.length > 2) {
            var searchUrl = $(this).data('searchurl');
            window.location = searchUrl + encodeURIComponent(query);
        }
    });
    $('.header-2014 .search .universal-search-option').on("mouseover", function () {
        $('.header-2014 .search .universal-search-option').removeClass('selected');
        $(this).addClass('selected');
    });

    $('.search input').on('focus', function () {
        var query = searchInput.val();
        if (query.length > 0) {
            searchElem.addClass('universal-search-open');
        }
    });

    $('.search input').on("click", function (event) {
        event.stopPropagation(); //otherwise the toggleFlyouts on $(body) is triggered
    });

    $('.under-13').tipsy({ gravity: 'n' });

    //OTHER
    $('.nav-content, .navigation, .header-2014').on("click", function () {
        toggleFlyouts(undefined);
        searchElem.toggleClass('universal-search-open', false);
    });

    $('.navigation, .notifications-container, .tickets-container, .robux-container').on("click", 'a, a > span', function (event) {
        event.stopPropagation();
    });
});