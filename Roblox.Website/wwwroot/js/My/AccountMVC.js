var RobloxMissingParentEmail = {
    resetParentEmail: false,
    hasParentEmailBeenReset: false
};
Roblox.ChangeUsername = function () {

    var passwordRequiredText = "";
    var unknownErrorText = "";
    var newUsernameFieldLabel = "";
    var newUsernameHintText = "";
    var passwordLabel = "";
    var processIndicatorImageUrl = "";
    var processingText = "";

    var initializeStrings = function () {
        passwordRequiredText = Roblox.ChangeUsername.Resources.passwordRequiredText;
        unknownErrorText = Roblox.ChangeUsername.Resources.unknownErrorText;
        newUsernameFieldLabel = Roblox.ChangeUsername.Resources.newUsernameFieldLabel;
        newUsernameHintText = Roblox.ChangeUsername.Resources.newUsernameHintText;
        passwordLabel = Roblox.ChangeUsername.Resources.passwordLabel;
        warningText = Roblox.ChangeUsername.Resources.warningText;
        processIndicatorImageUrl = Roblox.ChangeUsername.Resources.processIndicatorImageUrl;
        processingText = Roblox.ChangeUsername.Resources.processingText;
    };

    //From: http://www.mredkj.com/javascript/numberFormat.html
    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var whole = x[0];
        var decimal = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(whole)) {
            whole = whole.replace(rgx, '$1' + ',' + '$2');
        }
        return whole + decimal;
    }

    function showInsufficientFundsModal(robuxRemaining, alerturl) {
        var buyRobuxUrl = $('#UsernameSetting').data('buy-robux-url');
        Roblox.GenericConfirmation.open({
            titleText: Roblox.ChangeUsername.Resources.insufficientFundsTitle,
            bodyContent: String.format(Roblox.ChangeUsername.Resources.insufficientFundsText, "<span class='robux notranslate'>" + addCommas(robuxRemaining) + "</span>"),
            acceptText: Roblox.ChangeUsername.Resources.insufficientFundsAcceptText,
            acceptColor: Roblox.GenericConfirmation.green,
            onAccept: function () { window.location.href = buyRobuxUrl; },
            declineText: Roblox.AccountResources.cancelText,
            imageUrl: alerturl,
            footerText: Roblox.ChangeUsername.Resources.insufficientFundsFooter,
            allowHtmlContentInBody: true,
            allowHtmlContentInFooter: true,
            dismissable: true
        });
    }

    function showVerifiedEmailRequiredModal() {
        Roblox.GenericConfirmation.open({
            titleText: Roblox.ChangeUsername.Resources.emailVerifiedTitle,
            bodyContent: Roblox.ChangeUsername.Resources.emailVerifiedMessage,
            onAccept: function () {
                window.location.href = "/my/account?confirmemail=1";
            },
            acceptColor: Roblox.GenericConfirmation.blue,
            acceptText: Roblox.ChangeUsername.Resources.verify,
            declineText: Roblox.AccountResources.cancelText,
            allowHtmlContentInBody: true
        });
    }

    function showProcessingModal() {
        var modalProperties = { overlayClose: false, opacity: 80, overlayCss: { backgroundColor: "#000" }, escClose: false };

        $("#ProcessingView").modal(modalProperties);
    };

    function validateUsernameChangeFields() {
        if ($('#roblox-confirm-btn').is("a[disabled]")) {
            return false;
        }
        var password = validatePassword();
        if (password.length > 0) {
            return validateUsernameChange(password);
        }
        return false;
    }

    function validatePassword() {
        var password = $('#PasswordTextBox').val();

        if (password == "") {
            $('#noPassword').show();
            return '';
        }

        return password;
    }

    function validateUsernameChange(password) {
        var acceptBtn = $('#roblox-confirm-btn');
        var declineBtn = $('#roblox-decline-btn');
        acceptBtn.addClass('btn-disabled-neutral');
        declineBtn.addClass('btn-disabled-negative');
        acceptBtn.attr("disabled", true);
        declineBtn.attr("disabled", true);
        $('#Processing').show();
        var currentUsername = $('#username').text();
        var username = $('#UserName').val();
        var token = $('[name=__RequestVerificationToken]').val();
        var verifyUpdateUrl = $('#UsernameSetting').data('change-username-verifyurl');
        $.ajax(verifyUpdateUrl, {
            type: "POST",
            cache: false,
            data: { __RequestVerificationToken: token, username: username, password: password },
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    $(document).unbind('keypress'); //we bound the enter key earlier, we need to unbind it to prevent user error
                    Roblox.GenericConfirmation.close(); //force close the generic modal
                    $('#Processing').hide();
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.ChangeUsername.Resources.changeUsernameTitle,
                        bodyContent: String.format(Roblox.ChangeUsername.Resources.confirmUsernameChangeText, username),
                        allowHtmlContentInBody: true,
                        acceptColor: Roblox.GenericConfirmation.green,
                        footerText: String.format(Roblox.ChangeUsername.Resources.confirmUsernameChangeFooterText, data.remainingBalance),
                        acceptText: Roblox.ChangeUsername.Resources.confirmUsernameChangeAccept,
                        declineText: Roblox.AccountResources.cancelText,
                        dismissable: false,
                        onAccept: function () {
                            if ($('#roblox-confirm-btn').is("a[disabled]")) {
                                return false;
                            }
                            var acceptBtn = $('#roblox-confirm-btn');
                            var declineBtn = $('#roblox-decline-btn');
                            acceptBtn.addClass('btn-disabled-primary');
                            declineBtn.addClass('btn-disabled-negative');
                            acceptBtn.attr("disabled", true);
                            declineBtn.attr("disabled", true);
                            showProcessingModal();
                            purchaseNameChange(username, password);
                        }
                    });
                } else {
                    if (data.newModal) {
                        Roblox.GenericConfirmation.open({
                            titleText: data.title,
                            bodyContent: data.message,
                            acceptText: "OK",
                            acceptColor: Roblox.GenericConfirmation.blue,
                            declineColor: Roblox.GenericConfirmation.none,
                            imageUrl: $('#UsernameSetting').data('alerturl'),
                            allowHtmlContentInBody: false,
                            dismissable: false
                        });
                    } else {
                        $('#StandardError span').text(data.message);
                        $('#StandardError').show();
                        $('#Processing').hide();
                        $('.ConfirmationModalButtonContainer a').removeClass('btn-disabled-neutral');
                        $('.ConfirmationModalButtonContainer a').removeClass('btn-disabled-negative');
                        $('.ConfirmationModalButtonContainer a').attr("disabled", false);
                    }
                }
            }
        });

        return false;

    }

    function purchaseNameChange(username, password) {
        var token = $('[name=__RequestVerificationToken]').val();
        var updateUrl = $('#UsernameSetting').data('change-username-url');
        $.ajax(updateUrl, {
            type: "POST",
            cache: false,
            data: { __RequestVerificationToken: token, username: username, password: password },
            dataType: "json",
            success: function (data) {
                $.modal.close(".simplemodal-overlay");
                var acceptBtn = $('#roblox-confirm-btn');
                var declineBtn = $('#roblox-decline-btn');
                acceptBtn.attr("disabled", false);
                declineBtn.attr("disabled", false);
                if (data.success) {
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.ChangeUsername.Resources.changeUsernameTitle,
                        bodyContent: String.format(Roblox.ChangeUsername.Resources.usernameChangedText, username),
                        acceptText: Roblox.AccountResources.okText,
                        acceptColor: Roblox.GenericConfirmation.blue,
                        declineColor: Roblox.GenericConfirmation.none,
                        allowHtmlContentInBody: true,
                        dismissable: false,
                        onAccept: function () { location.reload(); }
                    });
                } else {
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.ChangeUsername.Resources.usernameChangeErrorTitle,
                        bodyContent: Roblox.ChangeUsername.Resources.usernameChangeErrorText + data.message,
                        acceptText: Roblox.AccountResources.okText,
                        acceptColor: Roblox.GenericConfirmation.blue,
                        declineColor: Roblox.GenericConfirmation.none,
                        imageUrl: $('#UsernameSetting').data('alerturl'),
                        allowHtmlContentInBody: false,
                        dismissable: false
                    });
                }
            }
        });
    }

    function initializeChangeUsernameButton() {
        $('#changeUsername').click(function () {
            var usernameSetting = $('#UsernameSetting');
            var robuxRemaining = usernameSetting.data('robux-remaining');
            if (usernameSetting.data('email-verified') == "False") {
                showVerifiedEmailRequiredModal();
            } else if (robuxRemaining > 0) {
                showInsufficientFundsModal(robuxRemaining, usernameSetting.data('alerturl'));
            } else {
                var errorFields =
                    "<div id='noPassword' style='display: none' class='validation-summary-errors'>" +
                        "<span class='text'>" +
                            passwordRequiredText +
                        "</span>" +
                    "</div>" +
                    "<div id='StandardError' style='display: none' class='validation-summary-errors'>" +
                        "<span class='text'>" +
                            unknownErrorText +
                        "</span>" +
                    "</div>";

                var newUsernameField =
                    '<label class="form-label" for="username" style="float:left;">' +
                        newUsernameFieldLabel +
                    '</label>' +
                    '<div class="validation">' +
                        '<table id="UsernameError" class="validator-container">' +
                            '<tr><td>' +
                                '<div class="validator-tooltip-main">' +
                                    '<div id="usernameErrorMessage"></div>' +
                                '</div>' +
                            '</td></tr>' +
                        '</table>' +
                        '<div id="usernameGood" class="validator-checkmark"></div>' +
                    '</div>' +
                    '<div class="rightFormColumn">' +
                        '<div class="inputColumn">' +
                            '<input type="text" class="text-box text-box-large change-username-name-textbox" value="" tabindex="99" id="UserName">' +
                        '</div>' +
                        '<div class="clear" style="font-size:0;"></div>' +
                        '<span class="tip-text">' + newUsernameHintText + '</span>' +
                    '</div>';

                var passwordField =
                    "<label class='form-label' style='float:left'>" + passwordLabel + "</label>" +
                    "<div class='rightFormColumn'>" +
                        "<div class='inputColumn'>" +
                            "<input id='PasswordTextBox' tabindex='100' type='password' class='text-box text-box-large change-username-password-textbox' />" +
                        "</div>" +
                    "</div>";

                var inputFieldsWrapperStart = "<div id=\"NameChangeInputFieldsWrapper\">";
                var inputFieldsWrapperEnd = "</div>";

                var processingImage = "<div style='clear:both;padding-bottom:10px;'></div><div style='height:10px;padding-left:45px;'><div id='Processing' style='display:none;'><img src='" + processIndicatorImageUrl + "' alt='" + processingText + "'/></div></div>";
                var warningField = "<div id=\"NameChangeWarning\" class=\"tip-text\">" + warningText + "</div>";

                Roblox.GenericConfirmation.open({
                    allowHtmlContentInBody: true,
                    allowHtmlContentInFooter: true,
                    titleText: Roblox.ChangeUsername.Resources.changeUsernameTitle,
                    bodyContent: inputFieldsWrapperStart + errorFields + newUsernameField + passwordField + inputFieldsWrapperEnd + processingImage,
                    acceptText: Roblox.ChangeUsername.Resources.proceedToBuyText,
                    declineText: Roblox.AccountResources.cancelText,
                    footerText: warningField,
                    fieldValidationRequired: true,
                    xToCancel: true,
                    dismissable: false,
                    onAccept: validateUsernameChangeFields,
                    onOpenCallback: function () {
                        $('#UserName').keydown(function (event) {
                            if (event.which == '32') {  // Ignore spaces
                                return false;
                            }
                        });
                        $('#UserName').blur(Roblox.SignupFormValidator.checkUsername);
                        $('#UsernameError').hide();
                        $(document).keypress(function (e) {
                            if (e.which == 13) {
                                $('#roblox-confirm-btn').click();
                            }
                            else if ($('#PasswordTextBox').is(":focus")) {
                                $('#noPassword').hide();
                            }
                        });
                    }
                });
            }
        });
    };

    return {
        initializeStrings: initializeStrings,
        initializeChangeUsernameButton: initializeChangeUsernameButton
    };
} ();

$(function () {

    var missingParentEmail = $('#AccountPageContainer').data('missingparentemail');
    var userAbove13 = $('#AccountPageContainer').data('userabove13');

    //If user changes the DOB to <13

    function checkIfUserUnder13() {
        //We need to get the New DOB
        var year = parseInt($('#AccountPageContainer #YearDropDown option:selected').val());
        var month = parseInt($('#AccountPageContainer #MonthDropDown option:selected').val());
        var day = parseInt($('#AccountPageContainer #DayDropDown option:selected').val());
        var enteredDate = new Date(year, month, day);
        var under13Date = new Date($('#AccountPageContainer').data('currentdateyear'), $('#AccountPageContainer').data('currentdatemonth'), $('#AccountPageContainer').data('currentdateday'));
        under13Date.setFullYear(under13Date.getFullYear() - 13);
        if (enteredDate > under13Date) {
            RobloxMissingParentEmail.resetParentEmail = true;
            Roblox.AddEmail.loadEmailModal(true);
            return true;
        } else {
            return false;
        }
    };

    $('.updateSettingsBtn').on('click', function (evt) {
        evt.preventDefault();
        if (!$('.updateSettingsBtn').hasClass('btn-disabled-neutral')) {
            if (userAbove13 && checkIfUserUnder13() && !RobloxMissingParentEmail.hasParentEmailBeenReset)
                return false;
        } else {
            return false;
        }
        document.getElementById("UpdateAccountForm").submit();
        return true;
    });

    $('#AccountPageContainer #YearDropDown').change(function () {
        checkIfUserUnder13();
    });

    $('#AskParentToVerifyAgeLink, #AskParentToAgeMeUp').click(function () {
        if (missingParentEmail) {
            Roblox.GenericConfirmation.open({
                titleText: Roblox.AccountResources.addParentEmailText,
                bodyContent: Roblox.AccountResources.missingParentBodyText,
                declineColor: Roblox.GenericConfirmation.none,
                acceptText: Roblox.AccountResources.okText,
                dismissable: false
            });
            return false;
        }
    });

    $('#UpdateEmail').click(function () {
        Roblox.AddEmail.loadEmailModal(!userAbove13);
        return false;
    });

    $('.changePassWord').click(function () {
        changePasswordModal.open();
        return false;
    });
    var blurbTouched = false;
    $("#blurbText").focus(function () {
        blurbTouched = true;
        if ($("#blurbText").val() == $("#blurbText")[0].title) {
            $("#blurbText").removeClass("blurbGreyText");
            $("#blurbText").val("");
        }
        
    });
    $("#blurbText").blur(function () {
        if ($("#blurbText").val() == "") {
            $("#blurbText").addClass("blurbGreyText");
            $("#blurbText").val($("#blurbText")[0].title);
            blurbTouched = false;
        }
    });
    $(".roblox-blurb-default-text").blur();
    //Add space for the Year drop down
    if ($('#YearDropDown').length > 0) {
        //$('#YearDropDown').width($('#YearDropDown').width() + 7);
    }

    if ($("#blurbText").val() == "" || $("#blurbText").val() == $("#blurbText")[0].title) {
        $("#blurbText").addClass("blurbGreyText");
        $("#blurbText").val($("#blurbText")[0].title);
    }

    $('#fbDisconnectOK').click(function () {
        $.modal.close("#FacebookDisconnectModal");
    });
    if ($('#chkNewsletter').length > 0) {
        $('#chkNewsletter').css({ 'margin': '0px 3px 2px 0px', 'vertical-align': 'text-bottom' });
    }
});


    $(function() {

        $('#VerifyEmailButton').on('click', function(evt) {
            evt.preventDefault();

            $.ajax({
                url: "/my/account/sendverifyemail",
                cache: false,
                type: 'post',
                success: function(status) {
                    Roblox.GenericModal.open("Send Verifification Email", null, status, function() {
                         return false;
                    }, false);
                }
            });
        });

        $('#UnlockPurchaseButton').on('click',function(evt){
            $.ajax({
                url: "/my/account/UnlockPurchase",
                cache: false,
                type: 'post',
                success: function(status) {
                    Roblox.GenericModal.open("Purchase Unlock", null, status, function() {
                         location.reload(true);
                    }, false);
                }
            });
        });

        $('#AskParentToVerifyAgeLink').on('click',function(evt){
            evt.preventDefault();
            $.ajax({
                url: "/my/account/AskParentVerifyAge",
                cache: false,
                type: 'post',
                success: function(status) {
                    Roblox.GenericModal.open("Age Verification", null, status, function() {
                    }, false);
                }
            });
        });

        $('#AskParentToAgeMeUp').on('click',function(evt){
            evt.preventDefault();
            $.ajax({
                url: "/my/account/AskParentToAgeMeUp",
                cache: false,
                type: 'post',
                success: function(status) {
                    Roblox.GenericModal.open("Age Up", null, status, function() {
                    }, false);
                }
            });
        });

        $('div.tab').bind('click', function () {
		    switchTabs($(this));
	    });
        // open first tab
        var firstCurrentTab = $('.tab-container div.tab.active');
        $('#' + firstCurrentTab.data('id')).show();
    });

    function switchTabs(nextTabElem) {
		var currentTab = $('.tab-container div.tab.active');
		currentTab.removeClass('active');
		$('#' + currentTab.data('id')).hide();
		nextTabElem.addClass('active');
		$('#' + nextTabElem.data('id')).show();
	}
