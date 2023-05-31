import $ from 'jquery';

function isAvailable() {
    return isLocalStorageEnabled();
}

function subscribe(eventName, subscriberNamespace, callback) {
    var windowEventName = buildWindowEventName(eventName, subscriberNamespace);
    $(window).unbind(windowEventName).bind(windowEventName, function (event) {
        if (event.originalEvent.key === eventName) {
            callback(event.originalEvent.newValue);
        }
    });
}

function unsubscribe(eventName, subscriberNamespace) {
    var windowEventName = buildWindowEventName(eventName, subscriberNamespace);
    $(window).unbind(windowEventName);
};

function publish(eventName, message) {
    localStorage.removeItem(eventName);// For some weird reason, the events are raised only if we delete and set the key again.
    localStorage.setItem(eventName, message);
};

function buildWindowEventName(eventName, subscriberNamespace) {
    return 'storage.' + eventName + '_' + subscriberNamespace;
};

function isLocalStorageEnabled() {
    var key = 'roblox';
    try {
        localStorage.setItem(key, key);
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
};

const crossTabCommunicationPubSub = {
    IsAvailable: isAvailable,
    Subscribe: subscribe,
    Unsubscribe: unsubscribe,
    Publish: publish
};

export default crossTabCommunicationPubSub;