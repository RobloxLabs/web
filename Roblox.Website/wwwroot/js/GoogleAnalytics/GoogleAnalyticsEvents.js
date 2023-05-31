var GoogleAnalyticsEvents = {
    FireEvent: function(args) {
        if (window._gaq) {
            if (!window.GoogleAnalyticsDisableRoblox2) {
                var eventsArray = ["_trackEvent"];
                _gaq.push(eventsArray.concat(args));
            }
            var eventsArrayB = ["b._trackEvent"];
            _gaq.push(eventsArrayB.concat(args));
        }
    },
    ViewVirtual: function (url) {
        if (window.GoogleAnalyticsReplaceUrchinWithGAJS) {
            if (window._gaq) {
                !window.GoogleAnalyticsDisableRoblox2 && window._gaq.push(['_trackPageview', url]);
                window._gaq.push(['b._trackPageview', url]);
            }
        } else {
            urchinTracker && urchinTracker(url);
        }
    },
    TrackTransaction: function (orderId, priceTotal) {
        if (window._gaq) {
            if (!window.GoogleAnalyticsDisableRoblox2) {
                _gaq.push(['_addTrans',orderId, 'Roblox', priceTotal, '0', '0', 'San Mateo', 'California', 'USA']);
                                             // Store Name            Tax  Shipping
            }
            _gaq.push(['b._addTrans', orderId, 'Roblox', priceTotal, '0', '0', 'San Mateo', 'California', 'USA']);
        }
    },
    TrackTransactionItem: function (orderId, sku, name, category, price) {
        if (window._gaq) {
            if (!window.GoogleAnalyticsDisableRoblox2) {
                _gaq.push(['_addItem', sku, name, category, price, 1]);
                _gaq.push(['_trackTrans']);
            }
            _gaq.push(['b._addItem', sku, name, category, price, 1]);
            _gaq.push(['b._trackTrans']);
        }
    }
};

function GoogleAnalyticsTimingTracker(category, variable, optLabel, isDebug) {
    this.maxTime = 1 * 60 * 1000;
    this.category = category;
    this.variable = variable;
    this.label = optLabel ? optLabel : undefined;
    this.isDebug = isDebug;
}

GoogleAnalyticsTimingTracker.prototype.getTimeStamp = function() {
    if (window.performance && window.performance.now) {
        return Math.round(window.performance.now());
    }
    return new Date().getTime();
};

GoogleAnalyticsTimingTracker.prototype.start = function () {
    this.startTime = this.getTimeStamp();
};

GoogleAnalyticsTimingTracker.prototype.stop = function () {
    this.elapsedTime = this.getTimeStamp() - this.startTime;
};

/**
 * Send data to Google Analytics with the configured variable, action,
 * elapsed time and label. This function performs a check to ensure that
 * the elapsed time is greater than 0 and less than MAX_TIME. This check
 * ensures no bad data is sent if the browser client time is off. If
 * debug has been enebled, then the sample rate is overridden to 100%
 * and all the tracking parameters are outputted to the console.
 * @return {Object} This TrackTiming instance. Useful for chaining.
 */
GoogleAnalyticsTimingTracker.prototype.send = function () {
    if (0 < this.elapsedTime && this.elapsedTime < this.maxTime) {

        var command = ['b._trackTiming', this.category, this.variable, this.elapsedTime, this.label, 100];

        if (this.isDebug) {
            if (window.console && window.console.log) {
                console.log(command);
            }
        }

        window._gaq.push(command);
    }
};
