GoogleListener = new RBXBaseEventListener();
GoogleListener.handleEvent = function (event, data) {
    function translateOsString(str) {
        str = str.toLowerCase();
        if (str == "win32")
            str = "Windows";
        else if (str == "osx")
            str = "Mac";
        return str;
    }

    var gEvent, gData, dataMap;

    switch (event.type) {
        case 'rbx_evt_initial_install_begin':
            data['os'] = translateOsString(data['os']);
            data['category'] = 'Bootstrapper Install Begin';
            dataMap = { os: 'action' };
            break;
        case 'rbx_evt_ftp':
            data['os'] = translateOsString(data['os']);
            data['category'] = 'First Time Played';
            dataMap = { os: 'action' };
            break;
        case 'rbx_evt_initial_install_success':
            data['os'] = translateOsString(data['os']);
            data['category'] = 'Bootstrapper Install Success';
            dataMap = { os: 'action' };
            break;
        case 'rbx_evt_fmp':
            data['os'] = translateOsString(data['os']);
            data['category'] = 'Five Minute Play';
            dataMap = { os: 'action' };
            break;
        case 'rbx_evt_abtest':
            dataMap = { experiment: 'category', variation: 'action', version: 'opt_label' };
            break;
        case 'rbx_evt_card_redemption':
            data['category'] = "CardRedemption";
            dataMap = { merchant: 'action', cardValue: 'opt_label' };
            break;
        default:
            console.log('GoogleListener - Event registered without handling instructions: ' + event.type);
            return false;
    }

    dataMap['category'] = 'category';

    gData = this.distillData(data, dataMap);
    this.fireEvent(gData);
    return true;
}

GoogleListener.distillData = function (data, mapping) {
    var distilled = {};
    for (dataKey in mapping) {
        if (typeof (data[dataKey]) != typeof (undefined))
            distilled[mapping[dataKey]] = data[dataKey];
    }
    var eventParams = [distilled['category'], distilled['action']];
    if (distilled['opt_label'] != null) {
        eventParams = eventParams.concat(distilled['opt_label']);
    }
    if (distilled['opt_value'] != null) {
        eventParams = eventParams.concat(distilled['opt_value']);
    }

    return eventParams;
}
GoogleListener.fireEvent = function (processedEvent) {
    if (typeof (_gaq) != typeof (undefined)) {
        var eventsArray = ["_trackEvent"];
        var eventsArrayB = ["b._trackEvent"];
        _gaq.push(eventsArray.concat(processedEvent));
        _gaq.push(eventsArrayB.concat(processedEvent));
    }
}
GoogleListener.events = [
    'rbx_evt_initial_install_begin',
    'rbx_evt_ftp',
    'rbx_evt_initial_install_success',
    'rbx_evt_fmp',
    'rbx_evt_abtest',
    'rbx_evt_card_redemption'
];