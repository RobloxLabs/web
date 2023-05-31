if (typeof Roblox === 'undefined') {
    Roblox = {};
}

Roblox.JSErrorTracker = {
    showAlert: false,
    defaultPixel: 'GA',
    javascriptStackTraceEnabled: false,
    suppressConsoleError: false,
    data: { category: 'JavascriptExceptions' },

    initialize: function (args) {
        $.extend(Roblox.JSErrorTracker, args);
        this.addOnErrorEventHandler(this.errorHandler);
    },

    errorHandler: function (errMsg, errUrl, errLine, errCol, errObj) {
        try {
            var errInfo = "";
            if (errCol) {
                errInfo = " errCol = " + errCol;
            }
            if (errObj) {
                errInfo = " fileName = " + errObj.fileName + ",  stackTrace = " + JSON.stringify(errObj.stack);
            }
            Roblox.JSErrorTracker.data.msg = errMsg + errInfo;
            Roblox.JSErrorTracker.data.url = errUrl;
            Roblox.JSErrorTracker.data.line = errLine;
            Roblox.JSErrorTracker.data.ua = window.navigator.userAgent;
            Roblox.JSErrorTracker.logException(Roblox.JSErrorTracker.data);
        } catch (e) {
        }
        return Roblox.JSErrorTracker.suppressConsoleError;
    },

    addOnErrorEventHandler: function (fn) {
        var existingErrHandler = window.onerror;
        if (typeof window.onerror === 'function') {
            window.onerror = function (errMsg, errUrl, errLine, errCol, errObj) {
                existingErrHandler(errMsg, errUrl, errLine, errCol, errObj);
                fn(errMsg, errUrl, errLine, errCol, errObj);
            };
        } else {
            window.onerror = fn;
        }
    },

    processException: function (exDetails, pixelToFire) {
        if (typeof (exDetails) === 'undefined') {
            return;
        }
        if (typeof (exDetails.category) === 'undefined')
            exDetails.category = Roblox.JSErrorTracker.data.category;
        switch (pixelToFire) {
            case 'GA':
                var mapping = { category: 'category', url: 'action', msg: 'opt_label', line: 'opt_value' };
                Roblox.JSErrorTracker.fireGAPixel(Roblox.JSErrorTracker.distillGAData(exDetails, mapping));
                break;
            default:
                console.log("Roblox JSErrorTracker received an unknown pixel to fire");
                break;
        }
        return true;
    },

    logException: function (exDetails) {
        Roblox.JSErrorTracker.processException(exDetails, Roblox.JSErrorTracker.defaultPixel);
        Roblox.JSErrorTracker.showErrorMessage(exDetails.msg);
    },

    distillData: function (data, mapping) {
        var distilled = {};
        for (var datakey in mapping) {
            if (typeof data[datakey] !== 'undefined') {
                distilled[mapping[datakey]] = encodeURIComponent(data[datakey]);
            }
        }
        return distilled;
    },

    distillGAData: function (data, mapping) {
        var distilled = Roblox.JSErrorTracker.distillData(data, mapping);
        //Params for GA category, action, opt_label, opt_value
        var eventParams = [decodeURIComponent([distilled.category])];
        if (typeof (distilled.action) !== typeof (undefined)) {
            eventParams = eventParams.concat(decodeURIComponent(distilled.action));
            if (typeof (distilled.opt_label) !== typeof (undefined)) {
                eventParams = eventParams.concat(decodeURIComponent(distilled.opt_label));
                if (typeof (distilled.opt_value) !== typeof (undefined)) {
                    eventParams = eventParams.concat(parseInt(decodeURIComponent(distilled.opt_value)));
                }
            }
        } else {
            //action is a required field
            if (Roblox.JSErrorTracker.showAlert) {
                alert("Missing a required parameter for GA");
            }
        }
        return eventParams;
    },

    createURL: function (url, args, mapping) {
        var urlToFire = url;
        var distilled = Roblox.JSErrorTracker.distillData(args, mapping);
        urlToFire += "?";
        if (distilled != null) {
            for (var arg in distilled) {
                if (typeof (arg) != typeof (undefined) && args.hasOwnProperty(arg))
                    urlToFire += arg + "=" + distilled[arg] + "&";
            }
        }
        urlToFire = urlToFire.slice(0, urlToFire.length - 1);
        return urlToFire;
    },

    fireGAPixel: function (params) {
        if (typeof (_gaq) !== 'undefined') {
            _gaq.push(["c._trackEvent"].concat(params));
        }
    },

    showErrorMessage: function (msg) {
        if (Roblox.JSErrorTracker.showAlert) {
            if (msg !== null)
                alert(msg);
            else
                alert("An error occured");
        }
    }
};