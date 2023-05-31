import { Utilities, CurrentUser } from 'Roblox';

const signalRConnectionWrapper = function (
    settings,
    logger,
    onConnectionStatusChangedCallback,
    onNotificationCallback,
    onSubscriptionStatusCallback
) {
    const self = this;

    // Interface
    self.Start = start;
    self.Stop = stop;
    self.Restart = restart;
    self.IsConnected = getIsConnected;

    // SignalR Constants
    const signalRStateConversion = {
        0: 'connecting',
        1: 'connected',
        2: 'reconnecting',
        4: 'disconnected'
    };
    const signalRState = { connecting: 0, connected: 1, reconnecting: 2, disconnected: 4 };

    let signalrConnection = null;
    let isConnected = false;
    const exponentialBackoff = getExponentialBackoff();

    function start() {
        signalrConnection = setupSignalRConnection();
        signalrConnection
            .start(getConnectionOptions())
            .done(function () {
                log(`Connected to SignalR [${signalrConnection.transport.name}]`);
            })
            .fail(function (args) {
                log(`FAILED to connect to SignalR [${args}]`);
            });
    }

    function stop() {
        if (signalrConnection) {
            $(signalrConnection).unbind(); // unbind all events to stop onDisconnected from triggering
            signalrConnection.stop();
            signalrConnection = null;
        }
        onConnectionStatusChangedCallback(false);
    }

    function restart() {
        if (signalrConnection === null) {
            start();
        } else {
            signalrConnection.stop();
            // this will trigger an automatic restart
        }
    }

    function getIsConnected() {
        return isConnected;
    }

    function setupSignalRConnection() {
        const notificationsBaseUrl = settings.notificationsUrl;

        const connection = $.hubConnection(`${notificationsBaseUrl}/notifications`, {
            useDefaultPath: false
        });
        const userNotificationsHub = connection.createHubProxy('userNotificationHub');

        // Subscribe to events raised by the server(magikx)
        userNotificationsHub.on('notification', onNotificationCallback);
        userNotificationsHub.on('subscriptionStatus', onSubscriptionStatusCallback);

        // Wire up signalR connection state change events
        connection.stateChanged(handleSignalRStateChange);
        connection.disconnected(handleSignalRDisconnected);
        connection.reconnecting(handleSignalRReconnecting);

        return connection;
    }

    function getAllowedTransports() {
        if (window.WebSocket) {
            return ['webSockets'];
        }
        return ['webSockets', 'longPolling'];
    }

    function getConnectionOptions() {
        const connectionOptions = {
            pingInterval: null
        };

        if (settings.isSignalRClientTransportRestrictionEnabled) {
            connectionOptions.transport = getAllowedTransports();
        }

        return connectionOptions;
    }

    function handleSignalRStateChange(state) {
        if (state.newState === signalRState.connected) {
            isConnected = true;
            onConnectionStatusChangedCallback(true);
        } else if (state.oldState === signalRState.connected && isConnected) {
            isConnected = false;
            onConnectionStatusChangedCallback(false);
        }

        log(
            `Connection Status changed from [${signalRStateConversion[state.oldState]}] to [${signalRStateConversion[state.newState]
            }]`
        );
    }

    function handleSignalRDisconnected() {
        // after connection failure attempt automatic reconnect after a suitable delay
        const delay = exponentialBackoff.StartNewAttempt();
        log(`In disconnected handler. Will attempt Reconnect after ${delay}ms`);

        setTimeout(function () {
            const attemptCount = exponentialBackoff.GetAttemptCount();
            if (attemptCount === 1) {
                const userId = `userId: ${CurrentUser}` && CurrentUser.userId;
                if (typeof GoogleAnalyticsEvents !== 'undefined') {
                    GoogleAnalyticsEvents.FireEvent(['SignalR', 'Attempting to Reconnect', userId]);
                }
            }
            log(`Attempting to Reconnect [${exponentialBackoff.GetAttemptCount()}]...`);
            if (signalrConnection == null) {
                return;
            }
            signalrConnection
                .start(getConnectionOptions())
                .done(function () {
                    exponentialBackoff.Reset();
                    log('Connected Again!');
                })
                .fail(function () {
                    log('Failed to Reconnect!');
                });
        }, delay);
    }

    function handleSignalRReconnecting() {
        log('In reconnecting handler. Attempt to force disconnect.');
        signalrConnection.stop(); // To trigger backed-off reconnect logic
    }

    function getExponentialBackoff() {
        if (!Utilities) {
            return false;
        }
        // Exponential Backoff Configuration
        const regularBackoffSpec = new Utilities.ExponentialBackoffSpecification({
            firstAttemptDelay: 2000,
            firstAttemptRandomnessFactor: 3,
            subsequentDelayBase: 10000,
            subsequentDelayRandomnessFactor: 0.5,
            maximumDelayBase: 300000
        });
        const fastBackoffSpec = new Utilities.ExponentialBackoffSpecification({
            firstAttemptDelay: 20000,
            firstAttemptRandomnessFactor: 0.5,
            subsequentDelayBase: 40000,
            subsequentDelayRandomnessFactor: 0.5,
            maximumDelayBase: 300000
        });
        const fastBackoffThreshold = 60000; // maximum time between reconnects to trigger fast backoff mode

        const fastBackoffPredicate = function (exponentialBackoff) {
            const lastSuccessfulConnection = exponentialBackoff.GetLastResetTime();

            // If we are attempting to reconnect again shortly after having reconnected, it may indicate
            // server instability, in which case we should backoff more quickly
            if (
                lastSuccessfulConnection &&
                lastSuccessfulConnection + fastBackoffThreshold > new Date().getTime()
            ) {
                return true;
            }
            return false;
        };

        return new Utilities.ExponentialBackoff(
            regularBackoffSpec,
            fastBackoffPredicate,
            fastBackoffSpec
        );
    }

    function log(msg) {
        if (logger) {
            logger(msg);
        }
    }
};

export default signalRConnectionWrapper;
