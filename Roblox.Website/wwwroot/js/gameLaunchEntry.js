import $ from 'jquery';
import { DeviceMeta } from 'Roblox';
import AppHybridClientInterface from './win10/appHybridClientInterface';
import AuthenticationChecker from './authenticationChecker';
import GameLauncher from './gameLauncher';
import GameLaunchLogger from './gameLaunchLogger';
import GamePlayEvents from './gamePlayEvents';
import GamePlayEventsHandlers from './gamePlayEventsHandlers';
import PrerollPlayer from './prerollPlayer';
import VideoPreRollDFP from './videoPreRollDFP';
import ProtocolHandlerClientInterface from './protocolHandlerClientInterface';
import PlayButton from '../ts/playButton/containers/PlayButton';

// shim all the things that are available globally for backwards compatibility;
if (!window.Roblox) {
    window.Roblox = {};
}

Object.assign(window.Roblox, {
    AuthenticationChecker,
    GameLauncher,
    GameLaunchLogger,
    GamePlayEvents,
    PrerollPlayer,
    ProtocolHandlerClientInterface,
    VideoPreRollDFP,
    PlayButton
});

$(document).ready(() => {
    GamePlayEventsHandlers();
    const device = DeviceMeta();
    if (device.isUWPApp || device.isUniversalApp) {
        window.Roblox.AppHybridClientInterface = AppHybridClientInterface;
        GameLauncher.setGameLaunchInterface(AppHybridClientInterface);
    }
    GameLauncher.setGameLaunchLogger(GameLaunchLogger);
});