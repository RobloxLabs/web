; // KontagentEventListener.js
KontagentListener = new RBXBaseEventListener, KontagentListener.restUrl = "", KontagentListener.APIKey = "", KontagentListener.StagingAPIKey = "", KontagentListener.StagingEvents = [], KontagentListener.handleEvent = function(n, t) {
    function r(n) {
        return n = n.toLowerCase(), n == "win32" ? n = "Windows" : n == "osx" && (n = "Mac"), n
    }
    var u, f, i;
    u = "evt";
    switch (n.type) {
        case "rbx_evt_pageview":
            i = {
                guid: "s",
                path: "u",
                ts: "ts",
                user_ip: "ip"
            }, u = "pgr";
            break;
        case "rbx_evt_newuser":
            t.eventName = "New User", t.eventType = "New User", i = {
                guid: "s",
                eventType: "st1",
                eventName: "n"
            };
            break;
        case "rbx_evt_traffic_source":
            t.eventType = "Traffic Source", i = {
                guid: "s",
                eventType: "st1",
                source: "n"
            };
            break;
        case "rbx_evt_install_begin":
            t.eventName = "Download", t.eventType = "Download", i = {
                guid: "s",
                eventType: "st1",
                os: "st2",
                eventName: "n"
            };
            break;
        case "rbx_evt_initial_install_start":
            t.eventName = "Bootstrap Install Begin", t.eventType = "Bootstrap Install Begin", i = {
                guid: "s",
                eventType: "st1",
                os: "st2",
                eventName: "n"
            };
            break;
        case "rbx_evt_initial_install_success":
            t.eventName = "Bootstrap Install Success", t.eventType = "Bootstrap Install Success", t.os = r(t.os), i = {
                guid: "s",
                eventType: "st1",
                os: "st2",
                userType: "st3",
                eventName: "n"
            };
            break;
        case "rbx_evt_ftp":
            t.eventName = "First Time Play", t.eventType = "First Time Play", t.os = r(t.os), i = {
                guid: "s",
                eventType: "st1",
                os: "st2",
                userType: "st3",
                eventName: "n"
            };
            break;
        case "rbx_evt_fmp":
            t.eventName = "Five Minute Play", t.eventType = "Five Minute Play", t.os = r(t.os), i = {
                guid: "s",
                eventType: "st1",
                os: "st2",
                userType: "st3",
                eventName: "n"
            };
            break;
        case "rbx_evt_odr":
            t.eventName = "One Day Return", t.eventType = "One Day Return", i = {
                guid: "s",
                eventType: "st1",
                eventName: "n"
            };
            break;
        case "rbx_evt_sdr":
            t.eventName = "Seven Day Return", t.eventType = "Seven Day Return", i = {
                guid: "s",
                eventType: "st1",
                eventName: "n"
            };
            break;
        case "rbx_evt_signup":
            t.eventName = "Sign Up", t.eventType = "Sign Up", t.gender = t.gender, i = {
                guid: "s",
                eventType: "st1",
                gender: "st2",
                age: "st3",
                eventName: "n"
            };
            break;
        case "rbx_evt_abtest":
            t.eventType = "AB Enrollment", i = {
                guid: "s",
                eventType: "st1",
                experiment: "st2",
                variation: "n"
            };
            break;
        case "rbx_evt_generic":
            t.eventName = t.type, i = {
                guid: "s",
                type: "st1",
                eventName: "n"
            }, typeof t.opt1 != "undefined" && (i.opt1 = "st2"), typeof t.opt2 != "undefined" && typeof t.opt1 != "undefined" && (i.opt2 = "st3");
            break;
        case "rbx_evt_popup_action":
            t.eventType = "GuestPlayPopupAction", t.eventName = "GuestPlayPopupAction", i = {
                guid: "s",
                eventType: "st1",
                action: "st2",
                eventName: "n"
            };
            break;
        default:
            return console.log("KontagentListener - Event registered without handling instructions: " + n.type), !1
    }
    return f = this.distillData(t, i), this.fireEvent(this.eventToString(n.type, u, f)), !0
}, KontagentListener.distillData = function(n, t) {
    var r = {},
        i;
    for (i in t) typeof n[i] != typeof undefined && (r[t[i]] = encodeURIComponent(n[i]));
    return r
}, KontagentListener.eventToString = function(n, t, i) {
    var r = KontagentListener.restUrl,
        f = this.isStagingEvent(n, i) ? KontagentListener.StagingAPIKey : KontagentListener.APIKey,
        u;
    if (r += f + "/" + t + "/?", i != null)
        for (u in i) typeof u != typeof undefined && i.hasOwnProperty(u) && (r += u + "=" + i[u] + "&");
    return r = r.slice(0, r.length - 1)
}, KontagentListener.isStagingEvent = function(n, t) {
    var r = !1,
        u, i;
    try {
        for (u in this.StagingEvents)
            if (i = this.StagingEvents[u], typeof i == "string") {
                if (n == i) {
                    r = !0;
                    break
                }
            } else if (typeof i == "object" && typeof i[n] != "undefined" && i[n] == t.st1) {
            r = !0;
            break
        }
    } catch (f) {}
    return r
}, KontagentListener.fireEvent = function(n) {
    var t = $('<img width="1" height="1" src="' + n + '"/>')
}, KontagentListener.events = ["rbx_evt_generic", "rbx_evt_pageview", "rbx_evt_newuser", "rbx_evt_traffic_source", "rbx_evt_install_begin", "rbx_evt_initial_install_start", "rbx_evt_initial_install_success", "rbx_evt_ftp", "rbx_evt_fmp", "rbx_evt_odr", "rbx_evt_sdr", "rbx_evt_signup", "rbx_evt_abtest"];
