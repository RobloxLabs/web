var RobloxYouTube = RobloxYouTube ||
{
    Events:
    {
        States:
            {
                Unstarted: -1,
                Ended: 0,
                Playing: 1,
                Paused: 2,
                Buffering: 3,
                VideoCued: 5
            },
        Errors:
            {
                InvalidParameters: 2,
                VideoNotFound: 100,
                NotEmbeddable: 101,
                NotEmbeddable2: 150 // Same as embeddable 1  (http://code.google.com/apis/youtube/js_api_reference.html#Events)
            }
    }
};

var RobloxYouTubeVideoManager = function () {

    var _AllVideosOnPage = new Array();
    var _CallWhenApiReady = new Array();
    var _YouTubeApiReady = false;

    //insert the IFrame api
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function CallWhenReady(callback) {
        if (_YouTubeApiReady) {
            callback();
        } else {
            _CallWhenApiReady.push(callback);
        }
    }

    function OnYouTubeApiReady() {
        _YouTubeApiReady = true;
        for (var i = 0; i < _CallWhenApiReady.length; i++) {
            _CallWhenApiReady[i]();
        }
    }
    
    function AddVideo(video) {
        _AllVideosOnPage[video.RobloxVideoPlayerID] = video;
        return video;
    }
    function GetVideo(videoId) {
        return _AllVideosOnPage[videoId];
    }

    $(function() {
        if (!_YouTubeApiReady && typeof YT != "undefined") {
            // Something seems to be re-writing the public onYouTubeIframeAPIReady (probably ima3.js)
            // We use this code to double check if this happened.
            if (YT.loaded === 1) {
                OnYouTubeApiReady();                
            }
            else {
                onYouTubeIframeAPIReady = robloxOnYoutubeIframeAPIReady;
            }
        }
    });

    return {
        AddVideo: AddVideo,
        GetVideo: GetVideo,
        OnYouTubeApiReady: OnYouTubeApiReady,
        CallWhenReady: CallWhenReady
    };
}();

function RobloxYouTubeVideo(videoPlayerId, stateChangeCallback)
{
    
    var self = this;
    this.RobloxVideoPlayerID = videoPlayerId;
    this.OnPlayerStateChangeCallback = function (state) {
        stateChangeCallback(state, videoPlayerId, self);
    }
    this.YouTubeVideoID = null;
    this.Chromeless = false;
    this.Autoplay = false;
    this.Muted = false;

    this.Player = function() {
        return document.getElementById(this.RobloxVideoPlayerID);
    };
    // Arguments:
    // chromeless: Render this video in chromeless mode or not
    // youTubeVideoId: id of video on youtube
    // divToFill: ID of a div to replace with the video.  This should ideally be a div containing the message: "You need Flash player 8+ and JavaScript enabled to view this video.", that will be replaced when the video loads (if possible)
    this.Init = function (youTubeVideoId, chromeless, divToFillId, width, height, autoplay) {
        this.YouTubeVideoID = youTubeVideoId;
        this.Chromeless = chromeless;
        this.Autoplay = autoplay;
        this.Muted = autoplay;

        var isSmallThumb = (width <= 120);

        function onPlayerReady(event) {
            if (isSmallThumb) {
                return;
            }

            if (self.Muted)
                event.target.mute();


            //Problem: iPad needs user input to play video. If you try to autoplay, it gets stuck buffering with black screen
            //Even YouTube's own demo site has this problem.
            var isiPad = navigator.userAgent.match(/iPad/i) != null;

            if (self.Autoplay && !isiPad)
                event.target.playVideo();
        }

        RobloxYouTubeVideoManager.CallWhenReady(function () {
            var player = new YT.Player(divToFillId, {
                width: width,
                height: height,
                playerVars: {
                    showinfo: 0,
                    showsearch: 0,
                    rel: 0, //show related videos at end
                    fs: 0, //no fullscreen button
                    version: 3,
                    autohide: 1,
                    enablejsapi: 1,
                    iv_load_policy: 3, //hide annotations
                    playerapiid: youTubeVideoId,
                    controls: 1,
                    wmode: "opaque"
                },
                videoId: youTubeVideoId,
                events: {
                    'onReady': onPlayerReady
                }
            });
            if (player.A) {
                player.A.id = self.RobloxVideoPlayerID;
            }
        });
    };
    this.SeekToTime = function (secondsMark) {
        this.Player().seekTo(secondsMark, true);
    };
    this.PauseVideo = function () {
        this.Player().pauseVideo();
    };
};

//Youtube calls this method when the iFrame API js file is loaded
//Must be in the global environment
var robloxOnYoutubeIframeAPIReady = function() {
    RobloxYouTubeVideoManager.OnYouTubeApiReady();
}

onYoutubeIframeAPIReady = robloxOnYoutubeIframeAPIReady;