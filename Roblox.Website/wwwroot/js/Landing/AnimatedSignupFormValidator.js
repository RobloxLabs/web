; // Landing/AnimatedSignupFormValidator.js
typeof Roblox == "undefined" && (Roblox = {}), Roblox.AnimatedSignupFormValidator = function() {
    function i(n) {
        var r = parseInt($("#lstMonths option:selected").val()),
            i = parseInt($("#lstDays option:selected").val()),
            t = parseInt($("#lstYears option:selected").val());
        return Roblox.SignupFormValidatorGeneric.invalidBirthday(r, i, t) ? (n && (Roblox.SignupFormValidatorGeneric.selectedBirthday(r, i, t) ? $("#birthdayError").html(Roblox.Resources.AnimatedSignupFormValidator.invalidBirthday) : $("#birthdayError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#birthdayError").show(), $("#birthdayText").addClass("error"), $("#birthdayGood").hide()), !1) : ($("#birthdayGood").show(), $("#birthdayError").hide(), $("#birthdayText").removeClass("error"), !0)
    }

    function t() {
        var t = $("#MaleBtn:checked"),
            n = $("#FemaleBtn:checked");
        return Roblox.SignupFormValidatorGeneric.genderSelected(t, n) ? ($("#genderGood").show(), $("#genderError").hide(), $("#genderText").removeClass("error"), !0) : ($("#genderError").text(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#genderError").show(), $("#genderGood").hide(), $("#genderText").addClass("error"), !1)
    }

    function s() {
        var t = $("#username").val(),
            n;
        if (t.length == 0) {
            $("#usernameGood").hide(), $("#usernameError").show(), $("#usernameText").removeClass("error");
            return
        }
        n = o(t), n != "" ? ($("#usernameError").html(n), $("#usernameError").show(), $("#usernameText").addClass("error")) : ($("#usernameError").hide(), $("#usernameText").removeClass("error"), c())
    }

    function o(n) {
        var t = "";
        return Roblox.SignupFormValidatorGeneric.usernameTooLong(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.tooLong), Roblox.SignupFormValidatorGeneric.usernameTooShort(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.tooShort), Roblox.SignupFormValidatorGeneric.usernameRegexInvalid(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.invalidName), t
    }

    function c() {
        var i = $("#username").val(),
            t = function(n) {
                n.data == 1 ? ($("#usernameError").html(Roblox.Resources.AnimatedSignupFormValidator.alreadyTaken), $("#usernameError").show(), $("#usernameText").addClass("error"), $("#usernameGood").hide()) : n.data == 2 ? ($("#usernameError").html(Roblox.Resources.AnimatedSignupFormValidator.cantBeUsed), $("#usernameError").show(), $("#usernameText").addClass("error"), $("#usernameGood").hide()) : n.data == 0 && ($("#usernameError").hide(), $("#usernameText").removeClass("error"), $("#usernameGood").show())
            },
            n = function() {};
        $.ajax({
            type: "GET",
            url: "/UserCheck/checkifinvalidusernameforsignup?username=" + i,
            success: t,
            error: n
        })
    }

    function h() {
        var i = $("#password").val(),
            u = $("#username").val(),
            t;
        if (n(), $("#password").val().length == 0) {
            $("#passwordError").hide(), $("#passwordGood").hide(), $("#passwordText").removeClass("error");
            return
        }
        t = r(i, u), t != "" ? ($("#passwordError").html(t), $("#passwordError").show(), $("#passwordText").addClass("error"), $("#passwordGood").hide()) : ($("#passwordError").hide(), $("#passwordText").removeClass("error"), $("#passwordGood").show())
    }

    function n() {
        var t = $("#password").val(),
            n = $("#passwordConfirm").val();
        if ($("#passwordError").css("display") != "none" || n == "" || t == "") {
            $("#passwordConfirmGood").hide(), $("#passwordConfirmError").hide(), $("#passwordConfirmText").removeClass("error");
            return
        }
        Roblox.SignupFormValidatorGeneric.passwordsMatch(t, n) ? ($("#passwordConfirmGood").show(), $("#passwordConfirmError").hide(), $("#passwordConfirmText").removeClass("error")) : ($("#passwordConfirmError").html(Roblox.Resources.AnimatedSignupFormValidator.doesntMatch), $("#passwordConfirmError").show(), $("#passwordConfirmText").addClass("error"), $("#passwordConfirmGood").hide())
    }

    function r(n, t) {
        var i = "";
        return Roblox.SignupFormValidatorGeneric.passwordTooLong(n) ? i = Roblox.Resources.AnimatedSignupFormValidator.tooLong : Roblox.SignupFormValidatorGeneric.passwordTooShort(n) ? i = Roblox.Resources.AnimatedSignupFormValidator.tooShort : (Roblox.SignupFormValidatorGeneric.passwordEnoughLetters(n) || (i = Roblox.Resources.AnimatedSignupFormValidator.needsFourLetters), Roblox.SignupFormValidatorGeneric.passwordEnoughNumbers(n) || (i = Roblox.Resources.AnimatedSignupFormValidator.needsTwoNumbers), Roblox.SignupFormValidatorGeneric.passwordContainsSpaces(n) && (i = Roblox.Resources.AnimatedSignupFormValidator.noSpaces)), Roblox.SignupFormValidatorGeneric.weakPassword(n) && (i = Roblox.Resources.AnimatedSignupFormValidator.weakKey), Roblox.SignupFormValidatorGeneric.passwordIsUsername(n, t) && (i = Roblox.Resources.AnimatedSignupFormValidator.invalidName), i
    }

    function e() {
        var e = i(!0),
            o = t(),
            f = u(),
            n = $("#usernameError").css("display") == "none",
            r = $("#passwordError").css("display") == "none" && $("#passwordConfirmError").css("display") == "none";
        return e && o && f && r && n ? !0 : !1
    }

    function u() {
        var n = !0;
        return $("#password").val().length == 0 && ($("#passwordError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#passwordError").show(), $("#passwordText").addClass("error"), n = !1), $("#passwordConfirm").val().length == 0 && ($("#passwordConfirmError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#passwordConfirmError").show(), $("#passwordConfirmText").addClass("error"), n = !1), $("#username").val().length == 0 && ($("#usernameError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#usernameError").show(), $("#usernameText").addClass("error"), n = !1), n
    }
    return {
        checkBirthday: i,
        checkGender: t,
        checkUsername: s,
        checkPassword: h,
        checkPasswordConfirm: n,
        validateForm: e
    }
}();