MongoListener = new RBXBaseEventListener();

MongoListener.handleEvent = function (event, data) {

    var shard;
    if (typeof data["shard"] === "undefined") {
        shard = this.defaultShard;
    } else {
        shard = data["shard"];
    }

    if (typeof data["eventName"] === "undefined") {
        data.eventName = event.type;
    }

    if (data.eventName === "JavascriptExceptionLoggingEvent") {
        dataMap = { category: 'category', url: 'url', msg: 'msg', line: 'line', ua: 'UA' };
    } else {
        if (typeof data["category"] === "undefined") {
            data.category = MongoListener.getCategoryFromEventName(data.eventName);
        }
        data.userId = MongoListener.userId;
        data.ip = MongoListener.clientIpAddress;
        dataMap = { guid: 'guid', category: 'category', userId: 'userid', ip: 'ip' };

        /* // don't send age and gender up, for now.  maybe a UserInfo event later?
        if (typeof data.age !== 'undefined') {
            dataMap.age = 'age';
        }

        if (typeof data.gender !== 'undefined') {
            dataMap.gender = 'gender';
        }
        */
    }

    this.fireEvent(shard, this.distillData(data, dataMap));

    return true;
}
MongoListener.getCategoryFromEventName = function (eventName) {
    switch (eventName) {
        case 'rbx_evt_sitetouch':
            return 'SiteTouch';
        case 'rbx_evt_fmp':
            return 'FiveMinutePlay';
        case 'rbx_evt_play_user':
        case 'rbx_evt_play_guest':
            return 'Play';
        default:
            return eventName;
    }
}

MongoListener.distillData = function (data, mapping) {
    var distilled = {};
    for (dataKey in mapping) {
        if (typeof (data[dataKey]) != typeof (undefined))
            distilled[mapping[dataKey]] = encodeURIComponent(data[dataKey]);
    }

    return distilled;
}
MongoListener.fireEvent = function (shard, data) {
   	$.ajax({ url: MongoListener.loggingURI + shard,
   		dataType: "jsonp",
   		jsonpCallback: "MongoListener.callback",
   		data: data
   	});
}
MongoListener.callback = function (obj) {
//console.log goes here.
}
MongoListener.events = [
    'JavascriptExceptionLoggingEvent'
    /*, 'rbx_evt_fmp'
    , 'rbx_evt_play_user'
    , 'rbx_evt_play_guest'
    , 'rbx_evt_sitetouch'*/
];
