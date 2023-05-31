Roblox = Roblox || {};
Roblox.CookieConstraint = (function () {
	var cookieConstraintData = $("#cookie-constraint-container");
	var refresh = cookieConstraintData.data("refresh-rate") || 3600000;
	var returnUrl = cookieConstraintData.data("return-url") || "/";

	function tryReturn() {
		window.location.href = returnUrl;
	}

	function timer() {
		setInterval(tryReturn, refresh);
	}

	return {
		Timer: timer,
		tryReturn: tryReturn
	}
})();

Roblox.CookieConstraint.Timer();