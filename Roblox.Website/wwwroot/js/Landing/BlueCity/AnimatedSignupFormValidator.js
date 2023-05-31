typeof Roblox == "undefined" && (Roblox = {}), Roblox.AnimatedSignupFormValidator = function() {
    function r(n) {
        var r = parseInt($("#lstMonths option:selected").val()),
            i = parseInt($("#lstDays option:selected").val()),
            t = parseInt($("#lstYears option:selected").val());
        return Roblox.SignupFormValidatorGeneric.invalidBirthday(r, i, t) ? (n && (Roblox.SignupFormValidatorGeneric.selectedBirthday(r, i, t) ? $("#birthdayError").html(Roblox.Resources.AnimatedSignupFormValidator.invalidBirthday) : $("#birthdayError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#birthdayError").show(), $("#birthdayText").addClass("error"), $("#birthdayGood").hide()), !1) : ($("#birthdayGood").show(), $("#birthdayError").hide(), $("#birthdayText").removeClass("error"), !0)
    }

    function i() {
        var t = $("#MaleBtn:checked"),
            n = $("#FemaleBtn:checked");
        return Roblox.SignupFormValidatorGeneric.genderSelected(t, n) ? ($("#genderGood").show(), $("#genderError").hide(), $("#genderText").removeClass("error"), !0) : ($("#genderError").text(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#genderError").show(), $("#genderGood").hide(), $("#genderText").addClass("error"), !1)
    }

    function c() {
        var t = $("#username").val(),
            n;
        if (t.length == 0) {
            $("#usernameGood").hide(), $("#usernameError").show(), $("#usernameText").removeClass("error");
            return
        }
        n = s(t), n != "" ? ($("#usernameError").html(n), $("#usernameError").show(), $("#usernameText").addClass("error")) : ($("#usernameError").hide(), $("#usernameText").removeClass("error"), h())
    }

    function s(n) {
        var t = "";
        return Roblox.SignupFormValidatorGeneric.usernameTooLong(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.tooLong), Roblox.SignupFormValidatorGeneric.usernameTooShort(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.tooShort), Roblox.SignupFormValidatorGeneric.usernameRegexInvalid(n) && (t = Roblox.Resources.AnimatedSignupFormValidator.invalidName), t
    }

    function h() {
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

    function f() {
        var i = $("#password").val(),
            r = $("#username").val(),
            n;
        if (t(), $("#password").val().length == 0) {
            $("#passwordError").hide(), $("#passwordGood").hide(), $("#passwordText").removeClass("error");
            return
        }
        n = o(i, r), n != "" ? ($("#passwordError").html(n), $("#passwordError").show(), $("#passwordText").addClass("error"), $("#passwordGood").hide()) : ($("#passwordError").hide(), $("#passwordText").removeClass("error"), $("#passwordGood").show())
    }

    function t() {
        var t = $("#password").val(),
            n = $("#passwordConfirm").val();
        if ($("#passwordError").css("display") != "none" || n == "" || t == "") {
            $("#passwordConfirmGood").hide(), $("#passwordConfirmError").hide(), $("#passwordConfirmText").removeClass("error");
            return
        }
        Roblox.SignupFormValidatorGeneric.passwordsMatch(t, n) ? ($("#passwordConfirmGood").show(), $("#passwordConfirmError").hide(), $("#passwordConfirmText").removeClass("error")) : ($("#passwordConfirmError").html(Roblox.Resources.AnimatedSignupFormValidator.doesntMatch), $("#passwordConfirmError").show(), $("#passwordConfirmText").addClass("error"), $("#passwordConfirmGood").hide())
    }

    function o(n, t) {
        var i = "";
        return Roblox.SignupFormValidatorGeneric.passwordTooLong(n) ? i = Roblox.Resources.AnimatedSignupFormValidator.tooLong : Roblox.SignupFormValidatorGeneric.passwordTooShort(n) ? i = Roblox.Resources.AnimatedSignupFormValidator.tooShort : (Roblox.SignupFormValidatorGeneric.passwordEnoughLetters(n) || (i = Roblox.Resources.AnimatedSignupFormValidator.needsFourLetters), Roblox.SignupFormValidatorGeneric.passwordEnoughNumbers(n) || (i = Roblox.Resources.AnimatedSignupFormValidator.needsTwoNumbers), Roblox.SignupFormValidatorGeneric.passwordContainsSpaces(n) && (i = Roblox.Resources.AnimatedSignupFormValidator.noSpaces)), Roblox.SignupFormValidatorGeneric.weakPassword(n) && (i = Roblox.Resources.AnimatedSignupFormValidator.weakKey), Roblox.SignupFormValidatorGeneric.passwordIsUsername(n, t) && (i = Roblox.Resources.AnimatedSignupFormValidator.invalidName), i
    }

    function u() {
        var s = r(!0),
            h = i(),
            c = e(),
            o = $("#usernameError").css("display") == "none",
            u = $("#passwordError").css("display") == "none" && $("#passwordConfirmError").css("display") == "none",
            t = !0,
            f = n();
        return ($("#email").length > 0 && (Roblox.FormValidator.validateElementRegex($("#email")) || (t = !1)), s && h && c && u && o && t && f) ? !0 : !1
    }

    function e() {
        var n = !0;
        return $("#password").val().length == 0 && ($("#passwordError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#passwordError").show(), $("#passwordText").addClass("error"), n = !1), $("#passwordConfirm").val().length == 0 && ($("#passwordConfirmError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#passwordConfirmError").show(), $("#passwordConfirmText").addClass("error"), n = !1), $("#username").val().length == 0 && ($("#usernameError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#usernameError").show(), $("#usernameText").addClass("error"), n = !1), $("#email").length > 0 && $("#email").val().length == 0 && ($("#emailError").html(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#emailError").show(), $("#emailText").addClass("error"), n = !1), n
    }

    function n() {
        var n = !0;
        return $("#WomAttributionSectionTest").length && $('input[name="womAttribution"]').length && (n = $('input[name="womAttribution"]:checked').length, n ? ($("#womAttributionError").hide(), $("#womAttributionText").removeClass("error"), $("#womAttributionGood").show()) : ($("#womAttributionError").text(Roblox.Resources.AnimatedSignupFormValidator.requiredField), $("#womAttributionGood").hide(), $("#womAttributionError").show(), $("#womAttributionText").addClass("error"))), n
    }
    return $("#email").keyup(function() {
        if ($(this).val().length == 0) {
            $("#emailText").removeClass("error"), $("#emailGood").hide(), $("#emailError").hide();
            return
        }
        Roblox.FormValidator.validateElementRegex($(this)) ? ($("#emailError").hide(), $("#emailText").removeClass("error"), $("#emailGood").show()) : ($("#emailError").html(Roblox.Resources.AnimatedSignupFormValidator.invalidEmail), $("#emailGood").hide(), $("#emailError").show(), $("#emailText").addClass("error"))
    }), {
        checkBirthday: r,
        checkGender: i,
        checkUsername: c,
        checkPassword: f,
        checkPasswordConfirm: t,
        checkWomAttributionTest: n,
        validateForm: u
    }
}();