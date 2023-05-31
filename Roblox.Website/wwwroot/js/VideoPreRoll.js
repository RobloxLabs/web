if (typeof Roblox == "undefined") {
    Roblox = {};
}

Roblox.VideoPreRoll = {
    newValue: '',
    showVideoPreRoll: false,
    videoInitialized: false, // this.start has run
    videoStarted: false,
    videoCompleted: false,
    videoSkipped: false,
    videoCancelled: false,
    videoErrored: false,
    videoOptions: {
        // identification, targeting and other miscellaneous metadata
        key: "integration_test",            // Your publisher key provided by Adap.tv
        //zid: "flash_ads",                   // Name of the zone for this videoview. Defaults to "default"
        companionId: "videoPrerollCompanionAd" /*,     // The id attribute of the div to contain the companion ad

        // Parameter to pass metadata for specific ad networks, or for insertion into dynamic ad tags.
        // Contents of the context parameter must be passed as another object
        // In this case we are passing two custom keys.  Note that leading and trailing whitespace in values will be trimmed.
        
        context: {
            key1: "value1",
            key2: "value2"
        },
        // metadata about the video

        id: "games",                  // The unique identifier of the video (limit 64 chars).  
                                        // id Needs to be present for Google Ads to work.
        title: "Test Video",                // The title of the video
        duration: "29",                     // The duration of video in _seconds_, if applicable

        description: "Test Video",          // description of video
        keywords: "test,video,adaptv",      // A comma-delimited list of tags/keywords
        categories: "category1,category2"  // A comma-delimited list of top level categories
        */
        // Categories is probably best for bc, nbc, exbc, under13, over13, user or not
        // not sure if we want a separate variable for sequence number
    },
    myvpaidad: null,
    loadingBarMaxTime: 30000,
    loadingBarCurrentTime: 0,
    loadingBarIntervalID: 0,
    loadingBarID: "videoPrerollLoadingBar",
    loadingBarInnerID: "videoPrerollLoadingBarCompleted",
    loadingBarPercentageID: "videoPrerollLoadingPercent",
    videoLoadingTimeout: 7000,
    videoPlayingTimeout: 23000,
    videoLogNote: "",  // if blank, assume this was successful
    logsEnabled: false,
    excludedPlaceIds: "",
    specificAdOnPlacePageEnabled: false,
    specificAdOnPlacePageId: 0,
    specificAdOnPlacePageCategory: "",
    specificAdOnPlacePage2Enabled: false,
    specificAdOnPlacePage2Id: 0,
    specificAdOnPlacePage2Category: "",
    checkEligibility: function checkEligibility() {
        if (Roblox.VideoPreRoll.showVideoPreRoll) {
            if (!flashCheck(8) && !window.chrome) { // flash not installed
                Roblox.VideoPreRoll.videoLogNote = "NoFlash";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
            else if (typeof __adaptv__ == "undefined") {    // redir.adap.tv JS not found
                Roblox.VideoPreRoll.videoLogNote = "NoAdapTv";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
            else if (!Roblox.Client.IsRobloxInstalled()) {  // Roblox is not installed
                //Roblox.VideoPreRoll.videoLogNote = "NoClient";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
            else if (Roblox.Client.isIDE()) {  // is Studio, check this before player
                Roblox.VideoPreRoll.videoLogNote = "RobloxStudio";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
            else if (Roblox.Client.isRobloxBrowser()) {  // is Player
                Roblox.VideoPreRoll.videoLogNote = "RobloxPlayer";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
            else if (window.chrome && window.location.hash == '#chromeInstall')  // during chrome install
            {
                //Roblox.VideoPreRoll.videoLogNote = "ChromeInstall";
                Roblox.VideoPreRoll.showVideoPreRoll = false;
            }
        }
    },
    isExcluded: function isExcluded() {
        if (Roblox.VideoPreRoll.showVideoPreRoll && Roblox.VideoPreRoll.excludedPlaceIds !== "") {
            var excludedPlaceIdArr = Roblox.VideoPreRoll.excludedPlaceIds.split(",");
            if (typeof play_placeId !== "undefined") {
                for (var i = 0; i < excludedPlaceIdArr.length; i++) {
                    if (play_placeId == excludedPlaceIdArr[i]) {
                        Roblox.VideoPreRoll.videoLogNote = "ExcludedPlace";
                        //Roblox.VideoPreRoll.showVideoPreRoll = false;
                        return true;
                    }
                }
            }
        }
        return false;
    },
    start: function start() {
        // flip state bits
        this.videoInitialized = true;
        this.videoStarted = false;
        this.videoCancelled = false;
        this.videoCompleted = false;
        this.videoSkipped = false;
        this.loadingBarCurrentTime = 0;
        this.videoLogNote = "";

        // Set specific ad category
        if (Roblox.VideoPreRoll.specificAdOnPlacePageEnabled && typeof play_placeId !== "undefined") {
            var categoryPlusComma = "," + Roblox.VideoPreRoll.specificAdOnPlacePageCategory;
            if (play_placeId == Roblox.VideoPreRoll.specificAdOnPlacePageId && Roblox.VideoPreRoll.videoOptions.categories.indexOf(categoryPlusComma) == -1) {
                Roblox.VideoPreRoll.videoOptions.categories += categoryPlusComma;
            }
        }
        // Set second specific ad category
        if (Roblox.VideoPreRoll.specificAdOnPlacePage2Enabled && typeof play_placeId !== "undefined") {
            var categoryPlusComma = "," + Roblox.VideoPreRoll.specificAdOnPlacePage2Category;
            if (play_placeId == Roblox.VideoPreRoll.specificAdOnPlacePage2Id && Roblox.VideoPreRoll.videoOptions.categories.indexOf(categoryPlusComma) == -1) {
                Roblox.VideoPreRoll.videoOptions.categories += categoryPlusComma;
            }
        }

        var adap = __adaptv__;
        this.myvpaidad = new adap.ads.vpaid.VPAIDAd('videoPrerollMainDiv');

        var loadingBarInterval = 1000;

        // Start loading bar
        LoadingBar.init(this.loadingBarID, this.loadingBarInnerID, this.loadingBarPercentageID);
        this.loadingBarIntervalID = setInterval(function () {
            Roblox.VideoPreRoll.loadingBarCurrentTime += loadingBarInterval;
            LoadingBar.update(Roblox.VideoPreRoll.loadingBarID, Roblox.VideoPreRoll.loadingBarCurrentTime / Roblox.VideoPreRoll.loadingBarMaxTime);
        }, loadingBarInterval);

        var Event = adap.ads.vpaid.VPAIDEvent;
        /*
        var skipEvents = ['AdLoaded', 'AdStarted', 'AdStopped', 'AdError'];

        for (var evtname in Event) {
        if (Event.hasOwnProperty(evtname) && !skipEvents.indexOf(evtname)) {
        this.myvpaidad.on(Event[evtname], function () { console.log("*** " + e.type.toString() + " FIRED ***"); });
        }
        }
        */

        this.myvpaidad.on(Event.AdLoaded, function (e) { Roblox.VideoPreRoll._onVideoLoaded(e); });
        this.myvpaidad.on(Event.AdStarted, function (e) { Roblox.VideoPreRoll._onVideoStart(e); });
        this.myvpaidad.on(Event.AdStopped, function (e) { Roblox.VideoPreRoll._onVideoComplete(e); });
        this.myvpaidad.on(Event.AdError, function (e) { Roblox.VideoPreRoll._onVideoError(e); });

        try {
            this.myvpaidad.initAd(391, 312, this.videoOptions);
        }
        catch (exp) {
            _onVideoError();
        }
    },
    error: function error() {
        clearInterval(loadingBarInterval);
        // do I stop the video
    },
    cancel: function cancel() {
        this.videoCancelled = true;
        $.modal.close();  // calls this.close()
    },
    skip: function skip() {
        this.videoCompleted = true;
        this.videoSkipped = true;
        this.showVideoPreRoll = false;
    },
    close: function close() {
        if (MadStatus.running) {
            MadStatus.stop("");
        }
        if (RobloxLaunch.launcher) {
            RobloxLaunch.launcher._cancelled = true;
        }
        clearInterval(this.loadingBarIntervalID);
        LoadingBar.dispose(this.loadingBarID);
        try {
            this.myvpaidad.stopAd();
        }
        catch (exp) {
            // ignore errors
        }
        if (this.isPlaying()) {
            // closing before video ended, must be a cancel
            this.videoCancelled = true;
        }
        //console.log("videoCompleted: " + this.videoCompleted);

        $.modal.close();
        this.logVideoPreRoll();
    },
    _onVideoError: function _onVideoError(e) {  // theoretically, e is an event object from adap.tv
        // FYI, myvpaidad never fires this event.  Might be able to drive off swf's error event instead?
        // Let's say there is an error.  assume video is complete.
        this.videoCompleted = true;
        this.videoErrored = true;

    },
    _onVideoLoaded: function _onVideoLoaded(e) {
        try {
            this.myvpaidad.startAd();
        }
        catch (exp) {
            _onVideoError(e);
        }
    },
    _onVideoStart: function _onVideoStart(e) {
        this.videoStarted = true;
    },
    _onVideoComplete: function _videoComplete(e) {
        if (this.videoStarted) {
            if (this.videoCancelled == false) {
                // video played to completion (or was skipped)
                this.videoCompleted = true;
                this.showVideoPreRoll = false;
                if (this.newValue != '') {
                    $.cookie("RBXVPR", this.newValue, 180);
                }
            }
        }
        //LoadingBar.dispose(loadingBarID);
    },
    logVideoPreRoll: function logVideoPreRoll() {
        if (!Roblox.VideoPreRoll.logsEnabled) {
            return; // logs disabled
        }
        var category = "";
        if (Roblox.VideoPreRoll.videoCompleted) { // Also encompasses timeouts
            category = "Complete";
            if (Roblox.VideoPreRoll.videoLogNote == "") {
                Roblox.VideoPreRoll.videoLogNote = "NoTimeout";
            }
            // log only once per page load
            Roblox.VideoPreRoll.logsEnabled = false;
        }
        else if (Roblox.VideoPreRoll.videoCancelled) {
            category = "Cancelled";
            Roblox.VideoPreRoll.videoLogNote = RobloxLaunch.state;
        }
        else if (Roblox.VideoPreRoll.videoInitialized == false && Roblox.VideoPreRoll.videoLogNote != "") {
            category = "Failed";
            // log only once per page load
            Roblox.VideoPreRoll.logsEnabled = false;
        }
        else {
            return;  // nothing to report
        }
        GoogleAnalyticsEvents.FireEvent(["PreRoll", category, Roblox.VideoPreRoll.videoLogNote]);

    },
    isPlaying: function isPlaying() {
        if (!Roblox.VideoPreRoll.videoInitialized) {
            return false;
        }

        // if video is not loaded post timeout, consider the video complete
        if (Roblox.VideoPreRoll.videoInitialized
                && !Roblox.VideoPreRoll.videoStarted
                && Roblox.VideoPreRoll.loadingBarCurrentTime > Roblox.VideoPreRoll.videoLoadingTimeout) {
            Roblox.VideoPreRoll.videoCompleted = true;
            Roblox.VideoPreRoll.videoLogNote = "LoadingTimeout";

        }
        // if video is waaay too long, consider the video complete
        if (Roblox.VideoPreRoll.videoStarted && !Roblox.VideoPreRoll.videoCompleted
                && Roblox.VideoPreRoll.loadingBarCurrentTime > Roblox.VideoPreRoll.videoPlayingTimeout) {
            Roblox.VideoPreRoll.videoCompleted = true;
            Roblox.VideoPreRoll.videoLogNote = "PlayingTimeout";
        }

        return !Roblox.VideoPreRoll.videoCompleted;
    },
    correctIEModalPosition: function correctIEModalPosition(dialog) {
        if (dialog.container.innerHeight() <= 30) {  // gives a little style buffer.  should really be around 15px;
            // this must be IE (or equally stupid).  shift the modal up.
            var innerContainer = $("#videoPrerollPanel");
            var shiftDistance = -Math.floor(innerContainer.innerHeight() / 2);
            innerContainer.css({ position: "relative", top: shiftDistance + "px" });
            dialog.container.find(".VprCloseButton").css({ top: (shiftDistance - 10) + "px", "z-index": "1003" });
        }
    },
    test: function openVideoPreroll2(options) {
        _popupOptions = {
            escClose: true,
            opacity: 80,
            overlayCss: { backgroundColor: "#000" },
            onShow: function (dialog) {
                Roblox.VideoPreRoll.correctIEModalPosition(dialog);
                Roblox.VideoPreRoll.start();
            },
            onClose: function (dialog) { Roblox.VideoPreRoll.close(); },
            closeHTML: '<a href="#" class="ImageButton closeBtnCircle_35h ABCloseCircle VprCloseButton"></a>'
        };
        $("#videoPrerollPanel").modal(_popupOptions);
        // Madlib status
        if (!MadStatus.running) {
            MadStatus.init($("#videoPrerollPanel").find('.MadStatusField'), $("#videoPrerollPanel").find('.MadStatusBackBuffer'), 2000, 800);
            MadStatus.start();
        }
        $("#videoPrerollPanel").find('.MadStatusStarting').css("display", 'none');
        $("#videoPrerollPanel").find('.MadStatusSpinner').css("visibility", ((status === 3 || status === 4 || status === 5) ? 'hidden' : 'visible'));
    }
};

function openVideoPreroll2(options) {
    // this is deprecated.  use Roblox.VideoPreRoll.test instead.
    Roblox.VideoPreRoll.test(options);
}

var LoadingBar = {
    bars: [],
    init: function loadingBarInit(barID, innerBarID, percentageID, percentComplete) {
        var newBar = this.get(barID);
        if (newBar == null) {
            newBar = {}; 
        }
        newBar.barID = barID;
        newBar.innerBarID = innerBarID;
        newBar.percentageID = percentageID;
        if (typeof percentComplete == "undefined") {
            newBar.percentComplete = 0; // value from 0 to 1
        }
        this.bars.push(newBar);
        this.update(barID, newBar.percentComplete);
    },
    get: function loadingBarGet(barID) {
        for (var i = 0; i < this.bars.length; i++) {
            if (this.bars[i].barID == barID) {
                return this.bars[i];
            }
        }
        return null;
    },
    dispose: function loadingBarDispose(barID) {
        for (var i = 0; i < this.bars.length; i++) {
            if (this.bars[i].barID == barID) {
                this.bars.splice(i, 1);
            }
        }
    },
    update: function loadingBarUpdate(barID, percentComplete) {
        var bar = this.get(barID);
        if (!bar) {
            return;
        }
        if (percentComplete > 1) {
            percentComplete = 1;
        }
        var maxWidth = $("#" + barID).width();
        var innerBarWidth = Math.round(maxWidth * percentComplete);
        //$("#" + bar.innerBarID).width(innerBarWidth);
        $("#" + bar.innerBarID).animate({width: innerBarWidth}, 200, "swing");
        if (bar.percentageID && $("#" + bar.percentageID).length > 0) {
            $("#" + bar.percentageID).html(Math.round(percentComplete * 100) + "%");
        }
        bar.percentComplete = percentComplete;
    }
};

function flashCheck(version) {
    // Function checkForFlash adapted from FlashReplace by Robert Nyman
    // http://code.google.com/p/flashreplace/
    // And stolen again from jPlayer.js
    var flashIsInstalled = false;
    var flash;
    if (window.ActiveXObject) {
        try {
            flash = new ActiveXObject(("ShockwaveFlash.ShockwaveFlash." + version));
            flashIsInstalled = true;
        }
        catch (e) {
            // Throws an error if the version isn't available			
        }
    }
    else if (navigator.plugins && navigator.mimeTypes.length > 0) {
        flash = navigator.plugins["Shockwave Flash"];
        if (flash) {
            var flashVersion = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1");
            if (flashVersion >= version) {
                flashIsInstalled = true;
            }
        }
    }
    return flashIsInstalled;
} 
