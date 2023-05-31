/*
    List of parameters:
    totalItems  - total items in dataset
    itemsPerPage - number of items shown at a time
    itemContainerDivID - id of the div that will contain the data objects
    pagerContainerDivID - id of the div that will contain the paging controls
    GetItemsPaged_Function - javascript function that will make the request for the objects. It is assumed the function will return itemsPerPage number of items
    ItemFormatter_Function(obj) - javascript function that takes in one of the objects returned in the GetItemsPaged function, and expects a string of html to
         append to the itemContainer div
    ItemFormatterCallback_Function(obj) - javascript function that is called after each item is appended to the html markup. If something must be done (event
        binding, string shortening) after the item is inserted into the page, this is where it is done. The same object that is passed to the ItemFormatter
        function is passed to this one.
    pagerOptions (obj) - object with various options. Currently includes:
            Paging_PageNumbers_AreLinks - set to false to have the page numbers appear as Page 1 of 100, instead of 1 2 3... and clickable
*/

function DataPager(totalItems, itemsPerPage, itemContainerDivID, pagerContainerDivID, GetItemsPaged_Function, ItemFormatter_Function,ItemFormatterCallback_Function, pagerOptions) {
    
    if (!(this instanceof DataPager)) {
        return new DataPager(totalItems, containerDivID, GetItemsPaged_Function, ItemFormatter_Function);
    }

    var totalItems = totalItems;
    var itemsPerPage = itemsPerPage;
    var currentPage = 1;
    var maxPage = Math.ceil(totalItems / itemsPerPage);
    var itemContainerDiv = $('#' + itemContainerDivID);
    var pagerContainerDiv = $('#' + pagerContainerDivID);
    var getItemsPaged = GetItemsPaged_Function;
    var itemFormatter = ItemFormatter_Function;
    var itemFormatterCallback = ItemFormatterCallback_Function;

    //default options
    var options = {
        Paging_PageNumbers_AreLinks: true,
        FetchItemsOnLoad: true,
        pagingClickFunction: false
    };
    for(var op in pagerOptions) {
        options[op] = pagerOptions[op];
    }
    function updatePager() {
        if (currentPage < 1)
            currentPage = 1;
        if (currentPage > maxPage)
            currentPage = maxPage;

        pagerContainerDiv.find(".disabled").removeClass('disabled');
        
        if (!options.Paging_PageNumbers_AreLinks) {
            pagerContainerDiv.find('.CurrentPage').text(currentPage);
        } else {
            pagerContainerDiv.find(":contains('" + currentPage + "')").addClass('disabled'); //how to differentiate 10 and 1?
        }

        if (currentPage == 1) {
            pagerContainerDiv.find('[pagingaction="First"]').addClass('disabled');
            pagerContainerDiv.find('[pagingaction="Previous"]').addClass('disabled');
            pagerContainerDiv.find('[pagingaction="Next"]').removeClass('disabled');
            pagerContainerDiv.find('[pagingaction="Last"]').removeClass('disabled');
        }
        if (currentPage == maxPage) {
            pagerContainerDiv.find('[pagingaction="First"]').removeClass('disabled');
            pagerContainerDiv.find('[pagingaction="Previous"]').removeClass('disabled');
            pagerContainerDiv.find('[pagingaction="Next"]').addClass('disabled');
            pagerContainerDiv.find('[pagingaction="Last"]').addClass('disabled');
        }
    }

    function pagingClick() {
        elem = $(this);
        if (elem.hasClass('disabled') || elem.attr('pagingaction') === undefined) {
            return;
        }

        currentPage = parseInt(currentPage,10);
        switch (elem.attr('pagingaction')) {
            case 'First':
                currentPage = 1;
                break;
            case 'Previous':
                currentPage -= 1;
                break;
            case 'Next':
                currentPage += 1;
                break;
            case 'Last':
                currentPage = maxPage;
                break;
            default:
                currentPage = elem.html();
                break;
        }

        if (currentPage < 1)
            currentPage = 1;
        if (currentPage > maxPage)
            currentPage = maxPage;
        
        

        if (!options.pagingClickFunction) {
            itemContainerDiv.html('<div class="loading"></div>');
            getItemsPaged((currentPage - 1) * itemsPerPage + 1, itemsPerPage);
        } else {
            options.pagingClickFunction(currentPage); // for example, pushes state.
        }
    };

    var updateHtml = function (response) {
        itemContainerDiv.html('');
        var data = response;
        itemContainerDiv.append(data);
    };
    
    var callUpdatePager = function (newTotal, newPage) {
        if (newPage != undefined) currentPage = newPage;
        totalItems = newTotal;
        if (maxPage != Math.ceil(totalItems / itemsPerPage) || totalItems == itemsPerPage || totalItems == 0) { //if the number of pages has changed, redraw pager
            maxPage = Math.ceil(totalItems / itemsPerPage);
            drawPager();
        }
        updatePager();
    };
    var update = function (response) {
        itemContainerDiv.html('');
        var data = response.data;

        if (data == null || data.length == 0) {
            itemContainerDiv.append(itemFormatter(data));
            return;
        }
        for (var i = 0; i < data.length; i++) {
            itemContainerDiv.append(itemFormatter(data[i]));
            itemFormatterCallback(data[i]);
        }
        itemContainerDiv.append('<div style="clear:both;"></div>');

        totalItems = response.totalItems;
        if (maxPage != Math.ceil(totalItems / itemsPerPage)) { //if the number of pages has changed, redraw pager
            maxPage = Math.ceil(totalItems / itemsPerPage);
            drawPager();
        }
        updatePager();
    };

    function drawPager() {
        if (totalItems <= itemsPerPage) {
            pagerContainerDiv.html('');
            return;
        }
        //Display Page 1 of 10 vs 1 2 3...
        var pagerspan = $('<span></span>').append('<a class="disabled pager first" pagingaction="First">First</a><a class="disabled pager previous" pagingaction="Previous">Previous</a>');
        if (options.Paging_PageNumbers_AreLinks) {
            pagerspan.append('<a class="disabled pager page text" pagingaction="PageNum">1</a>');
            for (var i = itemsPerPage; i < totalItems; i += itemsPerPage) {
                pagerspan.append('<a pagingaction="PageNum">' + ((i / itemsPerPage) + 1) + '</a>');
            }
            pagerspan.append('<a class="pager next" pagingaction="Next">Next</a><a class="pager last" pagingaction="Last">Last</a>');
        } else {
            pagerspan = $('<span></span>').append('<a class="disabled pager first" pagingaction="First"></a><a class="disabled pager previous" pagingaction="Previous"></a>');
            pagerspan.append('<span class="page text">Page <span class="CurrentPage">1</span> of <span class="TotalPages">' + maxPage + '</span></span>');
            pagerspan.append('<a class="pager next" pagingaction="Next"></a><a class="pager last" pagingaction="Last"></a>');
        }

        pagerspan.children().each(function () {
            $(this).bind('click', pagingClick);
        });
        pagerContainerDiv.html($('<div class="JSPager_Container"></div>').append(pagerspan));
    }

    //construct pager
    (function () {
        if (options.FetchItemsOnLoad) getItemsPaged(1, itemsPerPage);
        if (totalItems > itemsPerPage) {
            drawPager();
        }
    })();


    return {
        getItemsPaged: getItemsPaged,
        update: update,
        updateHtml: updateHtml,
        callUpdatePager: callUpdatePager,
        totalItems: totalItems,
        itemContainerDiv: itemContainerDiv,
        getStartIndex: function () { return (currentPage - 1) * itemsPerPage + 1; },
        getCurrentPage: function () { return currentPage; },
        isLastPage: function() { return maxPage == currentPage; }
    };
    
}
