if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.PersistedBackoffIntervalTracker = function (intervals, namespace) {
    "use strict";

    var keys = {
        actionLastPerformed: 'actionLastPerformed',
        actionCount: 'actionCount'
    };

    function buildKey(keySuffix) {
        return 'Roblox.PersistedBackoffIntervalTracker.' + namespace + '.' + keySuffix;
    }

    function localStorageGet(keySuffix) {
        return localStorage.getItem(buildKey(keySuffix));
    }
    function localStorageSet(keySuffix, value) {
        localStorage.setItem(buildKey(keySuffix), value);
    }
    function localStorageRemove(keySuffix) {
        localStorage.removeItem(buildKey(keySuffix));
    }

    function getTimestamp () {
        return new Date().getTime();
    }

    function recordAction() {
        var currentCountString = localStorageGet(keys.actionCount) || 0;
        var currentCount = parseInt(currentCountString, 10);
        localStorageSet(keys.actionCount, currentCount + 1);
        localStorageSet(keys.actionLastPerformed, getTimestamp());
    }

    function getActionCount() {
        var actionCount = localStorageGet(keys.actionCount);
        if (actionCount) {
            return parseInt(actionCount, 10);
        }
        return 0;
    }

    function getCurrentInterval() {
        var actionCount = getActionCount();
        if (actionCount === 0) {
            return 0;
        }

        var minimumInterval;
        if (actionCount > intervals.length) {
            minimumInterval = intervals[intervals.length - 1];
        } else {
            minimumInterval = intervals[actionCount - 1];
        }

        return minimumInterval;
    }

    function isTooSoon() {
        var lastActionTime = localStorageGet(keys.actionLastPerformed);
        if (!lastActionTime) {
            return false;
        }
        
        var elapsedSinceLastPrompt = getTimestamp() - lastActionTime;
        var interval = getCurrentInterval();
        return elapsedSinceLastPrompt < interval;
    }

    function hasBeenTooLong(intervalMultiple) {
        var lastActionTime = localStorageGet(keys.actionLastPerformed);
        if (!lastActionTime) {
            return true;
        }

        var elapsedSinceLastPrompt = getTimestamp() - lastActionTime;
        var interval = getCurrentInterval();
        return elapsedSinceLastPrompt >= (interval * intervalMultiple);
    }

    function reset() {
        localStorageRemove(keys.actionCount);
        localStorageRemove(keys.actionLastPerformed);
    }

    this.RecordAction = recordAction;
    this.GetActionCount = getActionCount;
    this.GetCurrentInterval = getCurrentInterval;
    this.IsTooSoon = isTooSoon;
    this.HasBeenTooLong = hasBeenTooLong;
    this.Reset = reset;

    // Exposed to assist unit tests
    this._Internal = {
        Keys: keys,
        LocalStorageGet: localStorageGet,
        LocalStorageSet: localStorageSet,
        LocalStorageRemove: localStorageRemove
    };
};