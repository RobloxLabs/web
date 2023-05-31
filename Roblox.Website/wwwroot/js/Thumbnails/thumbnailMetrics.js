var Roblox = Roblox || {};
Roblox.ThumbnailMetrics = (function () {

    var metricsBaseUrl = Roblox.EnvironmentUrls && Roblox.EnvironmentUrls.metricsApi || 'https://metrics.roblox.com',
        metricsLoadTimeUrl = metricsBaseUrl + '/v1/thumbnails/load',
        metricsMetadataUrl = metricsBaseUrl + '/v1/thumbnails/metadata',
        loadStates = {
            complete: 'complete',
            timeout: 'timeout'
        },
        initDone = false,
        queue = [],
        logProbability = 0.0; //will be in settings.

    function setLogProbability(num) {
        logProbability = parseFloat(num);
    }

    function shouldLog() {
        return Math.random() <= logProbability;
    }

    function processQueue() {
        queue.forEach(function (funcToCall) {
            funcToCall();
        });
    }

    function init() {
        $.ajax({
            type: "GET",
            url: metricsMetadataUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data) {
                    logProbability = data.logRatio;
                }
                initDone = true;
                processQueue();
            },
            error: function () {
                initDone = true;
            }
        });
    }

    function logFinalThumbnailTime(duration, thumbnailType) {
        if (thumbnailType === undefined) {
            thumbnailType = "";
        }
        if (!initDone) {
            queue.push(function () {
                logFinalThumbnailTime(duration, thumbnailType);
            });
            return false;
        }
        if (!shouldLog()) {
            return false;
        }
        $.ajax({
            type: "POST",
            timeout: 3000,
            url: metricsLoadTimeUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                duration: duration,
                loadState: loadStates.complete,
                thumbnailType: thumbnailType
            }
        });
    }

    function logThumbnailTimeout(thumbnailType) {
        if (thumbnailType === undefined) {
            thumbnailType = "";
        }
        if (!initDone) {
            queue.push(logThumbnailTimeout(thumbnailType));
            return false;
        }
        $.ajax({
            type: "POST",
            timeout: 3000,
            url: metricsLoadTimeUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                loadState: loadStates.timeout,
                thumbnailType: thumbnailType
            }
        });
    }

    //call init
    init();

    return {
        logFinalThumbnailTime: logFinalThumbnailTime,
        setLogProbability: setLogProbability,
        logThumbnailTimeout: logThumbnailTimeout,
        init: init
    };
})();