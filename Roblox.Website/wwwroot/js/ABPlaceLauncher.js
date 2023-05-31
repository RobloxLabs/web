if (typeof Roblox === 'undefined') {
	Roblox = {};
}

var RobloxABLaunch = {
	launchGamePage: null,
	launcher: null
};

RobloxABLaunch.RequestGame = function (behaviorID, placeID, gender) {
	RobloxPlaceLauncherService.LogJoinClick();
	if (RobloxABLaunch.launcher === null) {
		RobloxABLaunch.launcher = new Roblox.ABPlaceLauncher();
	}

	RobloxABLaunch.launcher.RequestGame(placeID, gender);
};

RobloxABLaunch.RequestGroupBuildGame = function (behaviorID, placeID) {
	RobloxPlaceLauncherService.LogJoinClick();
	if (RobloxABLaunch.launcher === null) {
		RobloxABLaunch.launcher = new Roblox.ABPlaceLauncher();
	}
	RobloxABLaunch.launcher.RequestGroupBuildGame(placeID);
};

//Called from "Join" under "Load Running Games" on a Place Page.
RobloxABLaunch.RequestGameJob = function (behaviorID, placeId, gameId) {
	RobloxPlaceLauncherService.LogJoinClick();
	if (RobloxABLaunch.launcher === null) {
		RobloxABLaunch.launcher = new Roblox.ABPlaceLauncher();
	}
	RobloxABLaunch.launcher.RequestGameJob(placeId, gameId);
};

RobloxABLaunch.StartGame = function (visitUrl, type, authenticationUrl, authenticationTicket, isEdit) {
	//Fix for the HttpSendRequest,err=0x2F7E
	authenticationUrl = authenticationUrl.replace("http://", "https://");

	try {
		if (typeof window.external !== 'undefined' && window.external.IsRobloxABApp) {
			window.external.StartGame(authenticationTicket, authenticationUrl, visitUrl);
		}
		else {
			RobloxABLaunch.LogException("RobloxABLaunch used by non AB client.", "RobloxABLaunch.StartGame from non AB", "49", window.navigator.userAgent, 'JavascriptExceptions');
		}
	}
	catch (err) {
		RobloxABLaunch.LogException(err.message, "RobloxABLaunch.StartGame Error", err.name, window.navigator.userAgent, 'JavascriptExceptions');
		return false;
	}
	return true;
};

RobloxABLaunch.LogException = function (msg, url, line, ua, category) {
	var exDetails = { };
	exDetails.msg = msg;
	exDetails.url = url;
	exDetails.line = line;
	exDetails.ua = ua;
	exDetails.category = category;
	exDetails.shard = 'WebMetrics';
	exDetails.eventName = 'JavascriptExceptionLoggingEvent';
	RobloxEventManager.triggerEvent('JavascriptExceptionLoggingEvent', exDetails);
};

Roblox.ABPlaceLauncher = function () {
};

Roblox.ABPlaceLauncher.prototype =
{
	_onGameStatus: function (result) {
		if (result.status === 2) {
			RobloxABLaunch.StartGame(result.joinScriptUrl, "Join", result.authenticationUrl, result.authenticationTicket);
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
       }
	},
	_onGameError: function (result) {
		console.log("An error occurred. Please try again later -"+result);
	},
	_startUpdatePolling: function (joinGameDelegate) {
		try {
			joinGameDelegate();
		}
		catch (e) {
			joinGameDelegate();
		}
	},
	// TODO: This should only be called once.  What if you call it again???
	RequestGame: function (placeId, gender) {
		// Now send a request to the Grid...
		var onGameSuccess = function (result, context) { context._onGameStatus(result); };
		var onGameError = function (result, context) { context._onGameError(result); };
		var self = this;
		var isPartyLeader = false;

		if (typeof Party !== 'undefined' && typeof Party.AmILeader === 'function') {
			isPartyLeader = Party.AmILeader();
		}

		var gameDelegate = function () { RobloxPlaceLauncherService.RequestGame(placeId, isPartyLeader, gender, onGameSuccess, onGameError, self); };

		this._startUpdatePolling(gameDelegate);

		return false;
	},
	// TODO: This should only be called once.  What if you call it again???
	RequestGroupBuildGame: function (placeId) {
		// Now send a request to the Grid...
		var onGameSuccess = function (result, context) { context._onGameStatus(result, true); };
		var onGameError = function (result, context) { context._onGameError(result); };
		var self = this;
		var gameDelegate = function () { RobloxPlaceLauncherService.RequestGroupBuildGame(placeId, onGameSuccess, onGameError, self); };

		this._startUpdatePolling(gameDelegate);

		return false;
	},
	// TODO: This should only be called once.  What if you call it again???
	RequestGameJob: function (placeId, gameId) {
		// Now send a request to the Grid...
		var onGameSuccess = function (result, context) { context._onGameStatus(result); };
		var onGameError = function (result, context) { context._onGameError(result); };
		var self = this;
		var gameDelegate = function () { RobloxPlaceLauncherService.RequestGameJob(placeId, gameId, onGameSuccess, onGameError, self); };

		this._startUpdatePolling(gameDelegate);

		return false;
	},
	dispose: function () {
		Roblox.ABPlaceLauncher.callBaseMethod(this, 'dispose');
	}
};
