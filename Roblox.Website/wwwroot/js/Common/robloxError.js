'use strict';
var RobloxError = (function () {

    var RobloxError = function (message, errorType) {
        var errorClass = errorType && errorType.name;
        switch (errorClass) {
            case 'TypeError':
                this.error = new TypeError(message);
                break;
            case 'EvalError':
                this.error = new EvalError(message);
                break;
            case 'RangeError':
                this.error = new RangeError(message);
                break;
            case 'ReferenceError':
                this.error = new ReferenceError(message);
                break;
            default:
                this.error = new Error(message);
                break;
        }
    }

    RobloxError.prototype.throw = function (fallbackAction) {
        if (Roblox && Roblox.jsConsoleEnabled) {
            throw this.error;
        }

        if (fallbackAction && typeof fallbackAction === "function") {
            fallbackAction();
        }
    }
    return RobloxError;
})();