RobloxEventManager = new function () {
    var cookieStoreEvents = [];
    var dataStore = {};
    this.enabled = false;
    this.initialized = false;
    this.eventQueue = [];

    function getCookieValue(cookieName) {
        var regex = new RegExp(cookieName + '=([^;]*)');
        var match = regex.exec(document.cookie);

        if (match)
            return match[1];

        return null;
    }
    
    function parseDotNetCookie(cookieValue) {
        var cookieObject = {};
        var keyVals = cookieValue.split('&');
        for (var i = 0; i < keyVals.length; i++) {
            var keyVal = keyVals[i].split('=');
            cookieObject[keyVal[0]] = keyVal[1];
        }
        return cookieObject;
    }
    
    function getDotNetCookie(name) {
        var value = getCookieValue(name);
        if (value)
            return parseDotNetCookie(value);

        return null;
    }

    this.initialize = function (enabled) {
        this.initialized = true;
        this.enabled = enabled;
        while (this.eventQueue.length > 0) {
            var event = this.eventQueue.pop();
            this.triggerEvent(event.eventName, event.args);
        }
    };

    this.getMarketingGuid = function () {
        var c = getDotNetCookie('RBXEventTracker');
        if (c != null)
            return c['browserid'];
        return -1;
    };

    this.triggerEvent = function (eventName, args) {
        if (this.initialized) {
            if (this.enabled) {
                if (typeof args === 'undefined')
                    args = {};
                args.guid = this.getMarketingGuid();
                if (args.guid != -1)
                    $(document).trigger(eventName, [args]);
            }
        } else {
            this.eventQueue.push({ eventName: eventName, args: args });
        }
    };

    this.registerCookieStoreEvent = function (eventName) {
        cookieStoreEvents.push(eventName);
    };

    this.insertDataStoreKeyValuePair = function (key, value) {
        dataStore[key] = value;
    };

    this.monitorCookieStore = function () {
        try {
            if (typeof Roblox === "undefined" || typeof Roblox.Client === "undefined" || window.location.protocol == "https:")
                return;

            var plugin = Roblox.Client.CreateLauncher(false);
            if (plugin == null)
                return;

            for (var i = 0; i < cookieStoreEvents.length; i++) {
                try {
                    var eventName = cookieStoreEvents[i];
                    var storedValue = plugin.GetKeyValue(eventName);

                    if (storedValue != '' && storedValue != '-1' && storedValue != 'RBX_NOT_VALID') {
                        var args = eval('(' + storedValue + ')');   // has userId and placeId
                        args['userType'] = args['userId'] > 0 ? 'user' : 'guest';
                        RobloxEventManager.triggerEvent(eventName, args);
                        plugin.SetKeyValue(eventName, 'RBX_NOT_VALID');
                    }
                }
                catch (err) {

                }
            }
        }
        catch (err) {
            // If we update in the middle of checking cookies, let the monitor do the remaining cookies at the next interval
        }
    };

    this.startMonitor = function () {
        var interval, timeout, mouseHasMoved;
        function doTimeout() {
            if (mouseHasMoved)
                resetMouse();
            else
                stop();
        }
        function resetMouse() {
            clearTimeout(timeout);
            timeout = setTimeout(doTimeout, RobloxEventManager._idleInterval);
            mouseHasMoved = false;
            // Rebind mouse movement
            $(document).one("mousemove", function () {
                mouseHasMoved = true;
            });
        }
        function start() {
            // Monitor cookie store every 5 secs
            clearInterval(interval);
            interval = setInterval(RobloxEventManager.monitorCookieStore, 5000);
            // Set mouse movement
            resetMouse();
        }
        // Actually stop monitor
        function stop() {
            clearTimeout(timeout);
            clearInterval(interval);
            // Detach plugin
            var pluginObj = document.getElementById('robloxpluginobj');
            Roblox.Client.ReleaseLauncher(pluginObj, false, false);
            // Restart plugin when the mouse moves
            $(document).one("mousemove", start);
        }
        start();
    };
};

function RBXBaseEventListener() {

    if (!(this instanceof RBXBaseEventListener)) {
        return new RBXBaseEventListener();
    }

    this.init = function () {
        for (eventKey in this.events) {
            if (this.events.hasOwnProperty(eventKey)) {
                $(document).bind(this.events[eventKey], $.proxy(this.localCopy, this));
            }
        }
    };
    this.events = [];

    this.localCopy = function (event, data) {
        var localEvent = $.extend(true, {}, event);
        var localData = $.extend(true, {}, data);
        this.handleEvent(localEvent, localData);
    };
    /*
     * INTERFACE FUNCTIONS
     */
    this.distillData = function (data, mapping) {
        console.log('RBXEventListener distillData - Please implement me');
        return false;
    };
    this.handleEvent = function (event) {
        console.log('EventListener handleEvent - Please implement me');
        return false;
    };
    this.fireEvent = function (evtStr) {
        console.log('EventListener fireEvent - Please implement me');
        return false;
    };
}