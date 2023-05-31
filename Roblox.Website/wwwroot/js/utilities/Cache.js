var Roblox = Roblox || {};
Roblox.Cache = (function () {
    function createPaginationCache() {
        var cache = {};

        return {
            getPage: function (key, pageNumber, pageSize) {
                if (cache[key]) {
                    return cache[key].slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
                }
                return [];
            },
            getLength: function (key) {
                return cache[key] ? cache[key].length : 0;
            },
            append: function (key, values) {
                if (!cache[key]) {
                    cache[key] = [];
                }
                cache[key] = cache[key].concat(values);
            },
            clear: function (key) {
                cache[key] = [];
            }
        };
    }

    function buildKey(values) {
        var key = "";
        for (var n in values) {
            if (values.hasOwnProperty(n)) {
                key += "&" + n + "=" + values[n];
            }
        }
        return key;
    }

    return {
        buildKey: buildKey,
        createPaginationCache: createPaginationCache
    };
})();
