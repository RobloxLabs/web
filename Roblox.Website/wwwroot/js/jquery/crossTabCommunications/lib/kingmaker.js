import $ from 'jquery';
import crossTabCommunicationPubSub from './pubSub';

var namespaceForEvents = 'Roblox.CrossTabCommunication.Kingmaker';
var keys = {
    masterId: namespaceForEvents + '.masterId',
    electionInProgress: namespaceForEvents + '.electionInProgress',
    masterIdRequest: namespaceForEvents + '.masterIdRequest',
    masterIdResponse: namespaceForEvents + '.masterIdResponse',
    masterLastResponseTime: namespaceForEvents + '.masterLastResponseTime'
};

var masterIdRequestValue = 'q';
var masterNodeReply;
var masterTabId;
var isThisTabMaster;

var masterNodeMonitorTimer;
var masterLastResponseTime;
var masterIdleTimeBuffer;
//Whenever the master node is polled, it sets the time it responded into a localstorage key.
//When a new tab comes up, it checks this key and if the last time a master node responded to a query was > X seconds, it declares itself as the master immediately.
var masterLastResponseTimeThreshold;

var randomNumber;
var electionDetailsPurgeInterval;
var monitorMasterNodeInterval;
var waitIntervalForMasterHeartBeat;
var electionDuration;

var currentTabId;
var electionListeners = [];
var loggers = [];

var attachLogger = function (loggerCallback) {
    loggers.push(loggerCallback);
};

var isAvailable = function () {
    return crossTabCommunicationPubSub.IsAvailable();
};

var initialize = function () {
    currentTabId = generateUUID();
    intializeDefaults();

    $(function () {
        if (isAvailable()) {
            nominateAsEligible();
        }
    });
};

var isMasterTab = function () {
    return isThisTabMaster;
};

var subscribeToMasterChange = function (callback) {
    electionListeners.push(callback);
};

function logger(message) {
    var loggersToCall = loggers.slice(0);
    for (var i = 0; i < loggersToCall.length; i++) {
        try {
            loggersToCall[i](message);
        } catch (e) {
        }
    }
}

function nominateAsEligible() {
    //Role assignment
    var masterId = localStorage.getItem(keys.masterId);
    subscribeToEvents();
    var masterLastResponseTimeString = localStorage.getItem(keys.masterLastResponseTime);
    if (!masterLastResponseTimeString || masterLastResponseTimeString.length === 0) {
        masterLastResponseTime = 0;
    } else {
        masterLastResponseTime = parseInt(masterLastResponseTimeString);
    }
    if (masterId) {
        if (masterId === currentTabId) {
            isThisTabMaster = true;
        } else if (masterLastResponseTime > 0 && (Date.now() - masterLastResponseTime > masterLastResponseTimeThreshold)) { //The master node has not responded to pings in a long time. Time to declare this tab as the master!
            initiateElection();
        } else {
            pingMasterAndInitiateElectionIfNotActive();
        }
    } else {
        initiateElection();
    }
    startElectionDetailsPurger();
    monitorMasterNode();
}

//Copied from Stackoverflow.
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function timestamp() {
    var timeNowInMs = Date.now();
    return timeNowInMs.toString();
}

function intializeDefaults() {
    masterNodeReply = '';
    masterTabId = null;
    isThisTabMaster = false;

    masterNodeMonitorTimer = null;
    masterLastResponseTime = Date.now() - 10000;
    masterIdleTimeBuffer = 2500;
    masterLastResponseTimeThreshold = 20000;

    randomNumber = Math.floor((Math.random() * 100) + 1);
    electionDetailsPurgeInterval = 500;
    monitorMasterNodeInterval = 2000 + randomNumber;
    waitIntervalForMasterHeartBeat = 1500 + randomNumber;
    electionDuration = 400 + randomNumber;
}

function logMaster() {
    logger("Master is:" + masterTabId);
}

//This callback is raised so that the tabs can know the final result of whether they were chosen as a master or a slave
function announceElectionResults(isMaster) {
    logger('Announcing: Is this tab the master? ' + isMaster);

    // make a copy of the listeners to notify.
    var listenersToNotify = electionListeners.slice(0);
    for (var i = 0; i < listenersToNotify.length; i++) {
        try {
            listenersToNotify[i](isMaster);
        } catch (e) {
            logger('Error running subscribed election result handler: ' + JSON.stringify(e));
        }
    }
}

function declareThisTabAsMaster() {
    logger('Declaring myself as the master' + masterTabId);
    masterTabId = currentTabId;
    isThisTabMaster = true;
    crossTabCommunicationPubSub.Publish(keys.masterId, masterTabId);
    localStorage.removeItem(keys.electionInProgress);
    announceElectionResults(true);

    $(window).unbind('unload.' + namespaceForEvents).bind('unload.' + namespaceForEvents, function () {
        var masterId = localStorage.getItem(keys.masterId);
        if (masterId && masterId === currentTabId) {
            abdicate();
        }
    });
}

function abdicate() {
    //TODO
}

function purgeElectionDetails() {
    var electionTime = localStorage.getItem(keys.electionInProgress);
    var lastElectionTimeInMs = parseInt(electionTime);
    if (electionTime && (Date.now() - lastElectionTimeInMs > electionDetailsPurgeInterval)) {
        localStorage.removeItem(keys.electionInProgress);
    }
    window.setTimeout(purgeElectionDetails, electionDetailsPurgeInterval);
}

function startElectionDetailsPurger() {
    window.setTimeout(function () {
        purgeElectionDetails();
    }, electionDetailsPurgeInterval);
}

function initiateElection() {
    //master did not reply. Initiate election
    var electionTime = localStorage.getItem(keys.electionInProgress);
    masterTabId = '';
    if (electionTime) { //There is an election in progress. Wait for results
        logger("Election already in progress");
        window.setTimeout(function () {
            if (masterTabId.length === 0) {
                declareThisTabAsMaster();
            } else if (masterTabId !== currentTabId) {
                announceElectionResults(false);
            }
            logMaster();
        }, electionDuration);
    } else {
        logger("Election not in progress");
        localStorage.setItem(keys.electionInProgress, timestamp());
        if (masterTabId.length === 0) {
            declareThisTabAsMaster();
        } else if (masterTabId !== currentTabId) {
            announceElectionResults(false);
        }
        logMaster();
    }
}

function subscribeToEvents() {
    logger('Binding to events');

    crossTabCommunicationPubSub.Subscribe(keys.masterIdRequest, namespaceForEvents, function (message) {
        if (isThisTabMaster === true && message === masterIdRequestValue) {
            logger('Query Received - Confirming Still Master');
            crossTabCommunicationPubSub.Publish(keys.masterIdResponse, currentTabId);
            localStorage.setItem(keys.masterLastResponseTime, timestamp());
        }
    });

    crossTabCommunicationPubSub.Subscribe(keys.masterId, namespaceForEvents, function (message) {
        if (message) {
            logger('Received Notice Of Master');
            masterLastResponseTime = Date.now();
            masterTabId = message;
            var wasCurrentlyMaster = isThisTabMaster;
            isThisTabMaster = (masterTabId === currentTabId);
            if (isThisTabMaster === false && wasCurrentlyMaster) {
                announceElectionResults(false);
                monitorMasterNode(); //master just responded. Move the monitoring to later
            }
            if (isThisTabMaster === true && !wasCurrentlyMaster) {
                declareThisTabAsMaster();
            }
            localStorage.removeItem(keys.electionInProgress);
            logMaster();
        }
    });

    crossTabCommunicationPubSub.Subscribe(keys.masterIdResponse, namespaceForEvents, function (message) {
        if (message) {
            logger('Master Responded to Query');
            masterLastResponseTime = Date.now();
            masterNodeReply = message;
            monitorMasterNode();//master just responded. Move the monitoring to later
        } else {
            logger('Master Responded to Query - no message');
        }
    });
}

function pingMasterAndInitiateElectionIfNotActive() {
    logger('Checking if Master still active');
    if (isThisTabMaster === true || (Date.now() - masterLastResponseTime) <= masterIdleTimeBuffer) {
        return;
    }
    masterNodeReply = '';
    crossTabCommunicationPubSub.Publish(keys.masterIdRequest, masterIdRequestValue);
    window.setTimeout(function () {
        if (masterNodeReply.length === 0) {
            if (isThisTabMaster === true || (Date.now() - masterLastResponseTime) <= masterIdleTimeBuffer) {
                declareThisTabAsMaster();
                return;
            }
            logger('Master did not respond. Initiating election');
            initiateElection();
        } else {
            if (masterTabId !== masterNodeReply) {
                announceElectionResults(false); //initiated as a slave
                masterTabId = masterNodeReply;
                logMaster();
            }
        }
    }, waitIntervalForMasterHeartBeat);
}

function monitorMasterNode() {
    if (masterNodeMonitorTimer) {
        clearTimeout(masterNodeMonitorTimer);
    }
    masterNodeMonitorTimer = window.setTimeout(function () {
        if (isThisTabMaster === false) {
            pingMasterAndInitiateElectionIfNotActive();
        } else {
            localStorage.setItem(keys.masterLastResponseTime, timestamp());
        }
        monitorMasterNode();
    }, monitorMasterNodeInterval);
}

initialize();

const crossTabCommunicationKingmaker = {
    IsAvailable: isAvailable,
    IsMasterTab: isMasterTab,
    SubscribeToMasterChange: subscribeToMasterChange,
    AttachLogger: attachLogger
};

export default crossTabCommunicationKingmaker;