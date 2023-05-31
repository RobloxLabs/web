/* eslint-disable prefer-const */
import { GaEventSettings } from 'Roblox';
import $ from 'jquery';
import GameLauncher from './gameLauncher';
import GamePlayEvents from './gamePlayEvents';

const GameLaunchLogger = {
    logToConsoleEnabled: false,
    logToGAEnabled: true,
    logToEphemeralCountersEnabled: true
};

const ephemeralCountersEvents = {};
ephemeralCountersEvents[GameLauncher.startClientAttemptedEvent] = [
    'GameLaunchAttempt_<os>',
    'GameLaunchAttempt_<os>_<launchmethod>'
];
ephemeralCountersEvents[GameLauncher.startClientSucceededEvent] = [
    'GameLaunchSuccessWeb_<os>',
    'GameLaunchSuccessWeb_<os>_<launchmethod>'
];

const googleAnalyticsEvents = {};
if (GaEventSettings.gaLaunchAttemptAndLaunchSuccessEnabled) {
    googleAnalyticsEvents[GameLauncher.startClientAttemptedEvent] = 'Launch Attempt';
    googleAnalyticsEvents[GameLauncher.startClientSucceededEvent] = 'Launch Success';
}
googleAnalyticsEvents[GameLauncher.beginInstallEvent] = 'Install Begin';
googleAnalyticsEvents[GameLauncher.successfulInstallEvent] = 'Install Success';
googleAnalyticsEvents[GameLauncher.manualDownloadEvent] = 'Manual Download';

const eventStreamEvents = {};
eventStreamEvents[GameLauncher.startClientAttemptedEvent] = GamePlayEvents.SendClientStartAttempt;
eventStreamEvents[GameLauncher.startClientSucceededEvent] =
    GamePlayEvents.SendClientStartSuccessWeb;
eventStreamEvents[GameLauncher.beginInstallEvent] = GamePlayEvents.SendInstallBegin;
eventStreamEvents[GameLauncher.successfulInstallEvent] = GamePlayEvents.SendInstallSuccess;
eventStreamEvents[GameLauncher.manualDownloadEvent] = GamePlayEvents.SendManualDownloadClick;

function getLaunchMode(params) {
    return params.params.launchMode;
}

function getOsName() {
    return $('#PlaceLauncherStatusPanel').data('os-name');
}

function logToConsole(value) {
    if (GameLaunchLogger.logToConsoleEnabled) {
        console.log(value);
    }
}

function logToEphemeralCounters(counterName, launchMethod) {
    if (GameLaunchLogger.logToEphemeralCountersEnabled) {
        let osName = getOsName();
        if (osName === 'Windows') {
            osName = 'Win32';
        }
        counterName = counterName.replace('<os>', osName);
        counterName = counterName.replace('<launchmethod>', launchMethod);
        if (window.EventTracker?.fireEvent) {
            window.EventTracker.fireEvent(counterName);
        }
    }
}

function logToGA(category, name, label, value) {
    if (
        typeof window.GoogleAnalyticsEvents !== 'undefined' &&
        GameLaunchLogger.logToGAEnabled &&
        window.GoogleAnalyticsEvents.FireEvent
    ) {
        window.GoogleAnalyticsEvents.FireEvent([category, name, label, value]);
    }
}

function logGameLauncherEvent(event, params) {
    logToConsole(`${event.type}: ${JSON.stringify(params)}`);
    if (ephemeralCountersEvents[event.type]) {
        $.each(ephemeralCountersEvents[event.type], (idx, counterName) => {
            logToEphemeralCounters(counterName, params.launchMethod);
        });
    }
    if (googleAnalyticsEvents[event.type]) {
        logToGA(params.launchMethod, googleAnalyticsEvents[event.type], getLaunchMode(params), 0);
    }
    if (
        $('#PlaceLauncherStatusPanel').data('event-stream-for-protocol-enabled') === 'True' &&
        eventStreamEvents[event.type]
    ) {
        // pass null into context so we use lastContext (set by gamePlayIntent event)
        eventStreamEvents[event.type](null, params.params.placeId);
    }
}

// public interface
Object.assign(GameLaunchLogger, {
    // functions
    logToConsole,
    logToEphemeralCounters,
    logToGA
});

$(document).ready(() => {
    const gameLauncherEvents = [
        GameLauncher.startClientAttemptedEvent,
        GameLauncher.startClientFailedEvent,
        GameLauncher.startClientSucceededEvent,
        GameLauncher.beginInstallEvent,
        GameLauncher.successfulInstallEvent,
        GameLauncher.manualDownloadEvent
    ];
    $(GameLauncher).on(gameLauncherEvents.join(' '), logGameLauncherEvent);
});

export default GameLaunchLogger;
