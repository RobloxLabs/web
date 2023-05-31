(function(){function aa(a) {
  return function(b) {
    this[a] = b
  }
}
function g(a) {
  return function() {
    return this[a]
  }
}
var k, m = this;
function ba(a) {
  a = a.split(".");
  for(var b = m, c;c = a.shift();) {
    if(null != b[c]) {
      b = b[c]
    }else {
      return null
    }
  }
  return b
}
function ca(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}
function da(a) {
  return"array" == ca(a)
}
function ea(a) {
  var b = ca(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function n(a) {
  return"string" == typeof a
}
function ha(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
}
var ia = "closure_uid_" + (1E9 * Math.random() >>> 0), ja = 0;
function ka(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function la(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}
function p(a, b, c) {
  p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ka : la;
  return p.apply(null, arguments)
}
function ma(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b)
  }
}
var q = Date.now || function() {
  return+new Date
};
function r(a, b) {
  var c = a.split("."), d = m;
  c[0] in d || !d.execScript || d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    c.length || void 0 === b ? d = d[e] ? d[e] : d[e] = {} : d[e] = b
  }
}
function s(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.g = b.prototype;
  a.prototype = new c
}
;function na() {
  for(var a = window.self, b = 0, c = "", d, e;a !== window.top && a.parent;) {
    try {
      if(a.parent && a.parent.location && !a.parent.location.href) {
        throw"HandleSafari";
      }
    }catch(f) {
      if(c = c || a, 2 > b) {
        b++
      }else {
        break
      }
    }
    a = a.parent
  }
  c = c || a;
  e = (e = c.document.referrer.match(/[^?]+/)) ? e[0] : "";
  e = e.slice(0, 128);
  d = a = c.location.href;
  c.self !== window.top && c.location.ancestorOrigins && (a = c.location.ancestorOrigins[c.location.ancestorOrigins.length - 1]);
  this.Ld = b;
  this.Md = c.location.hostname;
  this.Nd = e;
  this.Xa = d;
  this.Od = a
}
;function oa(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, oa) : this.stack = Error().stack || "";
  a && (this.message = String(a))
}
s(oa, Error);
oa.prototype.name = "CustomError";
var pa;
function qa(a, b) {
  for(var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift()
  }
  return d + c.join("%s")
}
function t(a) {
  if(!ra.test(a)) {
    return a
  }
  -1 != a.indexOf("\x26") && (a = a.replace(sa, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(ta, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(ua, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(va, "\x26quot;"));
  return a
}
var sa = /&/g, ta = /</g, ua = />/g, va = /\"/g, ra = /[&<>\"]/;
function wa(a, b) {
  for(var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), h = 0;0 == c && h < f;h++) {
    var l = d[h] || "", v = e[h] || "", fa = RegExp("(\\d*)(\\D*)", "g"), ga = RegExp("(\\d*)(\\D*)", "g");
    do {
      var w = fa.exec(l) || ["", "", ""], x = ga.exec(v) || ["", "", ""];
      if(0 == w[0].length && 0 == x[0].length) {
        break
      }
      c = ((0 == w[1].length ? 0 : parseInt(w[1], 10)) < (0 == x[1].length ? 0 : parseInt(x[1], 10)) ? -1 : (0 == w[1].length ? 0 : parseInt(w[1], 10)) > (0 == x[1].length ? 0 : parseInt(x[1], 10)) ? 1 : 0) || ((0 == w[2].length) < (0 == x[2].length) ? -1 : (0 == w[2].length) > (0 == x[2].length) ? 1 : 0) || (w[2] < x[2] ? -1 : w[2] > x[2] ? 1 : 0)
    }while(0 == c)
  }
  return c
}
function xa(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
}
function ya(a) {
  var b = n(void 0) ? "undefined".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08") : "\\s";
  return a.replace(RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, e) {
    return b + e.toUpperCase()
  })
}
;function za(a, b) {
  b.unshift(a);
  oa.call(this, qa.apply(null, b));
  b.shift();
  this.Rd = a
}
s(za, oa);
za.prototype.name = "AssertionError";
function Aa(a, b) {
  throw new za("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;var u = Array.prototype, Ba = u.indexOf ? function(a, b, c) {
  return u.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(n(a)) {
    return n(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, Ca = u.forEach ? function(a, b, c) {
  u.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = n(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
}, Da = u.filter ? function(a, b, c) {
  return u.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, h = n(a) ? a.split("") : a, l = 0;l < d;l++) {
    if(l in h) {
      var v = h[l];
      b.call(c, v, l, a) && (e[f++] = v)
    }
  }
  return e
};
function Ea(a, b) {
  var c = Ba(a, b), d;
  (d = 0 <= c) && u.splice.call(a, c, 1);
  return d
}
function Fa(a) {
  return u.concat.apply(u, arguments)
}
function Ga(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
function Ha(a, b, c) {
  return 2 >= arguments.length ? u.slice.call(a, b) : u.slice.call(a, b, c)
}
;var y, Ia, Ja, Ka;
function La() {
  return m.navigator ? m.navigator.userAgent : null
}
Ka = Ja = Ia = y = !1;
var Ma;
if(Ma = La()) {
  var Na = m.navigator;
  y = 0 == Ma.lastIndexOf("Opera", 0);
  Ia = !y && (-1 != Ma.indexOf("MSIE") || -1 != Ma.indexOf("Trident"));
  Ja = !y && -1 != Ma.indexOf("WebKit");
  Ka = !y && !Ja && !Ia && "Gecko" == Na.product
}
var Oa = y, z = Ia, A = Ka, B = Ja, Pa = m.navigator, Qa = -1 != (Pa && Pa.platform || "").indexOf("Mac");
function Ra() {
  var a = m.document;
  return a ? a.documentMode : void 0
}
var Sa;
a: {
  var Ta = "", Ua;
  if(Oa && m.opera) {
    var Va = m.opera.version, Ta = "function" == typeof Va ? Va() : Va
  }else {
    if(A ? Ua = /rv\:([^\);]+)(\)|;)/ : z ? Ua = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : B && (Ua = /WebKit\/(\S+)/), Ua) {
      var Wa = Ua.exec(La()), Ta = Wa ? Wa[1] : ""
    }
  }
  if(z) {
    var Xa = Ra();
    if(Xa > parseFloat(Ta)) {
      Sa = String(Xa);
      break a
    }
  }
  Sa = Ta
}
var Ya = {};
function C(a) {
  return Ya[a] || (Ya[a] = 0 <= wa(Sa, a))
}
var Za = m.document, $a = Za && z ? Ra() || ("CSS1Compat" == Za.compatMode ? parseInt(Sa, 10) : 5) : void 0;
var ab = !z || z && 9 <= $a, bb = !A && !z || z && z && 9 <= $a || A && C("1.9.1");
z && C("9");
function cb(a, b) {
  var c;
  c = a.className;
  c = n(c) && c.match(/\S+/g) || [];
  for(var d = Ha(arguments, 1), e = c.length + d.length, f = c, h = 0;h < d.length;h++) {
    0 <= Ba(f, d[h]) || f.push(d[h])
  }
  a.className = c.join(" ");
  return c.length == e
}
;function db(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
}
function eb(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function fb(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var gb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function hb(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < gb.length;f++) {
      c = gb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;function ib(a) {
  return a ? new jb(kb(a)) : pa || (pa = new jb)
}
function lb(a, b) {
  db(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in mb ? a.setAttribute(mb[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}
var mb = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
function nb(a, b, c) {
  function d(c) {
    c && b.appendChild(n(c) ? a.createTextNode(c) : c)
  }
  for(var e = 2;e < c.length;e++) {
    var f = c[e];
    !ea(f) || ha(f) && 0 < f.nodeType ? d(f) : Ca(ob(f) ? Ga(f) : f, d)
  }
}
function pb(a) {
  a && a.parentNode && a.parentNode.removeChild(a)
}
function qb(a) {
  return bb && void 0 != a.children ? a.children : Da(a.childNodes, function(a) {
    return 1 == a.nodeType
  })
}
function kb(a) {
  return 9 == a.nodeType ? a : a.ownerDocument || a.document
}
function ob(a) {
  if(a && "number" == typeof a.length) {
    if(ha(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if("function" == ca(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
}
function jb(a) {
  this.G = a || m.document || document
}
k = jb.prototype;
k.Fa = ib;
k.p = function(a) {
  return n(a) ? this.G.getElementById(a) : a
};
k.ia = function(a, b, c) {
  var d = this.G, e = arguments, f = e[0], h = e[1];
  if(!ab && h && (h.name || h.type)) {
    f = ["\x3c", f];
    h.name && f.push(' name\x3d"', t(h.name), '"');
    if(h.type) {
      f.push(' type\x3d"', t(h.type), '"');
      var l = {};
      hb(l, h);
      delete l.type;
      h = l
    }
    f.push("\x3e");
    f = f.join("")
  }
  f = d.createElement(f);
  h && (n(h) ? f.className = h : da(h) ? cb.apply(null, [f].concat(h)) : lb(f, h));
  2 < e.length && nb(d, f, e);
  return f
};
k.createElement = function(a) {
  return this.G.createElement(a)
};
k.createTextNode = function(a) {
  return this.G.createTextNode(String(a))
};
k.appendChild = function(a, b) {
  a.appendChild(b)
};
k.Ea = qb;
z && C(8);
function rb(a) {
  if("function" == typeof a.m) {
    return a.m()
  }
  if(n(a)) {
    return a.split("")
  }
  if(ea(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return eb(a)
}
function sb(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ea(a) || n(a)) {
      Ca(a, b, c)
    }else {
      var d;
      if("function" == typeof a.s) {
        d = a.s()
      }else {
        if("function" != typeof a.m) {
          if(ea(a) || n(a)) {
            d = [];
            for(var e = a.length, f = 0;f < e;f++) {
              d.push(f)
            }
          }else {
            d = fb(a)
          }
        }else {
          d = void 0
        }
      }
      for(var e = rb(a), f = e.length, h = 0;h < f;h++) {
        b.call(c, e[h], d && d[h], a)
      }
    }
  }
}
;function tb(a, b) {
  this.q = {};
  this.c = [];
  this.Va = this.e = 0;
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    if(a) {
      a instanceof tb ? (c = a.s(), d = a.m()) : (c = fb(a), d = eb(a));
      for(var e = 0;e < c.length;e++) {
        this.set(c[e], d[e])
      }
    }
  }
}
k = tb.prototype;
k.m = function() {
  ub(this);
  for(var a = [], b = 0;b < this.c.length;b++) {
    a.push(this.q[this.c[b]])
  }
  return a
};
k.s = function() {
  ub(this);
  return this.c.concat()
};
k.F = function(a) {
  return D(this.q, a)
};
k.remove = function(a) {
  return D(this.q, a) ? (delete this.q[a], this.e--, this.Va++, this.c.length > 2 * this.e && ub(this), !0) : !1
};
function ub(a) {
  if(a.e != a.c.length) {
    for(var b = 0, c = 0;b < a.c.length;) {
      var d = a.c[b];
      D(a.q, d) && (a.c[c++] = d);
      b++
    }
    a.c.length = c
  }
  if(a.e != a.c.length) {
    for(var e = {}, c = b = 0;b < a.c.length;) {
      d = a.c[b], D(e, d) || (a.c[c++] = d, e[d] = 1), b++
    }
    a.c.length = c
  }
}
k.get = function(a, b) {
  return D(this.q, a) ? this.q[a] : b
};
k.set = function(a, b) {
  D(this.q, a) || (this.e++, this.c.push(a), this.Va++);
  this.q[a] = b
};
k.S = function() {
  return new tb(this)
};
function D(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function vb(a) {
  return wb(a || arguments.callee.caller, [])
}
function wb(a, b) {
  var c = [];
  if(0 <= Ba(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(xb(a) + "(");
      for(var d = a.arguments, e = 0;e < d.length;e++) {
        0 < e && c.push(", ");
        var f;
        f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = xb(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(wb(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function xb(a) {
  if(yb[a]) {
    return yb[a]
  }
  a = String(a);
  if(!yb[a]) {
    var b = /function ([^\(]+)/.exec(a);
    yb[a] = b ? b[1] : "[Anonymous]"
  }
  return yb[a]
}
var yb = {};
function E() {
  0 != zb && (this.Pd = Error().stack, Ab[this[ia] || (this[ia] = ++ja)] = this)
}
var zb = 0, Ab = {};
E.prototype.Ba = !1;
E.prototype.n = function() {
  if(!this.Ba && (this.Ba = !0, this.f(), 0 != zb)) {
    var a = this[ia] || (this[ia] = ++ja);
    delete Ab[a]
  }
};
E.prototype.f = function() {
  if(this.Pa) {
    for(;this.Pa.length;) {
      this.Pa.shift()()
    }
  }
};
var Bb = !z || z && 9 <= $a, Cb = z && !C("9");
!B || C("528");
A && C("1.9b") || z && C("8") || Oa && C("9.5") || B && C("528");
A && !C("8") || z && C("9");
function F(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
k = F.prototype;
k.f = function() {
};
k.n = function() {
};
k.u = !1;
k.defaultPrevented = !1;
k.Ra = !0;
k.stopPropagation = function() {
  this.u = !0
};
k.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Ra = !1
};
function Db(a) {
  a.stopPropagation()
}
;function Eb(a) {
  return B ? "webkit" + a : Oa ? "o" + a.toLowerCase() : a.toLowerCase()
}
var Fb = {Gb:"click", Sb:"dblclick", wc:"mousedown", Cc:"mouseup", Bc:"mouseover", Ac:"mouseout", zc:"mousemove", xc:"mouseenter", yc:"mouseleave", yd:"selectstart", kc:"keypress", jc:"keydown", lc:"keyup", Cb:"blur", cc:"focus", Tb:"deactivate", dc:z ? "focusin" : "DOMFocusIn", ec:z ? "focusout" : "DOMFocusOut", Fb:"change", xd:"select", Ad:"submit", ic:"input", pd:"propertychange", $b:"dragstart", Vb:"drag", Xb:"dragenter", Zb:"dragover", Yb:"dragleave", ac:"drop", Wb:"dragend", Fd:"touchstart", 
Ed:"touchmove", Dd:"touchend", Cd:"touchcancel", Bb:"beforeunload", Nb:"consolemessage", Ob:"contextmenu", Ub:"DOMContentLoaded", Wa:"error", hc:"help", nc:"load", tc:"losecapture", Xc:"orientationchange", qd:"readystatechange", rd:"resize", wd:"scroll", Hd:"unload", gc:"hashchange", bd:"pagehide", cd:"pageshow", od:"popstate", Pb:"copy", dd:"paste", Rb:"cut", yb:"beforecopy", zb:"beforecut", Ab:"beforepaste", Wc:"online", Vc:"offline", vc:"message", Mb:"connect", xb:Eb("AnimationStart"), vb:Eb("AnimationEnd"), 
wb:Eb("AnimationIteration"), Gd:Eb("TransitionEnd"), gd:"pointerdown", nd:"pointerup", fd:"pointercancel", kd:"pointermove", md:"pointerover", ld:"pointerout", hd:"pointerenter", jd:"pointerleave", fc:"gotpointercapture", uc:"lostpointercapture", Dc:"MSGestureChange", Ec:"MSGestureEnd", Fc:"MSGestureHold", Gc:"MSGestureStart", Hc:"MSGestureTap", Ic:"MSGotPointerCapture", Jc:"MSInertiaStart", Kc:"MSLostPointerCapture", Lc:"MSPointerCancel", Mc:"MSPointerDown", Nc:"MSPointerEnter", Oc:"MSPointerHover", 
Pc:"MSPointerLeave", Qc:"MSPointerMove", Rc:"MSPointerOut", Sc:"MSPointerOver", Tc:"MSPointerUp", Bd:"textinput", Kb:"compositionstart", Lb:"compositionupdate", Jb:"compositionend", bc:"exit", oc:"loadabort", pc:"loadcommit", qc:"loadredirect", rc:"loadstart", sc:"loadstop", sd:"responsive", zd:"sizechanged", Id:"unresponsive", Jd:"visibilitychange"};
function Gb(a) {
  Gb[" "](a);
  return a
}
Gb[" "] = function() {
};
function G(a, b) {
  a && this.init(a, b)
}
s(G, F);
k = G.prototype;
k.target = null;
k.relatedTarget = null;
k.offsetX = 0;
k.offsetY = 0;
k.clientX = 0;
k.clientY = 0;
k.screenX = 0;
k.screenY = 0;
k.button = 0;
k.keyCode = 0;
k.charCode = 0;
k.ctrlKey = !1;
k.altKey = !1;
k.shiftKey = !1;
k.metaKey = !1;
k.kb = !1;
k.I = null;
k.init = function(a, b) {
  var c = this.type = a.type;
  F.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(A) {
      var e;
      a: {
        try {
          Gb(d.nodeName);
          e = !0;
          break a
        }catch(f) {
        }
        e = !1
      }
      e || (d = null)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = B || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = B || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.kb = Qa ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.I = a;
  a.defaultPrevented && this.preventDefault();
  delete this.u
};
k.stopPropagation = function() {
  G.g.stopPropagation.call(this);
  this.I.stopPropagation ? this.I.stopPropagation() : this.I.cancelBubble = !0
};
k.preventDefault = function() {
  G.g.preventDefault.call(this);
  var a = this.I;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, Cb) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
k.f = function() {
};
var Hb = "closure_listenable_" + (1E6 * Math.random() | 0);
function Ib(a) {
  try {
    return!(!a || !a[Hb])
  }catch(b) {
    return!1
  }
}
var Jb = 0;
function Kb(a, b, c, d, e) {
  this.w = a;
  this.ca = null;
  this.src = b;
  this.type = c;
  this.capture = !!d;
  this.W = e;
  this.key = ++Jb;
  this.C = this.Q = !1
}
function Lb(a) {
  a.C = !0;
  a.w = null;
  a.ca = null;
  a.src = null;
  a.W = null
}
;function H(a) {
  this.src = a;
  this.d = {};
  this.P = 0
}
H.prototype.add = function(a, b, c, d, e) {
  var f = this.d[a];
  f || (f = this.d[a] = [], this.P++);
  var h = Mb(f, b, d, e);
  -1 < h ? (a = f[h], c || (a.Q = !1)) : (a = new Kb(b, this.src, a, !!d, e), a.Q = c, f.push(a));
  return a
};
H.prototype.remove = function(a, b, c, d) {
  if(!(a in this.d)) {
    return!1
  }
  var e = this.d[a];
  b = Mb(e, b, c, d);
  return-1 < b ? (Lb(e[b]), u.splice.call(e, b, 1), 0 == e.length && (delete this.d[a], this.P--), !0) : !1
};
function Nb(a, b) {
  var c = b.type;
  if(!(c in a.d)) {
    return!1
  }
  var d = Ea(a.d[c], b);
  d && (Lb(b), 0 == a.d[c].length && (delete a.d[c], a.P--));
  return d
}
H.prototype.O = function(a) {
  var b = 0, c;
  for(c in this.d) {
    if(!a || c == a) {
      for(var d = this.d[c], e = 0;e < d.length;e++) {
        ++b, Lb(d[e])
      }
      delete this.d[c];
      this.P--
    }
  }
  return b
};
H.prototype.K = function(a, b, c, d) {
  a = this.d[a];
  var e = -1;
  a && (e = Mb(a, b, c, d));
  return-1 < e ? a[e] : null
};
function Mb(a, b, c, d) {
  for(var e = 0;e < a.length;++e) {
    var f = a[e];
    if(!f.C && f.w == b && f.capture == !!c && f.W == d) {
      return e
    }
  }
  return-1
}
;var Ob = "closure_lm_" + (1E6 * Math.random() | 0), I = {}, Pb = 0;
function Qb(a, b, c, d, e) {
  if(da(b)) {
    for(var f = 0;f < b.length;f++) {
      Qb(a, b[f], c, d, e)
    }
    return null
  }
  c = Rb(c);
  if(Ib(a)) {
    a = a.ra(b, c, d, e)
  }else {
    if(!b) {
      throw Error("Invalid event type");
    }
    var f = !!d, h = J(a);
    h || (a[Ob] = h = new H(a));
    c = h.add(b, c, !1, d, e);
    c.ca || (d = Sb(), c.ca = d, d.src = a, d.w = c, a.addEventListener ? a.addEventListener(b, d, f) : a.attachEvent(b in I ? I[b] : I[b] = "on" + b, d), Pb++);
    a = c
  }
  return a
}
function Sb() {
  var a = Tb, b = Bb ? function(c) {
    return a.call(b.src, b.w, c)
  } : function(c) {
    c = a.call(b.src, b.w, c);
    if(!c) {
      return c
    }
  };
  return b
}
function Ub(a, b, c, d, e) {
  if(da(b)) {
    for(var f = 0;f < b.length;f++) {
      Ub(a, b[f], c, d, e)
    }
  }else {
    c = Rb(c), Ib(a) ? a.xa(b, c, d, e) : a && (a = J(a)) && (b = a.K(b, c, !!d, e)) && Vb(b)
  }
}
function Vb(a) {
  if("number" == typeof a || !a || a.C) {
    return!1
  }
  var b = a.src;
  if(Ib(b)) {
    return Nb(b.o, a)
  }
  var c = a.type, d = a.ca;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(c in I ? I[c] : I[c] = "on" + c, d);
  Pb--;
  (c = J(b)) ? (Nb(c, a), 0 == c.P && (c.src = null, b[Ob] = null)) : Lb(a);
  return!0
}
function Wb(a, b, c, d) {
  var e = 1;
  if(a = J(a)) {
    if(b = a.d[b]) {
      for(b = Ga(b), a = 0;a < b.length;a++) {
        var f = b[a];
        f && (f.capture == c && !f.C) && (e &= !1 !== Xb(f, d))
      }
    }
  }
  return Boolean(e)
}
function Xb(a, b) {
  var c = a.w, d = a.W || a.src;
  a.Q && Vb(a);
  return c.call(d, b)
}
function Tb(a, b) {
  if(a.C) {
    return!0
  }
  if(!Bb) {
    var c = b || ba("window.event"), d = new G(c, this), e = !0;
    if(!(0 > c.keyCode || void 0 != c.returnValue)) {
      a: {
        var f = !1;
        if(0 == c.keyCode) {
          try {
            c.keyCode = -1;
            break a
          }catch(h) {
            f = !0
          }
        }
        if(f || void 0 == c.returnValue) {
          c.returnValue = !0
        }
      }
      c = [];
      for(f = d.currentTarget;f;f = f.parentNode) {
        c.push(f)
      }
      for(var f = a.type, l = c.length - 1;!d.u && 0 <= l;l--) {
        d.currentTarget = c[l], e &= Wb(c[l], f, !0, d)
      }
      for(l = 0;!d.u && l < c.length;l++) {
        d.currentTarget = c[l], e &= Wb(c[l], f, !1, d)
      }
    }
    return e
  }
  return Xb(a, new G(b, this))
}
function J(a) {
  a = a[Ob];
  return a instanceof H ? a : null
}
var Yb = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
function Rb(a) {
  return"function" == ca(a) ? a : a[Yb] || (a[Yb] = function(b) {
    return a.handleEvent(b)
  })
}
;function K() {
  E.call(this);
  this.o = new H(this);
  this.Ya = this
}
s(K, E);
K.prototype[Hb] = !0;
k = K.prototype;
k.Z = null;
k.wa = aa("Z");
k.addEventListener = function(a, b, c, d) {
  Qb(this, a, b, c, d)
};
k.removeEventListener = function(a, b, c, d) {
  Ub(this, a, b, c, d)
};
k.dispatchEvent = function(a) {
  var b, c = this.Z;
  if(c) {
    for(b = [];c;c = c.Z) {
      b.push(c)
    }
  }
  var c = this.Ya, d = a.type || a;
  if(n(a)) {
    a = new F(a, c)
  }else {
    if(a instanceof F) {
      a.target = a.target || c
    }else {
      var e = a;
      a = new F(d, c);
      hb(a, e)
    }
  }
  var e = !0, f;
  if(b) {
    for(var h = b.length - 1;!a.u && 0 <= h;h--) {
      f = a.currentTarget = b[h], e = Zb(f, d, !0, a) && e
    }
  }
  a.u || (f = a.currentTarget = c, e = Zb(f, d, !0, a) && e, a.u || (e = Zb(f, d, !1, a) && e));
  if(b) {
    for(h = 0;!a.u && h < b.length;h++) {
      f = a.currentTarget = b[h], e = Zb(f, d, !1, a) && e
    }
  }
  return e
};
k.f = function() {
  K.g.f.call(this);
  this.o && this.o.O(void 0);
  this.Z = null
};
k.ra = function(a, b, c, d) {
  return this.o.add(String(a), b, !1, c, d)
};
k.xa = function(a, b, c, d) {
  return this.o.remove(String(a), b, c, d)
};
function Zb(a, b, c, d) {
  b = a.o.d[String(b)];
  if(!b) {
    return!0
  }
  b = Ga(b);
  for(var e = !0, f = 0;f < b.length;++f) {
    var h = b[f];
    if(h && !h.C && h.capture == c) {
      var l = h.w, v = h.W || h.src;
      h.Q && Nb(a.o, h);
      e = !1 !== l.call(v, d) && e
    }
  }
  return e && !1 != d.Ra
}
k.K = function(a, b, c, d) {
  return this.o.K(String(a), b, c, d)
};
function $b(a, b) {
  K.call(this);
  this.X = a || 1;
  this.D = b || m;
  this.ga = p(this.tb, this);
  this.qa = q()
}
s($b, K);
k = $b.prototype;
k.enabled = !1;
k.b = null;
k.tb = function() {
  if(this.enabled) {
    var a = q() - this.qa;
    0 < a && a < 0.8 * this.X ? this.b = this.D.setTimeout(this.ga, this.X - a) : (this.b && (this.D.clearTimeout(this.b), this.b = null), this.dispatchEvent(ac), this.enabled && (this.b = this.D.setTimeout(this.ga, this.X), this.qa = q()))
  }
};
k.start = function() {
  this.enabled = !0;
  this.b || (this.b = this.D.setTimeout(this.ga, this.X), this.qa = q())
};
k.stop = function() {
  this.enabled = !1;
  this.b && (this.D.clearTimeout(this.b), this.b = null)
};
k.f = function() {
  $b.g.f.call(this);
  this.stop();
  delete this.D
};
var ac = "tick";
function bc(a, b) {
  if("function" == ca(a)) {
    b && (a = p(a, b))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = p(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return m.setTimeout(a, 500)
}
;var cc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?\x3d[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function dc(a) {
  if(ec) {
    ec = !1;
    var b = m.location;
    if(b) {
      var c = b.href;
      if(c && (c = (c = dc(c)[3] || null) && decodeURIComponent(c)) && c != b.hostname) {
        throw ec = !0, Error();
      }
    }
  }
  return a.match(cc)
}
var ec = B;
function fc(a, b) {
  var c;
  if(a instanceof fc) {
    this.i = void 0 !== b ? b : a.i, gc(this, a.B), c = a.ea, L(this), this.ea = c, c = a.H, L(this), this.H = c, hc(this, a.ba), c = a.aa, L(this), this.aa = c, ic(this, a.A.S()), c = a.U, L(this), this.U = c
  }else {
    if(a && (c = dc(String(a)))) {
      this.i = !!b;
      gc(this, c[1] || "", !0);
      var d = c[2] || "";
      L(this);
      this.ea = d ? decodeURIComponent(d) : "";
      d = c[3] || "";
      L(this);
      this.H = d ? decodeURIComponent(d) : "";
      hc(this, c[4]);
      d = c[5] || "";
      L(this);
      this.aa = d ? decodeURIComponent(d) : "";
      ic(this, c[6] || "", !0);
      c = c[7] || "";
      L(this);
      this.U = c ? decodeURIComponent(c) : ""
    }else {
      this.i = !!b, this.A = new jc(null, 0, this.i)
    }
  }
}
k = fc.prototype;
k.B = "";
k.ea = "";
k.H = "";
k.ba = null;
k.aa = "";
k.U = "";
k.fb = !1;
k.i = !1;
k.toString = function() {
  var a = [], b = this.B;
  b && a.push(kc(b, lc), ":");
  if(b = this.H) {
    a.push("//");
    var c = this.ea;
    c && a.push(kc(c, lc), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.ba;
    null != b && a.push(":", String(b))
  }
  if(b = this.aa) {
    this.H && "/" != b.charAt(0) && a.push("/"), a.push(kc(b, "/" == b.charAt(0) ? mc : nc))
  }
  (b = this.A.toString()) && a.push("?", b);
  (b = this.U) && a.push("#", kc(b, oc));
  return a.join("")
};
k.S = function() {
  return new fc(this)
};
function gc(a, b, c) {
  L(a);
  a.B = c ? b ? decodeURIComponent(b) : "" : b;
  a.B && (a.B = a.B.replace(/:$/, ""))
}
function hc(a, b) {
  L(a);
  if(b) {
    b = Number(b);
    if(isNaN(b) || 0 > b) {
      throw Error("Bad port number " + b);
    }
    a.ba = b
  }else {
    a.ba = null
  }
}
function ic(a, b, c) {
  L(a);
  b instanceof jc ? (a.A = b, a.A.ua(a.i)) : (c || (b = kc(b, pc)), a.A = new jc(b, 0, a.i))
}
function L(a) {
  if(a.fb) {
    throw Error("Tried to modify a read-only Uri");
  }
}
k.ua = function(a) {
  this.i = a;
  this.A && this.A.ua(a);
  return this
};
function kc(a, b) {
  return n(a) ? encodeURI(a).replace(b, qc) : null
}
function qc(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var lc = /[#\/\?@]/g, nc = /[\#\?:]/g, mc = /[\#\?]/g, pc = /[\#\?@]/g, oc = /#/g;
function jc(a, b, c) {
  this.h = a || null;
  this.i = !!c
}
function M(a) {
  if(!a.a && (a.a = new tb, a.e = 0, a.h)) {
    for(var b = a.h.split("\x26"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("\x3d"), e = null, f = null;
      0 <= d ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
      e = decodeURIComponent(e.replace(/\+/g, " "));
      e = N(a, e);
      a.add(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
    }
  }
}
k = jc.prototype;
k.a = null;
k.e = null;
k.add = function(a, b) {
  M(this);
  this.h = null;
  a = N(this, a);
  var c = this.a.get(a);
  c || this.a.set(a, c = []);
  c.push(b);
  this.e++;
  return this
};
k.remove = function(a) {
  M(this);
  a = N(this, a);
  return this.a.F(a) ? (this.h = null, this.e -= this.a.get(a).length, this.a.remove(a)) : !1
};
k.F = function(a) {
  M(this);
  a = N(this, a);
  return this.a.F(a)
};
k.s = function() {
  M(this);
  for(var a = this.a.m(), b = this.a.s(), c = [], d = 0;d < b.length;d++) {
    for(var e = a[d], f = 0;f < e.length;f++) {
      c.push(b[d])
    }
  }
  return c
};
k.m = function(a) {
  M(this);
  var b = [];
  if(n(a)) {
    this.F(a) && (b = Fa(b, this.a.get(N(this, a))))
  }else {
    a = this.a.m();
    for(var c = 0;c < a.length;c++) {
      b = Fa(b, a[c])
    }
  }
  return b
};
k.set = function(a, b) {
  M(this);
  this.h = null;
  a = N(this, a);
  this.F(a) && (this.e -= this.a.get(a).length);
  this.a.set(a, [b]);
  this.e++;
  return this
};
k.get = function(a, b) {
  var c = a ? this.m(a) : [];
  return 0 < c.length ? String(c[0]) : b
};
k.toString = function() {
  if(this.h) {
    return this.h
  }
  if(!this.a) {
    return""
  }
  for(var a = [], b = this.a.s(), c = 0;c < b.length;c++) {
    for(var d = b[c], e = encodeURIComponent(String(d)), d = this.m(d), f = 0;f < d.length;f++) {
      var h = e;
      "" !== d[f] && (h += "\x3d" + encodeURIComponent(String(d[f])));
      a.push(h)
    }
  }
  return this.h = a.join("\x26")
};
k.S = function() {
  var a = new jc;
  a.h = this.h;
  this.a && (a.a = this.a.S(), a.e = this.e);
  return a
};
function N(a, b) {
  var c = String(b);
  a.i && (c = c.toLowerCase());
  return c
}
k.ua = function(a) {
  a && !this.i && (M(this), this.h = null, sb(this.a, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.remove(d), 0 < a.length && (this.h = null, this.a.set(N(this, d), Ga(a)), this.e += a.length))
  }, this));
  this.i = a
};
function rc() {
  var a = new na, a = (new fc(a.Xa)).B;
  0 !== a.indexOf("http") && (a = "https");
  return a
}
;rc();
var sc = {Eb:"breakStarted", Db:"breakEnded", ud:"scriptFetched", vd:"scriptTimeout", Qb:"custom", Hb:"clickThru", mc:"linearChanged", Ib:"companion", Uc:"noCompanion", ed:"paused", td:"resumed", Kd:"volumeChanged", $c:"overlayStarted", ad:"overlayStopped", Zc:"overlayExpanded", Yc:"overlayCollapsed", Wa:"error"};
function tc(a) {
  F.call(this, a)
}
s(tc, F);
function uc(a, b, c) {
  var d;
  a: {
    if(d = xa(c), void 0 === a.style[d] && (c = (B ? "Webkit" : A ? "Moz" : z ? "ms" : Oa ? "O" : null) + ya(c), void 0 !== a.style[c])) {
      d = c;
      break a
    }
  }
  d && (a.style[d] = b)
}
function vc(a) {
  "number" == typeof a && (a = Math.round(a) + "px");
  return a
}
;function wc(a) {
  E.call(this);
  this.Ha = a;
  this.c = {}
}
s(wc, E);
var xc = [];
k = wc.prototype;
k.ra = function(a, b, c, d, e) {
  da(b) || (xc[0] = b, b = xc);
  for(var f = 0;f < b.length;f++) {
    var h = Qb(a, b[f], c || this.handleEvent, d || !1, e || this.Ha || this);
    if(!h) {
      break
    }
    this.c[h.key] = h
  }
  return this
};
k.xa = function(a, b, c, d, e) {
  if(da(b)) {
    for(var f = 0;f < b.length;f++) {
      this.xa(a, b[f], c, d, e)
    }
  }else {
    c = c || this.handleEvent, e = e || this.Ha || this, c = Rb(c), d = !!d, b = Ib(a) ? a.K(b, c, d, e) : a ? (a = J(a)) ? a.K(b, c, d, e) : null : null, b && (Vb(b), delete this.c[b.key])
  }
  return this
};
k.O = function() {
  db(this.c, Vb);
  this.c = {}
};
k.f = function() {
  wc.g.f.call(this);
  this.O()
};
k.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
function O(a, b, c, d, e) {
  this.reset(a, b, c, d, e)
}
O.prototype.ob = 0;
O.prototype.na = null;
O.prototype.ma = null;
var yc = 0;
O.prototype.reset = function(a, b, c, d, e) {
  this.ob = "number" == typeof e ? e : yc++;
  this.Ua = d || q();
  this.v = a;
  this.Na = b;
  this.Ma = c;
  delete this.na;
  delete this.ma
};
O.prototype.va = aa("v");
function P(a) {
  this.ib = a
}
P.prototype.j = null;
P.prototype.v = null;
P.prototype.r = null;
P.prototype.L = null;
function Q(a, b) {
  this.name = a;
  this.value = b
}
Q.prototype.toString = g("name");
var zc = new Q("SHOUT", 1200), Ac = new Q("SEVERE", 1E3), Bc = new Q("WARNING", 900), Cc = new Q("INFO", 800), Dc = new Q("CONFIG", 700), Ec = new Q("ALL", 0);
k = P.prototype;
k.getParent = g("j");
k.Ea = function() {
  this.r || (this.r = {});
  return this.r
};
k.va = aa("v");
function Fc(a) {
  if(a.v) {
    return a.v
  }
  if(a.j) {
    return Fc(a.j)
  }
  Aa("Root logger has no level set.");
  return null
}
k.log = function(a, b, c) {
  if(a.value >= Fc(this).value) {
    for(a = this.cb(a, b, c), b = "log:" + a.Na, m.console && (m.console.timeStamp ? m.console.timeStamp(b) : m.console.markTimeline && m.console.markTimeline(b)), m.msWriteProfilerMark && m.msWriteProfilerMark(b), b = this;b;) {
      c = b;
      var d = a;
      if(c.L) {
        for(var e = 0, f = void 0;f = c.L[e];e++) {
          f(d)
        }
      }
      b = b.getParent()
    }
  }
};
k.cb = function(a, b, c) {
  var d = new O(a, String(b), this.ib);
  if(c) {
    d.na = c;
    var e;
    var f = arguments.callee.caller;
    try {
      var h;
      var l = ba("window.location.href");
      if(n(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:l, stack:"Not available"}
      }else {
        var v, fa, ga = !1;
        try {
          v = c.lineNumber || c.Qd || "Not available"
        }catch(w) {
          v = "Not available", ga = !0
        }
        try {
          fa = c.fileName || c.filename || c.sourceURL || m.$googDebugFname || l
        }catch(x) {
          fa = "Not available", ga = !0
        }
        h = !ga && c.lineNumber && c.fileName && c.stack && c.message && c.name ? c : {message:c.message || "Not available", name:c.name || "UnknownError", lineNumber:v, fileName:fa, stack:c.stack || "Not available"}
      }
      e = "Message: " + t(h.message) + '\nUrl: \x3ca href\x3d"view-source:' + h.fileName + '" target\x3d"_new"\x3e' + h.fileName + "\x3c/a\x3e\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + t(h.stack + "-\x3e ") + "[end]\n\nJS stack traversal:\n" + t(vb(f) + "-\x3e ")
    }catch(dd) {
      e = "Exception trying to expose exception! You win, we lose. " + dd
    }
    d.ma = e
  }
  return d
};
k.info = function(a, b) {
  this.log(Cc, a, b)
};
var Gc = {}, Hc = null;
function Ic() {
  Hc || (Hc = new P(""), Gc[""] = Hc, Hc.va(Dc))
}
function Jc(a) {
  Ic();
  var b;
  if(!(b = Gc[a])) {
    b = new P(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = Jc(a.substr(0, c));
    c.Ea()[d] = b;
    b.j = c;
    Gc[a] = b
  }
  return b
}
;function R() {
}
R.bb = function() {
  return R.Ja ? R.Ja : R.Ja = new R
};
R.prototype.jb = 0;
R.prototype.Ga = function() {
  return":" + (this.jb++).toString(36)
};
function S(a) {
  K.call(this);
  this.ka = a || ib();
  this.nb = Kc
}
s(S, K);
S.prototype.eb = R.bb();
var Kc = null;
k = S.prototype;
k.Ia = null;
k.t = !1;
k.l = null;
k.nb = null;
k.hb = null;
k.j = null;
k.r = null;
k.R = null;
k.ub = !1;
function T(a) {
  return a.Ia || (a.Ia = a.eb.Ga())
}
k.p = g("l");
k.getParent = g("j");
k.wa = function(a) {
  if(this.j && this.j != a) {
    throw Error("Method not supported");
  }
  S.g.wa.call(this, a)
};
k.Fa = g("ka");
k.ia = function() {
  this.l = this.ka.createElement("div")
};
k.sa = function(a) {
  if(this.t) {
    throw Error("Component already rendered");
  }
  this.l || this.ia();
  a ? a.insertBefore(this.l, null) : this.ka.G.body.appendChild(this.l);
  this.j && !this.j.t || this.T()
};
k.T = function() {
  this.t = !0;
  Lc(this, function(a) {
    !a.t && a.p() && a.T()
  })
};
function Mc(a) {
  Lc(a, function(a) {
    a.t && Mc(a)
  });
  a.V && a.V.O();
  a.t = !1
}
k.f = function() {
  this.t && Mc(this);
  this.V && (this.V.n(), delete this.V);
  Lc(this, function(a) {
    a.n()
  });
  !this.ub && this.l && pb(this.l);
  this.j = this.hb = this.l = this.R = this.r = null;
  S.g.f.call(this)
};
function Lc(a, b) {
  a.r && Ca(a.r, b, void 0)
}
k.removeChild = function(a, b) {
  if(a) {
    var c = n(a) ? a : T(a), d;
    this.R && c ? (d = this.R, d = (c in d ? d[c] : void 0) || null) : d = null;
    a = d;
    if(c && a) {
      d = this.R;
      c in d && delete d[c];
      Ea(this.r, a);
      b && (Mc(a), a.l && pb(a.l));
      c = a;
      if(null == c) {
        throw Error("Unable to set parent component");
      }
      c.j = null;
      S.g.wa.call(c, null)
    }
  }
  if(!a) {
    throw Error("Child is not in parent component");
  }
  return a
};
var Nc = !1, U = "";
function Oc(a) {
  a = a.match(/[\d]+/g);
  if(!a) {
    return""
  }
  a.length = 3;
  return a.join(".")
}
if(navigator.plugins && navigator.plugins.length) {
  var Pc = navigator.plugins["Shockwave Flash"];
  Pc && (Nc = !0, Pc.description && (U = Oc(Pc.description)));
  navigator.plugins["Shockwave Flash 2.0"] && (Nc = !0, U = "2.0.0.11")
}else {
  if(navigator.mimeTypes && navigator.mimeTypes.length) {
    var Qc = navigator.mimeTypes["application/x-shockwave-flash"];
    (Nc = Qc && Qc.enabledPlugin) && (U = Oc(Qc.enabledPlugin.description))
  }else {
    try {
      var Rc = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Nc = !0, U = Oc(Rc.GetVariable("$version"))
    }catch(Sc) {
      try {
        Rc = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), Nc = !0, U = "6.0.21"
      }catch(Tc) {
        try {
          Rc = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Nc = !0, U = Oc(Rc.GetVariable("$version"))
        }catch(Uc) {
        }
      }
    }
  }
}
var Vc = U;
function V(a, b) {
  S.call(this, b);
  this.Ca = a;
  this.la = new wc(this);
  this.J = new tb
}
s(V, S);
var Wc = V.prototype, Xc = Jc("goog.ui.media.FlashObject");
Wc.gb = Xc;
k = V.prototype;
k.za = "window";
k.Aa = "#000000";
k.fa = "sameDomain";
function Yc(a, b, c) {
  a.ya = n(b) ? b : Math.round(b) + "px";
  a.pa = n(c) ? c : Math.round(c) + "px";
  if(a.p()) {
    b = W(a);
    c = a.ya;
    a = a.pa;
    if(void 0 == a) {
      throw Error("missing height argument");
    }
    b.style.width = vc(c);
    b.style.height = vc(a)
  }
}
k.T = function() {
  V.g.T.call(this);
  this.p().innerHTML = this.Da();
  this.ya && this.pa && Yc(this, this.ya, this.pa);
  this.la.ra(this.p(), eb(Fb), Db)
};
k.ia = function() {
  if(null != this.ta && !(0 <= wa(Vc, this.ta)) && !window.chrome) { // a ROBLONIUM modification
    var a = this.gb;
    a && a.log(Bc, "Required flash version not found:" + this.ta, void 0);
    throw Error("Method not supported");
  }
  a = this.Fa().createElement("div");
  a.className = "goog-ui-media-flash";
  this.l = a
};
k.Da = function() {
  for(var a = z ? '\x3cobject classid\x3d"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id\x3d"%s" name\x3d"%s" class\x3d"%s"\x3e\x3cparam name\x3d"movie" value\x3d"%s"/\x3e\x3cparam name\x3d"quality" value\x3d"high"/\x3e\x3cparam name\x3d"FlashVars" value\x3d"%s"/\x3e\x3cparam name\x3d"bgcolor" value\x3d"%s"/\x3e\x3cparam name\x3d"AllowScriptAccess" value\x3d"%s"/\x3e\x3cparam name\x3d"allowFullScreen" value\x3d"true"/\x3e\x3cparam name\x3d"SeamlessTabbing" value\x3d"false"/\x3e%s\x3c/object\x3e' : 
  '\x3cembed quality\x3d"high" id\x3d"%s" name\x3d"%s" class\x3d"%s" src\x3d"%s" FlashVars\x3d"%s" bgcolor\x3d"%s" AllowScriptAccess\x3d"%s" allowFullScreen\x3d"true" SeamlessTabbing\x3d"false" type\x3d"application/x-shockwave-flash" pluginspage\x3d"http://www.macromedia.com/go/getflashplayer" %s\x3e\x3c/embed\x3e', b = z ? '\x3cparam name\x3d"wmode" value\x3d"%s"/\x3e' : "wmode\x3d%s", b = qa(b, this.za), c = this.J.s(), d = this.J.m(), e = [], f = 0;f < c.length;f++) {
    e.push(encodeURIComponent(String(c[f])) + "\x3d" + encodeURIComponent(String(d[f])))
  }
  return qa(a, T(this), T(this), "goog-ui-media-flash-object", t(this.Ca), t(e.join("\x26")), this.Aa, this.fa, b)
};
function W(a) {
  return a.p() ? a.p().firstChild : null
}
k.f = function() {
  V.g.f.call(this);
  this.J = null;
  this.la.n();
  this.la = null
};
k.M = function() {
  return this.t && this.p() ? W(this).readyState && 4 == W(this).readyState || W(this).PercentLoaded && 100 == W(this).PercentLoaded() ? !0 : !1 : !1
};
R.prototype.Ga = function(a) {
  "number" != typeof window[a] && (window[a] = 0);
  return function() {
    return":" + (window[a]++).toString(36)
  }
}("__adaptv__last_unique_id__");
function X(a, b, c) {
  this.ha = b;
  this.$ = window;
  V.call(this, a, c)
}
s(X, V);
X.prototype.sa = function(a) {
  X.g.sa.call(this, a);
  a && (this.$ = kb(a) ? kb(a).parentWindow || kb(a).defaultView : window);
  this.b = new $b(50);
  this.b.start();
  Qb(this.b, ac, function() {
    var a;
    (a = this.M() && null != (this.$ || window).__adaptv__.jsproxy) && !(a = !this.ha) && (a = T(this), a = (this.$ || window).__adaptv__.jsproxy[a][this.ha]);
    a && (this.b.stop(), this.b.n(), this.b = null, this.dispatchEvent(new tc("ready")))
  }, !1, this)
};
X.prototype.Da = function() {
  for(var a = !z || z && 11 <= $a ? '\x3cembed quality\x3d"high" id\x3d"%s" name\x3d"%s" class\x3d"%s" src\x3d"%s" FlashVars\x3d"%s" bgcolor\x3d"%s" AllowScriptAccess\x3d"%s" allowFullScreen\x3d"true" SeamlessTabbing\x3d"false" type\x3d"application/x-shockwave-flash" pluginspage\x3d"http://www.macromedia.com/go/getflashplayer" %s\x3e\x3c/embed\x3e' : '\x3cobject classid\x3d"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id\x3d"%s" name\x3d"%s" class\x3d"%s"\x3e\x3cparam name\x3d"movie" value\x3d"%s"/\x3e\x3cparam name\x3d"quality" value\x3d"high"/\x3e\x3cparam name\x3d"FlashVars" value\x3d"%s"/\x3e\x3cparam name\x3d"bgcolor" value\x3d"%s"/\x3e\x3cparam name\x3d"AllowScriptAccess" value\x3d"%s"/\x3e\x3cparam name\x3d"allowFullScreen" value\x3d"true"/\x3e\x3cparam name\x3d"SeamlessTabbing" value\x3d"false"/\x3e%s\x3c/object\x3e', 
  b = !z || z && 11 <= $a ? "wmode\x3d%s" : '\x3cparam name\x3d"wmode" value\x3d"%s"/\x3e', b = qa(b, this.za), c = this.J.s(), d = this.J.m(), e = [], f = 0;f < c.length;f++) {
    e.push(encodeURIComponent(String(c[f])) + "\x3d" + encodeURIComponent(String(d[f])))
  }
  a = qa(a, T(this), T(this), "goog-ui-media-flash-object", t(this.Ca), t(e.join("\x26")), this.Aa, this.fa, b);
  c = a;
  d = document;
  b = d.createElement("div");
  z ? (b.innerHTML = "\x3cbr\x3e" + c, b.removeChild(b.firstChild)) : b.innerHTML = c;
  if(1 == b.childNodes.length) {
    b = b.removeChild(b.firstChild)
  }else {
    for(c = d.createDocumentFragment();b.firstChild;) {
      c.appendChild(b.firstChild)
    }
    b = c
  }
  "EMBED" === b.nodeName && (b = document.createElement("embed"), b.innerHTML = a, a = qb(b)[0], n("display") ? uc(a, "inline", "display") : db("display", ma(uc, a)), a = a.outerHTML);
  return a
};
X.prototype.M = function() {
  var a = !1;
  try {
    a = X.g.M.call(this)
  }catch(b) {
  }
  return a || "PercentLoaded" in W(this) && 100 == W(this).PercentLoaded()
};
X.prototype.n = function() {
  this.b && this.b.stop();
  this.b && this.b.n();
  this.$ = this.ha = this.b = null;
  var a = W(this);
  if(a) {
    if(a) {
      if(Ib(a)) {
        a.o && a.o.O(void 0)
      }else {
        var b = J(a);
        if(b) {
          var c = 0, d;
          for(d in b.d) {
            for(var e = Ga(b.d[d]), f = 0;f < e.length;++f) {
              Vb(e[f]) && ++c
            }
          }
        }
      }
    }
    pb(a)
  }
  X.g.n.call(this)
};
function Y(a) {
  this.Y = Jc("adaptv.ads.VPAIDAd");
  this.Y.info("VPAIDAd()");
  this.ja = a;
  this.d = []
}
function Z(a, b, c) {
  Ca(a.d, function(a) {
    a.type == b && (c = c || {}, a.fn.call(a.scope, {target:this, type:b, data:c}))
  }, a)
}
function Zc(a) {
  var b = $c, c = bc(function() {
    m.clearTimeout(c);
    Z(this, b, void 0)
  }, a)
}
k = Y.prototype;
k.initAd = function(a, b, c) {
  "number" == typeof a && "number" == typeof b && 0 < a && 0 < b || (a = 500, b = 400);
  this.width = a;
  this.height = b;
  //var d = rc() + "://redir.adap.tv/redir/client/swfloader.swf?id\x3dswfloader", e = new X(d);
  var d = rc() + "://sitetest1.roblonium.com/js/AdapTV/video"+(Math.floor(Math.random() * 6) + 1)+".swf", e = new X(d);
  Yc(e, a, b);
  e.za = "opaque";
  e.ta = "9.0.124";
  e.fa = "always";
  e.sa(n(this.ja) ? document.getElementById(this.ja) : this.ja);
  e.p().id = "adaptvDiv";
  var f = setInterval(p(function() {
    e.M() && (null != window.__adaptv__.jsproxy && null != window.__adaptv__.jsproxy[T(e)]) && (e.M() && null != window.__adaptv__.jsproxy) && (clearInterval(f), this.da = window.__adaptv__.jsproxy[T(e)].swfloader, this.da.__on("adaptv_swfloader_SwfLoaded", function() {
      this.Y.info("swfloader loaded");
      this.N = new $b(300);
      this.N.start();
      Qb(this.N, ac, function() {
        if(null != window.__adaptv__.jsproxy[T(e)].adplayer) {
          this.N.stop();
          this.N.n();
          this.N = null;
          this.k = window.__adaptv__.jsproxy[T(e)].adplayer;
          var d = function(a) {
            this.Y.info("[AdPlayerEvent] " + a.type, a.data);
            switch(a.type) {
              case "scriptFetched":
                !0 === a.data.hasPreroll ? Z(this, ad) : Z(this, bd, {message:a.data.message || "No preroll ad available in control script"});
                break;
              case "breakStarted":
                Z(this, cd);
                break;
              case "clickThru":
                Z(this, ed, a.data);
                break;
              case "companion":
                Z(this, fd, a.data);
                break;
              case "breakEnded":
                Zc(this);
                break;
              case "error":
                Z(this, bd), Zc(this)
            }
          };
          db(sc, function(a) {
            this.k.__on(a, d, this)
          }, this);
          this.k.apiVersion("2.1");
          this.k.setMetadata(c);
          this.k.setContentSize(a, b);
          this.k.setHTMLSize(a, b, 0, 0);
          this.k.fetchScript()
        }
      }, !1, this)
    }, this), this.da.__on("adaptv_swfloader_SwfLoadError", function() {
      this.Y.info("swfloader load error");
      Z(this, bd)
    }, this), this.da.init(a, b), this.da.load(rc() + "://redir.adap.tv/redir/client/static/AS3AdPlayer.swf?js\x3dadplayer", null, {events:eb(sc)}))
  }, this), 500)
};
k.startAd = function() {
  this.k.startBreak()
};
k.stopAd = function() {
  this.k.endBreak()
};
k.Oa = function(a, b, c) {
  this.d.push({type:a, fn:b, scope:c})
};
k.setVolume = function(a) {
  this.k.setVolume(a)
};
k.getVolume = function() {
  return this.k.getVolume()
};
k.n = function() {
  this.k.destroy()
};
var ad = "AdLoaded", cd = "AdStarted", fd = "AdCompanionDisplay", ed = "AdClickThru", $c = "AdStopped", bd = "AdError";
function gd() {
  this.Qa = q()
}
var hd = new gd;
gd.prototype.set = aa("Qa");
gd.prototype.reset = function() {
  this.set(q())
};
gd.prototype.get = g("Qa");
function id(a) {
  this.lb = a || "";
  this.sb = hd
}
k = id.prototype;
k.$a = !0;
k.Sa = !0;
k.qb = !0;
k.pb = !0;
k.Ta = !1;
k.rb = !1;
function $(a) {
  return 10 > a ? "0" + a : String(a)
}
function jd(a, b) {
  var c = (a.Ua - b) / 1E3, d = c.toFixed(3), e = 0;
  if(1 > c) {
    e = 2
  }else {
    for(;100 > c;) {
      e++, c *= 10
    }
  }
  for(;0 < e--;) {
    d = " " + d
  }
  return d
}
function kd(a) {
  id.call(this, a)
}
s(kd, id);
function ld() {
  this.mb = p(this.Za, this);
  this.oa = new kd;
  this.oa.Sa = !1;
  this.Ka = this.oa.Ta = !1;
  this.La = "";
  this.ab = {}
}
ld.prototype.Za = function(a) {
  if(!this.ab[a.Ma]) {
    var b;
    b = this.oa;
    var c = [];
    c.push(b.lb, " ");
    if(b.Sa) {
      var d = new Date(a.Ua);
      c.push("[", $(d.getFullYear() - 2E3) + $(d.getMonth() + 1) + $(d.getDate()) + " " + $(d.getHours()) + ":" + $(d.getMinutes()) + ":" + $(d.getSeconds()) + "." + $(Math.floor(d.getMilliseconds() / 10)), "] ")
    }
    b.qb && c.push("[", jd(a, b.sb.get()), "s] ");
    b.pb && c.push("[", a.Ma, "] ");
    b.rb && c.push("[", a.v.name, "] ");
    c.push(a.Na);
    b.Ta && a.na && c.push("\n", a.ma);
    b.$a && c.push("\n");
    b = c.join("");
    if(c = md) {
      switch(a.v) {
        case zc:
          nd(c, "info", b);
          break;
        case Ac:
          nd(c, "error", b);
          break;
        case Bc:
          nd(c, "warn", b);
          break;
        default:
          nd(c, "debug", b)
      }
    }else {
      window.opera ? window.opera.postError(b) : this.La += b
    }
  }
};
var md = window.console;
function nd(a, b, c) {
  if(a[b]) {
    a[b](c)
  }else {
    a.log(c)
  }
}
;r("__adaptv__.debug.configure", function(a, b) {
  Jc(a).va(b || Ec);
  var c = new ld;
  if(!0 != c.Ka) {
    Ic();
    var d = Hc, e = c.mb;
    d.L || (d.L = []);
    d.L.push(e);
    c.Ka = !0
  }
});
r("__adaptv__.debug.log", function(a) {
  Jc("adaptv.page").info(a)
});
r("__adaptv__.ads.VPAIDAd", Y);
r("__adaptv__.ads.VPAIDAd.prototype.initAd", Y.prototype.initAd);
r("__adaptv__.ads.VPAIDAd.prototype.startAd", Y.prototype.startAd);
r("__adaptv__.ads.VPAIDAd.prototype.stopAd", Y.prototype.stopAd);
r("__adaptv__.ads.VPAIDAd.prototype.on", Y.prototype.Oa);
r("__adaptv__.ads.VPAIDAd.prototype.setVolume", Y.prototype.setVolume);
r("__adaptv__.ads.VPAIDAd.prototype.getVolume", Y.prototype.getVolume);
r("__adaptv__.ads.VPAIDEvent.AdLoaded", ad);
r("__adaptv__.ads.VPAIDEvent.AdStarted", cd);
r("__adaptv__.ads.VPAIDEvent.AdCompanionDisplay", fd);
r("__adaptv__.ads.VPAIDEvent.AdClickThru", ed);
r("__adaptv__.ads.VPAIDEvent.AdStopped", $c);
r("__adaptv__.ads.VPAIDEvent.AdError", bd);
r("__adaptv__.ads.vpaid.VPAIDAd", Y);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.initAd", Y.prototype.initAd);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.startAd", Y.prototype.startAd);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.stopAd", Y.prototype.stopAd);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.on", Y.prototype.Oa);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.setVolume", Y.prototype.setVolume);
r("__adaptv__.ads.vpaid.VPAIDAd.prototype.getVolume", Y.prototype.getVolume);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdLoaded", ad);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdStarted", cd);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdCompanionDisplay", fd);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdClickThru", ed);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdStopped", $c);
r("__adaptv__.ads.vpaid.VPAIDEvent.AdError", bd);
})();