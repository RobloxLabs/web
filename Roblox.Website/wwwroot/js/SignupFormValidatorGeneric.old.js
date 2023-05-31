typeof Roblox == "undefined" && (Roblox = {}), Roblox.SignupFormValidatorGeneric = function() {
    function a(n, t, i) {
        return i <= 0 || n <= 0 || t <= 0 || t > new Date(i, n, 0).getDate()
    }

    function v(n, t, i) {
        return i != 0 && n != 0 && t != 0
    }

    function c(n, t) {
        return $(n).length != 0 || $(t).length != 0
    }

    function l(n) {
        return n.length > 20
    }

    function y(n) {
        return n.length < 3
    }

    function b(n) {
        return !n.match(/^[a-zA-Z0-9]*$/)
    }

    function k(n) {
        var i = function(n) {
                return n.data == 1 ? 1 : n.data == 2 ? 2 : n.data == 0 ? 0 : void 0
            },
            t = function() {};
        $.ajax({
            type: "GET",
            url: "/UserCheck/checkifinvalidusernameforsignup?username=" + n,
            success: i,
            error: t
        })
    }

    function p(n, t) {
        return t == "" || n.length > 0 && t != "" && n == t
    }

    function w(n) {
        return n.length > 20
    }

    function h(n) {
        return n.length < 6
    }

    function i(n) {
        return s(n) > 3
    }

    function r(n) {
        return f(n) > 1
    }

    function n(n) {
        return o(n) > 0
    }

    function t(n, t) {
        return n == t
    }

    function u(n) {
        return (n = n.toLowerCase(), n.indexOf("asdf") > -1) ? !0 : n.indexOf("pass") > -1 || n.indexOf("qwer") > -1 || n.indexOf("zxcv") > -1 || n.indexOf("aaaa") > -1 || n.indexOf("zzzz") > -1 ? !0 : !1
    }

    function o(n) {
        var r = /^\s$/,
            i = 0,
            t;
        if (n == null || n == "") return 0;
        for (t = 0; t < n.length; t++) n.charAt(t).match(r) && (i += 1);
        return i
    }

    function s(n) {
        var r = /^[A-Za-z]$/,
            i = 0,
            t;
        if (n == null || n == "") return 0;
        for (t = 0; t < n.length; t++) n.charAt(t).match(r) && (i += 1);
        return i
    }

    function f(n) {
        var r = /^[0-9]$/,
            i = 0,
            t;
        if (n == null || n == "") return 0;
        for (t = 0; t < n.length; t++) n.charAt(t).match(r) && (i += 1);
        return i
    }
    return {
        invalidBirthday: a,
        selectedBirthday: v,
        genderSelected: c,
        usernameTooLong: l,
        usernameTooShort: y,
        usernameRegexInvalid: b,
        usernameInvalid: k,
        passwordTooLong: w,
        passwordTooShort: h,
        passwordEnoughLetters: i,
        passwordEnoughNumbers: r,
        passwordContainsSpaces: n,
        passwordIsUsername: t,
        passwordsMatch: p,
        weakPassword: u
    }
}();