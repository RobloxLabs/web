import jsClientDeviceIdentifier from './deviceIdentifiers/jsClientDeviceIdentifier';
import deviceMeta from './deviceIdentifiers/deviceMeta';
import authenticatedUser from './authenticatedUser/authenticatedUser';
import environmentSites from './environmentIdentifier/environmentSites';

// keep this for rollout, because we already have two places to use this. Will remove after clean up the usage
window.Roblox.JsClientDeviceIdentifier = jsClientDeviceIdentifier;

window.HeaderScripts = {
  jsClientDeviceIdentifier,
  authenticatedUser,
  environmentSites,
  deviceMeta
};
