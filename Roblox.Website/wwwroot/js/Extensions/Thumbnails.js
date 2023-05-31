// asset image reloading
$(function () {
    var imageRetryDataElement = $("#image-retry-data");
    var pauseBetweenRequests = imageRetryDataElement ? imageRetryDataElement.data("image-retry-timer") : 1500;
    var retryMaxTimes = imageRetryDataElement ? imageRetryDataElement.data("image-retry-max-times") : 10;
    var gaLoggingPercent = imageRetryDataElement ? imageRetryDataElement.data('ga-logging-percent') : 0;
    var GoogleAnalyticsEvents_FireEvent = (window.GoogleAnalyticsEvents && GoogleAnalyticsEvents.FireEvent) || function () { };
    var GoogleAnalyticsEvents_FireEventPercentage = function (data) {
        if (Math.random() <= gaLoggingPercent / 100.0) {
            GoogleAnalyticsEvents_FireEvent(data);
        }
    }

    function handleFinalData(data, options) {
        var img = options.el.is("img") ? options.el : options.el.find("img");  // img inside <a>
        var imgWithSrc = img.length === 1 ? img : options.el.find("img.original-image");
        //for lazy load of images
        if (!imgWithSrc.attr("src") && imgWithSrc.hasClass("lazy")) {
            imgWithSrc.attr("data-original", data.Url);
        }
        else {
            imgWithSrc.attr("src", data.Url);  
        }
        //so nobody else requests it.
        options.el.removeAttr("data-retry-url");
        options.el.trigger("thumbnailLoaded");
    }

    function logSuccess(options) {
        var gap = new Date().getTime() - options.start;
        Roblox.ThumbnailMetrics && Roblox.ThumbnailMetrics.logFinalThumbnailTime(gap);
        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenTime", "2D", "Success", gap]);
        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenRetries", "2D", "Success", options.retryCount]);
    }

    function logGiveUp(options) {
        var gap = new Date().getTime() - options.start;
        Roblox.ThumbnailMetrics && Roblox.ThumbnailMetrics.logThumbnailTimeout();
        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenRetries", "2D", "Gave Up", options.retryCount]);
        GoogleAnalyticsEvents_FireEventPercentage(["ThumbnailGenTime", "2D", "Gave Up", gap]);
    }

    function gotThumbnailData(data, options) {
        if (data.Final) {
            if (options.realRegeneration) {
                logSuccess(options);
            }
            handleFinalData(data, options);
        } else {
            options.realRegeneration = true;
            options.retryCount++;
            if (options.retryCount < retryMaxTimes) {
                setTimeout(function () {
                    options.retryFunction(options);
                }, pauseBetweenRequests); // try again later
            } else {
                logGiveUp(options);
            }
        }
    }

    function getThumbnailData(options) {
        //kill other parallel requests if we are done
        var url = options.el.data("retry-url");
        if (!url) {
            return;
        }

        $.ajax({
            url: url,
            dataType: "json",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) { gotThumbnailData(data, options); }
        });
    }

    $.fn.loadRobloxThumbnails = function () {
        return this.each(function () {
            var options = {
                retryCount: 0,
                realRegeneration: false,
                start: new Date().getTime(),
                el: $(this),
                retryFunction: getThumbnailData
            };

            setTimeout(function () {
                getThumbnailData(options);
            }, 0);
        });
    };
});
