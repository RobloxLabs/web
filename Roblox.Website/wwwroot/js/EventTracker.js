EventTracker = new function () {
    var self = this;
    self.logMetrics = false;
    self.transmitMetrics = true;
    self.localEventLog = [];

    var eventStore = new function () {
        var events = {};
        this.get = function (name) {
            return events[name];
        };
        this.set = function (name, time) {
            events[name] = time;
        };
        this.remove = function (name) {
            delete events[name];
        };
    };

    var timestamp = function () {
        return new Date().valueOf();
    };

    var endEachEvent = function (eventNames, reason) {
        var now = timestamp();
        $.each(eventNames, function (idx, name) {
            end(name, reason, now);
        });
    };

    var end = function (name, reason, time) {
        var evt = eventStore.get(name);
        if (evt) {
            eventStore.remove(name);
            var duration = time - evt;
            if (self.logMetrics) {
                console.log('[event]', name, reason, duration);
            }
            if (self.transmitMetrics) {
                var statName = name + "_" + reason;
                $.ajax({
                    type: "POST",
                    timeout: 50000,
                    url: "/game/report-stats?name=" + statName + "&value=" + duration,
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    }
                });
            }
        } else {
            if (self.logMetrics) {
                console.log('[event]', 'ERROR: event not started -', name, reason);
            }
        }
    };

    self.start = function () {
        var now = timestamp();
        $.each(arguments, function (idx, name) {
            eventStore.set(name, now);
        });
    };

    self.endSuccess = function () {
        endEachEvent(arguments, 'Success');
    };

    self.endCancel = function () {
        endEachEvent(arguments, 'Cancel');
    };

    self.endFailure = function () {
        endEachEvent(arguments, 'Failure');
    };
    self.fireEvent = function () {
        $.each(arguments, function (idx, name) {
            $.ajax({
                type: "POST",
                timeout: 50000,
                url: "/game/report-event?name=" + name,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            });
            if (self.logMetrics) {
                console.log('[event]', name);
            }
            self.localEventLog.push(name);
        });
    };
}