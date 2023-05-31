Type.registerNamespace("Roblox.Controls.Image"); Roblox.Controls.Image.IE6Hack = function(a) { a = a.getElementsByTagName("img")[0]; var b = a.src; a.src = a.blankUrl; a.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='crop', src='" + b + "')" }; Roblox.Controls.Image.SetImageSrc = function(a, b) { a = a.getElementsByTagName("img")[0]; if (a.blankUrl) a.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='crop', src='" + b + "')"; else a.src = b }; Roblox.Controls.Image.IsBadImage = function(a) { if (!a.complete) return false; if (typeof a.naturalWidth != "undefined" && a.naturalWidth === 0) return false; return true }; Roblox.Controls.Image.ErrorUrl = ""; Roblox.Controls.Image.OnError = function(a) { if (Roblox.Controls.Image.IsBadImage(a)) { var b = new XMLHttpRequest; a = a.src; b.open("POST", Roblox.Controls.Image.ErrorUrl, true); b.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); b.setRequestHeader("Content-length", a.length); b.setRequestHeader("Connection", "close"); b.send(a) } return false };
// Image.Js.  Register the namespace for the control.
Type.registerNamespace('Roblox.Thumbs');

//
// Define the control properties.
//
Roblox.Thumbs.Image = function (element) {
    Roblox.Thumbs.Image.initializeBase(this, [element]);
    this._fileExtension = null;
    this._spinnerUrl = null;
    this._pollTime = 3000;
    this._waitTime = 0;
    this._webService = null;
    this._requestThumbnail = null;
    this._updateTimeout = null;
    this._spinner = null;
};

//
// Create the prototype for the control.
//
Roblox.Thumbs.Image.prototype = {

    initialize: function () {
        Roblox.Thumbs.Image.callBaseMethod(this, 'initialize');
    },

    dispose: function () {
        if (typeof (this._updateTimeout) !== 'undefined')
            window.clearTimeout(this._updateTimeout);
        Roblox.Thumbs.Image.callBaseMethod(this, 'dispose');
    },

    _showSpinner: function () {
        if (this._spinner !== null)
            return;

        this.get_element().style.position = "relative";
        this._spinner = document.createElement("img");
        this._spinner.style.position = "absolute";
        this._spinner.style.left = "0px";
        this._spinner.style.top = "0px";
        this._spinner.style.height = "16px";
        this._spinner.style.width = "16px";
        this._spinner.style.border = 0;
        this._spinner.src = this._spinnerUrl;
        this.get_element().appendChild(this._spinner);
    },

    _hideSpinner: function () {
        if (!this._spinner)
            return;
        var e = this.get_element();
        if (e) {
            e.removeChild(this._spinner);
        }
        this._spinner = null;
    },

    _onUpdate: function () {

        if (!this._webService) {
            this._hideSpinner();
            return;
        }
        this._showSpinner();
        this._requestThumbnail();
    },

    _onUrl: function (result) {

        if (!this.get_element()) {
            this._hideSpinner();
            return;
        }

        Roblox.Controls.Image.SetImageSrc(this.get_element(), result.url);

        if ((!result.final || result.url.indexOf("unavail") > 0) && this._waitTime <= 40)   // Give up after 40 times.
        {
            // Try again later
            this._waitTime = parseInt(this._waitTime) + parseInt(1);
            this._updateTimeout = window.setTimeout(Function.createDelegate(this, this._onUpdate), this._pollTime);
        }
        else
            this._hideSpinner();
    },

    _onError: function (result) {
        this._hideSpinner();
    },

    get_thumbnailFormatID: function () {
        return this._thumbnailFormatID;
    },

    set_thumbnailFormatID: function (value) {
        if (this._thumbnailFormatID !== value) {
            this._thumbnailFormatID = value;
            this.raisePropertyChanged('thumbnailFormatID');
        }
    },

    get_pollTime: function () {
        return this._pollTime.value;
    },

    set_pollTime: function (value) {
        if (this._pollTime !== value) {
            this._pollTime = value;
            this.raisePropertyChanged('pollTime');
        }
    },

    get_fileExtension: function () {
        return this._fileExtension;
    },

    set_fileExtension: function (value) {
        if (this._fileExtension !== value) {
            this._fileExtension = value;
            this.raisePropertyChanged('fileExtension');
        }
    },

    get_spinnerUrl: function () {
        return this._spinnerUrl;
    },

    set_spinnerUrl: function (value) {
        if (this._spinnerUrl !== value) {
            this._spinnerUrl = value;
            this.raisePropertyChanged('spinnerUrl');
        }
    }
};

// Optional descriptor for JSON serialization.
Roblox.Thumbs.Image.descriptor = {
    properties: []
};

// Register the class as a type that inherits from Sys.UI.Control.
Roblox.Thumbs.Image.registerClass('Roblox.Thumbs.Image', Sys.UI.Control);
// AssetImage.js.  Register the namespace for the control.
Type.registerNamespace('Roblox.Thumbs');

//
// Define the control properties.
//
Roblox.Thumbs.AssetImage = function (element) {
    Roblox.Thumbs.AssetImage.initializeBase(this, [element]);
    this._assetID = 0;
    this._assetVersionID = null;
    this._ov = false;
};

//
// Create the prototype for the control.
//
Roblox.Thumbs.AssetImage.prototype = {

    initialize: function () {
        Roblox.Thumbs.AssetImage.callBaseMethod(this, 'initialize');
        this._webService = Roblox.Thumbs.Asset;
        this._requestThumbnail = Function.createDelegate(this, this.requestThumbnail);
    },

    dispose: function () {
        Roblox.Thumbs.AssetImage.callBaseMethod(this, 'dispose');
    },

    get_assetID: function () {
        return this._assetID;
    },

    set_assetID: function (value) {
        if (this._assetID !== value) {
            this._assetID = value;
            this.raisePropertyChanged('assetID');
        }
    },

    get_assetVersionID: function () {
        return this._assetVersionID;
    },

    set_assetVersionID: function (value) {
        if (this._assetVersionID !== value) {
            this._assetVersionID = value;
            this.raisePropertyChanged('assetVersionID');
        }
    },

    get_ov: function () {
        return this._ov;
    },

    set_ov: function (value) {
        if (this._ov !== value) {
            this._ov = value;
            this.raisePropertyChanged('ov');
        }
    },

    requestThumbnail: function () {
        var style = this.get_element().style;
        var width = style.pixelWidth;
        var height = style.pixelHeight;

        var onSuccess = function (result, context) { context._onUrl(result); };
        var onError = function (result, context) { context._onError(result); };

        this._webService.RequestThumbnail_v2(this._assetID, this._assetVersionID, width, height, this._fileExtension, this._thumbnailFormatID, this._ov, onSuccess, onError, this);
    }
};

// Optional descriptor for JSON serialization.
Roblox.Thumbs.AssetImage.descriptor = {
    properties: []
};

// Register the class as a type that inherits from Sys.UI.Control.
Roblox.Thumbs.AssetImage.registerClass('Roblox.Thumbs.AssetImage', Roblox.Thumbs.Image);

Roblox.Thumbs.AssetImage.updateUrl = function(componentID) {
    /// <summary>
    /// This static function (that is intended to be called from script emitted
    /// on the server)
    /// </summary>
    var a = $find(componentID);
    if (a != null || a != undefined) {
        a._onUpdate();
    }
};

Roblox.Thumbs.AssetImage.mediaPlayer = null;
Roblox.Thumbs.AssetImage.isInitialized = false;
Roblox.Thumbs.AssetImage.currentlyPlayingAsset = null;
Roblox.Thumbs.AssetImage.InitMediaPlayer = function () {
    if (typeof jQuery !== "undefined" && !Roblox.Thumbs.AssetImage.isInitialized) {
        Roblox.Thumbs.AssetImage.isInitialized = true;
        $(function () {
            $(document).on("click", "div.MediaPlayerIcon", function (e) {
                var assetButton = $(e.target);
                assetButton.mediaUrl = assetButton.attr("data-mediathumb-url");

                /// <summary>
                /// Determines if the asset button and the given asset button are the same asset.
                /// </summary>
                assetButton.hasSameMediaAs = function (other) {
                    return assetButton.mediaUrl === other.mediaUrl;
                };

                /// <summary>
                /// Plays or resumes the asset button's media and updates the button's visuals.
                /// </summary>
                assetButton.play = function () {
                    if (Roblox.Thumbs.AssetImage.currentlyPlayingAsset === null ||
                        !Roblox.Thumbs.AssetImage.currentlyPlayingAsset.hasSameMediaAs(assetButton)) {

                        // If another asset is playing then pause it first.
                        if (Roblox.Thumbs.AssetImage.currentlyPlayingAsset != null) {
                            Roblox.Thumbs.AssetImage.currentlyPlayingAsset.stop();
                        }

                        Roblox.Thumbs.AssetImage.mediaPlayer.jPlayer("setMedia", { mp3: assetButton.mediaUrl });
                        Roblox.Thumbs.AssetImage.currentlyPlayingAsset = assetButton;

                        Roblox.Thumbs.AssetImage.mediaPlayer.on($.jPlayer.event.ended, assetButton.onJPlayerEnded);
                        Roblox.Thumbs.AssetImage.mediaPlayer.on($.jPlayer.event.error, assetButton.onJPlayerError);
                    }

                    Roblox.Thumbs.AssetImage.mediaPlayer.jPlayer("play");
                    assetButton.removeClass("Play").addClass("Pause");
                };

                /// <summary>
                /// Stops the asset button's media and resets the button.
                /// </summary>
                assetButton.stop = function () {
                    if (Roblox.Thumbs.AssetImage.currentlyPlayingAsset.hasSameMediaAs(assetButton)) {

                        Roblox.Thumbs.AssetImage.currentlyPlayingAsset = null;
                        Roblox.Thumbs.AssetImage.mediaPlayer.jPlayer("clearMedia");
                        Roblox.Thumbs.AssetImage.mediaPlayer.off($.jPlayer.event.ended);
                        Roblox.Thumbs.AssetImage.mediaPlayer.off($.jPlayer.event.error);

                        assetButton.removeClass("Pause").addClass("Play");
                    }
                };

                /// <summary>
                /// Pauses the asset button's media and changes the button's visuals.
                /// </summary>
                assetButton.pause = function () {
                    if (Roblox.Thumbs.AssetImage.currentlyPlayingAsset.hasSameMediaAs(assetButton)) {
                        Roblox.Thumbs.AssetImage.mediaPlayer.jPlayer("pause");
                        assetButton.removeClass("Pause").addClass("Play");
                    }
                }

                /// <summary>
                /// Handles the jPlayer error event.
                /// </summary>
                assetButton.onJPlayerError = function () {
                    assetButton.stop();
                };

                /// <summary>
                /// Handles the jPlayer ended event.
                /// </summary>
                assetButton.onJPlayerEnded = function () {
                    assetButton.stop();
                };

                // If the media player isn't yet initialized then
                // initialize it and begin playing when it's ready.
                if (Roblox.Thumbs.AssetImage.mediaPlayer == null) {
                    Roblox.Thumbs.AssetImage.mediaPlayer = $("<div id='MediaPlayerSingleton'></div>").appendTo("body").jPlayer({
                        swfPath: '/js/jPlayer/2.9.2/jquery.jplayer.swf',
                        solution: "html, flash",
                        supplied: "mp3",
                        wmode: "transparent",
                        errorAlerts: false,
                        warningAlerts: false,
                        ready: function (event) {
                            assetButton.play();
                        }
                    });
                }

                else { // Otherwise, play or pause normally.
                    if (assetButton.hasClass("Pause")) {
                        assetButton.pause();
                    }
                    else {
                        assetButton.play();
                    }
                }
            });
        });
    }
}