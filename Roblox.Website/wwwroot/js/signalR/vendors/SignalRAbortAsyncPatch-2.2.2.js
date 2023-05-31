/*
 * Patch to SignalR 2.2.0 and 2.2.2 to change the behaviour of the 'abort' calls.
 * The default behaviour is to use a synchronous call on page unload to notify
 * the server that a connection is ending. This has two problems:
 *      1) The browser tab is unresponsive until the call returns
 *      2) This behaviour is deprecated by browsers
 * 
 * This will replace the original 'abort' calls for all supported transports,
 * always passing in true for the 'async' parameter
 * 
 * According to https://github.com/SignalR/SignalR/pull/4025, this is still an open issue on 2.2.2
 */
; (function () {
    "use strict";

    if ($.signalR && ($.signalR.version === "2.2.0" || $.signalR.version === "2.2.2")) {
        var originalWebSocketsAsync = $.signalR.transports.webSockets.abort;
        $.signalR.transports.webSockets.abort = function (connection, async) {
            originalWebSocketsAsync(connection, true);
        };

        var originalLongPollingAsync = $.signalR.transports.longPolling.abort;
        $.signalR.transports.longPolling.abort = function (connection, async) {
            originalLongPollingAsync(connection, true);
        };
    }
})();