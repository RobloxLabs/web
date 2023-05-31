/*

This JS Class reads device meta from meta tag and provides DeviceMeta
object which carries information about device type the user is on.

Author: Achint Verma
Date: Aug 10, 2017

*/

var Roblox = Roblox || {};
Roblox.DeviceMeta = (function () {

    // read meta information from tag
    var metaTag = document.querySelector('meta[name="device-meta"]');
    if (metaTag === null) {
        console.debug("Error loading device information from meta tag - please check if meta tag is present");
        return;
    }
    var keyMap = metaTag.dataset || {};

    // possible app types 
    var appTypes = {
        android: "android",
        ios: "ios",
        xbox: "xbox",
        uwp: "uwp",
        amazon: "amazon",
        unknown: "unknown"
    };

    // possible device types
    var deviceTypes = {
        computer: "computer",
        tablet: "tablet",
        phone: "phone",
        console: "console"
    };
    
    // this constructor mechanism prevents overwriting flags by returning a new copy everytime
    return function () {
        return {
            deviceType: deviceTypes[keyMap.deviceType] || '',
            appType: appTypes[keyMap.appType] || '',
            isInApp: keyMap.isInApp === 'true',
            isDesktop: keyMap.isDesktop === 'true',
            isPhone: keyMap.isPhone === 'true',
            isTablet: keyMap.isTablet === 'true',
            isConsole: keyMap.isConsole === 'true',
            isAndroidApp: keyMap.isAndroidApp === 'true',
            isIosApp: keyMap.isIosApp === 'true',
            isUWPApp: keyMap.isUwpApp === 'true',
            isXboxApp: keyMap.isXboxApp === 'true',
            isAmazonApp: keyMap.isAmazonApp === 'true',
            isStudio: keyMap.isStudio === 'true',
            isIosDevice: keyMap.isIosDevice === 'true',
            isAndroidDevice: keyMap.isAndroidDevice === 'true'

        }
    };
})();