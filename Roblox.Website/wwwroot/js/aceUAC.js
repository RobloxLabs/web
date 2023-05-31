(function() {
 if (window["ACE3_AdRequest"]) {
  return;
 }
 var ACE3RTBglobalThrottle = 33;
 var ComScoreGlobalThrottle = 100;
 var ACE3Host1 = "http://beta.ace.advertising.com";
 var ACE3Default = "http://r1.ace";
 var ACE3Host1Var = "as=0";
 var ACE3DefaultHostVar = "as=1";
 var ACE3NewHost = {};

 ACE3NewHost['861853']=100
 ACE3NewHost['861888']=100
 ACE3NewHost['858567']=100
 ACE3NewHost['858581']=100
 ACE3NewHost['895573']=100
 ACE3NewHost['810819']=100
 ACE3NewHost['861851']=100
 ACE3NewHost['861843']=100
 ACE3NewHost['820747']=100
 ACE3NewHost['851479']=100

 var REGIONS = {
  DEFAULT: 0,
  USA: 1,
  EU: 2,
  JAPAN: 3,
  CHINA: 4
 };
 var balancer = function() {
  var defaultRegionHosts = {};
  defaultRegionHosts[REGIONS.USA] = "http://r1.ace";
  defaultRegionHosts[REGIONS.EU] = "http://r2.ace";
  defaultRegionHosts[REGIONS.JAPAN] = "http://sr-r3.ace";
  defaultRegionHosts[REGIONS.CHINA] = "http://sr-r3.ace";
  defaultRegionHosts[REGIONS.DEFAULT] = ACE3Default;
  var alternateRegionHosts = {};
  alternateRegionHosts[REGIONS.EU] = "http://r2.ace";
  alternateRegionHosts[REGIONS.CHINA] = "http://sr-r3.ace";
  alternateRegionHosts[REGIONS.JAPAN] = "http://sr-r3.ace";
  alternateRegionHosts[REGIONS.DEFAULT] = ACE3Default;
  var b = [ {
   percent: 100,
   mapping: defaultRegionHosts
  }, {
   percent: 0,
   mapping: alternateRegionHosts
  } ];
  return b;
 }();
 var ACE3PopHost = "http://p.ace.advertising.com";
 var ACE3SecureUserMatchingHost = "https://secure.leadback.advertising.com";
 var ACE3UserMatchingHost = "http://cmap.uac.ace.advertising.com";
 var ACE3_ASYNC_FIF_TIMEOUT = 2500;
 var ACE3_ASYNC_FIF_POLL_INTERVAL = 30;
 var ACE3_UAC_CDN_ORIGIN = "http://uac.advertising.com";
 var ACE3_UAC_CDN_ORIGIN_SECURE = "https://secure.uac.advertising.com";
 var adsComPopVar = "";
 var adComPopFo = "1";
 var adComDelayValue = "";
 var ACE3AllowExp;
 var ACE3AV = parseInt(window.navigator.appVersion, 10);
 var ACE3IE = window.navigator.appName === "Microsoft Internet Explorer";
 var ACE3NS = window.navigator.appName === "Netscape";
 var ACE3OP = window.navigator.appName === "Opera";
 var ACE3FVer = "0";
 var trimDoubleEscapedString = function(s, length) {
  if (s.length > length) {
   s = s.substr(0, length);
   if (s.substr(s.length - 4).indexOf("%") !== -1) {
    s = s.substr(0, s.lastIndexOf("%"));
   } else if (s.substr(s.length - 7).indexOf("%25u") !== -1) {
    s = s.substr(0, s.lastIndexOf("%25u"));
   }
  }
  return s;
 };
 var ACE3CkLen = function(url, dref) {
  return url.length < 2076 ? trimDoubleEscapedString(dref, 2076 - url.length) : "";
 };
 var appendHiddenIFrame = function(url) {
  var hif = document.createElement("iframe");
  hif.src = url;
  hif.width = 0;
  hif.height = 0;
  hif.style.width = "0px";
  hif.style.height = "0px";
  hif.style.display = "none";
  document.body.appendChild(hif);
  return hif;
 };
 var addEvent = function(eventName, handler) {
  var standardsCompliant = !!window.addEventListener;
  window[standardsCompliant ? "addEventListener" : "attachEvent"]((standardsCompliant ? "" : "on") + eventName, handler, false);
 };
 var removeEvent = function(eventName, handler) {
  var standardsCompliant = !!window.removeEventListener;
  window[standardsCompliant ? "removeEventListener" : "detachEvent"]((standardsCompliant ? "" : "on") + eventName, handler, false);
 };
 var objectToHash = function(obj) {
  var hash = "#", i;
  for (i in obj) {
   if (obj.hasOwnProperty(i)) {
    hash += i + "=" + encodeURIComponent(obj[i]) + "&";
   }
  }
  return hash;
 };
 var checkBoolean = function(obj) {
  return obj && (true == obj || /true/i.test(obj) || /^y(es)?$/i.test(obj)) ? true : false;
 };
 var getAdDimensionsFromOptions = function(options) {
  var w, h, sz;
  if (options["size"]) {
   sz = options["size"];
   var str = sz.toString();
   w = str.substr(0, 3);
   h = str.substr(3, 6);
   if (str.length == 7) {
    w = str.substr(0, 3);
    h = str.substr(3, 7);
   }
   if (str.length > 7) {
    w = str.substr(0, str.length / 2);
    h = str.substr(str.length / 2, str.length);
   }
  } else if (options["width"] && options["height"]) {
   w = options["width"].toString();
   h = options["height"].toString();
  } else {
   w = "468";
   h = "060";
  }
  return {
   width: w,
   height: h
  };
 };
 var appendStaticIframe = function(options) {
  options.async_fif = 0;
  var fif = document.createElement("iframe");
  fif.src = (document.location.protocol === "https:" ? ACE3_UAC_CDN_ORIGIN_SECURE : ACE3_UAC_CDN_ORIGIN) + "/wrapper/aceUAC.htm" + objectToHash(options);
  var adDimensions = getAdDimensionsFromOptions(options);
  fif.width = adDimensions.width;
  fif.height = adDimensions.height;
  fif.setAttribute("scrolling", "no");
  fif.setAttribute("FRAMEBORDER", "0");
  fif.setAttribute("MARGINHEIGHT", "0");
  fif.setAttribute("MARGINWIDTH", "0");
  document.body.appendChild(fif);
 };
 var extractOriginFromUrl = function(url) {
  var end = url.indexOf("/", url.indexOf("//") + 2);
  return url.substr(0, end === -1 ? url.length : end);
 };
 var getLowerCaseAR = function(optsIn) {
  var optsOut, p, lcn;
  if (optsIn) {
   optsOut = {};
   for (p in optsIn) {
    if (Object.prototype.hasOwnProperty.call(optsIn, p)) {
     lcn = p.toLowerCase();
     if (lcn !== "class") {
      optsOut[lcn] = optsIn[p];
     } else {
      optsOut["Class"] = optsIn[p];
     }
    }
   }
  }
  return optsOut;
 };
 var ACE3CkPlg = function() {
  var n = window.navigator;
  var ua = n.userAgent.toLowerCase();
  ACE3FVer = 0;
  if (ACE3IE && ua.indexOf("win") !== -1) {
   try {
    try {
     var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
     try {
      axo.AllowScriptAccess = "always";
     } catch (e3) {
      ACE3FVer = 6;
     }
    } catch (ignore) {}
    ACE3FVer = (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].split(",").shift();
   } catch (e) {
    ACE3FVer = 0;
   }
  } else {
   var p = n.plugins;
   if (p) {
    var l = p.length;
    if (l > 1) {
     var m = n.mimeTypes;
     var fl = m["application/x-shockwave-flash"];
     if (m && fl && fl.enabledPlugin && fl.suffixes.indexOf("swf") !== -1) {
      var ds;
      var f = "Flash ";
      var fS, i, v;
      for (i = 0; i < l; i += 1) {
       ds = p[i].description;
       fS = ds.indexOf(f);
       if (fS !== -1) {
        v = ds.substring(fS + 6, fS + 7);
        if (v >= 6) {
         ACE3FVer = v;
        } else {
         v = ds.substring(fS + 6, fS + 8);
         if (v >= 10) {
          ACE3FVer = v;
         }
        }
       }
      }
     }
    }
   }
  }
 };
 var getApifw = function() {
  var apifw = "";
  if (window["mraid"]) {
   var version = mraid.getVersion();
   var majorIndex = version.indexOf(".");
   if (majorIndex > 0) {
    var majorVersion = version.substring(0, majorIndex);
    if (majorVersion == "1") {
     apifw += "3,";
    } else if (majorVersion == "2") {
     apifw += "5,";
    }
   }
  }
  if (window["ormma"]) {
   apifw += "4,";
  }
  return apifw.length > 0 ? apifw.substring(0, apifw.length - 1) : "";
 };
 var getValueByRegion = function(mapping, regionObj) {
  var hr;
  if (regionObj.region) {
   hr = mapping[regionObj.region];
  }
  if (!hr) {
   hr = mapping[REGIONS.DEFAULT];
  }
  return hr;
 };
 var ACE3getCk = function(nm) {
  var b = document.cookie.indexOf(nm + "=");
  var cookieVal = "";
  if (b !== -1) {
   var l = b + nm.length + 1, e = document.cookie.indexOf(";", l);
   if (e === -1) {
    e = document.cookie.length;
   }
   cookieVal = unescape(document.cookie.substring(l, e));
  }
  return cookieVal;
 };
 var ACE3setCk = function(nm, v, dt) {
  document.cookie = nm + "=" + escape(v) + (dt ? "" : "; expires=" + dt) + "; path=/;";
 };
 var postMessageFifPing = function(fifFrame, options, timeout) {
  var success = function(origin) {
   fifFrame.contentWindow.postMessage(objectToHash(options), origin);
  };
  var fail = function() {
   appendStaticIframe(options);
  };
  var fifResponded = false;
  var fifPingListener = function(e) {
   if (!fifResponded) {
    if (!e) {
     removeEvent("message", fifPingListener);
     fail();
    } else if (e.source === fifFrame.contentWindow) {
     if (e.data === "fifgood") {
      success(e.origin);
     } else {
      fail();
     }
     fifResponded = true;
    }
   }
  };
  addEvent("message", fifPingListener);
  setTimeout(function() {
   setTimeout(fifPingListener, timeout);
  }, 1);
 };
 var hashPollFifPing = function(fifFrame, options, timeout, interval) {
  var success = function() {
   fifFrame.contentWindow.location.replace(fifFrame.getAttribute("src") + objectToHash(options));
  };
  var fail = function() {
   appendStaticIframe(options);
  };
  var t = 0;
  var fifPoll = function() {
   var diff = t === 0 ? 0 : (new Date).getTime() - t;
   if (location.hash.match(/#fifgood/ig)) {
    success();
   } else if (location.hash.match(/#crossdomain/ig)) {
    fail();
   } else {
    if (diff > timeout) {
     fail();
    } else {
     setTimeout(fifPoll, interval);
    }
   }
  };
  setTimeout(function() {
   t = (new Date).getTime();
   setTimeout(fifPoll, interval);
  }, 1);
 };
 var fifPing = function(fifFrame, options, timeout, interval) {
  if (window.postMessage && !ACE3IE) {
   postMessageFifPing(fifFrame, options, timeout, interval);
  } else {
   hashPollFifPing(fifFrame, options, timeout, interval);
  }
 };
 var getTopOrigin = function(success, fail, timeout) {
  var resolved = false;
  var originListener = function(e) {
   if (!resolved) {
    if (!e) {
     resolved = true;
     fail();
    } else if (e.source === window.top) {
     resolved = true;
     success(e.origin);
    }
    if (resolved) {
     removeEvent("message", originListener);
    }
   }
  };
  addEvent("message", originListener);
  window.top.postMessage("topOrigin", "*");
  setTimeout(function() {
   setTimeout(originListener, timeout);
  }, 1);
 };
 var ACErtbCheck = function(site, region) {
  if (!document.getElementById("ACE3RTBPingFile") && Math.floor(Math.random() * 100) + 1 <= ACE3RTBglobalThrottle) {
   var rcode = "&rCode=1";
   region = parseInt(region, 10);
   if (region == 2 || region == 3 || region == 4) {
    rcode = "&rCode=" + region;
   }
   var rtbPing = document.createElement("iframe");
   rtbPing.id = "ACE3RTBPingFile";
   rtbPing.name = "ACE3RTBPingFile";
   rtbPing.width = 0;
   rtbPing.height = 0;
   rtbPing.style.width = "0px";
   rtbPing.style.height = "0px";
   rtbPing.style.display = "none";
   rtbPing.src = (document.location.protocol === "https:" ? ACE3SecureUserMatchingHost : ACE3UserMatchingHost) + "/um.ashx?site=" + site + rcode;
   document.body.appendChild(rtbPing);
  }
 };
 var ComScorePixelCheck = function(site) {
  if (!document.getElementById("ComScorePingFile") && Math.floor(Math.random() * 100) + 1 <= ComScoreGlobalThrottle) {
   var comScorePing = document.createElement("iframe");
   comScorePing.id = "ComScorePingFile";
   comScorePing.name = "ComScorePingFile";
   comScorePing.src = "";
   if (document.location.protocol === "https:") {
    comScorePing.src = "https://secure.leadback.advertising.com/cs.ashx?site=" + site;
   } else {
    comScorePing.src = "http://leadback.advertising.com/cs.ashx?site=" + site;
   }
   comScorePing.width = 0;
   comScorePing.height = 0;
   comScorePing.style.width = "0px";
   comScorePing.style.height = "0px";
   comScorePing.style.display = "none";
   document.body.appendChild(comScorePing);
  }
 };
 var AcePop = window["AcePop"] = function(m, w, h, f) {
  var popwin, p = 1;
  if (!f) {
   f = adComPopFo;
  }
  if (adComDelayValue) {
   adsComPopVar = m + "|" + w + "|" + h + "|" + f;
   setTimeout(AcePop, adComDelayValue * 1e3);
   adComDelayValue = "";
   p = 0;
  } else {
   if (!m && adsComPopVar) {
    var n = adsComPopVar.split("|");
    popwin = window.open(n[0], "win", "width=" + n[1] + ",height=" + n[2] + ",status=0,location=0");
    f = n[3];
   } else if (m && adsComPopVar) {
    adsComPopVar = m + "|" + w + "|" + h + "|" + f;
    p = 0;
   } else if (m) {
    popwin = window.open(m, "win", "width=" + w + ",height=" + h + ",status=0,location=0");
   }
   if (p) {
    if (f != "0") {
     window.focus();
     popwin.blur();
    } else {
     popwin.focus();
     window.blur();
    }
   }
  }
 };
 var doUserMatchingCalls = function(exchmap, csonly, site, region) {
  var isCsOnly = checkBoolean(csonly);
  if (exchmap != "0" || isCsOnly) {
   if (window.addEventListener) {
    window.addEventListener("load", function() {
     if (!isCsOnly) {
      ACErtbCheck(site, region);
     }
     ComScorePixelCheck(site);
    }, false);
   } else if (window.attachEvent) {
    window.attachEvent("onload", function() {
     if (!isCsOnly) {
      ACErtbCheck(site, region);
     }
     ComScorePixelCheck(site);
    });
   }
  }
 };
 window["ACE3_AdRequest"] = function(obj) {
  obj = getLowerCaseAR(obj);
  var site = "";
  if (obj["site"]) {
   site = obj["site"];
  } else {
   site = "100";
  }
  var nmVal = {
   media: "mnum",
   leadback: "betr",
   context: "ctxt",
   ip: "dmip",
   mid: "xsmemid",
   z: "zpcd",
   mn: "mn",
   zid: "zid",
   adsreqtype: "adsreqtype",
   campid: "campid"
  };
  var ur = "", ifV = 0, dr, dr1 = "", ht = "", ct, dw, dynclick = "", rclk = "", i;
  var kvismob = window.onorientationchange !== undefined ? "1" : "2";
  if (/mobile|android|iphone|ipad|playbook|hp-tablet|kindle|silk|webos|blackberry|opera mini/i.test(window.navigator.appVersion)) {
   kvismob = "1";
  }
  ct = obj["calltype"] ? obj["calltype"].toString().toUpperCase() : "J";
  try {
   ur = escape(window.top.location.href);
   if (ur == "undefined") {
    ur = escape(document.referrer);
    ifV = 2;
   } else if (window.top !== window.self) {
    ifV = 1;
   }
  } catch (e) {
   ur = escape(document.referrer);
   ifV = 2;
  }
  if (ct == "IFRAME" || ct == "IF") {
   ifV = 2;
  }
  var se = -1;
  try {
   se = window.location.protocol == "https:" ? 1 : -1;
  } catch (ignore) {}
  var ex = "";
  if (obj["extra"]) {
   ex = obj["extra"];
   ex = ex.charAt(0) == "/" ? ex : "/" + ex;
  }
  ACE3AllowExp = obj["allowexp"] == "0" || ex.indexOf("/aolexp=0") >= 0 ? 0 : obj["allowexp"] == "1" || ex.indexOf("/aolexp=1") >= 0 ? 2 : 1;
  ex = ex.replace(/(^|\/)aolexp=[01]/g, "");
  var ot = "";
  var n;
  for (n in nmVal) {
   if (nmVal.hasOwnProperty(n)) {
    if (obj[n] && typeof obj[n] != "function") {
     if (nmVal[n] == "mn") {
      ot += "/xsxdata=1:" + obj[n];
     } else {
      ot += "/" + nmVal[n] + "=" + obj[n];
     }
    }
   }
  }
  if (ct === "J" && ifV > 0 && checkBoolean(obj["async_fif"]) && kvismob === "2" && ACE3AllowExp == 1) {
   if ((ifV === 1 && window.parent !== window.top || ifV === 2) && obj["async_fif_url"]) {
    if (se === 1 && window["ACE_SHOST"]) {
     obj["ACE_SHOST"] = window["ACE_SHOST"];
    } else if (se === -1 && window["ACE_HOST"]) {
     obj["ACE_HOST"] = window["ACE_HOST"];
    }
    if (window["ACE_LOGIGNORED"]) {
     obj["ACE_LOGIGNORED"] = window["ACE_LOGIGNORED"];
    }
    if (window["ACE_DREF"]) {
     obj["ACE_DREF"] = window["ACE_DREF"];
    }
    var fif_url = obj["async_fif_url"];
    var timeout = obj["async_fif_timeout"] ? 1 * obj["async_fif_timeout"] : ACE3_ASYNC_FIF_TIMEOUT;
    var doFifPing = function(url) {
     var childFif = appendHiddenIFrame(url + "#" + encodeURIComponent(window.location.href));
     fifPing(childFif, obj, timeout, ACE3_ASYNC_FIF_POLL_INTERVAL);
    };
    if (fif_url.indexOf("http") === 0) {
     doFifPing(fif_url);
    } else {
     if (ifV === 1) {
      doFifPing(extractOriginFromUrl(window.top.location.href) + fif_url);
     } else {
      var cur = window;
      try {
       while (cur.parent !== window.top) {
        void cur.parent.document.referrer;
        cur = cur.parent;
       }
      } catch (ignore) {}
      if (cur.parent === window.top && cur.document.referrer) {
       doFifPing(extractOriginFromUrl(cur.document.referrer) + fif_url);
      } else if (window.postMessage) {
       getTopOrigin(function(origin) {
        doFifPing(origin + fif_url);
       }, function() {
        appendStaticIframe(obj);
       }, timeout);
      }
     }
    }
    return;
   }
  }
  if ((ACE3AllowExp == 1 || ACE3AllowExp == 2) && ifV === 1 && window.top === window.parent) {
   ACE3AllowExp = 1;
   window["inDapIF"] = true;
   window["inFIF"] = true;
  } else if (ACE3AllowExp == 2 || ACE3AllowExp == 1 && ifV == 0) {
   ACE3AllowExp = 1;
  } else {
   ACE3AllowExp = 0;
  }
  if (window["ACE_DREF"]) {
   dr1 = window["ACE_DREF"];
  } else if (obj["anonymous"] != "1") {
   dr1 = ur;
  }
  dr = "/dref=" + escape(dr1.replace(/\//g, "%2F"));
  if (dr.indexOf(dr.length) == "%" || dr.indexOf(dr.length - 1) == "%") {
   dr = dr.substr(0, dr.lastIndexOf("%"));
  }
  if (obj["dynclick"]) {
   dynclick = escape(escape(obj["dynclick"]).replace(/\//g, "%2F"));
  }
  if (obj["rclk"]) {
   rclk = escape(escape(obj["rclk"]).replace(/\//g, "%2F"));
  }
  if (window["ACE_KeyParms"]) {
   window["ACE_KeyParm"] = window["ACE_KeyParms"][site];
  }
  if (window["ACE_KeyParm"]) {
   for (i = 0; i < window["ACE_KeyParm"].length; i = i + 2) {
    if (ur.toUpperCase().match(window["ACE_KeyParm"][i].toUpperCase()) != null) {
     site = window["ACE_KeyParm"][i + 1];
     break;
    }
   }
  }
  var old = 1, adv = ".advertising.com", alt = "Click to learn more...", gl = "", bnum, szs = "", parm = "";
  if ((ACE3NS || ACE3IE || ACE3OP) && ACE3AV >= 4 && !(ACE3NS && ACE3AV == 4)) {
   old = 0;
  }
  if (obj["ud"]) {
   var zip = obj["ud"].split("&");
   var zipV;
   for (i = 0; i < zip.length; i += 1) {
    if (zip[i].toString().indexOf("zp=") != -1) {
     zipV = zip[i].split("=");
     zipV = zipV[1];
     ot += "/zpcd=" + zipV;
     break;
    }
   }
  }
  if (window["ACE_LOGIGNORED"] == 1) {
   ot += "/logignored=1";
  }
  if (obj["alttext"]) {
   alt = obj["alttext"];
  }
  if (window["ACE_HOST"] && se < 0) {
   ht = window["ACE_HOST"];
   gl = 1;
  }
  if (window["ACE_SHOST"] && se > -1) {
   ht = window["ACE_SHOST"];
   gl = 1;
  }
  if (site == "712441") {
   ht = "http://ags.beta" + adv;
   gl = 1;
   obj["calltype"] = "IFRAME";
  }
  var pt = obj["poptype"];
  var pu = obj["poponunload"];
  if (gl != 1) {
   if (pt || pu) {
    ht = ACE3PopHost;
    gl = 1;
   }
   if (se > -1) {
    ht = "https://secure.ace" + adv;
    gl = 1;
   }
   if (obj["host"]) {
    var v = obj["host"];
    ht = v.indexOf("http") == -1 ? "http://" + v : v;
    gl = 1;
   }
  }
  if (gl != 1) {
   var rand = Math.floor(Math.random() * 100) + 1;
   if (ACE3NewHost && ACE3NewHost[site] != null) {
    if (rand <= ACE3NewHost[site]) {
     if (ACE3Host1Var) {
      parm = "/" + ACE3Host1Var;
     }
     ht = ACE3Host1;
    } else {
     if (ACE3DefaultHostVar) {
      parm = "/" + ACE3DefaultHostVar;
     }
     ht = ACE3Default;
    }
   } else {
    var randTotal = 0;
    var percentobj;
    for (percentobj in balancer) {
     if (balancer.hasOwnProperty(percentobj)) {
      if (rand <= balancer[percentobj].percent + randTotal) {
       ht = getValueByRegion(balancer[percentobj].mapping, obj) + adv;
       break;
      }
      randTotal += balancer[percentobj].percent;
     }
    }
   }
  }
  if (!ht) {
   ht = ACE3Default + adv;
  }
  bnum = obj["bnum"] || parseInt(Math.floor(99999999 * Math.random()) + 1, 10);
  var adDimensions = getAdDimensionsFromOptions(obj);
  var w = adDimensions.width.toString();
  var h = adDimensions.height.toString();
  var sz = obj["size"] || adDimensions.width + adDimensions.height;
  if (!obj["size"] && !(obj["width"] && obj["height"])) {
   obj["media"] = "316574";
  }
  if (!obj["media"]) {
   szs = "/size=" + sz;
  }
  if (obj["adtype"]) {
   var at = obj["adtype"].toString().toUpperCase();
   if (at == "I" || obj["at"] == "IMAGE") {
    ot += "/rich=0";
   }
  }
  var hl = window.history.length;
  if (hl > 50) {
   hl = 50;
  }
  var sr = "/scres=";
  var sw = window.screen.width;
  var sh = window.screen.height;
  if (sw == 640 && sh == 480) {
   sr += "2";
  } else if (sw == 800 && sh == 600) {
   sr += "3";
  } else if (sw == "1024" && sh == "768") {
   sr += "4";
  } else if (sw > 1024 && sh > 768) {
   sr += "5";
  } else {
   sr += "1";
  }
  var sr1 = "/swh=" + sw + "x" + sh;
  var pNo = "1";
  var pf = obj["popfreq"];
  if (pf) {
   i = pf.indexOf(",");
   n = pf.substring(0, i);
   var hrs = pf.substring(i + 1, pf.length);
   n = parseInt(n, 10);
   var cn = "AdComPop" + obj["site"];
   var ck = ACE3getCk(cn);
   if (hrs == 0) {
    if (!ck || ck == "") {
     ck = 0;
    }
    if (ck < n) {
     ACE3setCk(cn, parseFloat(ck) + 1);
    } else {
     pNo = "";
    }
   } else {
    if (!ck || ck == "") {
     var ED = new Date;
     ED.setTime(ED.getTime() + hrs * 36e5);
     ACE3setCk(cn, "1|" + ED.toGMTString(), ED.toGMTString());
    } else {
     var ck1 = ck.split("|");
     if (ck1[0] < n) {
      ACE3setCk(cn, parseFloat(ck1[0]) + 1 + "|" + ck1[1], ck1[1]);
     } else {
      pNo = "";
     }
    }
   }
  }
  window["ACE3Tile"] = window["ACE3Tile"] ? window["ACE3Tile"] + 1 : 1;
  var hd = new Date, hr = hd.getHours(), day = hd.getDay(), opV = 1, bu = "", s1;
  ot += "/wkhr=" + (day * 24 + hr) + "/hr=" + hr + "/hl=" + hl + sr + sr1 + "/tile=" + window["ACE3Tile"] + "/f=" + ifV + parm;
  var r = obj.hasOwnProperty("region") ? parseInt(obj["region"], 10) : 0;
  if (r != 2 && r != 3 && r != 4) {
   r = 1;
  }
  ot += "/r=" + r;
  if (obj["dontopenwindow"] == "true") {
   opV = 0;
  }
  if (window.navigator.userAgent.indexOf("AOL") != -1) {
   ot += "/a=1";
  }
  if (obj["isaol"] == "true") {
   ot += "/optn=" + (opV + 16);
  } else {
   ot += "/optn=" + opV;
  }
  if (pt) {
   pt = pt.toUpperCase();
  }
  if (pt == "POPOVER") {
   adComPopFo = "0";
  }
  if (obj["burl"] == "true") {
   bu = "/burl";
  }
  var s;
  if (pt || pu) {
   s = ht;
   if (pt != "POPHTML") {
    s += "/pop";
   }
   s += "/site=" + site;
   if (obj["size"] || obj["width"] && obj["height"]) {
    s += szs;
   }
   s += "/u=2/bnum=" + bnum + "/tags=42" + ot;
  } else {
   s = ht + bu + "/site=" + site + szs + "/u=2/bnum=" + bnum + ot;
  }
  if (dynclick != "") {
   s += "/dynclick=" + dynclick;
  }
  if (rclk != "") {
   s += "/rclk=" + rclk;
  }
  s += "/kvismob=" + kvismob;
  var apifw = getApifw();
  if (apifw) {
   s += "/apifw=" + apifw;
  }
  if (old || ct == "IMAGE" || ct == "I") {
   s1 = s + "/bins=1";
   if (s.indexOf("rich=0") == -1) {
    s1 += "/rich=0";
   }
   s1 += ex;
   dr = ACE3CkLen(s1, dr);
   dw = "<A HREF='" + ht + "/click/site=" + site + "/bnum=" + bnum + "' TARGET='_blank'><IMG SRC='" + s1 + dr + "' WIDTH=" + w + " HEIGHT=" + h + " BORDER=0 ALT='" + alt + "'></A>";
  } else {
   if (parseInt(ACE3FVer, 10) == 0) {
    ACE3CkPlg();
   }
   s += "/fv=" + ACE3FVer;
   s += "/aolexp=0";
   if (ct == "IFRAME" || ct == "IF") {
    s1 = s + "/tags=1" + ex;
    dr = ACE3CkLen(s1, dr);
    dw = "<IFRAME SRC='" + s1 + dr + "' WIDTH=" + w + " HEIGHT=" + h + " SCROLLING=NO FRAMEBORDER=0 MARGINHEIGHT=0 MARGINWIDTH=0></IFRAME>";
   } else {
    s1 = s + ex;
    dr = ACE3CkLen(s1, dr);
    dw = "<SCRIPT TYPE='text/javascript' SRC='" + s1 + dr + "'></SCRIPT>";
   }
  }
  if ((pt || pu) && (old || se > -1)) {
   pNo = 0;
  }
  if (pt && !(pt == "POPOVER" || pt == "POPUNDER" || pt == "POPHTML")) {
   pNo = 0;
  }
  if (pNo) {
   if (pu) {
    adsComPopVar = 1;
   }
   if (obj["popdelay"]) {
    adComDelayValue = obj["popdelay"];
   }
   if (ACE3AllowExp) {
    dw = dw.replace(/aolexp=[01]/, "aolexp=1");
   }
   document.write(dw);
   doUserMatchingCalls(obj["exchmap"], obj["csonly"], site, obj["region"]);
  }
  window["ACE_KeyParm"] = "";
  window["ACE_KeyParms"] = "";
  window["ACE_AR"] = "";
 };
})();

if (window["ACE_AR"]) {
 window["ACE3_AdRequest"](window["ACE_AR"]);
};
