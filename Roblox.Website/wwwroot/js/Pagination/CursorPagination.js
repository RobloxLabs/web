var Roblox = Roblox || {};
Roblox.CursorPagination = Roblox.CursorPagination || (function () {
    var defaultLimitName = "limit";
    var defaultCursorName = "cursor";
    var defaultSortOrderName = "sortOrder";

    var busyPromise = $.Deferred();
    busyPromise.reject([{
        code: -1,
        message: "Busy"
    }]);


    var getDataListFromResponseMethods = {
        defaultV1: function (response) {
            return response.data;
        }
    };

    var getNextPageCursorFromResponseMethods = {
        defaultV1: function (data) {
            return data.nextPageCursor;
        }
    };

    var getErrorsFromResponseMethods = {
        defaultV1: function (data) {
            return data.errors;
        }
    };

    var getQueryParametersMethods = {
        defaultV1: function (params) {
            return params;
        }
    };

    var sortOrders = {
        Asc: "Asc",
        Desc: "Desc"
    };


    function createPager(options) {
        var currentPageNumber = 0;
        var debounce = false;
        var pageParameters = {};
        var nextPageCursors = {};
        var cache = Roblox.Cache ? Roblox.Cache.createPaginationCache() : {};

        options.limitName = options.limitName || defaultLimitName;
        options.cursorName = options.cursorName || defaultCursorName;
        options.sortOrderName = options.sortOrderName || defaultSortOrderName;
        options.sortOrder = options.sortOrder || sortOrders.Asc;

        pageParameters[options.cursorName] = "";
        pageParameters[options.sortOrderName] = options.sortOrder;
        pageParameters[options.limitName] = options.loadPageSize;
        options.getDataListFromResponse = options.getDataListFromResponse || getDataListFromResponseMethods.defaultV1;
        options.getNextPageCursorFromResponse = options.getNextPageCursorFromResponse || getNextPageCursorFromResponseMethods.defaultV1;
        options.getErrorsFromResponse = options.getErrorsFromResponse || getErrorsFromResponseMethods.defaultV1;
        options.getQueryParameters = options.getQueryParameters || getQueryParametersMethods.defaultV1;
        options.loadSuccess = options.loadSuccess || function () { };
        options.loadError = options.loadError || function () { };


        function getCacheKey() {
            return Roblox.Cache.buildKey(options.getCacheKeyParameters(pageParameters));
        }

        function loadPage(pageNumber) {
            var cacheKey = getCacheKey();
            var items = cache.getPage(cacheKey, pageNumber, options.pageSize);
            var deferred = $.Deferred();

            deferred.promise().then(options.loadSuccess, options.loadError);
            if (items.length === options.pageSize || typeof (nextPageCursors[cacheKey]) !== "string") {
                currentPageNumber = pageNumber;
                deferred.resolve(items);
                return deferred.promise();
            }

            pageParameters[options.cursorName] = nextPageCursors[cacheKey];
            if (options.beforeLoad) {
                options.beforeLoad(pageNumber, pageParameters);
            }

            debounce = true;
            $.ajax({
                type: "GET",
                url: options.getRequestUrl(pageParameters),
                data: options.getQueryParameters(pageParameters),
                success: function (data) {
                    currentPageNumber = pageNumber;
                    nextPageCursors[cacheKey] = options.getNextPageCursorFromResponse(data);
                    debounce = false;
                    var list = options.getDataListFromResponse(data);
                    if (Array.isArray(list)) {
                        cache.append(cacheKey, list);
                        items = cache.getPage(cacheKey, pageNumber, options.pageSize);
                        deferred.resolve(items);
                    } else {
                        deferred.reject([{
                            code: 0,
                            message: "data pulled from response not array"
                        }]);
                    }
                },
                error: function (data) {
                    debounce = false;
                    deferred.reject(options.getErrorsFromResponse(data.responseJSON));
                }
            });

            return deferred.promise();
        }


        function isBusy() {
            return debounce;
        }

        function setPagingParameter(key, value) {
            if (value === undefined || value === null) {
                delete pageParameters[key];
            } else {
                pageParameters[key] = value;
            }
        }
        function getPagingParameter(key) {
            return pageParameters[key];
        }

        function getCurrentPageNumber() {
            return currentPageNumber;
        }

        function canLoadNextPage() {
            if (isBusy()) {
                return false;
            }
            var cacheKey = getCacheKey();
            if (cache.getLength(cacheKey) > currentPageNumber * options.pageSize) {
                // If we have enough in the cache we're good to load the next page
                return true;
            }
            // The cursor for the next page must be defined as a string before we can load the next page with it.
            return typeof (nextPageCursors[cacheKey]) === "string";
        }
        function canLoadPreviousPage() {
            return !isBusy() && currentPageNumber > 1;
        }
        function canLoadFirstPage() {
            return !isBusy();
        }

        function loadNextPage() {
            if (!canLoadNextPage()) {
                return busyPromise.promise();
            }
            return loadPage(currentPageNumber + 1);
        }
        function loadPreviousPage() {
            if (!canLoadPreviousPage()) {
                return busyPromise.promise();
            }
            return loadPage(currentPageNumber - 1);
        }
        function loadFirstPage() {
            if (!canLoadFirstPage()) {
                return busyPromise.promise();
            }
            // When loading the first page clear the cache, assume we're starting over.
            var cacheKey = getCacheKey();
            cache.clear(cacheKey);
            nextPageCursors[cacheKey] = "";
            return loadPage(1);
        }


        return {
            isBusy: isBusy,
            setPagingParameter: setPagingParameter,
            getPagingParameter: getPagingParameter,
            getCurrentPageNumber: getCurrentPageNumber,
            loadNextPage: loadNextPage,
            loadPreviousPage: loadPreviousPage,
            loadFirstPage: loadFirstPage,
            canLoadNextPage: canLoadNextPage,
            canLoadPreviousPage: canLoadPreviousPage,
            canLoadFirstPage: canLoadFirstPage
        };
    }


    return {
        getDataListFromResponseMethods: getDataListFromResponseMethods,
        getNextPageCursorFromResponseMethods: getNextPageCursorFromResponseMethods,
        getErrorsFromResponseMethods: getErrorsFromResponseMethods,
        getQueryParametersMethods: getQueryParametersMethods,
        sortOrder: sortOrders,
        createPager: createPager
    };
})();
