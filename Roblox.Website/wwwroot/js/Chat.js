;// bundle: chat___365f08d5200ee3afa25525767a5e1cff_m
;// files: jquery.cookies.2.2.0.1.js, blockUI.js, chat_v1.js, jquery-extensions.js, jPlayer/1.2.0/jquery.jplayer.min.js, party.js

;// jquery.cookies.2.2.0.1.js
var jaaulde=window.jaaulde||{};jaaulde.utils=jaaulde.utils||{},jaaulde.utils.cookies=function(){var i,u,r,n,t={expiresAt:null,path:"/",domain:null,secure:!1};return i=function(n){var i,r;return typeof n!="object"||n===null?i=t:(i={expiresAt:t.expiresAt,path:t.path,domain:t.domain,secure:t.secure},typeof n.expiresAt=="object"&&n.expiresAt instanceof Date?i.expiresAt=n.expiresAt:typeof n.hoursToLive=="number"&&n.hoursToLive!==0&&(r=new Date,r.setTime(r.getTime()+n.hoursToLive*36e5),i.expiresAt=r),typeof n.path=="string"&&n.path!==""&&(i.path=n.path),typeof n.domain=="string"&&n.domain!==""&&(i.domain=n.domain),n.secure===!0&&(i.secure=n.secure)),i},u=function(n){return n=i(n),(typeof n.expiresAt=="object"&&n.expiresAt instanceof Date?"; expires="+n.expiresAt.toGMTString():"")+"; path="+n.path+(typeof n.domain=="string"?"; domain="+n.domain:"")+(n.secure===!0?"; secure":"")},r=function(){for(var e={},i,f,n,r=document.cookie.split(";"),u,t=0;t<r.length;t=t+1){i=r[t].split("="),f=i[0].replace(/^\s*/,"").replace(/\s*$/,"");try{n=decodeURIComponent(i[1])}catch(s){n=i[1]}if(typeof JSON=="object"&&JSON!==null&&typeof JSON.parse=="function")try{u=n,n=JSON.parse(n)}catch(o){n=u}e[f]=n}return e},n=function(){},n.prototype.get=function(n){var t,u,i=r();if(typeof n=="string")t=typeof i[n]!="undefined"?i[n]:null;else if(typeof n=="object"&&n!==null){t={};for(u in n)t[n[u]]=typeof i[n[u]]!="undefined"?i[n[u]]:null}else t=i;return t},n.prototype.filter=function(n){var t,u={},i=r();typeof n=="string"&&(n=new RegExp(n));for(t in i)t.match(n)&&(u[t]=i[t]);return u},n.prototype.set=function(n,t,i){if((typeof i!="object"||i===null)&&(i={}),typeof t=="undefined"||t===null)t="",i.hoursToLive=-8760;else if(typeof t!="string")if(typeof JSON=="object"&&JSON!==null&&typeof JSON.stringify=="function")t=JSON.stringify(t);else throw new Error("cookies.set() received non-string value and could not serialize.");var r=u(i);document.cookie=n+"="+encodeURIComponent(t)+r},n.prototype.del=function(n,t){var r={},i;(typeof t!="object"||t===null)&&(t={}),typeof n=="boolean"&&n===!0?r=this.get():typeof n=="string"&&(r[n]=!0);for(i in r)typeof i=="string"&&i!==""&&this.set(i,null,t)},n.prototype.test=function(){var i=!1,n="cT",t="data";return this.set(n,t),this.get(n)===t&&(this.del(n),i=!0),i},n.prototype.setOptions=function(n){typeof n!="object"&&(n=null),t=i(n)},new n}(),function(){window.jQuery&&function(n){n.cookies=jaaulde.utils.cookies;var t={cookify:function(t){return this.each(function(){var f,e=["name","id"],u,i=n(this),r;for(f in e)if(!isNaN(f)&&(u=i.attr(e[f]),typeof u=="string"&&u!=="")){i.is(":checkbox, :radio")?i.attr("checked")&&(r=i.val()):r=i.is(":input")?i.val():i.html(),(typeof r!="string"||r==="")&&(r=null),n.cookies.set(u,r,t);break}})},cookieFill:function(){return this.each(function(){for(var u,e=["name","id"],r,t=n(this),i,f=function(){return u=e.pop(),!!u};f();)if(r=t.attr(u),typeof r=="string"&&r!==""){i=n.cookies.get(r),i!==null&&(t.is(":checkbox, :radio")?t.val()===i?t.attr("checked","checked"):t.removeAttr("checked"):t.is(":input")?t.val(i):t.html(i));break}})},cookieBind:function(t){return this.each(function(){var i=n(this);i.cookieFill().change(function(){i.cookify(t)})})}};n.each(t,function(t){n.fn[t]=this})}(window.jQuery)}();

;// blockUI.js
/*!
* jQuery blockUI plugin
* Version 2.33 (29-MAR-2010)
* @requires jQuery v1.2.3 or later
*
* Examples at: http://malsup.com/jquery/block/
* Copyright (c) 2007-2008 M. Alsup
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Thanks to Amir-Hossein Sobhi for some excellent contributions!
*/
(function(n){function h(e,o){var a=e==window,h=o&&o.message!==undefined?o.message:undefined,ot,st,d,w,ht,lt,ct,ut;o=n.extend({},n.blockUI.defaults,o||{}),o.overlayCSS=n.extend({},n.blockUI.defaults.overlayCSS,o.overlayCSS||{}),ot=n.extend({},n.blockUI.defaults.css,o.css||{}),st=n.extend({},n.blockUI.defaults.themedCSS,o.themedCSS||{}),h=h===undefined?o.message:h,a&&i&&u(window,{fadeOut:0}),h&&typeof h!="string"&&(h.parentNode||h.jquery)&&(d=h.jquery?h[0]:h,w={},n(e).data("blockUI.history",w),w.el=d,w.parent=d.parentNode,w.display=d.style.display,w.position=d.style.position,w.parent&&w.parent.removeChild(d));var b=o.baseZ,nt=n.browser.msie||o.forceIframe?n('<iframe class="blockUI" style="z-index:'+b+++';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+o.iframeSrc+'"></iframe>'):n('<div class="blockUI" style="display:none"></div>'),k=n('<div class="blockUI blockOverlay" style="z-index:'+b+++';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>'),p,g;if(g=o.theme&&a?'<div class="blockUI blockMsg blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+b+';display:none;position:fixed"><div class="ui-widget-header ui-dialog-titlebar blockTitle">'+(o.title||"&nbsp;")+'</div><div class="ui-widget-content ui-dialog-content"></div></div>':o.theme?'<div class="blockUI blockMsg blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+b+';display:none;position:absolute"><div class="ui-widget-header ui-dialog-titlebar blockTitle">'+(o.title||"&nbsp;")+'</div><div class="ui-widget-content ui-dialog-content"></div></div>':a?'<div class="blockUI blockMsg blockPage" style="z-index:'+b+';display:none;position:fixed"></div>':'<div class="blockUI blockMsg blockElement" style="z-index:'+b+';display:none;position:absolute"></div>',p=n(g),h&&(o.theme?(p.css(st),p.addClass("ui-widget-content")):p.css(ot)),o.applyPlatformOpacityRules&&n.browser.mozilla&&/Linux/.test(navigator.platform)||k.css(o.overlayCSS),k.css("position",a?"fixed":"absolute"),(n.browser.msie||o.forceIframe)&&nt.css("opacity",0),ht=[nt,k,p],lt=a?n("body"):n(e),n.each(ht,function(){this.appendTo(lt)}),o.theme&&o.draggable&&n.fn.draggable&&p.draggable({handle:".ui-dialog-titlebar",cancel:"li"}),ct=v&&(!n.boxModel||n("object,embed",a?null:e).length>0),l||ct){if(a&&o.allowBodyStretch&&n.boxModel&&n("html,body").css("height","100%"),(l||!n.boxModel)&&!a)var et=r(e,"borderTopWidth"),tt=r(e,"borderLeftWidth"),it=et?"(0 - "+et+")":0,rt=tt?"(0 - "+tt+")":0;n.each([nt,k,p],function(n,t){var i=t[0].style,u,r;i.position="absolute",n<2?(a?i.setExpression("height","Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:"+o.quirksmodeOffsetHack+') + "px"'):i.setExpression("height",'this.parentNode.offsetHeight + "px"'),a?i.setExpression("width",'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"'):i.setExpression("width",'this.parentNode.offsetWidth + "px"'),rt&&i.setExpression("left",rt),it&&i.setExpression("top",it)):o.centerY?(a&&i.setExpression("top",'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"'),i.marginTop=0):!o.centerY&&a&&(u=o.css&&o.css.top?parseInt(o.css.top):0,r="((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "+u+') + "px"',i.setExpression("top",r))})}if(h&&(o.theme?p.find(".ui-widget-content").append(h):p.append(h),(h.jquery||h.nodeType)&&n(h).show()),(n.browser.msie||o.forceIframe)&&o.showOverlay&&nt.show(),o.fadeIn){var ft=o.onBlock?o.onBlock:f,at=o.showOverlay&&!h?ft:f,vt=h?ft:f;o.showOverlay&&k._fadeIn(o.fadeIn,at),h&&p._fadeIn(o.fadeIn,vt)}else o.showOverlay&&k.show(),h&&p.show(),o.onBlock&&o.onBlock();c(1,e,o),a?(i=p[0],t=n(":input:enabled:visible",i),o.focusInput&&setTimeout(s,20)):y(p[0],o.centerX,o.centerY),o.timeout&&(ut=setTimeout(function(){a?n.unblockUI(o):n(e).unblock(o)},o.timeout),n(e).data("blockUI.timeout",ut))}function u(r,u){var o=r==window,e=n(r),h=e.data("blockUI.history"),s=e.data("blockUI.timeout"),f;s&&(clearTimeout(s),e.removeData("blockUI.timeout")),u=n.extend({},n.blockUI.defaults,u||{}),c(0,r,u),f=o?n("body").children().filter(".blockUI").add("body > .blockUI"):n(".blockUI",r),o&&(i=t=null),u.fadeOut?(f.fadeOut(u.fadeOut),setTimeout(function(){a(f,h,u,r)},u.fadeOut)):a(f,h,u,r)}function a(t,i,r,u){if(t.each(function(){this.parentNode&&this.parentNode.removeChild(this)}),i&&i.el&&(i.el.style.display=i.display,i.el.style.position=i.position,i.parent&&i.parent.appendChild(i.el),n(u).removeData("blockUI.history")),typeof r.onUnblock=="function")r.onUnblock(u,r)}function c(t,r,u){var e=r==window,s=n(r),f;(t||(!e||i)&&(e||s.data("blockUI.isBlocked")))&&(e||s.data("blockUI.isBlocked",t),u.bindEvents&&(!t||u.showOverlay))&&(f="mousedown mouseup keydown keypress",t?n(document).bind(f,u,o):n(document).unbind(f,o))}function o(r){if(r.keyCode&&r.keyCode==9&&i&&r.data.constrainTabKey){var u=t,e=!r.shiftKey&&r.target==u[u.length-1],f=r.shiftKey&&r.target==u[0];if(e||f)return setTimeout(function(){s(f)},10),!1}return n(r.target).parents("div.blockMsg").length>0?!0:n(r.target).parents().children().filter("div.blockUI").length==0}function s(n){if(t){var i=t[n===!0?t.length-1:0];i&&i.focus()}}function y(n,t,i){var u=n.parentNode,o=n.style,e=(u.offsetWidth-n.offsetWidth)/2-r(u,"borderLeftWidth"),f=(u.offsetHeight-n.offsetHeight)/2-r(u,"borderTopWidth");t&&(o.left=e>0?e+"px":"0"),i&&(o.top=f>0?f+"px":"0")}function r(t,i){return parseInt(n.css(t,i))||0}var i,t;if(/1\.(0|1|2)\.(0|1|2)/.test(n.fn.jquery)||/^1.1/.test(n.fn.jquery)){alert("blockUI requires jQuery v1.2.3 or later!  You are using v"+n.fn.jquery);return}n.fn._fadeIn=n.fn.fadeIn;var f=function(){},e=document.documentMode||0,v=n.browser.msie&&(n.browser.version<8&&!e||e<8),l=n.browser.msie&&/MSIE 6.0/.test(navigator.userAgent)&&!e;n.blockUI=function(n){h(window,n)},n.unblockUI=function(n){u(window,n)},n.growlUI=function(t,i,r,u){var f=n('<div class="growlUI"></div>');t&&f.append("<h1>"+t+"</h1>"),i&&f.append("<h2>"+i+"</h2>"),r==undefined&&(r=3e3),n.blockUI({message:f,fadeIn:700,fadeOut:1e3,centerY:!1,timeout:r,showOverlay:!1,onUnblock:u,css:n.blockUI.defaults.growlCSS})},n.fn.block=function(t){return this.unblock({fadeOut:0}).each(function(){n.css(this,"position")=="static"&&(this.style.position="relative"),n.browser.msie&&(this.style.zoom=1),h(this,t)})},n.fn.unblock=function(n){return this.each(function(){u(this,n)})},n.blockUI.version=2.33,n.blockUI.defaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,applyPlatformOpacityRules:!0,onBlock:null,onUnblock:null,quirksmodeOffsetHack:4},i=null,t=[]})(jQuery);

;// chat_v1.js
function BindDropDown(n, t) {
    ChatBar.SetPartyInviteStatus(t.ID, t.ShowInviteLink == "true"), $(".friend_dock_chatbox[userid=" + t.ID + "]").is(":visible") && ($(".StartChat[userid=" + t.ID + "]").hide(), $(".EndChat[userid=" + t.ID + "]").show()), $(n).children(".friend_dropdownbutton20").click(function() {
        $(this).siblings(".friendBarDropDownList").show()
    }), $(n).hover(function() {}, function() {
        $(this).find(".friendBarDropDownList").hide()
    }), $(n).find("li").click(function() {
        $(this).parent().parent().hide()
    });
    var i = $(n).parent();
    $(i).hover(function() {
        $(this).children(".friendBarDropDown").show()
    }, function() {
        $(this).children(".friendBarDropDown").hide()
    })
}

function ReportAbuse(n) {
    confirm(Roblox.Chat_v1.Resources.reportConfirm) && (window.location.href = "/abusereport/chat.aspx?ID=" + n + "&RedirectUrl=" + escape(window.location))
}
var Party, ChatBar = {};
ChatBar.CurrentTabID = null, ChatBar.FriendsEnabled = !1, ChatBar.BestFriendsEnabled = !1, ChatBar.PartyEnabled = !1, ChatBar.ChatPollIntervalTimer = null, ChatBar.ChatPollInterval = 1500, ChatBar.IdleChatPollInterval = 5e3, ChatBar.PollingStatus = "normal", ChatBar.PollIntervalFactorForIdle = 6, ChatBar.BestFriendsPollIntervalTimer = null, ChatBar.BestFriendsPollInterval = 3e4, ChatBar.BestFriendsLastPoll = null, ChatBar.FriendsPollIntervalTimer = null, ChatBar.FriendsPollInterval = 4e4, ChatBar.FriendsLastPoll = null, ChatBar.RecentsPollIntervalTimer = null, ChatBar.RecentsPollInterval = 32e3, ChatBar.RecentsLastPoll = null, ChatBar.MaxChatWindows = 4, ChatBar.NumChatWindows = 0, ChatBar.ActiveChats = null, ChatBar.Recents = [], ChatBar.BestFriends = [], ChatBar.Friends = [], ChatBar.ActiveChatsOnlineStatus = [], ChatBar.MyUserName = "", ChatBar.IsFirstLoad = !0, ChatBar.PollCount = 0, ChatBar.LastPollTime = 0, ChatBar.LastActivityTimeInTicks = +new Date, ChatBar.WindowIsInFocus = !0, ChatBar.RawData = {}, ChatBar.SoundPlayerIsReady = !1, ChatBar.AlreadyReceivedMessages = [], ChatBar.PageTitle = document.title, ChatBar.PageTitleIndicatorIntervalTimer = null, ChatBar.ActiveBlinkers = [], ChatBar.ChatTabBlinker = null, ChatBar.ChatThreadAvailable = !0, ChatBar.FriendsThreadAvailable = !0, ChatBar.DiagnosticsEnabled = !1, ChatBar.CurrentChatPollInterval = null, ChatBar.Log = function(n) {
    if (ChatBar.DiagnosticsEnabled && window.console) {
        var t = new Date,
            i = "CHATLOG " + t.toLocaleTimeString() + ":" + t.getMilliseconds() + " | ";
        console.log(i + n)
    }
}, ChatBar.OnPageLoad = function() {
    var t, n;
    $(".friend_dock_chatbox_entry").live("keyup", function(n) {
        if (n.keyCode == 13) {
            if ($.trim(this.value) == "") {
                this.value = "";
                return
            }
            return ChatBar.SendMessage($(this)), !1
        }
        return !0
    }), ChatBar.Log("ChatBar.OnPageLoad"), ChatBar.LoadStateFromClient(), t = $("#friend_dock_minimized_container:visible"), t.length > 0 ? (ChatBar.CurrentChatPollInterval = ChatBar.IdleChatPollInterval, ChatBar.Log("onpageload Detected chat minimized, ChatBar.ChatPollIntervalTimer to " + ChatBar.CurrentChatPollInterval), ChatBar.PollingStatus = "idle", ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval)) : (ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("onpageload Detected chat maximized, ChatBar.ChatPollIntervalTimer to " + ChatBar.CurrentChatPollInterval), ChatBar.PollingStatus = "normal", ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval)), ChatBar.ChatThreadAvailable == !0 ? ChatBar.PollForChats() : setTimeout(function() {
        ChatBar.PollForChats()
    }, 500), n = navigator.appName == "Microsoft Internet Explorer", n ? (document.onfocusout = function() {
        ChatBar.OnFocusOut()
    }, document.onfocusin = function() {
        ChatBar.OnFocusIn()
    }) : (window.onblur = function() {
        ChatBar.OnFocusOut()
    }, window.onfocus = function() {
        ChatBar.OnFocusIn()
    }), window.onbeforeunload = function() {
        ChatBar.SaveStateToClient()
    }, $("#jPlayerDiv").jPlayer({
        swfPath: "/js/jPlayer/2.4.0/Jplayer.swf",
        solution: "flash, html",
        supplied: "mp3, wav",
        wmode: "transparent",
        errorAlerts: !1,
        warningAlerts: !1,
        ready: function() {
            $("#jPlayerDiv").jPlayer("setMedia", {
                mp3: ChatBar.ChatReceivedSoundFile
            }), ChatBar.SoundPlayerIsReady = !0
        }
    })
}, ChatBar.PlaySound = function(n) {
    ChatBar.SoundPlayerIsReady && !ChatBar.WindowIsInFocus && ChatBar.ChatNotificationsSetting != "None" && n === "msgrec" && $("#jPlayerDiv").jPlayer("play")
}, ChatBar.GetOpenChats = function() {
    var t = 0,
        n = "";
    return $(".friend_dock_chatbox:visible").each(function() {
        n += $(this).attr("userid") + ",", t++
    }), n
}, ChatBar.GetAllChats = function() {
    var t = "",
        n;
    if (ChatBar.ActiveChats == null) return "";
    for (n = 0; n < ChatBar.ActiveChats.length; n++) t += ChatBar.ActiveChats[n].SenderID + ",";
    return t
}, ChatBar.ApplySettings = function() {
    var i = "",
        n, t;
    $("#chat_settings_all").attr("checked") ? i = "All" : $("#chat_settings_friends").attr("checked") ? i = "Friends" : $("#chat_settings_bestfriends").attr("checked") ? i = "TopFriends" : $("#chat_settings_noone").attr("checked") && (i = "Noone"), n = "", ChatBar.PartyEnabled && ($("#party_settings_all").attr("checked") ? n = "All" : $("#party_settings_friends").attr("checked") ? n = "Friends" : $("#party_settings_bestfriends").attr("checked") ? n = "TopFriends" : $("#party_settings_noone").attr("checked") && (n = "Noone")), t = "", $("#chat_settings_soundon").attr("checked") ? t = "All" : $("#chat_settings_soundoff").attr("checked") && (t = "None"), ChatBar.ChatNotificationsSetting = t, $.getJSON("/chat/utility.ashx", {
        reqtype: "setproperties",
        visibility: i,
        partyVisibility: n,
        notificationSetting: t
    }, function() {
        return
    })
}, ChatBar.GenerateUserOfflineSendPMMessage = function(n) {
    return Roblox.Chat_v1.Resources.sendPersonalMessage1 + "<a href='/My/NewMessage.aspx?RecipientID=" + n + "'>" + Roblox.Chat_v1.Resources.sendPersonalMessage2 + "</a>."
}, ChatBar.DisableTextEntry = function(n) {
    var t = "#" + n + "_friend_dock_chatbox_chat",
        i;
    $(t) && ($(t).children(".friend_dock_chatbox_entry").attr("disabled", "disabled"), $(t).children(".chaterror").size() == 0 && (i = ChatBar.GenerateUserOfflineSendPMMessage(n), $(t).append("<i class='chaterror'>" + i + "<br /><br /></i>"), $(t).prop({
        scrollTop: $(t).prop("scrollHeight")
    })))
}, ChatBar.EnableTextEntry = function(n) {
    var t = "#" + n + "_friend_dock_chatbox_chat";
    $(t) && ($(t).children(".friend_dock_chatbox_entry").removeAttr("disabled"), $(t).children(".chaterror").size() > 0 && $(t).children(".chaterror").remove())
}, ChatBar.BlockWindow = function(n) {
    $(".friend_dock_chatbox[userid=" + n + "]").block({
        message: "<b>" + Roblox.Chat_v1.Resources.loadingChat + "</b>",
        css: {
            border: "3px solid #a00"
        }
    })
}, ChatBar.UnblockAllWindows = function() {
    $(".friend_dock_chatbox:visible").each(function() {
        $(this).unblock()
    })
}, ChatBar.ResetPageTitle = function() {
    clearInterval(ChatBar.PageTitleIndicatorIntervalTimer), ChatBar.PageTitleIndicatorIntervalTimer = null, document.title = ChatBar.PageTitle
}, ChatBar.TogglePageTitleIndicator = function(n) {
    var t = n;
    clearInterval(ChatBar.PageTitleIndicatorIntervalTimer), ChatBar.PageTitleIndicatorIntervalTimer = setInterval(function() {
        document.title = document.title == ChatBar.PageTitle ? t : ChatBar.PageTitle
    }, 2e3)
}, ChatBar.OnFocusOut = function() {
    ChatBar.Log("ChatBar.OnFocusOut detected"), ChatBar.WindowIsInFocus = !1, clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.IdleChatPollInterval * 2, ChatBar.Log("onfocusout Set chatpollintervalttimer to " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval), ChatBar.PollingStatus = "idle", clearInterval(ChatBar.FriendsPollIntervalTimer), clearInterval(ChatBar.BestFriendsPollIntervalTimer), clearInterval(ChatBar.RecentsPollIntervalTimer)
}, ChatBar.OnFocusIn = function() {
    ChatBar.Log("ChatBar.OnFocusIn detected"), ChatBar.WindowIsInFocus = !0, clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("onfocusin Set chatpollintervalttimer to " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval), ChatBar.PollingStatus = "normal", ChatBar.LastActivityTimeInTicks = +new Date, ChatBar.ResetPageTitle(), ChatBar.PollIfNecessary(ChatBar.CurrentTabID)
}, ChatBar.HideFriends = function() {
    $("#ChatContainer").css("width", ""), $("#friend_dock_chatholder").hide(), $("#friend_dock_container").hide(), $("#friend_dock_minimized_container").show(), ChatBar.OnFocusOut(), $.cookies.set("IsMinimized", "true")
}, ChatBar.ShowFriends = function() {
    $("#ChatContainer").width("100%"), $("#friend_dock_container").show(), $("#friend_dock_minimized_container").hide(), $("#friend_dock_chatholder").show();
    var n = $("#friend_dock_container").html();
    n = n.replace(/min_src/g, "src"), $("#friend_dock_container").html(n), ChatBar.OnFocusIn(), $.cookies.set("IsMinimized", "false")
}, ChatBar.SetPartyInviteStatus = function(n, t) {
    t ? $(".friend_dock_friend[userid=" + n + "]").find(".partyInvite").show() : $(".friend_dock_friend[userid=" + n + "]").find(".partyInvite").hide()
}, ChatBar.UpdateChatZone = function(n) {
    try {
        if (!$("#chatsTab_dock_thumbnails_chat").find(".friend_dock_friend[userid=" + n.SenderID + "]").length) {
            var i = ChatBar.GenerateThumbFromTemplate(n),
                t = $("#chatsTab_dock_thumbnails_chat").append(i);
            BindDropDown($(t).find(".friendBarDropDown"), n), $("#chatsTab_dock_thumbnails_chat").children(".friend_dock_friend").size() > 20 && $("#chatsTab_dock_thumbnails_chat").children(".friend_dock_friend:last").remove()
        }
    } catch (r) {}
}, ChatBar.LoadUserLocationIntoWindow = function(n) {
    var i, r, u, t, f;
    n != null && (i = n.Location, i !== undefined && i != null) && (r = null, r = n.SenderID !== undefined ? n.SenderID : n.ID, u = null, u = n.SenderUserName !== undefined ? n.SenderUserName : n.Name, $(".friend_dock_chatbox[userid=" + r + "]").children(".friend_dock_chatbox_currentlocation").html(""), $(".friend_dock_chatbox[userid=" + r + "]").children(".friend_dock_chatbox_currentlocation").css("height", ""), t = "", f = $(".friend_dock_friend[userid=" + r + "] img").attr("src"), t += "<img style='margin-right:5px;margin-top:-5px;width:30px;height:30px;float:left' src='" + f + "' />", i == "website" ? t += "<p><span style='color: green'>" + Roblox.Chat_v1.Resources.online + "</span>: Website</p>" : i == "offline" ? t += "<p><span style='color: grey'>" + Roblox.Chat_v1.Resources.offline + "</span></p>" : (i.GameThumbnailURL && (t += "<div style='width: 62px; float: left; margin-right: 10px; margin-bottom: 10px; cursor: pointer'><a href='" + i.GameAssetURL + "' style='text-decoration: none'><img src='" + i.GameThumbnailURL + "'/></a></div>"), t += "<div>", t += "<a href='#' style='text-decoration: none; color: black' onclick=\"", t += "RobloxLaunch._GoogleAnalyticsCallback = function() { GoogleAnalyticsEvents.FireEvent(['Play', 'User']); RobloxEventManager.triggerEvent('rbx_evt_play_user'); }; Roblox.Client.WaitForRoblox(function() { RobloxLaunch.RequestFollowUser('PlaceLauncherStatusPanel', '" + r + "');}); return false;\">", t += "Join " + u + " in<br/><span style='font-weight: bold'><i>" + unescape(i.GameAssetName) + "</i></span>", t += "</a></div>"), $(".friend_dock_chatbox[userid=" + r + "]").children(".friend_dock_chatbox_currentlocation").html(t))
}, ChatBar.LoadChatIntoWindow = function(n) {
    var f, t, r, i, u, e;
    if (n != null && n.Conversation !== undefined && n.Conversation != null) {
        for (f = n.Conversation, t = n.SenderID, $("#" + t + "_friend_dock_chatbox_chat").html(""), r = 0; r < f.length; r++) i = f[r], u = "#0066CC", ChatBar.MyUserName != i.SenderUserName && (u = "#007B00"), e = i.TimeSent.substring(1), $("#" + t + "_friend_dock_chatbox_chat").append("<b><span style='color: " + u + "'>" + i.SenderUserName + "</span></b>: " + i.Message + " <span style='color: gray; font-size: 8px; font-style: italic'>(" + e + ")</span><br /><br />");
        $("#" + t + "_friend_dock_chatbox_chat").prop({
            scrollTop: $("#" + t + "_friend_dock_chatbox_chat").prop("scrollHeight")
        })
    }
}, ChatBar.FindUserData = function(n) {
    var t;
    if (ChatBar.ActiveChats != null)
        for (t = 0; t < ChatBar.ActiveChats.length; t++)
            if (ChatBar.ActiveChats[t].SenderID == n) return ChatBar.ActiveChats[t];
    if (ChatBar.Friends != null)
        for (t = 0; t < ChatBar.Friends.length; t++)
            if (ChatBar.Friends[t].ID == n) return ChatBar.Friends[t];
    if (ChatBar.BestFriends != null)
        for (t = 0; t < ChatBar.BestFriends.length; t++)
            if (ChatBar.BestFriends[t].ID == n) return ChatBar.BestFriends[t];
    if (ChatBar.Recents != null)
        for (t = 0; t < ChatBar.Recents.length; t++)
            if (ChatBar.Recents[t].ID == n) return ChatBar.Recents[t];
    return null
}, ChatBar.ToggleChat = function(n, t) {
    var i = ".friend_dock_chatbox[userid=" + n + "]";
    $(i).is(":visible") ? ChatBar.CloseChat($(i)) : ChatBar.OpenChat(n, t), ChatBar.LastActivityTimeInTicks = +new Date, ChatBar.PollingStatus == "idle" && (ChatBar.PollingStatus = "normal", clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("toggle chat - status is idle, setting interval to normal, ChatBar.ChatPollInterval = " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval)), ChatBar.IsFirstLoad = !0, ChatBar.PollForChats()
}, ChatBar.CreateChatWindow = function(n, t) {
    var r = ".friend_dock_chatbox[userid=" + n + "]",
        i;
    return $(r).length ? $(r).is(":visible") || ($(r).fadeIn(350), ChatBar.NumChatWindows++) : (i = $("#friend_dock_chattemplate").html(), i = i.replace(/CHATUSERID/g, n), i = i.replace(/CHATUSERNAME/g, t), $("#friend_dock_chatholder").append(i), ChatBar.NumChatWindows++), $("#" + r).click(function() {
        ChatBar.GiveElementFocus($(this).find(".friend_dock_chatbox_entry"))
    }), r
}, ChatBar.GiveElementFocus = function(n) {
    $(n).focus(), $(n).siblings(".blinkonheader").removeClass("blinkonheader").addClass("blinkoffheader")
}, ChatBar.OnMessageReceived = function(n) {
    var i, t, e, u, r, o, f;
    if (ChatBar.PlaySound("msgrec"), i = $(".blinkoffheader[userId=" + n + "]"), !i || ChatBar.WindowIsInFocus && $(i).siblings("textarea").is(":focus") || $(i).removeClass("blinkoffheader").addClass("blinkonheader"), ChatBar.IsMinimized()) {
        t = $("#minChatsTab"), e = setInterval(function() {
            t.toggleClass("tab_white19h_flash")
        }, 500);
        t.one("click", function() {
            clearInterval(e), t.removeClass("tab_white19h_flash"), $(".friend_dock_chatbox[userid=" + n + "]").is(":visible") || (ChatBar.ToggleChat(n, ChatBar.FindUserData(n).SenderUserName), ChatBar.OnMessageReceived(n), ChatBar.TogglePanel("chatsTab_dock_thumbnails_chat"))
        })
    }
    if ($(".friend_dock_chatbox[userid=" + n + "]").length) {
        if (u = ChatBar.ActiveBlinkers.indexOf(n), u == -1) {
            ChatBar.ActiveBlinkers.push(n), r = $(".friend_dock_friend[userid=" + n + "] .friend_dock_username"), o = setInterval(function() {
                r.toggle()
            }, 500);
            $(".friend_dock_chatbox[userid=" + n + "]").one("click", function() {
                clearInterval(o), r.show(), ChatBar.ActiveBlinkers.splice(u, 1)
            })
        }
        ChatBar.ChatTabBlinker == null && (f = $("#chatsTab"), ChatBar.ChatTabBlinker = setInterval(function() {
            ChatBar.ActiveBlinkers.length > 0 ? f.toggleClass("tab_white19h_flash") : (clearInterval(ChatBar.ChatTabBlinker), ChatBar.ChatTabBlinker = null, f.removeClass("tab_white19h_flash"))
        }, 500))
    }
}, ChatBar.OpenChat = function(n, t) {
    var r, i;
    $(".friend_dock_chatbox[userid=" + n + "]").is(":visible") || ($(".StartChat[userid=" + n + "]").hide(), $(".EndChat[userid=" + n + "]").show(), ChatBar.NumChatWindows >= ChatBar.MaxChatWindows && ChatBar.CloseChat($(".friend_dock_chatbox:visible:first")), r = ChatBar.CreateChatWindow(n, t), ChatBar.BlockWindow(n), i = ChatBar.FindUserData(n), ChatBar.LoadChatIntoWindow(i), ChatBar.LoadUserLocationIntoWindow(i), i == null && (ChatBar.ActiveChatsOnlineStatus != null && ChatBar.ActiveChatsOnlineStatus[n] !== undefined && ChatBar.ActiveChatsOnlineStatus[n] === !1 ? ChatBar.DisableTextEntry(n) : ChatBar.EnableTextEntry(n)))
}, ChatBar.CloseChat = function(n) {
    if (n) {
        var t = $(n).attr("userid");
        $(n).fadeOut(350), $(".StartChat[userid=" + t + "]").show(), $(".EndChat[userid=" + t + "]").hide(), ChatBar.NumChatWindows--
    }
}, ChatBar.ProcessPolledChatData = function(n) {
    var r = 0,
        u, t, i, s, e, h, f, o;
    for (ChatBar.ActiveChats = n, ChatBar.ActiveChats.length == 0 ? $("#chatsTab_dock_thumbnails_chat").html($("#chatsTab_dock_thumbnails_chat_empty").attr("outerHTML")) : $("#chatsTab_dock_thumbnails_chat_empty").hide(), u = 0; u < ChatBar.ActiveChats.length; u++) t = ChatBar.ActiveChats[u], i = t.SenderID, t.CachedOnClient == "false" && (ChatBar.UpdateChatZone(t), s = t.Online == "true", ChatBar.SetOnline(i, s)), ChatBar.SetPartyInviteStatus(i, t.ShowInviteLink == "true"), e = t.HasNewMessages == "true", h = ChatBar.IsFirstLoad, (e || h) && (f = $(".friend_dock_chatbox[userid=" + i + "]:visible").length, o = $.cookie("ChatWindowOpened" + i), e && (f ? r++ : ChatBar.IsMinimized() || o != null || (setTimeout(function() {
        ChatBar.ToggleChat(i, t.SenderUserName), ChatBar.OnMessageReceived(i)
    }, 0), $.cookie("ChatWindowOpened" + i, !0)), ChatBar.OnMessageReceived(i)), f && (ChatBar.LoadUserLocationIntoWindow(t), ChatBar.LoadChatIntoWindow(t))), r > 0 && ChatBar.WindowIsInFocus == !0 && (ChatBar.LastActivityTimeInTicks = +new Date, ChatBar.PollingStatus == "idle" && (ChatBar.PollingStatus = "normal", clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("got a message while idle, speeding up polling to" + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval)));
    ChatBar.ChatThreadAvailable = !0, ChatBar.WindowIsInFocus || (r == 1 ? ChatBar.TogglePageTitleIndicator(Roblox.Chat_v1.Resources.newMessage) : r > 1 && ChatBar.TogglePageTitleIndicator(Roblox.Chat_v1.Resources.newMessages))
}, ChatBar.StopChatPolling = function() {
    clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.Log("Stopeed polling")
}, ChatBar.PollForChats = function() {
    var i, r, n, t;
    ChatBar.ChatThreadAvailable != !1 && (ChatBar.ChatThreadAvailable = !1, i = ChatBar.PollCount % 10 == 0 ? "true" : "false", r = typeof Party != "undefined" && Party.ActiveParty && !Party.ActiveParty.PartyGuid ? "true" : "false", ChatBar.Log("Polling for Chat...   ChatBar.CurrentChatPollInterval = " + ChatBar.CurrentChatPollInterval), n = {
        openChatTabs: ChatBar.GetOpenChats(),
        fullget: ChatBar.IsFirstLoad,
        activechatids: ChatBar.GetAllChats(),
        getstatusinfo: i,
        getpartystatus: r,
        timeZoneOffset: (new Date).getTimezoneOffset()
    }, ChatBar.DiagnosticsEnabled && (n.diag_poll_count = ChatBar.PollCount, n.diag_page = window.location.pathname + window.location.search, n.diag_state = ChatBar.IsMinimized() ? "minimized" : "maximized", n.diag_interval = ChatBar.CurrentChatPollInterval, t = +new Date, n.diag_since_last = ChatBar.LastPollTime == 0 ? "first_time" : t - ChatBar.LastPollTime, ChatBar.LastPollTime = t), $.getJSON("/chat/get.ashx?reqType=getallchatswithdata", n, function(n) {
        var i, r, t;
        try {
            if (n.Error === "") {
                ChatBar.RawData = n, i = +new Date;
                try {
                    n.PartyStatus != null && Party != null && Party.ActiveParty != null && (ChatBar.Log("party detected, data.PartyStatus = " + n.PartyStatus + ", data.PartyStatus.Error = " + n.PartyStatus.Error), n.PartyStatus.Error != null ? ChatBar.Log("There was an error in party status.  Will not reset the interval") : (Party.ActiveParty = n.PartyStatus, ChatBar.LastActivityTimeInTicks = i, ChatBar.PollingStatus == "idle" && (ChatBar.PollingStatus = "normal", clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("Status was idle, set to normal, detected a party. set ChatBar.ChatPollInterval = " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
                        ChatBar.PollForChats()
                    }, ChatBar.CurrentChatPollInterval))))
                } catch (f) {}
                ChatBar.ProcessPolledChatData(n.Chats), ChatBar.IsFirstLoad = !1, ChatBar.UnblockAllWindows(), ChatBar.PollCount++, r = 3e4, t = i - ChatBar.LastActivityTimeInTicks, ChatBar.Log("Last activity time: " + ChatBar.LastActivityTimeInTicks + " time since last activity = " + t + " ChatBar.PollingStatus = " + ChatBar.PollingStatus), t > r && ChatBar.PollingStatus == "normal" && ChatBar.WindowIsInFocus == !0 && (ChatBar.PollingStatus = "idle", clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.IdleChatPollInterval, ChatBar.Log("Detected idle and was normal and window was in focus, set status to idle, interval = " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
                    ChatBar.PollForChats()
                }, ChatBar.CurrentChatPollInterval))
            }
        } catch (u) {}
    }))
}, ChatBar.SetOnline = function(n, t) {
    if (t) ChatBar.ActiveChatsOnlineStatus[n] = !0, $(".friend_dock_friend[userid=" + n + "]").children(".friend_dock_onlinestatus").show(), $(".friend_dock_friend[userid=" + n + "]").children(".friend_dock_offlinestatus").hide(), ChatBar.EnableTextEntry(n);
    else {
        var i = "#" + n + "_friend_dock_chatbox";
        $(i) && $(i).children(".friend_dock_chatbox_currentlocation").html("<p><span style='color: grey'>Offline</span></p>"), ChatBar.ActiveChatsOnlineStatus[n] = !1, $(".friend_dock_friend[userid=" + n + "]").children(".friend_dock_onlinestatus").hide(), $(".friend_dock_friend[userid=" + n + "]").children(".friend_dock_offlinestatus").show(), ChatBar.DisableTextEntry(n)
    }
}, ChatBar.RefreshFriends = function(n) {
    ChatBar.ChatThreadAvailable = !1, $.getJSON("/chat/friendhandler.ashx?cmd=" + n, function(t) {
        var r, i, e, f, u;
        try {
            if (ChatBar.ChatThreadAvailable = !0, t.Error === "") {
                if (r = "#friendsTab_dock_thumbnails", n == "bestfriends" ? r = "#bestFriendsTab_dock_thumbnails" : n == "recents" && (r = "#recentsTab_dock_thumbnails"), t.Count == 0) {
                    $(r).html($(r + "_empty").show());
                    return
                }
                for (n == "bestfriends" ? (ChatBar.BestFriends = t.Users, ChatBar.BestFriendsLastPoll = new Date) : n == "recents" ? (ChatBar.RecentsLastPoll = new Date, ChatBar.Recents = t.Users) : n == "friends" && (ChatBar.Friends = t.Users, ChatBar.FriendsLastPoll = new Date), $(r + "_empty").hide(), i = 0; i < t.Users.length; i++) $(r).children(".friend_dock_friend[userid=" + t.Users[i].ID + "]").length ? (t.Users[i].Online == "true" ? ChatBar.SetOnline(t.Users[i].ID, !0) : ChatBar.SetOnline(t.Users[i].ID, !1), ChatBar.SetPartyInviteStatus(t.Users[i].ID, t.Users[i].ShowInviteLink == "true")) : (e = ChatBar.GenerateThumbFromTemplate(t.Users[i]), f = $(r).append(e), BindDropDown($(f).find(".friendBarDropDown"), t.Users[i]), u = t.Users[i].Online == "true", ChatBar.SetOnline(t.Users[i].ID, u));
                $(".friendBarDropDown").hover(function() {
                    $(this).find("ul").show()
                }, function() {
                    $(this).find("ul").fadeOut("fast")
                }), $(".friendBarDropDown > li").click(function() {
                    $(this).parent().fadeOut("fast")
                })
            } else $("#friend_dock_container").hide()
        } catch (o) {}
    })
}, ChatBar.GenerateThumbFromTemplate = function(n) {
    var t = $("#friend_dock_friendtemplate").html(),
        r = null,
        i;
    return r = n.SenderID !== undefined ? n.SenderID : n.ID, i = null, i = n.SenderUserName !== undefined ? n.SenderUserName : n.Name, t = t.replace(/UID/g, r), t = t.replace(/USERNAMETRUNCATED/g, fitStringToWidth(i, 55, "friend_dock_username_href")), t = t.replace(/USERNAME/g, i), t = ChatBar.IsMinimized() ? t.replace(/thumbnail_holder/g, " min_src='" + n.Thumbnail + "' ") : t.replace(/thumbnail_holder/g, " src='" + n.Thumbnail + "' "), t = n.Online == "true" && n.CanAcceptChats == "true" ? t.replace("startchattingdisplay", "style='display:block;'") : t.replace("startchattingdisplay", "style='display:none;'"), t = n.Online == "true" ? t.replace("startpartydisplay", "style='display:block;'") : t.replace("startpartydisplay", "style='display:none;'")
}, ChatBar.RemoveActiveChat = function(n) {
    if (n) {
        var t = $(n).attr("userid");
        $.getJSON("/chat/utility.ashx?reqtype=removechat&targetuserid=" + t, function(n) {
            n.Result == "true" && ($("#chatsTab_dock_thumbnails_chat .friend_dock_friend[userid=" + t + "]").remove(), ChatBar.CloseChat($(".friend_dock_chatbox[userid=" + t + "]")))
        })
    }
}, ChatBar.DisplayLocalMessageInWindow = function(n, t) {
    $("#" + n + "_friend_dock_chatbox_chat").append("<b><span style='color: #0066CC'>" + ChatBar.MyUserName + "</span></b>: " + t + "<br /><br />"), $("#" + n + "_friend_dock_chatbox_chat").prop({
        scrollTop: $("#" + n + "_friend_dock_chatbox_chat").prop("scrollHeight")
    })
}, ChatBar.SendMessage = function(n) {
    var i = n.parents(".friend_dock_chatbox").attr("userid"),
        t = $.trim(n.val()),
        r;
    t != "" && (ChatBar.LastActivityTimeInTicks = +new Date, ChatBar.PollingStatus == "idle" && (ChatBar.PollingStatus = "normal", clearInterval(ChatBar.ChatPollIntervalTimer), ChatBar.CurrentChatPollInterval = ChatBar.ChatPollInterval, ChatBar.Log("Sent message, was idle, set mode to normal and interval = " + ChatBar.CurrentChatPollInterval), ChatBar.ChatPollIntervalTimer = setInterval(function() {
        ChatBar.PollForChats()
    }, ChatBar.CurrentChatPollInterval)), r = t.escapeHTML(), ChatBar.DisplayLocalMessageInWindow(i, r), n.val(""), $.ajax({
        url: "/chat/send.ashx?recipientUserId=" + i,
        type: "POST",
        data: "message=" + encodeURIComponent(t),
        success: function(n) {
            n.Error != "" && n.Error != "ModeratedMessage" && ChatBar.DisableTextEntry(i)
        }
    }))
}, ChatBar.TogglePanel = function(n) {
    var i, t;
    n != ChatBar.CurrentTabID && (i = n.substr(0, n.indexOf("_")), $("#" + i).removeClass("tab_white19h"), $("#" + i).addClass("tab_white19hselected"), ChatBar.CurrentTabID != null && (t = ChatBar.CurrentTabID.substr(0, ChatBar.CurrentTabID.indexOf("_")), $("#" + t).removeClass("tab_white19hselected"), $("#" + t).addClass("tab_white19h")), ChatBar.CurrentTabID != null && $("#" + ChatBar.CurrentTabID).hide(), ChatBar.CurrentTabID == "friendsTab_dock_thumbnails" ? clearInterval(ChatBar.FriendsPollIntervalTimer) : ChatBar.CurrentTabID == "bestFriendsTab_dock_thumbnails" ? clearInterval(ChatBar.BestFriendsPollIntervalTimer) : ChatBar.CurrentTabID == "recentsTab_dock_thumbnails" && clearInterval(ChatBar.RecentsPollIntervalTimer), ChatBar.PollIfNecessary(n), $("#" + n).show(), ChatBar.CurrentTabID = n)
}, ChatBar.PollIfNecessary = function(n) {
    ChatBar.IsMinimized() || (n == "friendsTab_dock_thumbnails" ? (ChatBar.FriendsPollIntervalTimer = setInterval(function() {
        ChatBar.RefreshFriends("friends")
    }, ChatBar.FriendsPollInterval), (ChatBar.FriendsLastPoll == null || +new Date - ChatBar.FriendsLastPoll.getTime() > ChatBar.FriendsPollInterval) && ChatBar.RefreshFriends("friends")) : n == "bestFriendsTab_dock_thumbnails" ? (ChatBar.BestFriendsPollIntervalTimer = setInterval(function() {
        ChatBar.RefreshFriends("bestfriends")
    }, ChatBar.BestFriendsPollInterval), (ChatBar.BestFriendsLastPoll == null || +new Date - ChatBar.BestFriendsLastPoll.getTime() > ChatBar.BestFriendsPollInterval) && ChatBar.RefreshFriends("bestfriends")) : n == "recentsTab_dock_thumbnails" && (ChatBar.RecentsPollIntervalTimer = setInterval(function() {
        ChatBar.RefreshFriends("recents")
    }, ChatBar.RecentsPollInterval), (ChatBar.RecentsLastPoll == null || +new Date - ChatBar.RecentsLastPoll.getTime() > ChatBar.RecentsPollInterval) && ChatBar.RefreshFriends("recents")))
}, ChatBar.SaveStateToClient = function() {
    var h = [],
        n = 0,
        o, s, f, i, r, u, t, e;
    $(".friend_dock_chatbox:visible").each(function() {
        var t = {};
        t.userid = $(this).attr("userid"), t.username = $(this).children(".friend_dock_chatbox_titlebar").children(".friend_dock_chatbox_username").children(".friend_dock_chatbox_username_display").html(), h[n] = t, n++
    }), o = $.toJSON(h), s = "friends", $("#friend_dock_chatzone:visible").length && (s = "chat"), f = "true", $("#friend_dock_container:visible").length && (f = "false"), i = "false", $("#partycontainer").is(":visible") && (i = "true"), $.cookies.set("ChatWindows", o), $.cookies.set("CurrentTabID", ChatBar.CurrentTabID), $.cookies.set("IsMinimized", f), $.cookies.set("PartyWindowVisible", i), ChatBar.AlreadyReceivedMessages.length && $.cookies.set("RecMsgs", ChatBar.AlreadyReceivedMessages), r = [], u = 0;
    for (n in ChatBar.ActiveChatsOnlineStatus) t = {}, t.userid = n, t.online = ChatBar.ActiveChatsOnlineStatus[n], r[u] = t, u++;
    e = $.toJSON(r), $.cookies.set("OnlineStatuses", e)
}, ChatBar.LoadStateFromClient = function() {
    var i = null,
        r = null,
        u = null,
        f = null,
        t, e, n;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent) && RegExp.$1 < 8) {
        try {
            i = eval("(" + $.cookies.get("ChatWindows") + ")")
        } catch (s) {}
        try {
            r = eval("(" + $.cookies.get("OnlineStatuses") + ")")
        } catch (s) {}
        try {
            u = eval("(" + $.cookies.get("PartyWindowVisible") + ")")
        } catch (s) {}
        try {
            f = $.cookies.get("IsMinimized"), f || $("#ChatContainer").width("100%")
        } catch (s) {}
        t = $.cookies.get("RecMsgs"), t != null && t.length && (ChatBar.AlreadyReceivedMessages = eval("(" + t + ")"))
    } else i = $.cookies.get("ChatWindows"), r = $.cookies.get("OnlineStatuses"), u = $.cookies.get("PartyWindowVisible"), f = $.cookies.get("IsMinimized"), f || $("#ChatContainer").width("100%"), t = $.cookies.get("RecMsgs"), t != null && t.length && (ChatBar.AlreadyReceivedMessages = t);
    if (e = $.cookies.get("CurrentTabID"), r != null)
        for (n = 0; n < r.length; n++) ChatBar.ActiveChatsOnlineStatus[r[n].userid] = r[n].online;
    u != null && (u == !0 || u == "true") && Party.ToggleTab(!0);
    try {
        if (i != null)
            for (n = 0; n < i.length; n++) ChatBar.OpenChat(i[n].userid, i[n].username);
        e != null ? ChatBar.TogglePanel(e) : ChatBar.TogglePanel("friendsTab_dock_thumbnails")
    } catch (o) {}
}, ChatBar.IsMinimized = function() {
	var IsMinimized = $("#friend_dock_minimized_container").is(":visible")
	if ($("#friend_dock_chatholder").children( ":visible" )) {
		IsMinimized = false
	}
	ChatBar.Log("ChatBar.IsMinimized() = " + IsMinimized)
    return IsMinimized
};

;// jquery-extensions.js
jQuery.extend(jQuery.expr[":"],{focus:function(n){return n==document.activeElement}});

;// jPlayer/1.2.0/jquery.jplayer.min.js
/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 1.2.0
 * Date: 11th July 2010
 */

(function(c){function k(a,b){var d=function(e){e=c[a][e]||[];return typeof e=="string"?e.split(/,?\s+/):e}("getter");return c.inArray(b,d)!=-1}c.fn.jPlayer=function(a){var b=typeof a=="string",d=Array.prototype.slice.call(arguments,1);if(b&&a.substring(0,1)=="_")return this;if(b&&k("jPlayer",a,d)){var e=c.data(this[0],"jPlayer");return e?e[a].apply(e,d):undefined}return this.each(function(){var h=c.data(this,"jPlayer");!h&&!b&&c.data(this,"jPlayer",new c.jPlayer(this,a))._init();h&&b&&c.isFunction(h[a])&&
h[a].apply(h,d)})};c.jPlayer=function(a,b){this.options=c.extend({},b);this.element=c(a)};c.jPlayer.getter="jPlayerOnProgressChange jPlayerOnSoundComplete jPlayerVolume jPlayerReady getData jPlayerController";c.jPlayer.defaults={cssPrefix:"jqjp",swfPath:"js",volume:80,oggSupport:false,nativeSupport:true,preload:"none",customCssIds:false,graphicsFix:true,errorAlerts:false,warningAlerts:false,position:"absolute",width:"0",height:"0",top:"0",left:"0",quality:"high",bgcolor:"#ffffff"};c.jPlayer._config=
{version:"1.2.0",swfVersionRequired:"1.2.0",swfVersion:"unknown",jPlayerControllerId:undefined,delayedCommandId:undefined,isWaitingForPlay:false,isFileSet:false};c.jPlayer._diag={isPlaying:false,src:"",loadPercent:0,playedPercentRelative:0,playedPercentAbsolute:0,playedTime:0,totalTime:0};c.jPlayer._cssId={play:"jplayer_play",pause:"jplayer_pause",stop:"jplayer_stop",loadBar:"jplayer_load_bar",playBar:"jplayer_play_bar",volumeMin:"jplayer_volume_min",volumeMax:"jplayer_volume_max",volumeBar:"jplayer_volume_bar",
volumeBarValue:"jplayer_volume_bar_value"};c.jPlayer.count=0;c.jPlayer.timeFormat={showHour:false,showMin:true,showSec:true,padHour:false,padMin:true,padSec:true,sepHour:":",sepMin:":",sepSec:""};c.jPlayer.convertTime=function(a){var b=new Date(a),d=b.getUTCHours();a=b.getUTCMinutes();b=b.getUTCSeconds();d=c.jPlayer.timeFormat.padHour&&d<10?"0"+d:d;a=c.jPlayer.timeFormat.padMin&&a<10?"0"+a:a;b=c.jPlayer.timeFormat.padSec&&b<10?"0"+b:b;return(c.jPlayer.timeFormat.showHour?d+c.jPlayer.timeFormat.sepHour:
"")+(c.jPlayer.timeFormat.showMin?a+c.jPlayer.timeFormat.sepMin:"")+(c.jPlayer.timeFormat.showSec?b+c.jPlayer.timeFormat.sepSec:"")};c.jPlayer.prototype={_init:function(){var a=this,b=this.element;this.config=c.extend({},c.jPlayer.defaults,this.options,c.jPlayer._config);this.config.diag=c.extend({},c.jPlayer._diag);this.config.cssId={};this.config.cssSelector={};this.config.cssDisplay={};this.config.clickHandler={};this.element.data("jPlayer.config",this.config);c.extend(this.config,{id:this.element.attr("id"),
swf:this.config.swfPath+(this.config.swfPath!=""&&this.config.swfPath.slice(-1)!="/"?"/":"")+"Jplayer.swf",fid:this.config.cssPrefix+"_flash_"+c.jPlayer.count,aid:this.config.cssPrefix+"_audio_"+c.jPlayer.count,hid:this.config.cssPrefix+"_force_"+c.jPlayer.count,i:c.jPlayer.count,volume:this._limitValue(this.config.volume,0,100),autobuffer:this.config.preload!="none"});c.jPlayer.count++;if(this.config.ready!=undefined)if(c.isFunction(this.config.ready))this.jPlayerReadyCustom=this.config.ready;else this._warning("Constructor's ready option is not a function.");
this.config.audio=document.createElement("audio");this.config.audio.id=this.config.aid;c.extend(this.config,{canPlayMP3:!!(this.config.audio.canPlayType?""!=this.config.audio.canPlayType("audio/mpeg")&&"no"!=this.config.audio.canPlayType("audio/mpeg"):false),canPlayOGG:!!(this.config.audio.canPlayType?""!=this.config.audio.canPlayType("audio/ogg")&&"no"!=this.config.audio.canPlayType("audio/ogg"):false),aSel:c("#"+this.config.aid)});c.extend(this.config,{html5:!!(this.config.oggSupport?this.config.canPlayOGG?
true:this.config.canPlayMP3:this.config.canPlayMP3)});c.extend(this.config,{usingFlash:!(this.config.html5&&this.config.nativeSupport),usingMP3:!(this.config.oggSupport&&this.config.canPlayOGG&&this.config.nativeSupport)});var d={setButtons:function(g,f){a.config.diag.isPlaying=f;if(a.config.cssId.play!=undefined&&a.config.cssId.pause!=undefined)if(f){a.config.cssSelector.play.css("display","none");a.config.cssSelector.pause.css("display",a.config.cssDisplay.pause)}else{a.config.cssSelector.play.css("display",
a.config.cssDisplay.play);a.config.cssSelector.pause.css("display","none")}if(f)a.config.isWaitingForPlay=false}},e={setFile:function(g,f){try{a._getMovie().fl_setFile_mp3(f);a.config.autobuffer&&b.trigger("jPlayer.load");a.config.diag.src=f;a.config.isFileSet=true;b.trigger("jPlayer.setButtons",false)}catch(j){a._flashError(j)}},clearFile:function(){try{b.trigger("jPlayer.setButtons",false);a._getMovie().fl_clearFile_mp3();a.config.diag.src="";a.config.isFileSet=false}catch(g){a._flashError(g)}},
load:function(){try{a._getMovie().fl_load_mp3()}catch(g){a._flashError(g)}},play:function(){try{a._getMovie().fl_play_mp3()&&b.trigger("jPlayer.setButtons",true)}catch(g){a._flashError(g)}},pause:function(){try{a._getMovie().fl_pause_mp3()&&b.trigger("jPlayer.setButtons",false)}catch(g){a._flashError(g)}},stop:function(){try{a._getMovie().fl_stop_mp3()&&b.trigger("jPlayer.setButtons",false)}catch(g){a._flashError(g)}},playHead:function(g,f){try{a._getMovie().fl_play_head_mp3(f)&&b.trigger("jPlayer.setButtons",
true)}catch(j){a._flashError(j)}},playHeadTime:function(g,f){try{a._getMovie().fl_play_head_time_mp3(f)&&b.trigger("jPlayer.setButtons",true)}catch(j){a._flashError(j)}},volume:function(g,f){a.config.volume=f;try{a._getMovie().fl_volume_mp3(f)}catch(j){a._flashError(j)}}},h={setFile:function(g,f,j){a.config.diag.src=a.config.usingMP3?f:j;a.config.isFileSet&&!a.config.isWaitingForPlay&&b.trigger("jPlayer.pause");a.config.audio.autobuffer=a.config.autobuffer;a.config.audio.preload=a.config.preload;
if(a.config.autobuffer){a.config.audio.src=a.config.diag.src;a.config.audio.load()}else a.config.isWaitingForPlay=true;a.config.isFileSet=true;a.jPlayerOnProgressChange(0,0,0,0,0);clearInterval(a.config.jPlayerControllerId);if(a.config.autobuffer)a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(false)},100);clearInterval(a.config.delayedCommandId)},clearFile:function(){a.setFile("","");a.config.isWaitingForPlay=false;a.config.isFileSet=false},load:function(){if(a.config.isFileSet)if(a.config.isWaitingForPlay){a.config.audio.autobuffer=
true;a.config.audio.preload="auto";a.config.audio.src=a.config.diag.src;a.config.audio.load();a.config.isWaitingForPlay=false;clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(false)},100)}},play:function(){if(a.config.isFileSet){if(a.config.isWaitingForPlay){a.config.audio.src=a.config.diag.src;a.config.audio.load()}a.config.audio.play();b.trigger("jPlayer.setButtons",true);clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=
window.setInterval(function(){a.jPlayerController(false)},100);clearInterval(a.config.delayedCommandId)}},pause:function(){if(a.config.isFileSet){a.config.audio.pause();b.trigger("jPlayer.setButtons",false);clearInterval(a.config.delayedCommandId)}},stop:function(){if(a.config.isFileSet)try{b.trigger("jPlayer.pause");a.config.audio.currentTime=0;clearInterval(a.config.jPlayerControllerId);a.config.jPlayerControllerId=window.setInterval(function(){a.jPlayerController(true)},100)}catch(g){clearInterval(a.config.delayedCommandId);
a.config.delayedCommandId=window.setTimeout(function(){a.stop()},100)}},playHead:function(g,f){if(a.config.isFileSet)try{b.trigger("jPlayer.load");if(typeof a.config.audio.buffered=="object"&&a.config.audio.buffered.length>0)a.config.audio.currentTime=f*a.config.audio.buffered.end(a.config.audio.buffered.length-1)/100;else if(a.config.audio.duration>0&&!isNaN(a.config.audio.duration))a.config.audio.currentTime=f*a.config.audio.duration/100;else throw"e";b.trigger("jPlayer.play")}catch(j){b.trigger("jPlayer.play");
b.trigger("jPlayer.pause");a.config.delayedCommandId=window.setTimeout(function(){a.playHead(f)},100)}},playHeadTime:function(g,f){if(a.config.isFileSet)try{b.trigger("jPlayer.load");a.config.audio.currentTime=f/1E3;b.trigger("jPlayer.play")}catch(j){b.trigger("jPlayer.play");b.trigger("jPlayer.pause");a.config.delayedCommandId=window.setTimeout(function(){a.playHeadTime(f)},100)}},volume:function(g,f){a.config.volume=f;a.config.audio.volume=f/100;a.jPlayerVolume(f)}};this.config.usingFlash?c.extend(d,
e):c.extend(d,h);for(var i in d){e="jPlayer."+i;this.element.unbind(e);this.element.bind(e,d[i])}if(this.config.usingFlash)if(this._checkForFlash(8))if(c.browser.msie){i='<object id="'+this.config.fid+'"';i+=' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';i+=' codebase="'+document.URL.substring(0,document.URL.indexOf(":"))+'://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"';i+=' type="application/x-shockwave-flash"';i+=' width="'+this.config.width+'" height="'+this.config.height+
'">';i+="</object>";d=[];d[0]='<param name="movie" value="'+this.config.swf+'" />';d[1]='<param name="quality" value="high" />';d[2]='<param name="FlashVars" value="id='+escape(this.config.id)+"&fid="+escape(this.config.fid)+"&vol="+this.config.volume+'" />';d[3]='<param name="allowScriptAccess" value="always" />';d[4]='<param name="bgcolor" value="'+this.config.bgcolor+'" />';i=document.createElement(i);for(e=0;e<d.length;e++)i.appendChild(document.createElement(d[e]));this.element.html(i)}else{d=
'<embed name="'+this.config.fid+'" id="'+this.config.fid+'" src="'+this.config.swf+'"';d+=' width="'+this.config.width+'" height="'+this.config.height+'" bgcolor="'+this.config.bgcolor+'"';d+=' quality="high" FlashVars="id='+escape(this.config.id)+"&fid="+escape(this.config.fid)+"&vol="+this.config.volume+'"';d+=' allowScriptAccess="always"';d+=' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';this.element.html(d)}else this.element.html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
else{this.config.audio.autobuffer=this.config.autobuffer;this.config.audio.preload=this.config.preload;this.config.audio.addEventListener("canplay",function(){var g=0.1*Math.random();a.config.audio.volume=(a.config.volume+(a.config.volume<50?g:-g))/100},false);this.config.audio.addEventListener("ended",function(){clearInterval(a.config.jPlayerControllerId);a.jPlayerOnSoundComplete()},false);this.element.append(this.config.audio)}this.element.css({position:this.config.position,top:this.config.top,
left:this.config.left});if(this.config.graphicsFix){this.element.append('<div id="'+this.config.hid+'"></div>');c.extend(this.config,{hSel:c("#"+this.config.hid)});this.config.hSel.css({"text-indent":"-9999px"})}this.config.customCssIds||c.each(c.jPlayer._cssId,function(g,f){a.cssId(g,f)});if(!this.config.usingFlash){this.element.css({left:"-9999px"});window.setTimeout(function(){a.volume(a.config.volume);a.jPlayerReady()},100)}},jPlayerReady:function(a){if(this.config.usingFlash){this.config.swfVersion=
a;this.config.swfVersionRequired!=this.config.swfVersion&&this._error("jPlayer's JavaScript / SWF version mismatch!\n\nJavaScript requires SWF : "+this.config.swfVersionRequired+"\nThe Jplayer.swf used is : "+this.config.swfVersion)}else this.config.swfVersion="n/a";this.jPlayerReadyCustom()},jPlayerReadyCustom:function(){},setFile:function(a,b){this.element.trigger("jPlayer.setFile",[a,b])},clearFile:function(){this.element.trigger("jPlayer.clearFile")},load:function(){this.element.trigger("jPlayer.load")},
play:function(){this.element.trigger("jPlayer.play")},pause:function(){this.element.trigger("jPlayer.pause")},stop:function(){this.element.trigger("jPlayer.stop")},playHead:function(a){this.element.trigger("jPlayer.playHead",[a])},playHeadTime:function(a){this.element.trigger("jPlayer.playHeadTime",[a])},volume:function(a){a=this._limitValue(a,0,100);this.element.trigger("jPlayer.volume",[a])},cssId:function(a,b){var d=this;if(typeof b=="string")if(c.jPlayer._cssId[a]){this.config.cssId[a]!=undefined&&
this.config.cssSelector[a].unbind("click",this.config.clickHandler[a]);this.config.cssId[a]=b;this.config.cssSelector[a]=c("#"+b);this.config.clickHandler[a]=function(h){d[a](h);c(this).blur();return false};this.config.cssSelector[a].click(this.config.clickHandler[a]);var e=this.config.cssSelector[a].css("display");if(a=="play")this.config.cssDisplay.pause=e;if(!(a=="pause"&&e=="none")){this.config.cssDisplay[a]=e;a=="pause"&&this.config.cssSelector[a].css("display","none")}}else this._warning("Unknown/Illegal function in cssId\n\njPlayer('cssId', '"+
a+"', '"+b+"')");else this._warning("cssId CSS Id must be a string\n\njPlayer('cssId', '"+a+"', "+b+")")},loadBar:function(a){if(this.config.cssId.loadBar!=undefined){var b=this.config.cssSelector.loadBar.offset();a=a.pageX-b.left;b=this.config.cssSelector.loadBar.width();this.playHead(100*a/b)}},playBar:function(a){this.loadBar(a)},onProgressChange:function(a){if(c.isFunction(a))this.onProgressChangeCustom=a;else this._warning("onProgressChange parameter is not a function.")},onProgressChangeCustom:function(){},
jPlayerOnProgressChange:function(a,b,d,e,h){this.config.diag.loadPercent=a;this.config.diag.playedPercentRelative=b;this.config.diag.playedPercentAbsolute=d;this.config.diag.playedTime=e;this.config.diag.totalTime=h;this.config.cssId.loadBar!=undefined&&this.config.cssSelector.loadBar.width(a+"%");this.config.cssId.playBar!=undefined&&this.config.cssSelector.playBar.width(b+"%");this.onProgressChangeCustom(a,b,d,e,h);this._forceUpdate()},jPlayerController:function(a){var b=0,d=0,e=0,h=0,i=0;if(this.config.audio.readyState>=
1){b=this.config.audio.currentTime*1E3;d=this.config.audio.duration*1E3;d=isNaN(d)?0:d;e=d>0?100*b/d:0;if(typeof this.config.audio.buffered=="object"&&this.config.audio.buffered.length>0){h=100*this.config.audio.buffered.end(this.config.audio.buffered.length-1)/this.config.audio.duration;i=100*this.config.audio.currentTime/this.config.audio.buffered.end(this.config.audio.buffered.length-1)}else{h=100;i=e}}!this.config.diag.isPlaying&&h>=100&&clearInterval(this.config.jPlayerControllerId);a?this.jPlayerOnProgressChange(h,
0,0,0,d):this.jPlayerOnProgressChange(h,i,e,b,d)},volumeMin:function(){this.volume(0)},volumeMax:function(){this.volume(100)},volumeBar:function(a){if(this.config.cssId.volumeBar!=undefined){var b=this.config.cssSelector.volumeBar.offset();a=a.pageX-b.left;b=this.config.cssSelector.volumeBar.width();this.volume(100*a/b)}},volumeBarValue:function(a){this.volumeBar(a)},jPlayerVolume:function(a){if(this.config.cssId.volumeBarValue!=null){this.config.cssSelector.volumeBarValue.width(a+"%");this._forceUpdate()}},
onSoundComplete:function(a){if(c.isFunction(a))this.onSoundCompleteCustom=a;else this._warning("onSoundComplete parameter is not a function.")},onSoundCompleteCustom:function(){},jPlayerOnSoundComplete:function(){this.element.trigger("jPlayer.setButtons",false);this.onSoundCompleteCustom()},getData:function(a){for(var b=a.split("."),d=this.config,e=0;e<b.length;e++)if(d[b[e]]!=undefined)d=d[b[e]];else{this._warning("Undefined data requested.\n\njPlayer('getData', '"+a+"')");return}return d},_getMovie:function(){return document[this.config.fid]},
_checkForFlash:function(a){var b=false,d;if(window.ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+a);b=true}catch(e){}else if(navigator.plugins&&navigator.mimeTypes.length>0)if(d=navigator.plugins["Shockwave Flash"])if(navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1")>=a)b=true;return b},_forceUpdate:function(){this.config.graphicsFix&&this.config.hSel.text(""+Math.random())},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_flashError:function(a){this._error("Problem with Flash component.\n\nCheck the swfPath points at the Jplayer.swf path.\n\nswfPath = "+
this.config.swfPath+"\nurl: "+this.config.swf+"\n\nError: "+a.message)},_error:function(a){this.config.errorAlerts&&this._alert("Error!\n\n"+a)},_warning:function(a){this.config.warningAlerts&&this._alert("Warning!\n\n"+a)},_alert:function(a){alert("jPlayer "+this.config.version+" : id='"+this.config.id+"' : "+a)}}})(jQuery);

;// party.js
var Party={};Party.ToggleTab=function(n){n==null?($("#partycontainer").toggle(),$("#partyTab").toggleClass("tab_white19h"),$("#partyTab").toggleClass("tab_white19hselected")):n==!0?($("#partycontainer").show(),$("#partyTab").removeClass("tab_white19h"),$("#partyTab").addClass("tab_white19hselected")):n==!1&&($("#partycontainer").hide(),$("#partyTab").addClass("tab_white19h"),$("#partyTab").removeClass("tab_white19hselected"))},Party.SetActiveView=function(n){$(".partyWindow").hide(),$("#"+n).show(),Party.ActiveView=n},Party.CreateNew=function(){Party.ActiveView!="party_my"&&(Party.SetActiveView("party_my"),$("#chat_messages").html("")),$.getJSON("/chat/party.ashx",{reqtype:"create"},function(n){return n.Error?!1:(Party.ProcessPolledData(n),Party.FirstLoad=!0,Party.Refresh(),Party.PollForUpdates(),Party.ToggleTab(!0),!0)})},Party.DoInvite=function(n){Party.InviteUser(document.getElementById(n).value),document.getElementById(n).value=""},Party.GenerateReportUserURLHTML=function(n){var t="";return t="(<span style='text-decoration: none; color: Red; cursor: pointer' ",t+=" onclick=\"if (confirm('"+Party.Resources.areYouSureReport+n.UserName+"?' ) )",t+=" { window.location = '/abusereport/partychat.aspx?PartyGuid="+Party.ActiveParty.PartyGuid+"&UserID="+n.UserID+"' ;",t+=' return true; } else { return false; } ">'+Party.Resources.report+"</span>)"},Party.GenerateKickUserHTML=function(n){return"<div class='kickuser btn_red21h' id='party_kick_"+n+"' ><a href='#' onclick='Party.RemoveUser("+n+"); return false;'>"+Party.Resources.kick+"</a></div>"},Party.GetMemberListAsHtml=function(){for(var r="",f=$("#partyMemberTemplate").html(),u=Party.AmILeader(),n,i,t=0;t<Party.ActiveParty.Members.length;t++)n=f.replace(/UID/g,Party.ActiveParty.Members[t].UserID),(Party.ActiveParty.Members[t].IsOnline==!0||Party.ActiveParty.Members[t].IsOnline=="True")&&(n=n.replace("friend_dock_offlinestatus","friend_dock_onlinestatus")),n=n.replace("[PARTY_MEMBER_THUMBNAIL]","<img src='"+Party.ActiveParty.Members[t].Thumbnail+"' style='width:24px;height:24px'/>"),n=t==0?n.replace("[PARTY_MEMBER_NAME]","<strong>"+Party.ActiveParty.Members[t].UserName+"</strong>"):n.replace("[PARTY_MEMBER_NAME]",Party.ActiveParty.Members[t].UserName),n=u&&Party.ActiveParty.Members[t].UserID!=Party.CurrentUserID?n.replace("[PARTY_KICK_MEMBER]",Party.GenerateKickUserHTML(Party.ActiveParty.Members[t].UserID)):n.replace("[PARTY_KICK_MEMBER]",""),Party.ActiveParty.Members[t].Pending==!1?(i="",Party.ActiveParty.Members[t].UserID!=Party.CurrentUserID&&(i=Party.GenerateReportUserURLHTML(Party.ActiveParty.Members[t])),n=n.replace("[PARTY_MEMBER_REPORT]",i)):n=n.replace("[PARTY_MEMBER_REPORT]","<span style='color: grey'>"+Party.Resources.pending+"</span>"),r+=n+"";return r},Party.ProcessKey=function(n,t){return(t==null&&(t=window.event),t.keyCode==13)?(Party.DoInvite(n),!1):!0},Party.Refresh=function(){var n,i,r,e,u,t,f;if(Party.ActiveParty.PartyGuid)if(Party.ActiveParty.Members.length>1){for(n=0;n<Party.ActiveParty.Members.length;n++)if(Party.ActiveParty.Members[n].UserID==Party.CurrentUserID){if(Party.ActiveParty.Members[n].Pending==!0&&Party.ActiveView!="party_pending")r=Party.GetMemberListAsHtml(),$("#party_invite_list").html(r),Party.SetActiveView("party_pending"),$("#invite_header").html($("#invite_header").html().replace("RobloTim",Party.ActiveParty.CreatorName)),Party.ToggleTab(!0),i=document.title,document.title=Party.Resources.partyInvite,document.getElementById("party_pending_title").className="title title_flash",setTimeout('document.title = "'+i+"\"; document.getElementById('party_pending_title').className = 'title';",500),setTimeout('document.title = "'+Party.Resources.partyInvite+"\"; document.getElementById('party_pending_title').className = 'title title_flash';",1e3),setTimeout('document.title = "'+i+"\"; document.getElementById('party_pending_title').className = 'title';",1500),setTimeout('document.title = "'+Party.Resources.partyInvite+"\"; document.getElementById('party_pending_title').className = 'title title_flash';",2e3),setTimeout('document.title = "'+i+"\"; document.getElementById('party_pending_title').className = 'title';",2500),setTimeout('document.title = "'+Party.Resources.partyInvite+"\"; document.getElementById('party_pending_title').className = 'title title_flash';",3e3),setTimeout('document.title = "'+i+"\"; document.getElementById('party_pending_title').className = 'title';",3500);else if(Party.ActiveParty.Members[n].Pending==!1){if(r=Party.GetMemberListAsHtml(),$("#party_member_list").html(r),Party.ActiveView!="party_my"&&(Party.SetActiveView("party_my"),$("#chat_messages").html("")),Party.ActiveParty.Members[n].HasUpdates||Party.FirstLoad==!0){for(Party.FirstLoad=!1,e="",u=Party.ActiveParty.Conversation,t=0;t<u.length;t++)e+="<b><span style='color: #0066CC'>"+u[t].SenderUserName+"</span></b>: "+u[t].Message+"<br /><br />";f=$("#chat_messages"),$(f).html(""),$(f).append(e),typeof ChatBar.PlaySound=="function"&&ChatBar.PlaySound("msgrec"),window.setTimeout(function(){$("#chat_messages").prop({scrollTop:$("#chat_messages").prop("scrollHeight")})},300)}Party.CurrentUserID!=Party.ActiveParty.CreatorID&&$("#party_invite_instructions").hide(),Party.PlayEnabled&&Party.CurrentUserID!=Party.ActiveParty.CreatorID?$("#party-auto-follow-setting").show():$("#party-auto-follow-setting").hide(),Party.PlayEnabled!=!0?($("#party_game_thumb").html(""),$("#party_game_name").html(""),$("#party_game_follow_me").hide()):Party.ActiveParty.PartyGameAsset!=null?(Party.ActiveParty.PartyGameThumbnail==null||Party.ActiveParty.PartyGameThumbnail.IsFinal==!1?$("#party_game_thumb").html("<a href='/Item.aspx?id="+Party.ActiveParty.PartyGameAsset.ID+"'><img src='/images/empty.png' width='75' height='75' alt='"+Party.ActiveParty.PartyGameAsset.Name.escapeHTML()+"' /></a>"):$("#party_game_thumb").html("<a href='/Item.aspx?id="+Party.ActiveParty.PartyGameAsset.ID+"'><img src='"+Party.ActiveParty.PartyGameThumbnail.Url+"' alt='"+Party.ActiveParty.PartyGameAsset.Name.escapeHTML()+"' /></a>"),$("#party_game_name").html(Party.ActiveParty.PartyGameAsset.Name),$("#party_game_follow_me").show(),Party.ToggleTab(!0),$("#party_game_follow_me").className=Party.ActiveParty.PartyLeaderIsInGame==!1||Party.ActiveParty.PartyLeaderIsInGame=="False"?"followme_gray19h":"followme_green19h"):($("#party_game_thumb").html(""),$("#party_game_name").html(""),$("#party_game_follow_me").hide())}break}}else Party.SetActiveView("party_none"),Party.RemoveUser(Party.CurrentUserID);else Party.SetActiveView("party_none")},Party.PollForUpdates=function(){Party.PollThreadAvailable&&Party.ActiveParty.PartyGuid&&(Party.PollThreadAvailable=!1,$.getJSON("/chat/party.ashx",{reqtype:"get"},function(n){Party.ProcessPolledData(n),Party.PollThreadAvailable=!0,Party.Refresh()}))},Party.SendMessage=function(n){if(n!=""){var t=n.escapeHTML();$("#chat_messages").append("<b><span style='color: #0066CC'>"+Party.CurrentUserName+"</span></b>: "+t+"<br /><br />"),$("#chat_messages").prop({scrollTop:$("#chat_messages").prop("scrollHeight")}),$("#comments").val(""),$.ajax({url:"/chat/send.ashx?partyGuid="+Party.ActiveParty.PartyGuid,type:"POST",data:"message="+encodeURIComponent(n),success:function(n){n.Error!=""&&alert(n.Error)}})}},Party.RemoveUser=function(n){$("#party_kick_"+n).html("<img src='/images/spinners/waiting.gif' />"),$.getJSON("/chat/party.ashx",{reqtype:"removeUser",userid:n},function(t){t.Error!=""?alert(t.Error):($("#party_kick_"+n).remove(),$("#party_pendinguserid_"+n).remove(),Party.PollForUpdates())})},Party.InviteUser=function(n){n=n.replace(/^\s+|\s+$/g,""),n==null||n==""?alert(Party.Resources.inviteInstructions):Party.ActiveParty==null||typeof Party.ActiveParty.Members=="undefined"?(Party.SetActiveView("party_loading"),$.getJSON("/chat/party.ashx",{reqtype:"createAndInvite",userName:n},function(n){if(n.Error)return alert(n.Error),Party.PollForUpdates(),Party.SetActiveView("party_none"),!0;Party.ProcessPolledData(n),Party.SetActiveView("party_my"),Party.FirstLoad=!0,Party.Refresh(),Party.PollForUpdates(),Party.ToggleTab(!0)})):(typeof Party.ActiveParty.Error=="undefined"||Party.ActiveParty.Error=="")&&(Party.ActiveParty.Members.length>=Party.MaxPartySize?alert(Party.Resources.partyFull):$.getJSON("/chat/party.ashx",{reqtype:"inviteUser",userName:n},function(n){n.Error&&alert(n.Error),Party.PollForUpdates()}))},Party.AcceptInvite=function(){$.getJSON("/chat/party.ashx",{reqtype:"acceptInvite"},function(n){n.Error&&alert(n.Error),Party.FirstLoad=!0,Party.ProcessPolledData(n),Party.Refresh()})},Party.DeclineInvite=function(){Party.SetActiveView("party_none"),$.getJSON("/chat/party.ashx",{reqtype:"removeUser",userID:Party.CurrentUserID},function(n){Party.ProcessPolledData(n),Party.Refresh()})},Party.AmILeader=function(){return Party.ActiveParty&&Party.CurrentUserID==Party.ActiveParty.CreatorID},Party.ProcessPolledData=function(n){var i,r,t,u;if(n!=null){if(Party.ActiveParty=n,Party.ActiveParty.Members)for(i=0;i<Party.ActiveParty.Members.length;i++)Party.ActiveParty.Members[i].UserID==Party.CurrentUserID&&(r=Party.ActiveParty.Members[i]);Party.AmILeader()||Party.ActiveParty.PartyGuid==null||Party.ActiveParty.PartyGameAsset==null||r==null||r.Pending?(typeof Party.ActiveParty.Members=="undefined"||Party.ActiveParty.Members.length<=1)&&Party.SetActiveView("party_none"):(t=Party.Cookie.GetObj(),t.AcknowledgedGameGuid&&t.AcknowledgedGameGuid==Party.ActiveParty.GameGuid||(u=Party.ActiveParty.PartyGameAsset.Name,(r.AutoFollowPartyLeader||confirm(Party.Resources.joinConfirm1+u+Party.Resources.joinConfirm2+"\n\n"+Party.Resources.joinConfirm3))&&Party.JoinGameWithParty(),t.AcknowledgedGameGuid=Party.ActiveParty.GameGuid,Party.Cookie.SetObj(t)))}},Party.JoinGameWithParty=function(){var n=Party.ActiveParty.PartyGameAsset.ID,i,t;play_placeId=n,i=Party.ActiveParty.PartyGuid,t=Party.ActiveParty.GameGuid,RobloxLaunch._GoogleAnalyticsCallback=function(){GoogleAnalyticsEvents.FireEvent("Play","User"),RobloxEventManager.triggerEvent("rbx_evt_play_user",{placeId:n})},Roblox.Client.WaitForRoblox(function(){RobloxLaunch.RequestPlayWithParty("PlaceLauncherStatusPanel",n,i,t)})},Party.OnPageLoad=function(){$(".closeparty").click(function(){Party.ToggleTab(null)}),$("#comments").live("keydown",function(n){return n.keyCode==13?(Party.SendMessage($("#comments").val()),!1):!0}),$("#party_my .main").css("max-height",$(window).height()-150),$(".party_invite_box").css("color","#888"),$(".party_invite_box").val("Enter username"),$(".party_invite_box").focus(function(){$(this).css("color","#000"),this.value==Party.Resources.enterUserName?this.value="":this.select()}),$(".party_invite_box").blur(function(){$.trim(this.value)==""&&($(this).css("color","#888"),this.value=Party.Resources.enterUserName)}),Party.Refresh(),Party.PollIntervalTimer=setInterval(function(){Party.PollForUpdates()},3e3)};
