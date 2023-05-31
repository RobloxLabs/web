import { MetaDataValues } from 'Roblox';

export default {
    currentPageName: MetaDataValues?.getPageName(),
    defaultIntervalTime: 5000,
    activeEvents: [
        'focus',
        'click',
        'hover',
        'scroll',
        'mouseover',
        'mouseenter',
        'mousedown',
        'dblclick',
        'keypress',
        'touchstart',
        'touchmove'
    ],
    inactiveEvents: ['blur']
};
