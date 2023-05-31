import $ from 'jquery';
import AuthenticationChecker from './authenticationChecker';
import PrerollPlayer from './prerollPlayer';

// EventNames
const startClientAttemptedEvent = 'startClientAttempted';
const startClientFailedEvent = 'startClientFailed';
const startClientSucceededEvent = 'startClientSucceeded';
const beginInstallEvent = 'beginInstall';
const successfulInstallEvent = 'successfulInstall';
const manualDownloadEvent = 'manualDownload';

let _resolveInit;

const gameLauncher = {
    // can be overriden by win10 roblox app appHybridClientInterface.js
    gameLaunchInterface: null,
    gameLaunchLogger: null,
    initialized: new Promise((resolve, reject) => {
        _resolveInit = resolve;
    })
};

function setGameLaunchInterface(newInterface) {
    gameLauncher.gameLaunchInterface = newInterface;
    _resolveInit();
}

function setGameLaunchLogger(newLogger) {
    gameLauncher.gameLaunchLogger = newLogger;
}

function editGameInStudio(placeId, universeId, allowUpload) {
    gameLauncher.gameLaunchInterface.editGameInStudio(placeId, universeId, allowUpload);
}

function openStudio() {
    gameLauncher.gameLaunchInterface.openStudio();
}

function tryAssetInStudio(assetId) {
    gameLauncher.gameLaunchInterface.tryAssetInStudio(assetId);
}

function returnToStudio() {
    gameLauncher.gameLaunchInterface.returnToStudio();
}

function openPluginInStudio(pluginId) {
    gameLauncher.gameLaunchInterface.openPluginInStudio(pluginId);
}

function joinMultiplayerGame(placeId, isMembershipLevelOk = true, isPlayTogetherGame) {
    const params = { placeId, isPlayTogetherGame: isPlayTogetherGame === true };

    const deferred = AuthenticationChecker.restrictGuests(params)
        .then(PrerollPlayer.waitForPreroll)
        .then(gameLauncher.gameLaunchInterface.joinMultiplayerGame);
    return deferred;
}

function followPlayerIntoGame(userId) {
    const params = { userId };
    const deferred = AuthenticationChecker.restrictGuests(params)
        .then(PrerollPlayer.waitForPreroll)
        .then(gameLauncher.gameLaunchInterface.followPlayerIntoGame);
    return deferred;
}

function joinGameInstance(placeId, gameId, isMembershipLevelOk, isPlayTogetherGame) {
    const params = {
        placeId,
        gameId,
        isPlayTogetherGame: isPlayTogetherGame === true
    };
    const deferred = AuthenticationChecker.restrictGuests(params)
        .then(PrerollPlayer.waitForPreroll)
        .then(gameLauncher.gameLaunchInterface.joinGameInstance);
    return deferred;
}

async function joinPrivateGame(placeId, accessCode, linkCode) {
    await gameLauncher.initialized;
    const params = {
        placeId,
        accessCode,
        linkCode
    };
    const deferred = PrerollPlayer.waitForPreroll(params).then(
        gameLauncher.gameLaunchInterface.joinPrivateGame
    );
    return deferred;
}

function playTogetherGame(placeId, conversationId) {
    const params = { placeId, conversationId };

    const deferred = AuthenticationChecker.restrictGuests(params)
        .then(PrerollPlayer.waitForPreroll)
        .then(gameLauncher.gameLaunchInterface.playTogetherGame);
    return deferred;
}

// jQuery plugin for binding game launch buttons.  Finds any protocol handler game launch buttons in the current jQuery object and binds them.
// eg: $("#ajaxUpdatedContainer").bindGameLaunch();
$.fn.bindGameLaunch = function bindGameLaunch() {
    this.find('.VisitButtonPlayGLI').click(function () {
        const el = $(this);
        const placeId = el.attr('placeid');
        const isMembershipLevelOk = el.data('is-membership-level-ok');
        joinMultiplayerGame(placeId, isMembershipLevelOk);
    });

    this.find('.VisitButtonEditGLI').click(function () {
        const el = $(this);
        const placeId = el.attr('placeid');
        const universeId = el.data('universeid');
        const allowUpload = !!el.data('allowupload');
        editGameInStudio(placeId, universeId, allowUpload);
    });

    return this;
};

$(document).ready(() => {
    // ---------- VisitButtons bindings: --------------
    $('body').bindGameLaunch();
});

Object.assign(gameLauncher, {
    // implementations of objects, set by implementers at page load
    authenticationChecker: AuthenticationChecker,
    prerollPlayer: PrerollPlayer,

    // Functions
    joinMultiplayerGame,
    openStudio,
    returnToStudio,
    openPluginInStudio,
    editGameInStudio,
    followPlayerIntoGame,
    joinGameInstance,
    joinPrivateGame,
    playTogetherGame,
    setGameLaunchInterface,
    setGameLaunchLogger,
    tryAssetInStudio,

    // EventNames
    startClientAttemptedEvent,
    startClientFailedEvent,
    startClientSucceededEvent,
    beginInstallEvent,
    successfulInstallEvent,
    manualDownloadEvent
});

export default gameLauncher;
