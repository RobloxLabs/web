if (typeof Roblox === "undefined") {
	Roblox = {};
}

Roblox.iFrameLogin = new function () {
    var ChallengeOrResponseMissingCode = "1";
    var UnableToVerifyCaptchaCode = "2";
    var ErrorOccurredCode = "3";
    var RequireTwoFactorAuthCode = "4";
    var FeatureDisabledCode = "5";
    var CaptchaChangedCode = "6";
    var IncorrectCredentialCode = "7";
    var CaptchaValidationError = "8";

    function init() {
        var requireRedirect = $(document.body).data("redirecttohttp");
        var captchaOn = $(document.body).data("captchaon");
        var holdOnAnotherEnter = false;
        var inValidUserName = true;

        var resizeParent = function (size) {
            var parentUrl = $(document.body).data("parent-url");
            $.postMessage('resize,' + size, parentUrl, parent);
        };

        //Resize div if Captcha is ON
        if (captchaOn) {
            resizeParent('265px');
        } else {
            resizeParent('128px');
        }

        var showLoggingIn = function (displayLoggingIn) {
            if (displayLoggingIn) {
                $('#LoginButton').hide();
                $('#LoggingInStatus').show();
            } else {
                $('#LoginButton').show();
                $('#LoggingInStatus').hide();
            }
        };

        var validateInputs = function () {
            var invalid = false;
            var inputs = [$('#Password'), $('#UserName')];
            if (captchaOn)
                inputs.push($('#recaptcha_response_field'));
            jQuery.each(inputs, function () {
                var $input = $(this);
                if ($input.val() == '') {
                    displayInputError($input, true);
                    invalid = true;
                } else
                    displayInputError($input, false);
            });
            return invalid;
        };

        var displayInputError = function (div, mode) {
            holdOnAnotherEnter = false;
            showLoggingIn(false);
            if (mode)
                div.css({ 'background-color': '#FDD' });
            else
                div.css({ 'background-color': 'white' });
        };

        var submitLogin = function () {
            //Validate Inputs
            if (validateInputs())
                return false;
            if (inValidUserName) {
                displayInputError($('#UserName'), true);
                return false;
            }
            holdOnAnotherEnter = true;
            showLoggingIn(true);
            var password = ($('#Password').val());
            var userName = ($('#UserName').val());
            var ch = '';
            var resp = '';
            if (captchaOn) {
                ch = $('#recaptcha_challenge_field').val();
                resp = $('#recaptcha_response_field').val();
                if (ch == "" || resp == "") {
                    displayInputError($('#recaptcha_response_field'), true);
                    return false;
                }
            }
            if (captchaOn)
                $('#Captcha_upBadCaptcha').text("");
            var onSuccess = onError = function (result, context) {
                if (result.IsValid) {
                    var topUrl;
                    //Redirect based on http/https
                    if (requireRedirect) {
                        topUrl = $(document.body).data("parent-url");
                    } else {
                        topUrl = window.parent.location.href;
                    }
                    if (topUrl.indexOf('#') != -1)
                        topUrl = window.parent.location.href.split('#')[0];
                    if (topUrl.indexOf('?') == -1)
                        topUrl += "?nl=true";
                    else
                        topUrl += "&nl=true";
                    window.parent.location = topUrl;
                    
                } else {
                    //Reload Page if Captcha control changed
                    if (result.ErrorCode.indexOf(CaptchaChangedCode) != -1) {
                        if (userName != '' && window.location.href.indexOf('username') == -1) {
                            window.location.href = window.location.href + '&username=' + userName;
                        } else
                            window.location.reload();
                        return false;
                    }
                    //Handle the Failure Response
                    if (result.ErrorCode.indexOf(RequireTwoFactorAuthCode) != -1) {
                        window.parent.location = "/login/twofactorauth?username=" + encodeURIComponent(userName);
                    }
                    if (result.ErrorCode.indexOf(IncorrectCredentialCode) != -1) {
                        displayInputError($('#Password'), true);
                        $("#NotAMemberLink").hide();
                        $("#ForgotPasswordLink").show();
                    } else if (result.ErrorCode.indexOf(ErrorOccurredCode) != -1) {
                        resizeParent('145px');
                        $('#ErrorMessage').text(result.Message);
                    } else if (result.ErrorCode.indexOf(FeatureDisabledCode) != -1) {
                        $('#ErrorMessage').text(result.Message);
                    }
                    //Else all other errors are to do with Captcha -if(result.Message == 'incorrect-captcha-sol')						
                    else {
                        //Increase size of the window to display the error message:
                        resizeParent('280px');
                        displayInputError($('#Password'), false);
                        $('#Captcha_upBadCaptcha').show();
                        $('#Captcha_upBadCaptcha').css("color", "red");
                        if (result.Message == 'incorrect-captcha-sol')
                            $('#Captcha_upBadCaptcha').text(Roblox.iFrameLogin.Resources.invalidCaptchaEntry);
                        else
                            $('#Captcha_upBadCaptcha').text(result.Message);
                    }
                    if (captchaOn) {
                        Recaptcha.reload("t"); // Required to avoid Captcha control from overriding focus()
                    }
                    $('#Password').val("");
                    $('#Password').focus();
                    holdOnAnotherEnter = false;
                    showLoggingIn(false);
                    return false;
                }
            }
            Roblox.Website.Services.Secure.LoginService.ValidateLogin(userName, password, captchaOn, ch, resp, onSuccess, onError);
        };

        var verifyUserName = function () {
            var userName = $('#UserName').val();
            //Trim whitespaces in the UserName
            userName = userName.replace(/ /g, '');
            $('#UserName').val(userName);
            var onSuccess = onError = function (result, context) {
                displayInputError($('#UserName'), !result.success);
                inValidUserName = !result.success;
                if (!result.success) {
                    $("#NotAMemberLink").show();
                    $("#ForgotPasswordLink").hide();
                }
            };
            if (userName != "")
                $.ajax({
                    type: "GET",
                    url: "/UserCheck/doesusernameexist?username=" + userName,
                    success: onSuccess,
                    error: onError
                });
        };

        $('#LoginButton').click(function () {
            submitLogin();
        });

        $('#UserName').blur(function () {
            verifyUserName();
        });

        $(document).keydown(function (event) {
            if (event.which == 13 && !holdOnAnotherEnter) {
                submitLogin();
                return false;
            }
        });
        $(function () {
            var tabindex = 1;
            $('input,select').each(function () {
                if (this.type != 'hidden') {
                    var $input = $(this);
                    $input.attr('tabindex', tabindex);
                    tabindex++;
                }
            });
        });
        //If page is reloaded with UserName, then User is Valid
        $(function () {
            if ($('#UserName').val() != '' || $('#UserName').val() != undefined);
            inValidUserName = false;
        });
        //Fix captcha CSS
        $(function () {
            $('#CaptchaContainer').css({ 'margin-left': '0', 'margin-top': '8px', 'width': 'none' });
        });
    }

    return { init: init };
}