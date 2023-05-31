import { CrossTabCommunication } from 'Roblox';
import realtimeEvents from '../constants/events';

const crossTabReplicatedSource = function (settings, logger) {
    const subscriberNamespace = 'Roblox.RealTime.Sources.CrossTabReplicatedSource';
    let isRunning = false;

    let onSourceExpiredHandler;
    let onNotificationHandler;
    let onConnectionEventHandler;

    const log = function (message, isVerbose) {
        if (logger) {
            logger(`CrossTabReplicatedSource: ${message}`, isVerbose);
        }
    };

    const isAvailable = function () {
        if (
            !CrossTabCommunication ||
            !CrossTabCommunication.Kingmaker ||
            !CrossTabCommunication.PubSub
        ) {
            log('CrossTabCommunication dependencies are not present');
            return false;
        }
        if (!CrossTabCommunication.Kingmaker.IsAvailable()) {
            log('CrossTabCommunication.Kingmaker not available - cannot pick a master tab');
            return false;
        }
        if (CrossTabCommunication.Kingmaker.IsMasterTab()) {
            log('This is the master tab - it needs to send the events, not listen to them');
            return false;
        }
        return true;
    };

    const subscribeToEvents = function () {
        CrossTabCommunication.Kingmaker.SubscribeToMasterChange(function (isMasterTab) {
            if (isMasterTab && isRunning && onSourceExpiredHandler) {
                log('Tab has been promoted to master tab - triggering end of this source');
                onSourceExpiredHandler();
            }
        });
        CrossTabCommunication.PubSub.Subscribe(
            realtimeEvents.Notification,
            subscriberNamespace,
            function (notification) {
                log(`Notification Received: ${notification}`, true);
                if (notification) {
                    onNotificationHandler(JSON.parse(notification));
                }
            }
        );
        CrossTabCommunication.PubSub.Subscribe(
            realtimeEvents.ConnectionEvent,
            subscriberNamespace,
            function (event) {
                log(`Connection Event Received: ${event}`);
                if (event) {
                    onConnectionEventHandler(JSON.parse(event));
                }
            }
        );
    };

    const requestConnectionStatus = function () {
        CrossTabCommunication.PubSub.Publish(
            realtimeEvents.RequestForConnectionStatus,
            realtimeEvents.RequestForConnectionStatus
        );
    };

    const stop = function () {
        log('Stopping. Unsubscribing from Cross-Tab events');
        isRunning = false;
        CrossTabCommunication.PubSub.Unsubscribe(realtimeEvents.Notification, subscriberNamespace);
        CrossTabCommunication.PubSub.Unsubscribe(realtimeEvents.ConnectionEvent, subscriberNamespace);
    };

    const start = function (onSourceExpired, onNotification, onConnectionEvent) {
        if (!isAvailable()) {
            return false;
        }
        isRunning = true;

        onSourceExpiredHandler = onSourceExpired;
        onNotificationHandler = onNotification;
        onConnectionEventHandler = onConnectionEvent;

        subscribeToEvents();
        requestConnectionStatus();

        return true;
    };

    // Public API
    this.IsAvailable = isAvailable;
    this.Start = start;
    this.Stop = stop;
    this.Name = 'CrossTabReplicatedSource';
};

export default crossTabReplicatedSource;