import { Performance } from 'Roblox';
import realtimeFactory from './factory';
import realtimeStateTracker from './stateTracker';

const realtimeClient = function (sourceConstructors) {
    let currentSource = null;

    const namespaceConnectStatus = {};

    // Subscribed event handlers
    const notificationHandlers = {};

    const onConnectedHandlers = {};
    const onDisconnectedHandlers = {};
    const onReconnectedHandlers = {};

    const onSignalRConnectionCallbacks = [];

    let customLogger = null;
    let logVerboseMessages = false;
    const log = function (message, isVerbose) {
        message = `RealTime Client: ${message}`;
        if (!isVerbose || logVerboseMessages) {
            if (customLogger) {
                customLogger(message);
            }
        }
    };
    let stateTracker = null;

    const setCustomLogger = function (loggerCallback) {
        customLogger = loggerCallback;
    };

    const setVerboseLogging = function (newValue) {
        logVerboseMessages = newValue;
    };

    const refreshConnectionStatus = function () {
        if (
            namespaceConnectStatus.constructor === Object &&
            Object.keys(namespaceConnectStatus).length > 0
        ) {
            for (const namespace in namespaceConnectStatus) {
                if (namespaceConnectStatus[namespace].isConnected) {
                    namespaceConnectStatus[namespace].isConnected = false;
                    onDisconnected(namespace);
                }
            }
        }
    };

    var refreshSource = function () {
        if (currentSource) {
            log(`Stopping current source: ${currentSource.Name}`);
            currentSource.Stop();
            currentSource = null;
            refreshConnectionStatus();
        }

        const settings = realtimeFactory.GetSettings();
        for (let i = 0; i < sourceConstructors.length; i++) {
            var newSource = new sourceConstructors[i](settings, log);
            log(`Attempting to start a new source: ${newSource.Name}`);
            const started = newSource.Start(
                refreshSource,
                function (notification) {
                    onNotification(newSource, notification);
                },
                function (connectionEvent) {
                    onConnectionEvent(newSource, connectionEvent);
                }
            );
            if (started) {
                log(`New source started: ${newSource.Name}`);
                currentSource = newSource;
                break;
            }
        }

        if (currentSource === null) {
            log('No source can be started!');
        }
    };

    const initialize = function () {
        if (realtimeStateTracker) {
            stateTracker = new realtimeStateTracker(
                realtimeFactory.IsLocalStorageEnabled(),
                realtimeFactory.IsEventPublishingEnabled()
            );
        }
        refreshSource();

        if (Performance) {
            Performance.setPerformanceMark('signalR_initialized');
        }
    };

    var onNotification = function (notificationSource, notification) {
        if (notificationSource !== currentSource) {
            // Ignore notifications from old sources
            return;
        }

        const namespaceHandlers = notificationHandlers[notification.namespace];
        if (namespaceHandlers) {
            for (let i = 0; i < namespaceHandlers.length; i++) {
                try {
                    namespaceHandlers[i](notification.detail);
                } catch (e) {
                    log(
                        `Error running subscribed event handler for notification [${notification.namespace
                        }]:${e}`
                    );
                }
            }
        }
        if (stateTracker) {
            stateTracker.UpdateSequenceNumber(
                notification.namespace,
                notification.namespaceSequenceNumber
            );
        }
    };

    const getConnectionStatus = function (namespace) {
        if (!namespace) {
            let isAnyNamespaceConnected = false;
            for (const name in namespaceConnectStatus) {
                if (namespaceConnectStatus[name] && namespaceConnectStatus[name].isConnected) {
                    isAnyNamespaceConnected = true;
                }
            }
            return {
                isConnected: isAnyNamespaceConnected
            };
        }
        if (!namespaceConnectStatus[namespace]) {
            namespaceConnectStatus[namespace] = {
                isConnected: false,
                hasEverBeenConnected: false
            };
        }
        return namespaceConnectStatus[namespace];
    };

    const fireConnectionEventPerNamespace = function (namespace, sequenceNumber) {
        const isDataReloadRequired = stateTracker
            ? stateTracker.IsDataRefreshRequired(namespace, sequenceNumber)
            : null;

        const connectionStatus = getConnectionStatus(namespace);

        // If currently connected, but the event indicates missed messages, trigger disconnect logic so data can be refreshed
        // But only if we are sure we need to refresh
        if (
            connectionStatus.isConnected &&
            isDataReloadRequired === stateTracker.RefreshRequiredEnum.IS_REQUIRED
        ) {
            log(
                `Have detected messages were missed. Triggering reconnect logic. Data Reload Required: ${isDataReloadRequired}`
            );
            connectionStatus.isConnected = false;
            onDisconnected(namespace);
        }

        // If not connected, send the connection event with indication of whether or not a data refresh is required
        if (!connectionStatus.isConnected) {
            connectionStatus.isConnected = true;

            if (connectionStatus.hasEverBeenConnected) {
                // reconnect if we know we have to, or if we aren't sure
                onReconnected(
                    isDataReloadRequired === null ||
                    isDataReloadRequired === stateTracker.RefreshRequiredEnum.IS_REQUIRED ||
                    isDataReloadRequired === stateTracker.RefreshRequiredEnum.UNCLEAR,
                    namespace
                );
            } else {
                const isHardReloadRequired =
                    isDataReloadRequired !== stateTracker.RefreshRequiredEnum.NOT_REQUIRED;

                connectionStatus.hasEverBeenConnected = true;
                if (Performance) {
                    const performanceLabel = `signalR_${currentSource.Name}_connected`;
                    Performance.logSinglePerformanceMark(performanceLabel);
                }
                onConnected(isHardReloadRequired, namespace);
            }
        }
    };

    const fireDisconnectedEventPerNamespace = function (namespace) {
        const connectionStatus = getConnectionStatus(namespace);
        if (connectionStatus.isConnected) {
            connectionStatus.isConnected = false;
            onDisconnected(namespace);
        }
    };

    const onConnectionEvent = (connectionEventSource, connectionEvent) => {
        if (connectionEventSource !== currentSource) {
            // Ignore events from old sources
            return;
        }

        if (connectionEvent.isConnected) {
            executeConnectionCallbacks();
            if (connectionEvent.namespace) {
                var { namespace } = connectionEvent;
                var sequenceNumber = connectionEvent.namespaceSequenceNumber;
                fireConnectionEventPerNamespace(namespace, sequenceNumber);
            } else if (connectionEvent.namespaceSequenceNumbersObj) {
                for (var namespace in connectionEvent.namespaceSequenceNumbersObj) {
                    var sequenceNumber = connectionEvent.namespaceSequenceNumbersObj[namespace];
                    fireConnectionEventPerNamespace(namespace, sequenceNumber);
                }
            }
        } else if (connectionEvent.namespace) {
            var { namespace } = connectionEvent;
            fireDisconnectedEventPerNamespace(namespace);
        } else if (connectionEvent.namespaceSequenceNumbersObj) {
            for (var namespace in connectionEvent.namespaceSequenceNumbersObj) {
                fireDisconnectedEventPerNamespace(namespace);
            }
        } else {
            for (var namespace in namespaceConnectStatus) {
                fireDisconnectedEventPerNamespace(namespace);
            }
        }
    };

    var onConnected = function (dataReloadRequired, selectedNamespace) {
        log('Client Connected!');
        if (!selectedNamespace) {
            for (const namespace in onConnectedHandlers) {
                try {
                    if (onConnectedHandlers[namespace]) {
                        for (var i = 0; i < onConnectedHandlers[namespace].length; i++) {
                            onConnectedHandlers[namespace][i](dataReloadRequired);
                        }
                    }
                } catch (e) {
                    log(`Error running subscribed event handler for connected:${e}`);
                }
            }
        } else {
            try {
                if (onConnectedHandlers[selectedNamespace]) {
                    for (var i = 0; i < onConnectedHandlers[selectedNamespace].length; i++) {
                        onConnectedHandlers[selectedNamespace][i](dataReloadRequired);
                    }
                }
            } catch (e) {
                log(`Error running subscribed event handler for connected:${e}`);
            }
        }
    };
    var onReconnected = function (dataReloadRequired, selectedNamespace) {
        log(`Client Reconnected! Data Reload Required: ${dataReloadRequired}`);
        if (!selectedNamespace) {
            for (const namespace in onReconnectedHandlers) {
                try {
                    if (onReconnectedHandlers[namespace]) {
                        for (var i = 0; onReconnectedHandlers[namespace].length > 0; i++) {
                            onReconnectedHandlers[namespace][i](dataReloadRequired);
                        }
                    }
                } catch (e) {
                    log(`Error running subscribed event handler for reconnected:${e}`);
                }
            }
        } else {
            try {
                if (onReconnectedHandlers[selectedNamespace]) {
                    for (var i = 0; onReconnectedHandlers[selectedNamespace].length > 0; i++) {
                        onReconnectedHandlers[selectedNamespace][i](dataReloadRequired);
                    }
                }
            } catch (e) {
                log(`Error running subscribed event handler for reconnected:${e}`);
            }
        }
    };
    var onDisconnected = function (selectedNamespace) {
        log('Client Disconnected!');
        if (!selectedNamespace) {
            for (const namespace in onDisconnectedHandlers) {
                try {
                    if (onDisconnectedHandlers[namespace]) {
                        for (var i = 0; onDisconnectedHandlers[namespace].length > 0; i++) {
                            onDisconnectedHandlers[namespace][i]();
                        }
                    }
                } catch (e) {
                    log(`Error running subscribed event handler for disconnected:${e}`);
                }
            }
        } else {
            try {
                if (onDisconnectedHandlers[selectedNamespace]) {
                    for (var i = 0; onDisconnectedHandlers[selectedNamespace].length > 0; i++) {
                        onDisconnectedHandlers[selectedNamespace][i]();
                    }
                }
            } catch (e) {
                log(`Error running subscribed event handler for disconnected:${e}`);
            }
        }
    };

    const subscribeToNotifications = function (namespace, handler) {
        if (!notificationHandlers[namespace]) {
            notificationHandlers[namespace] = [];
        }

        const typeHandlers = notificationHandlers[namespace];
        typeHandlers.push(handler);
    };

    const unsubscribeFromNotifications = function (namespace, handler) {
        if (!notificationHandlers[namespace]) {
            // not actually subscribed
            return;
        }

        const typeHandlers = notificationHandlers[namespace];
        const handlerIndex = typeHandlers.indexOf(handler);
        if (handlerIndex >= 0) {
            typeHandlers.splice(handlerIndex, 1);
        }
    };

    const isConnectedMethod = function (namespace) {
        const connectionStatus = getConnectionStatus(namespace);
        return connectionStatus.isConnected;
    };

    const executeConnectionCallbacks = () => {
        onSignalRConnectionCallbacks.forEach(callback => {
            callback();
        });
    };

    const detectSignalConnection = onSignalRConnection => {
        onSignalRConnectionCallbacks.push(onSignalRConnection);
    };

    const subscribeToConnectionEvents = function (
        onConnectedHandler,
        onReconnectedHandler,
        onDisconnectedHandler,
        namespace
    ) {
        if (!namespace) {
            return false;
        }

        if (onConnectedHandler) {
            if (!onConnectedHandlers[namespace]) {
                onConnectedHandlers[namespace] = [];
            }
            onConnectedHandlers[namespace].push(onConnectedHandler);
        }
        if (onReconnectedHandler) {
            if (!onReconnectedHandlers[namespace]) {
                onReconnectedHandlers[namespace] = [];
            }
            onReconnectedHandlers[namespace].push(onReconnectedHandler);
        }
        if (onDisconnectedHandler) {
            if (!onDisconnectedHandlers[namespace]) {
                onDisconnectedHandlers[namespace] = [];
            }
            onDisconnectedHandlers[namespace].push(onDisconnectedHandler);
        }
    };

    // Automatic Start
    initialize();
    // Public Interface
    this.Subscribe = subscribeToNotifications;
    this.Unsubscribe = unsubscribeFromNotifications;
    this.SubscribeToConnectionEvents = subscribeToConnectionEvents;
    this.DetectSignalConnection = detectSignalConnection;
    this.IsConnected = isConnectedMethod;
    this.SetLogger = setCustomLogger;
    this.SetVerboseLogging = setVerboseLogging;
};

export default realtimeClient;
