import { importFilesUnderPath } from 'roblox-es6-migration-helper';
import realtimeFactory from './lib/factory';
import './lib/client';
import './lib/signalRConnectionWrapper';
import './lib/stateTracker';

// vendors
importFilesUnderPath(require.context('./vendors/', true, /\.js$/));

importFilesUnderPath(require.context('./constants/', true, /\.js$/));

importFilesUnderPath(require.context('./sources/', true, /\.js$/));
importFilesUnderPath(require.context('./debugs/', true, /\.js$/));

// usage
importFilesUnderPath(require.context('./handlers/', true, /\.js$/));

window.Roblox.RealTime = {
    Factory: realtimeFactory
};

export default realtimeFactory;