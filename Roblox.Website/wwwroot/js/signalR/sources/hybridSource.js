import { Hybrid } from 'Roblox';
import options from '../constants/options';

const hybridSource = function (settings, logger) {
    let onSourceExpiredHandler;
    let onNotificationHandler;
    let onConnectionEventHandler;

    let heartbeatTriggerTime;
    const heartbeatInterval = 5000;
    const heartbeatBuffer = 3000;
    let heartbeatEnabled = true;

    const log = function (message, isVerbose) {
        if (logger) {
            logger(`HybridSource: ${message}`, isVerbose);
        }
    };

    const isAvailable = function () {
        // Ensure Hybrid.RealTime module present
        if (!(Hybrid && Hybrid.RealTime && Hybrid.RealTime.supports)) {
            log('Roblox.Hybrid or its RealTime module not present. Cannot use Hybrid Source');
            return false;
        }
        // And that it contains all required methods
        if (
            !(
                Hybrid.RealTime.isConnected &&
                Hybrid.RealTime.onNotification &&
                Hybrid.RealTime.onConnectionEvent
            )
        ) {
            log(
                'Roblox.Hybrid.RealTime module does not provide all required methods. Cannot use Hybrid Source'
            );
            return false;
        }
        // check bridge existing
        if (!Hybrid?.Bridge) {
            log('Roblox.Hybrid.Bridge is missing');
            return false;
        }
        // Once we have determinied it is not going to work, don't let it try again
        if (options.hybridSourceDisabled) {
            log('Roblox.Hybrid has previously told us it is not supported. Will not try again');
            return false;
        }

        return true;
    };

    var scheduleHeartbeat = function () {
        heartbeatTriggerTime = new Date().getTime();
        setTimeout(function () {
            if (heartbeatEnabled) {
                const now = new Date().getTime();
                if (now - heartbeatTriggerTime > heartbeatInterval + heartbeatBuffer) {
                    log('possible resume from suspension detected: polling for status');
                    requestConnectionStatus();
                }
                scheduleHeartbeat();
            }
        }, heartbeatInterval);
    };

    const stopHeartbeat = function () {
        heartbeatEnabled = false;
    };

    const hybridOnNotificationHandler = function (result) {
        if (!result || !result.params) {
            log('onNotification event without sufficient data');
            return;
        }
        const details = JSON.parse(result.params.detail) || {};
        const namespaceSequenceNumber = details.sequenceNumber || 0;
        const parsedEvent = {
            namespace: result.params.namespace || '',
            detail: JSON.parse(result.params.detail) || {},
            sequenceNumber: result.params.sequenceNumber || -1,
            namespaceSequenceNumber
        };
        log(`Relaying parsed notification: ${JSON.stringify(parsedEvent)}`, true);
        onNotificationHandler(parsedEvent);
    };

    const hybridOnConnectionEventHandler = function (result) {
        if (!result || !result.params) {
            log('onConnectionEvent event without sufficient data');
            return;
        }

        log(`ConnectionEvent received: ${JSON.stringify(result)}`, true);
        onConnectionEventHandler({
            isConnected: result.params.isConnected || false,
            sequenceNumber: result.params.sequenceNumber || -1,
            namespaceSequenceNumbersObj: result.params.namespaceSequenceNumbers || {}
        });
    };

    const subscribeToHybridEvents = function () {
        Hybrid.RealTime.supports('isConnected', function (isSupported) {
            if (isSupported) {
                log('Roblox.Hybrid.RealTime isConnected is supported. Subscribing to events');
                // Wire up events
                Hybrid.RealTime.onNotification.subscribe(hybridOnNotificationHandler);
                Hybrid.RealTime.onConnectionEvent.subscribe(hybridOnConnectionEventHandler);

                // Query the current state
                requestConnectionStatus();
            } else {
                log(
                    'Roblox.Hybrid.RealTime isConnected not supported. Aborting attempt to use HybridSource'
                );
                // If the method is not supported, we should disable this source and not waste time attempting it
                // again.
                options.hybridSourceDisabled = true;
                if (onSourceExpiredHandler) {
                    onSourceExpiredHandler();
                }
            }
        });
    };

    const detachHybridEventHandlers = function () {
        Hybrid.RealTime.onNotification.unsubscribe(hybridOnNotificationHandler);
        Hybrid.RealTime.onConnectionEvent.unsubscribe(hybridOnConnectionEventHandler);
    };

    var requestConnectionStatus = function () {
        Hybrid.RealTime.isConnected(function (success, result) {
            if (success && result) {
                log(`ConnectionStatus response received: ${JSON.stringify(result)}`);
                onConnectionEventHandler({
                    isConnected: result.isConnected,
                    sequenceNumber: result.sequenceNumber || 0,
                    namespaceSequenceNumbers: result.namespaceSequenceNumbers
                });
            } else {
                log('ConnectionStatus request failed! Aborting attempt to use HybridSource');
                if (onSourceExpiredHandler) {
                    onSourceExpiredHandler();
                }
            }
        });
    };

    const stop = function () {
        log('Stopping. Detaching from native events');
        detachHybridEventHandlers();
        stopHeartbeat();
    };

    const start = function (onSourceExpired, onNotification, onConnectionEvent) {
        log('Starting');
        if (!isAvailable()) {
            return false;
        }

        onSourceExpiredHandler = onSourceExpired;
        onNotificationHandler = onNotification;
        onConnectionEventHandler = onConnectionEvent;

        subscribeToHybridEvents();
        scheduleHeartbeat();
        return true;
    };

    // Public API
    this.IsAvailable = isAvailable;
    this.Start = start;
    this.Stop = stop;
    this.Name = 'HybridSource';
};

export default hybridSource;