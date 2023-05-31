//$.ajaxSetup({ cache: false });
var RBX = new Object();


var RobloxLaunchStates = {
    StartingServer: "StartingServer",
    StartingClient: "StartingClient",
    Upgrading: "Upgrading",
    None: "None"
};

var RobloxLaunch = {
    launchGamePage: '/install/download.aspx',
	launcher: null,
    googleAnalyticsCallback: function () {
        // Seemed safer to do than renaming all locations in code of RobloxLaunch._GoogleAnalyticsCallback
        // And why not make the place launcher even more confusing?
        if (RobloxLaunch._GoogleAnalyticsCallback) {
            RobloxLaunch._GoogleAnalyticsCallback();
        }
    },
    state: RobloxLaunchStates.None
};
var RobloxPlaceLauncherService = {
    LogJoinClick: function () {
        $.get("/Game/Placelauncher.ashx",
            { request: "LogJoinClick" }
        );
    },
    RequestGame: function (placeId, isPartyLeader, gender, onGameSuccess, onGameError, context) {
        gender = (gender !== null && gender !== undefined) ? gender : "";
        $.getJSON("/Game/PlaceLauncher.ashx",
            { request: "RequestGame", placeId: placeId, isPartyLeader: isPartyLeader, gender: gender },
            function (data) {
                if (data.Error) {
                    onGameError(data.Error, context);
                }
                else {
                    onGameSuccess(data, context);
                }
            }
        );
    },
    RequestPlayWithParty: function (placeId, partyGuid, gameId, onGameSuccess, onGameError, context) {
        $.getJSON("/Game/PlaceLauncher.ashx",
			{ request: "RequestPlayWithParty", placeId: placeId, partyGuid: partyGuid, gameId: gameId },
			function (data) {
			    if (data.Error) {
			        onGameError(data.Error, context);
			    }
			    else {
			        onGameSuccess(data, context);
			    }
			}
		);
    },
    RequestGroupBuildGame: function (placeId, onGameSuccess, onGameError, context) {
        $.getJSON("/Game/PlaceLauncher.ashx",
            { request: "RequestGroupBuildGame", placeId: placeId },
            function (data) {
                if (data.Error) {
                    onGameError(data.Error, context);
                }
                else {
                    onGameSuccess(data, context);
                }
            }
		);
    },
    RequestFollowUser: function (userId, onGameSuccess, onGameError, context) {
        $.getJSON("/Game/PlaceLauncher.ashx", {
            request: "RequestFollowUser", userId: userId
        },
            function (data) {
                if (data.Error) {
                    onGameError(data.Error, context);
                }
                else {
                    onGameSuccess(data, context);
                }
            }
		);
    },
    RequestGameJob: function (placeId, gameId, onGameSuccess, onGameError, context) {
        $.getJSON("/Game/PlaceLauncher.ashx",
            { request: "RequestGameJob", placeId: placeId, gameId: gameId },
            function (data) {
                if (data.Error) {
                    onGameError(data.Error, context);
                }
                else {
                    onGameSuccess(data, context);
                }
            }
		);
    },
    CheckGameJobStatus: function (jobId, onSuccess, onError, context) {
        $.getJSON("/Game/PlaceLauncher.ashx",
            { request: "CheckGameJobStatus", jobId: jobId },
            function (data) {
                if (data.Error) {
                    onError(data.Error, context);
                }
                else {
                    onSuccess(data, context);
                }
            }
		);
    },
    RequestPrivateGame: function (placeId, accessCode, gender, onGameSuccess, onGameError, context) {
        gender = (gender !== null && gender !== undefined) ? gender : "";
        $.getJSON("/Game/PlaceLauncher.ashx",
            { request: "RequestPrivateGame", placeId: placeId, accessCode: accessCode, gender: gender },
            function (data) {
                if (data.Error) {
                    onGameError(data.Error, context);
                }
                else {
                    onGameSuccess(data, context);
                }
            }
        );
    }
};

RobloxLaunch.RequestPlayWithParty = function (behaviorID, placeId, partyGuid, gameId) {
    EventTracker.start('Launch');
    RobloxPlaceLauncherService.LogJoinClick();
    RobloxLaunch.state = RobloxLaunchStates.None;
    if (checkRobloxInstall()) {
        if (RobloxLaunch.launcher === null) {
            RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
        }
        RobloxLaunch.launcher.RequestPlayWithParty(placeId, partyGuid, gameId);
    }
};

RobloxLaunch.RequestGame = function (behaviorID, placeID, gender) {
    EventTracker.start('Launch');
    RobloxPlaceLauncherService.LogJoinClick();
    RobloxLaunch.state = RobloxLaunchStates.None;
    if (checkRobloxInstall()) {
        if (RobloxLaunch.launcher === null) {
            RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
        }

        RobloxLaunch.launcher.RequestGame(placeID, gender);
    }
};

RobloxLaunch.RequestPrivateGame = function (behaviorID, placeID, accessCode, gender) {
    EventTracker.start('Launch');
    RobloxPlaceLauncherService.LogJoinClick();
    RobloxLaunch.state = RobloxLaunchStates.None;
    if (checkRobloxInstall()) {
        if (RobloxLaunch.launcher === null) {
            RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
        }

        RobloxLaunch.launcher.RequestPrivateGame(placeID, accessCode, gender);
    }
};

RobloxLaunch.RequestGroupBuildGame = function (behaviorID, placeID) {
    EventTracker.start('Launch');
	RobloxPlaceLauncherService.LogJoinClick();
	RobloxLaunch.state = RobloxLaunchStates.None;
	if (checkRobloxInstall()) {
		if (RobloxLaunch.launcher === null) {
			RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
		}
		RobloxLaunch.launcher.RequestGroupBuildGame(placeID);
	}
};

RobloxLaunch.RequestGameJob = function (behaviorID, placeId, gameId) {
    EventTracker.start('Launch');
	RobloxPlaceLauncherService.LogJoinClick();
	RobloxLaunch.state = RobloxLaunchStates.None;
	if (checkRobloxInstall()) {
		if (RobloxLaunch.launcher === null) {
			RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
		}
		RobloxLaunch.launcher.RequestGameJob(placeId, gameId);
	}
};

RobloxLaunch.RequestFollowUser = function (behaviorID, userId) {
    EventTracker.start('Launch');
	RobloxPlaceLauncherService.LogJoinClick();
	RobloxLaunch.state = RobloxLaunchStates.None;
	if (checkRobloxInstall()) {
		if (RobloxLaunch.launcher === null) {
			RobloxLaunch.launcher = new RBX.PlaceLauncher(behaviorID);
		}
		RobloxLaunch.launcher.RequestFollowUser(userId);
	}
};

RobloxLaunch.StartGame = function (visitUrl, type, authenticationUrl, authenticationTicket, isEdit) {
    var handler = function (newTicket) {
        RobloxLaunch.StartGameWork(visitUrl, type, authenticationUrl, newTicket, isEdit);
    };

    // todo: remove this javascript parameter, always fetch it
    if (authenticationTicket == "FETCH") {
        $.get("/Game/GetAuthTicket", handler);
    }
    else {
        handler(authenticationTicket);
    }
};

RobloxLaunch.StartGameWork = function (visitUrl, type, authenticationUrl, authenticationTicket, isEdit) {

    //Fix for the HttpSendRequest,err=0x2F7E
    authenticationUrl = authenticationUrl.replace("http://", "https://");

    if (visitUrl.indexOf("http") >= 0) {
        if (typeof RobloxLaunch.SeleniumTestMode === 'undefined') {
            visitUrl = visitUrl + "&testmode=false";
        } else {
            visitUrl = visitUrl + "&testmode=true";
        }
    }

    GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual("Visit/Try/" + type);
    RobloxLaunch.state = RobloxLaunchStates.StartingClient;

    // Fire off to Google Analytics
    if (RobloxLaunch.googleAnalyticsCallback !== null)
        RobloxLaunch.googleAnalyticsCallback();

    var prefix = null;
    try {
        if (typeof window.external !== 'undefined' && window.external.IsRoblox2App && (visitUrl.indexOf("visit") != -1 || isEdit)) {
            //QT studio 2.0 - Call Window.External.StartGame for Build and Edit.
            window.external.StartGame(authenticationTicket, authenticationUrl, visitUrl);
        } else {
            prefix = "RobloxProxy/";
            var launcher = Roblox.Client.CreateLauncher(true);

            if (!launcher) {
                // Check to see if we're in Roblox Player (Property only defined in Roblox Player)
                try {
                    parent.playFromUrl(visitUrl);
                    return;
                    // window.external.IsFullscreen;

                }
                catch (ex) {

                }

                if (Roblox.Client.isRobloxBrowser()) {
                    try {
                        // Must be in the roblox app
                        window.external.StartGame(authenticationTicket, authenticationUrl, visitUrl);
                    }

                    catch (ex) {
                        throw "window.external fallback failed, Roblox must not be installed or IE cannot access ActiveX";
                    }
                }

                else {
                    throw "launcher is null or undefined and external is missing";
                }
                //console.log("modal closed because we are in roblox player/ide");
                RobloxLaunch.state = RobloxLaunchStates.None;
                $.modal.close();
            }
            else {
                //launcher is non-null
                prefix = "RobloxProxy/StartGame/";
                try {
                    try {
                        if (Roblox.Client.IsIE() || Roblox.Client._legacyLaunch == false) { // IE
                            launcher.AuthenticationTicket = authenticationTicket;
                        } else {
                            launcher.Put_AuthenticationTicket(authenticationTicket);
                        }
                        if (isEdit) {
                            launcher.SetEditMode();
                        }
                    } catch (err) {
                        // This is an older version of the Launcher. Ignore the error
                    }
                    try {
                        if (Roblox.Client._silentModeEnabled) {
                            launcher.SetSilentModeEnabled(true); // true
                            if (Roblox.VideoPreRoll.videoInitialized && Roblox.VideoPreRoll.isPlaying()) {
                                Roblox.Client.SetStartInHiddenMode(true); // if possible... - true                                
                            }
                            //console.log("videoInitialized: " + Roblox.VideoPreRoll.videoInitialized + ", videoCompleted: " + Roblox.VideoPreRoll.videoCompleted);
                            launcher.StartGame(authenticationUrl, visitUrl);
                            RobloxLaunch.CheckGameStarted(launcher);

                        } else {
                            throw "silent mode is disabled, fall back";
                        }
                    } catch (err) {
                        // Silent bootstrapper not supported, fall back
                        launcher.StartGame(authenticationUrl, visitUrl);
                        if (Roblox.Client._bringAppToFrontEnabled) {
                            try {
                                launcher.BringAppToFront();
                            } catch (e) {
                            }
                        }
                        Roblox.Client.ReleaseLauncher(launcher, true, false);
                        //console.log("modal closed because there was an error with launcher");
                        $.modal.close();
                    }
                } catch (err) {
                    Roblox.Client.ReleaseLauncher(launcher, true, false);
                    throw err;
                }
                //Roblox.Client.ReleaseLauncher(launcher, true, false);
            }
        }
    }
    catch (err) {
        var message = err.message;

        if (message === "User cancelled") {
            GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual("Visit/UserCancelled/" + type);
            return false;
        }
        try {
            var y = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (err3) {
            message = "FailedXMLHTTP/" + message;
        }

        if (!Roblox.Client.isRobloxBrowser()) {
            GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual("Visit/Redirect/" + prefix + encodeURIComponent(message));
            window.location = RobloxLaunch.launchGamePage;
        }
        else {
            GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual("Visit/Fail/" + prefix + encodeURIComponent(message));
        }

        return false;
    }
    GoogleAnalyticsEvents && GoogleAnalyticsEvents.ViewVirtual("Visit/Success/" + type);
    return true;
};

   RobloxLaunch.StartApp = function (startScriptUrl, authenticationUrl) {
   		var handler = function (newTicket) {
   			RobloxLaunch.StartAppWork(startScriptUrl, authenticationUrl, newTicket);
   		};
   		$.get("/Game/GetAuthTicket", handler);
   };

   RobloxLaunch.StartAppWork = function (startScriptUrl, authenticationUrl, authenticationTicket) {

       RobloxLaunch.state = RobloxLaunchStates.StartingClient;
       var prefix = null;
       try {
           if (typeof window.external !== 'undefined' && window.external.IsRoblox2App) {
               //QT studio 2.0 - Call Window.External.StartGame for Build and Edit.
               window.external.StartGame(authenticationTicket, authenticationUrl, startScriptUrl);
           } else {
               prefix = "RobloxProxy/";
               var launcher = Roblox.Client.CreateLauncher(true);

               if (!launcher) {
                   // Check to see if we're in Roblox Player (Property only defined in Roblox Player)
                   try {
                       parent.playFromUrl(startScriptUrl);
                       return;
                       // window.external.IsFullscreen;
                   }
                   catch (ex) {

                   }

                   if (Roblox.Client.isRobloxBrowser()) {
                       try {
                           // Must be in the roblox app
                           window.external.StartGame(authenticationTicket, authenticationUrl, startScriptUrl);
                       }
                       catch (ex) {
                           throw "window.external fallback failed, Roblox must not be installed or IE cannot access ActiveX";
                       }
                   }
                   else {
                       throw "launcher is null or undefined and external is missing";
                   }
                   RobloxLaunch.state = RobloxLaunchStates.None;
                   $.modal.close();
               }
               else {
                   //launcher is non-null
                   prefix = "RobloxProxy/StartGame/";
                   try {
                       try {
                           launcher.SetAppMode();
                       } catch (err) {}
                       
                       try {
                           if (Roblox.Client.IsIE()) { // IE
                               launcher.AuthenticationTicket = authenticationTicket;
                           } else {
                               launcher.Put_AuthenticationTicket(authenticationTicket);
                           }
                       } catch (err) {
                           // This is an older version of the Launcher. Ignore the error
                       }
                       try {
                           if (Roblox.Client._silentModeEnabled) {
                               launcher.SetSilentModeEnabled(true);
                               if (Roblox.VideoPreRoll.videoInitialized && Roblox.VideoPreRoll.isPlaying()) {
                                   Roblox.Client.SetStartInHiddenMode(true); // if possible...
                               }
                               //console.log("videoInitialized: " + Roblox.VideoPreRoll.videoInitialized + ", videoCompleted: " + Roblox.VideoPreRoll.videoCompleted);
                               launcher.StartGame(authenticationUrl, startScriptUrl);
                               RobloxLaunch.CheckGameStarted(launcher);
                           } else {
                               throw "silent mode is disabled, fall back";
                           }
                       } catch (err) {
                           // Silent bootstrapper not supported, fall back
                           launcher.StartGame(authenticationUrl, startScriptUrl);
                           if (Roblox.Client._bringAppToFrontEnabled) {
                               try {
                                   launcher.BringAppToFront();
                               } catch (e) {
                               }
                           }
                           Roblox.Client.ReleaseLauncher(launcher, true, false);
                           //console.log("modal closed because there was an error with launcher");
                           $.modal.close();
                       }
                   } catch (err) {
                       Roblox.Client.ReleaseLauncher(launcher, true, false);
                       throw err;
                   }
                   //Roblox.Client.ReleaseLauncher(launcher, true, false);
               }
           }
       }
       catch (err) {
           var message = err.message;

           if ((message === "User cancelled")) {
               return false;
           }
           try {
               new ActiveXObject("Microsoft.XMLHTTP");
           }
           catch (err3) {
               message = "FailedXMLHTTP/" + message;
           }
           if (!Roblox.Client.isRobloxBrowser()) {
               window.location = RobloxLaunch.launchGamePage;
           }
           return false;
       }
       return true;
   };

   RobloxLaunch.CheckGameStarted = function (launcher) {
       var finalEventsSent = false;

       var rbxLauncher = RobloxLaunch.launcher;
       if (rbxLauncher === null) {
           rbxLauncher = new RBX.PlaceLauncher("PlaceLauncherStatusPanel");  // this should probably not be hard-coded
           rbxLauncher._showDialog();
           rbxLauncher._updateStatus(0);  // maybe not the best function reuse, but it will do
       }

       var started = false;

       function doCheck() {
           try {
               // note, IsGameStarted/Get_GameStarted only returns true for the first run after a game starts
               // so once it returns true, don't check anymore.
               if (!started) {
                   if (Roblox.Client.IsIE() || !Roblox.Client._legacyLaunch) {
                       started = launcher.IsGameStarted;
                   } else {
                       started = launcher.Get_GameStarted();
                   }
               }

               if (started && !finalEventsSent) {
                   EventTracker.endSuccess('StartClient');
                   EventTracker.endSuccess('Launch');
                   finalEventsSent = true;
               }

               // If started and either there is no video preroll or the video is complete 
               if (started && !Roblox.VideoPreRoll.isPlaying()) {

                   //console.log("Closing modal. " + Roblox.VideoPreRoll.videoInitialized ? "videoInitialized" : "" + " " + Roblox.VideoPreRoll.videoCompleted ? "videoCompleted" : "");

                   MadStatus.stop("Connecting to Players...");
                   RobloxLaunch.state = RobloxLaunchStates.None;
                   $.modal.close();
                   rbxLauncher._cancelled = true;   // cancel outstanding game requests
                   if (Roblox.Client._hiddenModeEnabled) {
                       Roblox.Client.UnhideApp();
                   }
                   if (Roblox.Client._bringAppToFrontEnabled) {
                       try {
                           launcher.BringAppToFront();
                       }
                       catch (e) { }
                   }
                   Roblox.Client.ReleaseLauncher(launcher, true, false);
               } else {
                   if (!rbxLauncher._cancelled) {
                       setTimeout(doCheck, 1000);
                   }
               }
           }
           catch (ex) {
               if (!rbxLauncher._cancelled) {
                   setTimeout(doCheck, 1000);
               }
           }
       }
       doCheck();
   };

   RobloxLaunch.CheckRobloxInstall = function (installPath) {
       if (!Roblox.Client.IsRobloxInstalled()) {
           // client not installed, send to install path
           window.location = installPath;
       }
       else {
           // client installed, check if it is up to date
           Roblox.Client.Update();
           return true;
       }
   };

RBX.PlaceLauncher = function (modalDialogueID) {
    this._cancelled = false;
    this._popupID = modalDialogueID;
    this._popup = $('#' + modalDialogueID);
};

RBX.PlaceLauncher.prototype =
{
    _showDialog: function () {
        this._cancelled = false;
        _popupOptions = {
            escClose: true,
            opacity: 80,
            overlayCss: { backgroundColor: "#000" }
        };
        if (this._popupID == "PlaceLauncherStatusPanel") {
            if (Roblox.VideoPreRoll && Roblox.VideoPreRoll.showVideoPreRoll && !Roblox.VideoPreRoll.isExcluded()) {
                this._popup = $("#videoPrerollPanel");
                _popupOptions.onShow = function (dialog) {
                    Roblox.VideoPreRoll.correctIEModalPosition(dialog);
                    Roblox.VideoPreRoll.start();
                };
                _popupOptions.onClose = function (dialog) { Roblox.VideoPreRoll.close(); };
                _popupOptions.closeHTML = '<a href="#" class="ImageButton closeBtnCircle_35h ABCloseCircle VprCloseButton"></a>';
            }
            else {
                this._popup = $("#" + this._popupID);
                // we want to log cases where VPR should have shown but didn't 
                _popupOptions.onClose = function (dialog) { Roblox.VideoPreRoll.logVideoPreRoll(); $.modal.close(); };
            }
        }
        // http://www.ericmmartin.com/projects/simplemodal/
        var self = this;
        setTimeout(function () {
            self._popup.modal(_popupOptions);
        }, 0);

        // bind our cancel button
        var RBXPlaceLauncher = this;
        $('.CancelPlaceLauncherButton').click(function () { RBXPlaceLauncher.CancelLaunch(); });
        $('.CancelPlaceLauncherButton').show();
    },




    _onGameStatus: function (result) {
        if (this._cancelled) {
            EventTracker.endCancel('GetConnection');
            EventTracker.endCancel('Launch');
            return;
        }

        this._updateStatus(result.status);

        if (result.status === 2) {
            EventTracker.endSuccess('GetConnection');
            EventTracker.start('StartClient');
            RobloxLaunch.StartGame(result.joinScriptUrl, "Join", result.authenticationUrl, result.authenticationTicket);
        }
        else if (result.status < 2 || result.status === 6) {
            // Try again
            var onSuccess = function (result, context) { context._onGameStatus(result); };
            var onError = function (result, context) { context._onGameError(result); };
            var self = this;
            var call = function () {
                RobloxPlaceLauncherService.CheckGameJobStatus(result.jobId, onSuccess, onError, self);
            };
            window.setTimeout(call, 2000);
        } else if (result.status === 4) { //error 
            EventTracker.endFailure('GetConnection');
            EventTracker.endFailure('Launch');
        }
    },
    _updateStatus: function (status) {
        // Madlib status
        if (!MadStatus.running) {
            MadStatus.init($(this._popup).find('.MadStatusField'), $(this._popup).find('.MadStatusBackBuffer'), 2000, 800);
            MadStatus.start();
        }
        switch (status) {
            case 0:
                break;
            case 1:
                MadStatus.manualUpdate("A server is loading the game...", true);
                break;
            case 2:
                MadStatus.manualUpdate("The server is ready. Joining the game...", true, false);
                break;
            case 3:
                MadStatus.manualUpdate("Joining games is temporarily disabled while we upgrade. Please try again soon.", false);
                break;
            case 4:
                MadStatus.manualUpdate("An error occurred. Please try again later.", false);
                break;
            case 5:
                MadStatus.manualUpdate("The game you requested has ended.", false);
                break;
            case 6:
                MadStatus.manualUpdate("The game you requested is currently full. Waiting for an opening...", true, true);
                break;
            case 7:
                MadStatus.manualUpdate("Roblox is updating. Please wait...", true);
                break;
            case 8:
                MadStatus.manualUpdate("Requesting a server", true);
                break;
            default:
                MadStatus.stop("Connecting to Players...");
        }

        $(this._popup).find('.MadStatusStarting').css("display", 'none');
        $(this._popup).find('.MadStatusSpinner').css("visibility", ((status === 3 || status === 4 || status === 5) ? 'hidden' : 'visible'));
    },
    _onGameError: function (result) {
        this._updateStatus(4);
    },
    _startUpdatePolling: function (joinGameDelegate) {
        try {
            RobloxLaunch.state = RobloxLaunchStates.Upgrading;
            var launcher = Roblox.Client.CreateLauncher(true);

            if (Roblox.Client.IsIE())
                var result = launcher.IsUpToDate;
            else
                result = launcher.Get_IsUpToDate();

            if (result || result === undefined) {
                try {
                    launcher.PreStartGame();
                }
                catch (e)
                { }

                Roblox.Client.ReleaseLauncher(launcher, true, false);
                RobloxLaunch.state = RobloxLaunchStates.StartingServer;
                EventTracker.endSuccess('UpdateClient');
                joinGameDelegate();
                return;
            }

            //Now we need to poll until it is finished
            var onSuccess = function (result, launcher, context) { context._onUpdateStatus(result, launcher, joinGameDelegate); };
            var onError = function (result, context) { context._onUpdateError(result); };
            var self = this;

            this.CheckUpdateStatus(onSuccess, onError, launcher, joinGameDelegate, self);
        }
        catch (e) {
            //alert("Missing IsUpToDate, falling back");
            Roblox.Client.ReleaseLauncher(launcher, true, false);
            //Something went wrong, fall back to the old method of Update + Join in parallel
            EventTracker.endSuccess('UpdateClient');
            joinGameDelegate();
        }
    },
    _onUpdateStatus: function (result, launcher, joinGameDelegate) {
        if (this._cancelled)
            return;

        this._updateStatus(result);

        if (result === 8) {
            Roblox.Client.ReleaseLauncher(launcher, true, true);
            Roblox.Client.Refresh();
            RobloxLaunch.state = RobloxLaunchStates.StartingServer;
            EventTracker.endSuccess('UpdateClient');
            joinGameDelegate();
        }
        else if (result === 7) {
            // Try again
            var onSuccess = function (result, launcher, context) { context._onUpdateStatus(result, launcher, joinGameDelegate); };
            var onError = function (result, context) { context._onUpdateError(result); };
            var self = this;
            var call = function () { self.CheckUpdateStatus(onSuccess, onError, launcher, joinGameDelegate, self); };
            window.setTimeout(call, 2000);
        }
        else {
            alert("Unknown status from CheckUpdateStatus");
        }
    },
    _onUpdateError: function (result) {
        this._updateStatus(2);
    },

    CheckUpdateStatus: function (onSuccess, onError, launcher, joinGameDelegate, self) {
        try {
            launcher.PreStartGame();

            if (Roblox.Client.IsIE())
                var result = launcher.IsUpToDate;
            else
                result = launcher.Get_IsUpToDate();

            if (result || result === undefined) {
                onSuccess(8, launcher, self);
            }
            else {
                onSuccess(7, launcher, self);
            }
        }
        catch (e) {
            //We have the old DLL loaded, so just pretend it was succesful like in the olden days
            onSuccess(8, launcher, self);
        }
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestGame: function (placeId, gender) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result); };
        var onGameError = function (result, context) { context._onGameError(result); };
        var self = this;
        var isPartyLeader = false;

        if (typeof Party !== 'undefined' && typeof Party.AmILeader === 'function') {
            isPartyLeader = Party.AmILeader();
        }

        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestGame(placeId, isPartyLeader, gender, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestPrivateGame: function (placeId, accessCode, gender) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result); };
        var onGameError = function (result, context) { context._onGameError(result); };
        var self = this;
        
        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestPrivateGame(placeId, accessCode, gender, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestPlayWithParty: function (placeId, partyGuid, gameId) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result); };
        var onGameError = function (result, context) { context._onGameError(result); };
        var self = this;

        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestPlayWithParty(placeId, partyGuid, gameId, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestGroupBuildGame: function (placeId) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result, true); };
        var onGameError = function (result, context) { context._onGameError(result); };
        var self = this;
        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestGroupBuildGame(placeId, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestFollowUser: function (userId) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result); };
        var onGameError = function (result, context) { context._onError(result); };
        var self = this;
        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestFollowUser(userId, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    // TODO: This should only be called once.  What if you call it again???
    RequestGameJob: function (placeId, gameId) {
        this._showDialog();

        // Now send a request to the Grid...
        var onGameSuccess = function (result, context) { context._onGameStatus(result); };
        var onGameError = function (result, context) { context._onGameError(result); };
        var self = this;
        var gameDelegate = function () { EventTracker.start('GetConnection'); RobloxPlaceLauncherService.RequestGameJob(placeId, gameId, onGameSuccess, onGameError, self); };

        this._startUpdatePolling(gameDelegate);

        return false;
    },
    CancelLaunch: function () {
        this._cancelled = true;
        $.modal.close();
        //console.log("modal closed because launch was cancelled");
        return false;
    },

    dispose: function () {
        RBX.PlaceLauncher.callBaseMethod(this, 'dispose');
    }
};
