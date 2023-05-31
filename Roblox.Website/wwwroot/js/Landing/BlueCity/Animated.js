; // Landing/Animated.js
$(function() {
    function r(n, t) {
        t.xpos = -.71 * n;
		t.logo.css("background-position", t.xpos + "px 0");
    }

    function e(n, t) {
        t.xpos = -.35 * n;
		t.logo.css("background-position", t.xpos + "px 0");
    }

    function n() {
        $("#animated-signup").show();
		$("#animated-login").hide();
		$("#animated-tab-signup").addClass("animated-tab-selected");
		$("#animated-tab-login").removeClass("animated-tab-selected");
    }

    function i() {
        $("#animated-login").show();
		$("#animated-signup").hide();
		$("#animated-tab-login").addClass("animated-tab-selected");
		$("#animated-tab-signup").removeClass("animated-tab-selected");
    }
    var f = {
            xpos: 0,
            logo: $("#Container")
        },
        o = {
            xpos: 0,
            logo: $("body")
        },
        u = $("#Experimental").data("is-animated") == "True",
        t;
    if (u) {
		(new Animator).init(f, r, 1e4, 60, !1, 0).start();
		(new Animator).init(o, e, 2e4, 60, !1, 0).start();
	}
	
	$("#UserName,#Password,#PasswordConfirm,#SignUpButton").keypress(function(n) {
        n.which == "13" && Roblox.AnimatedSignupFormValidator.validateForm() && $("#SignUpButton").click();
    });
	$("#UserName").blur(Roblox.AnimatedSignupFormValidator.checkUsername);
	$("#animated-tab-login").click(function() {
        i();
    });
	$("#animated-tab-signup").click(function() {
        n();
    });
	t = $("#animated-wrapper").data("first-visit"), t == "True" ? n() : i(), $("#loginUsername,#loginPassword").keypress(function(n) {
        n.which == "13" && Roblox.AnimatedLoginFormValidator.validateLoginForm() && $("#login-button").click();
    });
	$("#login-button").click(function() {
        Roblox.AnimatedLoginFormValidator.validateLoginForm() && $("#login-form").submit();
    })
});