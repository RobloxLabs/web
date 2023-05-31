import { EventStream } from 'Roblox';
import $ from 'jquery';

const gamePlayEvents = {
    lastContext: 'unknown',
    contextCategories: {
        joinUser: 'JoinUser'
    }
};

function getPage() {
    const path = window.location.pathname.toLowerCase();
    const profilePageString = 'profile';
    const profileLastIndex = path.lastIndexOf(profilePageString);
    // roundabout way of saying .endsWith since .endsWith is not supported by IE. Surprise surprise!
    if (
        profileLastIndex !== -1 &&
        path.length === profileLastIndex + profilePageString.length
    ) {
        return profilePageString;
    }
    if (path.indexOf('/develop') !== -1) {
        return 'develop';
    }
    return 'gameDetail';
}

function getProperties(placeId, referrerId) {
    const placeLauncherInfo = $('#PlaceLauncherStatusPanel');
    return {
        lType:
            placeLauncherInfo &&
                placeLauncherInfo.data('is-protocol-handler-launch-enabled') &&
                placeLauncherInfo
                    .data('is-protocol-handler-launch-enabled')
                    .toLowerCase() === 'true'
                ? 'protocol'
                : 'plugin',
        pid: placeId,
        refuid: referrerId,
        pg: getPage()
    };
}

function sendEvent(eventName, context, placeId, referrerId) {
    if (context !== null && context !== '' && context !== 'unknown') {
        gamePlayEvents.lastContext = context;
    }
    EventStream.SendEvent(
        eventName,
        gamePlayEvents.lastContext,
        getProperties(placeId, referrerId)
    );
}

function sendGamePlayIntent(context, placeId, referrerId) {
    sendEvent('gamePlayIntent', context, placeId, referrerId);
    $(document).trigger('playButton:gamePlayIntent');
}

function sendDevelopIntent(context, placeId) {
    sendEvent('developIntent', context, placeId);
}

function sendInstallBegin(context, placeId) {
    sendEvent('installBegin', context, placeId);
}

function sendInstallSuccess(context, placeId) {
    sendEvent('installSuccess', context, placeId);
}

function sendClientStartAttempt(context, placeId) {
    sendEvent('clientStartAttempt', context, placeId);
}
function sendClientStartSuccessWeb(context, placeId) {
    sendEvent('clientStartSuccessWeb', context, placeId);
}

function sendManualDownloadClick(context, placeId) {
    sendEvent('manualDownload', context, placeId);
}

Object.assign(gamePlayEvents, {
    SendGamePlayIntent: sendGamePlayIntent,
    SendDevelopIntent: sendDevelopIntent,
    SendInstallBegin: sendInstallBegin,
    SendInstallSuccess: sendInstallSuccess,
    SendClientStartAttempt: sendClientStartAttempt,
    SendClientStartSuccessWeb: sendClientStartSuccessWeb,
    SendManualDownloadClick: sendManualDownloadClick
});

export default gamePlayEvents;
