const AppTypes = {
  android: 'android',
  ios: 'ios',
  xbox: 'xbox',
  uwp: 'uwp',
  amazon: 'amazon',
  win32: 'win32',
  universalapp: ' universalApp',
  unknown: 'unknown'
};

const DeviceTypes = {
  computer: 'computer',
  tablet: 'tablet',
  phone: 'phone',
  console: 'console'
};

const getDeviceMeta = (): {
  deviceType: string;
  appType: string;
  isInApp: boolean;
  isDesktop: boolean;
  isPhone: boolean;
  isTablet: boolean;
  isConsole: boolean;
  isAndroidApp: boolean;
  isIosApp: boolean;
  isUWPApp: boolean;
  isXboxApp: boolean;
  isAmazonApp: boolean;
  isWin32App: boolean;
  isStudio: boolean;
  isIosDevice: boolean;
  isAndroidDevice: boolean;
  isUniversalApp: boolean;
} | null => {
  const metaTag = document.querySelector<HTMLElement>('meta[name="device-meta"]');
  if (metaTag === null) {
    console.debug(
      'Error loading device information from meta tag - please check if meta tag is present'
    );
    return null;
  }
  const keyMap = metaTag.dataset || {};

  return {
    deviceType: keyMap.deviceType
      ? DeviceTypes[keyMap.deviceType as keyof typeof DeviceTypes] || ''
      : '',
    appType: keyMap.appType ? AppTypes[keyMap.appType as keyof typeof AppTypes] || '' : '',
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
    isWin32App: keyMap.isWin32App === 'true',
    isStudio: keyMap.isStudio === 'true',
    isIosDevice: keyMap.isIosDevice === 'true',
    isAndroidDevice: keyMap.isAndroidDevice === 'true',
    isUniversalApp: keyMap.isUniversalApp === 'true'
  };
};

export default { getDeviceMeta, AppTypes, DeviceTypes };
