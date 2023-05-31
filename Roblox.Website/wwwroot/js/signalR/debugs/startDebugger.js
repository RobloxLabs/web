import { RealTimeSettings } from 'Roblox';
import realtimeDebugger from './debugger';

$(function () {
    if (RealTimeSettings && RealTimeSettings.IsDebuggerEnabled === 'True') {
        realtimeDebugger.debuggerInit();
    }
});