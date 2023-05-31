; // bundle: clientinstaller___ba4eec0c4d283ec86ac515f6795cff2f_m
; // files: ClientInstaller.js, InstallationInstructions.js, IEMetroInstructions.js

; // ClientInstaller.js
function tryToDownload() {
    oIFrm = document.getElementById("downloadInstallerIFrame"), oIFrm.src = "/install/setup.ashx"
}

function logStatistics(n) {
    $.get("/install/VisitButtonHandler.ashx?reqtype=" + n, function() {})
}
Type.registerNamespace("Roblox.Client"), Roblox.Client._installHost = null, Roblox.Client._installSuccess = null, Roblox.Client._CLSID = null, Roblox.Client._continuation = null, Roblox.Client._skip = null, Roblox.Client._isIDE = null, Roblox.Client._isRobloxBrowser = null, Roblox.Client._isPlaceLaunch = !1, Roblox.Client._silentModeEnabled = !1, Roblox.Client._bringAppToFrontEnabled = !1, Roblox.Client._numLocks = 0, Roblox.Client._logTiming = !1, Roblox.Client._logStartTime = null, Roblox.Client._logEndTime = null, Roblox.Client._hiddenModeEnabled = !1, Roblox.Client._runInstallABTest = function() {}, Roblox.Client.ReleaseLauncher = function(n, t, i) {
    if (t && Roblox.Client._numLocks--, (i || Roblox.Client._numLocks <= 0) && (n != null && (document.getElementById("pluginObjDiv").innerHTML = "", n = null), Roblox.Client._numLocks = 0), Roblox.Client._logTiming) {
        Roblox.Client._logEndTime = new Date;
        var r = Roblox.Client._logEndTime.getTime() - Roblox.Client._logStartTime.getTime();
        console && console.log && console.log("Roblox.Client: " + r + "ms from Create to Release.")
    }
}, Roblox.Client.GetInstallHost = function(n) {
    if (window.ActiveXObject) return n.InstallHost;
    var t = n.Get_InstallHost();
    return t.match(/sitetest1.roblonium.com$/) ? t : t.substring(0, t.length - 1)
}, Roblox.Client.CreateLauncher = function(n) {
    var i, u, t, r;
    Roblox.Client._logTiming && (Roblox.Client._logStartTime = new Date), n && Roblox.Client._numLocks++, (Roblox.Client._installHost == null || Roblox.Client._CLSID == null) && typeof initClientProps == "function" && initClientProps(), i = document.getElementById("robloxpluginobj"), u = $("#pluginObjDiv"), i || (Roblox.Client._hiddenModeEnabled = !1, window.ActiveXObject ? (t = '<object classid="clsid:' + Roblox.Client._CLSID + '"', t += ' id="robloxpluginobj" type="application/x-vnd-roblox-launcher"', t += ' codebase="' + Roblox.Client._installHost + '">Failed to INIT Plugin</object>', $(u).append(t)) : (t = '<object id="robloxpluginobj" type="application/x-vnd-roblox-launcher">', t += "<p>" + Roblox.Client.Resources.youNeedTheLatest, t += '<a href="' + Roblox.Client._installHost + '">' + Roblox.Client.Resources.here + "</a>.</p></object>", $(u).append(t)), i = document.getElementById("robloxpluginobj"));
    try {
        if (i || (typeof console.log == "undefined" ? alert(Roblox.Client.Resources.plugInInstallationFailed) : console.log("Plugin installation failed!")), i.Hello(), r = Roblox.Client.GetInstallHost(i), !r || r != Roblox.Client._installHost) throw "wrong InstallHost: (plugins):  " + r + "  (servers):  " + Roblox.Client._installHost;
        return i
    } catch (f) {
        return Roblox.Client.ReleaseLauncher(i, n, !1), null
    }
}, Roblox.Client.isIDE = function() {
    if (Roblox.Client._isIDE == null && (Roblox.Client._isIDE = !1, Roblox.Client._isRobloxBrowser = !1, window.external)) try {
        window.external.IsRobloxAppIDE !== undefined && (Roblox.Client._isIDE = window.external.IsRobloxAppIDE, Roblox.Client._isRobloxBrowser = !0)
    } catch (n) {}
    return Roblox.Client._isIDE
}, Roblox.Client.isRobloxBrowser = function() {
    return Roblox.Client.isIDE(), Roblox.Client._isRobloxBrowser
}, Roblox.Client.robloxBrowserInstallHost = function() {
    if (window.external) try {
        return window.external.InstallHost
    } catch (n) {}
    return ""
}, Roblox.Client.IsRobloxProxyInstalled = function() {
    var t = Roblox.Client.CreateLauncher(!1),
        n = !1;
    return (t != null && (n = !0), Roblox.Client.ReleaseLauncher(t, !1, !1), n || Roblox.Client.isRobloxBrowser()) ? !0 : !1
}, Roblox.Client.IsRobloxInstalled = function() {
    try {
        var t = Roblox.Client.CreateLauncher(!1),
            n = Roblox.Client.GetInstallHost(t);
        return Roblox.Client.ReleaseLauncher(t, !1, !1), n == Roblox.Client._installHost
    } catch (i) {
        return Roblox.Client.isRobloxBrowser() ? (n = Roblox.Client.robloxBrowserInstallHost(), n == Roblox.Client._installHost) : !1
    }
}, Roblox.Client.SetStartInHiddenMode = function(n) {
    try {
        var t = Roblox.Client.CreateLauncher(!1);
        if (t !== null) return t.SetStartInHiddenMode(n), Roblox.Client._hiddenModeEnabled = n, !0
    } catch (i) {}
    return !1
}, Roblox.Client.UnhideApp = function() {
    try {
        if (Roblox.Client._hiddenModeEnabled) {
            var n = Roblox.Client.CreateLauncher(!1);
            n.UnhideApp()
        }
    } catch (t) {}
}, Roblox.Client.Update = function() {
    try {
        var n = Roblox.Client.CreateLauncher(!1);
        n.Update(), Roblox.Client.ReleaseLauncher(n, !1, !1)
    } catch (t) {
        alert(Roblox.Client.Resources.errorUpdating + ": " + t)
    }
}, Roblox.Client.WaitForRoblox = function(n) {
	console && console.log && console.log("Roblox.Client: WaitForRoblox");
    if (Roblox.Client._skip) return window.location = Roblox.Client._skip, !1;
	console && console.log && console.log("Roblox.Client._continuation: " + Roblox.Client._continuation);
	console && console.log && console.log("Roblox.Client._cancelled: " + Roblox.Client._cancelled);
	console && console.log && console.log("Roblox.Client.IsRobloxProxyInstalled(): " + Roblox.Client.IsRobloxProxyInstalled());
	console && console.log && console.log("Roblox.Client.ImplementsProxy: " + Roblox.Client.ImplementsProxy);
    if (Roblox.Client._continuation = null, Roblox.Client._cancelled = !1, !Roblox.Client.IsRobloxProxyInstalled() && !Roblox.Client.ImplementsProxy) {
		console && console.log && console.log("Roblox.Client: _continuation");
        Roblox.InstallationInstructions.show(), Roblox.Client._runInstallABTest();
        var t = "Windows";
        return navigator.appVersion.indexOf("Mac") != -1 && (t = "Mac"), typeof _gaq != typeof undefined && (_gaq.push(["_trackEvent", "Install Begin", t]), _gaq.push(["b._trackEvent", "Install Begin", t])), RobloxEventManager.triggerEvent("rbx_evt_install_begin", {
            os: t
        }), window.chrome && (window.location.hash = "#chromeInstall", $.cookie("chromeInstall", n.toString().replace(/play_placeId/, play_placeId.toString()))), window.setTimeout(function() {
            Roblox.Client._ontimer()
        }, 1e3), tryToDownload(), !0
    }
    return Roblox.Client._continuation(), !1
}, Roblox.Client.ResumeTimer = function(n) {
    Roblox.Client._continuation = n, Roblox.Client._cancelled = !1, window.setTimeout(function() {
        Roblox.Client._ontimer()
    }, 0)
}, Roblox.Client.Refresh = function() {
    try {
        navigator.plugins.refresh(!1)
    } catch (n) {}
}, Roblox.Client._onCancel = function() {
    return Roblox.InstallationInstructions.hide(), Roblox.Client._cancelled = !0, !1
}, Roblox.Client._ontimer = function() {
    Roblox.Client._cancelled || (Roblox.Client.Refresh(), Roblox.Client.IsRobloxProxyInstalled() ? (Roblox.InstallationInstructions.hide(), window.setTimeout(function() {
        window.chrome && window.location.hash == "#chromeInstall" && (window.location.hash = "", $.cookie("chromeInstall", null))
    }, 5e3), Roblox.Client._continuation(), Roblox.Client._installSuccess && Roblox.Client._installSuccess()) : window.setTimeout(function() {
        Roblox.Client._ontimer()
    }, 1e3))
};

; // InstallationInstructions.js
typeof Roblox == "undefined" && (Roblox = {}), Roblox.InstallationInstructions = function() {
    function i() {
        var t, i, r;
        n(), t = 0, i = $(".InstallInstructionsImage"), i && typeof $(i).attr("modalwidth") != "undefined" && (t = $(".InstallInstructionsImage").attr("modalwidth")), t > 0 ? (r = ($(window).width() - (t - 10)) / 2, $("#InstallationInstructions").modal({
            escClose: !0,
            opacity: 50,
            minWidth: t,
            maxWidth: t,
            overlayCss: {
                backgroundColor: "#000"
            },
            position: [20, r]
        })) : $("#InstallationInstructions").modal({
            escClose: !0,
            opacity: 50,
            maxWidth: $(window).width() / 2,
            minWidth: $(window).width() / 2,
            overlayCss: {
                backgroundColor: "#000"
            },
            position: [20, "25%"]
        })
    }

    function r() {
        $.modal.close()
    }

    function n() {
        var n = $(".InstallInstructionsImage");
        navigator.userAgent.match(/Mac OS X 10[_|\.]5/) ? n && typeof $(n).attr("oldmacdelaysrc") != "undefined" && $(".InstallInstructionsImage").attr("src", $(".InstallInstructionsImage").attr("oldmacdelaysrc")) : n && typeof $(n).attr("delaysrc") != "undefined" && $(".InstallInstructionsImage").attr("src", $(".InstallInstructionsImage").attr("delaysrc"))
    }
    return {
        show: i,
        hide: r
    }
}();

; // IEMetroInstructions.js
(function() {
    function u() {
        return navigator.userAgent.indexOf("MSIE 10.0") != -1
    }

    function r() {
        try {
            return !!new ActiveXObject("htmlfile")
        } catch (n) {
            return !1
        }
    }
    var i = Roblox.Client.WaitForRoblox;
    Roblox.Client.WaitForRoblox = function(n) {
        return u() && !r() ? ($("#IEMetroInstructions").modal({
            overlayClose: !0,
            escClose: !0,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            }
        }), !1) : i(n)
    }
})(window);