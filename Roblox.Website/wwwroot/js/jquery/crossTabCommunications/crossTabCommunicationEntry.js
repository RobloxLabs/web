import pubSub from './lib/pubSub';
import kingmaker from './lib/kingmaker';

window.Roblox = window.Roblox || {};
window.Roblox.CrossTabCommunication = {
    PubSub: pubSub,
    Kingmaker: kingmaker
};
