RobloxListener = new RBXBaseEventListener();
RobloxListener.handleEvent = function (event, data) {
    var rEvent, rData, dataMap;

    switch (event.type) {
        case 'rbx_evt_install_begin':
            dataMap = { guid: 'guid', userId: 'userid' };
            rEvent = event.type;
            break;
        case 'rbx_evt_initial_install_start':
            dataMap = { guid: 'guid', userId: 'userid' };
            rEvent = event.type;
            break;
        case 'rbx_evt_ftp':
            dataMap = { guid: 'guid', userId: 'userid' };
            rEvent = event.type;
            break;
        case 'rbx_evt_initial_install_success':
            dataMap = { guid: 'guid', userId: 'userid' };
            rEvent = event.type;
            break;
        case 'rbx_evt_fmp':
            dataMap = { guid: 'guid', userId: 'userid' };
            rEvent = event.type;
            break;
        default:
            console.log('RobloxEventListener - Event registered without handling instructions: ' + event.type);
            return false;
    }

    rData = this.distillData(data, dataMap);
    this.fireEvent(this.eventToString(rEvent, rData));
    return true;
}

RobloxListener.distillData = function (data, mapping) {
    var distilled = {};
    for (dataKey in mapping) {
        if (typeof (data[dataKey]) != typeof (undefined))
            distilled[mapping[dataKey]] = encodeURIComponent(data[dataKey]);
    }

    return distilled;
}
RobloxListener.eventToString = function (event, args) {
    var eventString = RobloxListener.restUrl;
    eventString += "?event=" + event + "&";
    if (args != null) {
        for (arg in args) {
            if (typeof (arg) != typeof (undefined) && args.hasOwnProperty(arg))
                eventString += arg + "=" + args[arg] + "&";
        }
    }
    eventString = eventString.slice(0, eventString.length - 1);
    return eventString;
}
RobloxListener.fireEvent = function (processedEvent) {
    var trPixel = $('<img width="1" height="1" src="' + processedEvent + '"/>');
}
RobloxListener.events = []; // Don't listen for any events. Cleanup file by 2014/5/31