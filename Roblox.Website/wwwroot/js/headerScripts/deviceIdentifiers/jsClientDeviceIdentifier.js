function isIos13Ipad(): boolean {
    if (!window.navigator) {
        return false;
    }
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

function isMac(): boolean {
    return window?.navigator.platform.toUpperCase().indexOf('MAC') > -1;
}

function isWindows(): boolean {
    return window?.navigator.platform.toUpperCase().indexOf('WIN') > -1;
}
function isIE(): boolean {
    return (
        window?.navigator.userAgent.toUpperCase().indexOf('TRIDENT/') !== -1 ||
        window?.navigator.userAgent.toUpperCase().indexOf('MSIE') !== -1
    );
}
function isIE11(): boolean {
    return isIE() && !!window?.navigator.userAgent.match(/rv[: ]\d+./);
}

export default {
    isIos13Ipad: isIos13Ipad(),
    isMac: isMac(),
    isWindows: isWindows(),
    isIE: isIE(),
    isIE11: isIE11()
};
