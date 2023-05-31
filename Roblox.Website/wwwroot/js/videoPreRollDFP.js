import { Client, GaEventSettings } from 'Roblox';
import $ from 'jquery';

const LoadingBar = {
    bars: [],
    init: function loadingBarInit(
        barID,
        innerBarID,
        percentageID,
        percentComplete
    ) {
        let newBar = this.get(barID);
        if (newBar == null) {
            newBar = {};
        }
        newBar.barID = barID;
        newBar.innerBarID = innerBarID;
        newBar.percentageID = percentageID;
        if (typeof percentComplete === 'undefined') {
            newBar.percentComplete = 0; // value from 0 to 1
        }
        this.bars.push(newBar);
        this.update(barID, newBar.percentComplete);
    },
    get: function loadingBarGet(barID) {
        for (let i = 0; i < this.bars.length; i += 1) {
            if (this.bars[i].barID === barID) {
                return this.bars[i];
            }
        }
        return null;
    },
    dispose: function loadingBarDispose(barID) {
        for (let i = 0; i < this.bars.length; i += 1) {
            if (this.bars[i].barID === barID) {
                this.bars.splice(i, 1);
            }
        }
    },
    update: function loadingBarUpdate(barID, percentComplete) {
        const bar = this.get(barID);
        if (!bar) {
            return;
        }
        if (percentComplete > 1) {
            percentComplete = 1;
        }
        const maxWidth = $(`#${barID}`).width();
        const innerBarWidth = Math.round(maxWidth * percentComplete);
        // $("#" + bar.innerBarID).width(innerBarWidth);
        $(`#${bar.innerBarID}`).animate({ width: innerBarWidth }, 200, 'swing');
        if (bar.percentageID && $(`#${bar.percentageID}`).length > 0) {
            $(`#${bar.percentageID}`).html(`${Math.round(percentComplete * 100)}%`);
        }
        bar.percentComplete = percentComplete;
    }
};

const VideoPreRollDFP = {
    newValue: '',
    showVideoPreRoll: false,
    videoInitialized: false, // this.start has run
    videoStarted: false,
    videoCompleted: false,
    videoSkipped: false,
    videoCancelled: false,
    videoErrored: false,
    loadingBarMaxTime: 30000,
    loadingBarCurrentTime: 0,
    loadingBarIntervalID: 0,
    loadingBarID: 'videoPrerollLoadingBar',
    loadingBarInnerID: 'videoPrerollLoadingBarCompleted',
    loadingBarPercentageID: 'videoPrerollLoadingPercent',
    videoDiv: 'videoPrerollMainDiv',
    companionAdDiv: 'videoPrerollCompanionAd',
    contentElement: 'contentElement',
    videoLoadingTimeout: 7000,
    videoPlayingTimeout: 23000,
    videoLogNote: '', // if blank, assume this was successful
    logsEnabled: false,
    includedPlaceIds: '',
    isSwfPreloaderEnabled: false,
    isFlashInstalled: false,
    isPrerollShownEveryXMinutesEnabled: false,
    isAgeTargetingEnabled: true,
    isAgeOrSegmentTargetingEnabled: false,

    adUnit: '', //  /1015347/VideoPreroll
    adTime: 0,
    placeId: 0,

    customTargeting: {
        userAge: '',
        userAgeOrSegment: '',
        userGender: '',
        gameGenres: '',
        environment: '',
        adTime: '',
        PLVU: false
    },

    adsManager: null,
    adsLoader: null,
    adDisplayContainer: null,
    intervalTimer: null,

    videoContent: null,

    isCompanionAdRenderedByGoogleTag: false
};

function contentEndedListener() {
    VideoPreRollDFP.adsLoader.contentComplete();
}

function createVideoContent() {
    VideoPreRollDFP.videoContent = document.getElementById(
        VideoPreRollDFP.contentElement
    );
}

function createAdDisplayContainer() {
    VideoPreRollDFP.adDisplayContainer = new window.google.ima.AdDisplayContainer(
        document.getElementById(VideoPreRollDFP.videoDiv),
        VideoPreRollDFP.videoContent
    );
}

function constructUrl() {
    const baseUrl =
        'http://pubads.g.doubleclick.net/gampad/ads?impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]';
    const size = '&sz=400x300';
    const iu = `&iu=${VideoPreRollDFP.adUnit}`;
    const companionSize = '&ciu_szs=300x250';
    let ageTag = '';
    if (VideoPreRollDFP.isAgeTargetingEnabled) {
        ageTag += `&Age=${VideoPreRollDFP.customTargeting.userAge}`;
    }
    if (VideoPreRollDFP.isAgeOrSegmentTargetingEnabled) {
        ageTag += `&A=${VideoPreRollDFP.customTargeting.userAgeOrSegment}`;
    }
    const customTag = encodeURIComponent(
        `Env=${VideoPreRollDFP.customTargeting.environment}&Gender=${VideoPreRollDFP.customTargeting.userGender
        }${ageTag}&Genres=${VideoPreRollDFP.customTargeting.gameGenres}&PlaceID=${VideoPreRollDFP.placeId
        }&Time=${VideoPreRollDFP.customTargeting.adTime}&PLVU=${VideoPreRollDFP.customTargeting.PLVU
        }`
    );
    const url = `${baseUrl}${size}${iu}${companionSize}&cust_params=${customTag}&`;
    return url;
}

function renderCompanionAd() {
    window.googletag
        .defineSlot(
            VideoPreRollDFP.adUnit,
            [300, 250],
            VideoPreRollDFP.companionAdDiv
        )
        .addService(window.googletag.companionAds());
    window.googletag.enableServices();
    window.googletag.display(VideoPreRollDFP.companionAdDiv);
}

function onAdEvent(adEvent) {
    switch (adEvent.type) {
        case window.google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad
            break;
        case window.google.ima.AdEvent.Type.STARTED:
            VideoPreRollDFP.videoStarted = true;

            if (VideoPreRollDFP.isCompanionAdRenderedBywindow.googletag) {
                if (!window.googletag) {
                    break;
                }
                window.googletag.cmd.push(renderCompanionAd);
            } else {
                // Get the ad from the event.
                const ad = adEvent.getAd();
                // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
                const companionAds = ad.getCompanionAds(300, 250);
                if (companionAds.length > 0) {
                    const companionAd = companionAds[0];
                    // Get HTML content from the companion ad.
                    const content = companionAd.getContent();
                    // Write the content to the companion ad slot.
                    const div = document.getElementById(VideoPreRollDFP.companionAdDiv);
                    div.innerHTML = content;
                }
            }

            break;
        case window.google.ima.AdEvent.Type.SKIPPED:
            VideoPreRollDFP.videoCompleted = true;
            VideoPreRollDFP.videoSkipped = true;
            VideoPreRollDFP.showVideoPreRoll = false;
            break;
        case window.google.ima.AdEvent.Type.COMPLETE:
            if (VideoPreRollDFP.videoStarted) {
                if (VideoPreRollDFP.videoCancelled === false) {
                    // video played to completion (or was skipped)
                    VideoPreRollDFP.videoCompleted = true;
                    VideoPreRollDFP.showVideoPreRoll = false;
                    if (VideoPreRollDFP.newValue !== '') {
                        $.cookie('RBXVPR', VideoPreRollDFP.newValue, 180);
                    }
                }
            }
            break;
        default:
    }
}

function onAdError() {
    // Handle the error logging.
    VideoPreRollDFP.videoErrored = true;
    VideoPreRollDFP.videoCompleted = true;
    VideoPreRollDFP.videoLogNote = 'AdError';
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    VideoPreRollDFP.adsManager = adsManagerLoadedEvent.getAdsManager(
        VideoPreRollDFP.videoContent
    ); // See API reference for contentPlayback

    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError
    );
    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent
    );
    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdEvent.Type.LOADED,
        onAdEvent
    );
    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdEvent.Type.STARTED,
        onAdEvent
    );
    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdEvent.Type.SKIPPED,
        onAdEvent
    );
    VideoPreRollDFP.adsManager.addEventListener(
        window.google.ima.AdEvent.Type.COMPLETE,
        onAdEvent
    );

    try {
        VideoPreRollDFP.adsManager.init(
            400,
            300,
            window.google.ima.ViewMode.NORMAL
        );
        VideoPreRollDFP.adsManager.start();
    } catch (adError) {
        onAdError();
    }
}

function requestAds() {
    // Enable VPAID 2
    window.google.ima.settings.setVpaidAllowed(true);

    createVideoContent();
    createAdDisplayContainer();

    VideoPreRollDFP.adDisplayContainer.initialize();

    VideoPreRollDFP.adsLoader = new window.google.ima.AdsLoader(
        VideoPreRollDFP.adDisplayContainer
    );
    VideoPreRollDFP.adsLoader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
    );
    VideoPreRollDFP.adsLoader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
    );

    VideoPreRollDFP.videoContent.addEventListener('ended', contentEndedListener);

    // Request video ads.
    const adsRequest = new window.google.ima.AdsRequest();

    // construct tag url
    const tagUrl = constructUrl();
    adsRequest.adTagUrl = tagUrl;

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = 400;
    adsRequest.linearAdSlotHeight = 300;

    adsRequest.nonLinearAdSlotWidth = 400;
    adsRequest.nonLinearAdSlotHeight = 300;

    VideoPreRollDFP.adsLoader.requestAds(adsRequest);
}

function checkFlashEnabled() {
    let hasFlash = false;
    try {
        const flash = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (flash) {
            hasFlash = true;
        }
    } catch (e) {
        if (
            navigator.mimeTypes &&
            navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
            navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin
        ) {
            hasFlash = true;
        }
    }
    return hasFlash;
}

function checkEligibility() {
    if (VideoPreRollDFP.showVideoPreRoll) {
        if (checkFlashEnabled()) {
            VideoPreRollDFP.isFlashInstalled = true;
        }
        if (
            $('#PlaceLauncherStatusPanel').data(
                'is-protocol-handler-launch-enabled'
            ) !== 'True' &&
            !Client.IsRobloxInstalled()
        ) {
            // we're not on protocol handler and Roblox is not installed
            VideoPreRollDFP.showVideoPreRoll = false;
        } else if (
            typeof window.google === 'undefined' ||
            typeof window.google.ima === 'undefined'
        ) {
            VideoPreRollDFP.videoLogNote = 'NoGoogle';
            VideoPreRollDFP.showVideoPreRoll = false;
        } else if (Client.isIDE()) {
            // is Studio, check this before player
            VideoPreRollDFP.videoLogNote = 'RobloxStudio';
            VideoPreRollDFP.showVideoPreRoll = false;
        } else if (Client.isRobloxBrowser()) {
            // is Player
            VideoPreRollDFP.videoLogNote = 'RobloxPlayer';
            VideoPreRollDFP.showVideoPreRoll = false;
        } else if (
            (window.chrome || window.safari) &&
            window.location.hash === '#chromeInstall'
        ) {
            // during chrome install
            VideoPreRollDFP.showVideoPreRoll = false;
        }
    }
}

// -------------google analysis fire
function logVideoPreRoll() {
    if (!VideoPreRollDFP.logsEnabled) {
        return; // logs disabled
    }
    let category = '';
    if (VideoPreRollDFP.videoCompleted) {
        // Also encompasses timeouts
        category = 'Complete';
        if (VideoPreRollDFP.videoLogNote === '') {
            VideoPreRollDFP.videoLogNote = 'NoTimeout';
        }
        // log only once per page load
        VideoPreRollDFP.logsEnabled = false;
    } else if (VideoPreRollDFP.videoCancelled) {
        category = 'Cancelled';
        VideoPreRollDFP.videoLogNote = window.RobloxLaunch.state;
    } else if (
        VideoPreRollDFP.videoInitialized === false &&
        VideoPreRollDFP.videoLogNote !== ''
    ) {
        category = 'Failed';
        // log only once per page load
        VideoPreRollDFP.logsEnabled = false;
    } else {
        return; // nothing to report
    }
    if (GaEventSettings.gaDFPPreRollEnabled && window.GoogleAnalyticsEvents) {
        window.GoogleAnalyticsEvents.FireEvent([
            'DFPPreRoll',
            category,
            VideoPreRollDFP.videoLogNote
        ]);
    }
}

function isPlaying() {
    if (!VideoPreRollDFP.videoInitialized) {
        return false;
    }

    // if video is not loaded post timeout, consider the video complete
    if (
        VideoPreRollDFP.videoInitialized &&
        !VideoPreRollDFP.videoStarted &&
        VideoPreRollDFP.loadingBarCurrentTime > VideoPreRollDFP.videoLoadingTimeout
    ) {
        VideoPreRollDFP.videoCompleted = true;
        VideoPreRollDFP.videoLogNote = 'LoadingTimeout';
    }
    // if video is waaay too long, consider the video complete
    if (
        VideoPreRollDFP.videoStarted &&
        !VideoPreRollDFP.videoCompleted &&
        VideoPreRollDFP.loadingBarCurrentTime > VideoPreRollDFP.videoPlayingTimeout
    ) {
        VideoPreRollDFP.videoCompleted = true;
        VideoPreRollDFP.videoLogNote = 'PlayingTimeout';
    }

    return !VideoPreRollDFP.videoCompleted;
}

function correctIEModalPosition(dialog) {
    if (dialog.container.innerHeight() <= 30) {
        // gives a little style buffer.  should really be around 15px;
        // this must be IE (or equally stupid).  shift the modal up.
        const innerContainer = $('#videoPrerollPanel');
        const shiftDistance = -Math.floor(innerContainer.innerHeight() / 2);
        innerContainer.css({ position: 'relative', top: `${shiftDistance}px` });
        dialog.container
            .find('.VprCloseButton')
            .css({ top: `${shiftDistance - 10}px`, 'z-index': '1003' });
    }
}

function renderImaPreloader() {
    const adUrl = encodeURIComponent(constructUrl());
    const adTagUrl = `adTagUrl=${adUrl}`;
    $.ajax({
        url: '/game/preloader',
        data: { url: adTagUrl },
        method: 'GET',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).success(data => {
        $('#videoPrerollMainDiv').html(data);
        if (!VideoPreRollDFP.videoErrored) {
            VideoPreRollDFP.videoStarted = true;
        }
    });
}

function updatePrerollCount() {
    $.ajax({
        url: '/game/updateprerollcount',
        method: 'GET',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    });
}

function start() {
    if (VideoPreRollDFP.placeId === 0 && typeof play_placeId !== 'undefined') {
        VideoPreRollDFP.placeId = play_placeId;
    }
    // flip state bits
    VideoPreRollDFP.videoInitialized = true;
    VideoPreRollDFP.videoStarted = false;
    VideoPreRollDFP.videoCancelled = false;
    VideoPreRollDFP.videoCompleted = false;
    VideoPreRollDFP.videoSkipped = false;
    VideoPreRollDFP.loadingBarCurrentTime = 0;
    VideoPreRollDFP.videoLogNote = '';

    const loadingBarInterval = 1000;

    // Start loading bar
    LoadingBar.init(
        VideoPreRollDFP.loadingBarID,
        VideoPreRollDFP.loadingBarInnerID,
        VideoPreRollDFP.loadingBarPercentageID
    );
    VideoPreRollDFP.loadingBarIntervalID = setInterval(() => {
        VideoPreRollDFP.loadingBarCurrentTime += loadingBarInterval;
        LoadingBar.update(
            VideoPreRollDFP.loadingBarID,
            VideoPreRollDFP.loadingBarCurrentTime / VideoPreRollDFP.loadingBarMaxTime
        );
    }, loadingBarInterval);

    // Fetch preroll ad
    if (
        VideoPreRollDFP.isSwfPreloaderEnabled &&
        VideoPreRollDFP.isFlashInstalled
    ) {
        renderImaPreloader();
    } else {
        requestAds();
    }
}

function cancel() {
    VideoPreRollDFP.videoCancelled = true;
    $.modal.close(); // calls this.close()
}

function skip() {
    VideoPreRollDFP.videoCompleted = true;
    VideoPreRollDFP.videoSkipped = true;
    VideoPreRollDFP.showVideoPreRoll = false;
}

function close() {
    if (window.MadStatus && window.MadStatus.running) {
        window.MadStatus.stop('');
    }
    // todo: see where this robloxlaunch is coming from and if we can import it.
    if (window.RobloxLaunch.launcher) {
        window.RobloxLaunch.launcher._cancelled = true;
    }
    clearInterval(VideoPreRollDFP.loadingBarIntervalID);
    LoadingBar.dispose(VideoPreRollDFP.loadingBarID);

    if (isPlaying()) {
        // closing before video ended, must be a cancel
        VideoPreRollDFP.videoCancelled = true;
    }

    $.modal.close();
    logVideoPreRoll();

    // Update preroll count
    if (
        VideoPreRollDFP.isPrerollShownEveryXMinutesEnabled &&
        VideoPreRollDFP.videoInitialized &&
        VideoPreRollDFP.videoCompleted
    ) {
        updatePrerollCount();
    }
}

// Add the functions
Object.assign(VideoPreRollDFP, {
    contentEndedListener,
    createVideoContent,
    createAdDisplayContainer,
    constructUrl,
    renderCompanionAd,
    onAdEvent,
    onAdError,
    onAdsManagerLoaded,
    requestAds,
    checkFlashEnabled,
    checkEligibility,
    logVideoPreRoll,
    isPlaying,
    correctIEModalPosition,
    renderImaPreloader,
    updatePrerollCount,
    start,
    cancel,
    skip,
    close
});

export default VideoPreRollDFP;
