if (typeof Roblox === "undefined") {
    Roblox = {};
}

/* Roblox.SignupFormValidator handles the validation when a user signs up on the 
NewNameAndPassword.aspx page */
Roblox.SignupFormValidator = function () {
    $(function () {
        $('#UserName,#Password,#PasswordConfirm').keypress(function (event) {
            if (event.which == '13') {
                if (ValidateForm()) document.getElementById('ButtonCreateAccount').click();
            }
        });
        $('#UserName').blur(Roblox.SignupFormValidator.checkUsername);
    });

    function checkGender() {
        if ($('#MaleBtn:checked').length == 0 && $('#FemaleBtn:checked').length == 0) {
            $('#genderError').show();
            $('#genderGood').hide();
            return false;
        }
        else {
            $('#genderError').hide();
            $('#genderGood').show();
            return true;
        }
    }

    function checkPassword() {
        checkPasswordConfirm();

        if ($('#Password').val().length == 0) {
            $('#passwordError').hide();
            $('#passwordGood').hide();
            return; // don't do anything if empty
        }

        var error = verifyPassword($('#Password').val(), $('#UserName').val());
        if (error != "") {
            $('#passwordErrorMessage').html(error);
            $('#passwordError').show();
            $('#passwordGood').hide();
        } else {
            $('#passwordError').hide();
            $('#passwordGood').show();
        }
    }

    function checkPasswordConfirm() {
        var p0 = $('#Password').val();
        var p1 = $('#PasswordConfirm').val();

        // if either is empty, or the first password is bad, don't make any comment in the password confirm
        if ($('#passwordError').css('display') != 'none' || (p1 == "" || p0 == "")) {
            $('#passwordConfirmGood').hide();
            $('#passwordConfirmError').hide();
            return;
        }

        // if it matches
        var isMatch = testPasswordMatch(p0, p1);
        if (!isMatch) {
            $('#passwordConfirmError').show();
            $('#PasswordConfirmMessage').html("<p>" + Roblox.SignupFormValidator.Resources.doesntMatch + "</p>");
            $('#passwordConfirmGood').hide();
        } else {
            $('#passwordConfirmGood').show();
            $('#passwordConfirmError').hide();
        }
    }

    function checkUsername() {

        if ($('#UserName').val().length == 0) {
            $('#usernameGood').hide();
            $('#UsernameError').hide();
            return;
        }

        // check if errors related to length or regex
        var error = verifyUsername($('#UserName').val());
        if (error != "") {
            $('#usernameErrorMessage').html(error);
            $('#usernameErrorMessage').show();
            $('#UsernameError').show();
            $('#usernameGood').hide();
        } else {
            $('#UsernameError').hide();
            checkIfUsernameInvalid();
        }
    }
    function checkBirthday(showError) {
        var year = parseInt($('#lstYears option:selected').val());
        var month = parseInt($('#lstMonths option:selected').val());
        var day = parseInt($('#lstDays option:selected').val());

        // if valid
        if (year <= 0 || month <= 0 || day <= 0 || day > new Date(year, month, 0).getDate()) {
            if (showError) {
                if (year == 0 && month == 0 && day == 0) $('#birthdayErrorParagraph').html(Roblox.SignupFormValidator.Resources.requiredField);
                else $('#birthdayErrorParagraph').html('Invalid birthday');
                $('#birthdayError').show();
                $('#birthdayGood').hide();
            }
            return false;
        }
        else {
            $('#birthdayError').hide();
            $('#birthdayGood').show();
            return true;
        }
    }

    function checkIfPasswordIsGood() {
        return ($('#passwordError').css('display') == 'none' && $('#passwordConfirmError').css('display') == 'none');
    }

    function testPasswordMatch(pwd0, pwd1) {
        if (pwd1 == "" || pwd0.length > 0 && pwd1 != "" && pwd0 == pwd1)
            return true;
        return false;
    }
    function verifyUsername(username) {
        var msg = "";
        if (username.length > 20) msg += "<p>" + Roblox.SignupFormValidator.Resources.tooLong + "</p>";
        if (username.length < 3) msg += "<p>" + Roblox.SignupFormValidator.Resources.tooShort + "</p>";
        if (!username.match(/^[a-zA-Z0-9]*$/)) msg += "<p>" + Roblox.SignupFormValidator.Resources.containsInvalidCharacters + "</p>";
        return msg;
    }

    function verifyPassword(pwd, username) {
        // Someday, replace this with an AJAX call
        var msg = "";

        if (pwd.length > 20) {
            msg += "<p>" + Roblox.SignupFormValidator.Resources.tooLong + "</p>";
        } else if (pwd.length < 6) {
            msg += "<p>" + Roblox.SignupFormValidator.Resources.tooShort + "</p>";
        } else {
            if (countLettersInPassword(pwd) < 4) msg += "<p>" + Roblox.SignupFormValidator.Resources.needsFourLetters + "</p>";
            if (countNumbersInPassword(pwd) < 2) msg += "<p>" + Roblox.SignupFormValidator.Resources.needsTwoNumbers + "</p>";
            if (countSpaces(pwd) > 0) msg += "<p>" + Roblox.SignupFormValidator.Resources.noSpaces + "</p>";
        }

        if (weakPassword(pwd)) msg += "<p>" + Roblox.SignupFormValidator.Resources.weakKey + "</p>";
        if (pwd == username) msg += "<p>" + Roblox.SignupFormValidator.Resources.invalidName + "</p>";

        return msg;
    }
    function countSpaces(str) {
        var regExp = /^\s$/;
        var numSpaces = 0;
        if (str == null || str == "") {
            return 0;
        }
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i).match(regExp)) {
                numSpaces += 1;
            }
        }
        return numSpaces;
    }
    function countLettersInPassword(str) {
        var regExp = /^[A-Za-z]$/;
        var numLetters = 0;
        if (str == null || str == "") {
            return 0;
        }
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i).match(regExp)) {
                numLetters += 1;
            }
        }
        return numLetters;
    }
    function countNumbersInPassword(str) {
        var regExp = /^[0-9]$/;
        var numNumbers = 0;
        if (str == null || str == "") {
            return 0;
        }
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i).match(regExp)) {
                numNumbers += 1;
            }
        }
        return numNumbers;
    }
    function weakPassword(pwd) {
        if (pwd.indexOf("asdf") > -1) {
            return true;
        } else if (pwd.indexOf(Roblox.SignupFormValidator.Resources.password) > -1) {
            return true;
        } else if (pwd.indexOf("qwer") > -1) {
            return true;
        } else if (pwd.indexOf("zxcv") > -1) {
            return true;
        } else if (pwd.indexOf("aaaa") > -1) {
            return true;
        } else if (pwd.indexOf("zzzz") > -1) {
            return true;
        }
        return false;
    }

    function ValidateForm() {
        var validDate = checkBirthday(true);
        var validGender = checkGender();
        var noEmptyUsernameFields = CheckEmptyUsernameFields();
        var noUsernameErrors = $('#UsernameError').css('display') == 'none';
        var validEmail = true;

        if ($('#Email').length > 0) {
            if (!Roblox.FormValidator.validateElementRegex($('#Email'))) {
                validEmail = false;
            }
        }

        if (validDate && validGender && noEmptyUsernameFields && checkIfPasswordIsGood() && noUsernameErrors && validEmail) {
            return true;
        }
        return false;
    }

    /* show clientside errors when someone crosspostbacks to this page and serverside validation fails */
    function ValidateAndShowResponses() {
        checkBirthday(true);
        checkGender();
        checkUsername();
        checkPassword();
        CheckEmptyUsernameFields();
    }

    function checkIfUsernameInvalid() {
        var username = $get('UserName').value;
        var onSuccess = function (result, context) {
        if (result.data == 1) {
                $('#usernameErrorMessage').html("<p>" + Roblox.SignupFormValidator.Resources.alreadyTaken + "</p>");
                $('#usernameErrorMessage').show();
                $('#UsernameError').show();
                $('#usernameGood').hide();
            } else if (result.data == 2) { // automoderated
                $('#usernameErrorMessage').html("<p>" + Roblox.SignupFormValidator.Resources.cantBeUsed + "</p>");
                $('#usernameErrorMessage').show();
                $('#UsernameError').show();
                $('#usernameGood').hide();
            } else if (result.data == 0) {
                $('#usernameErrorMessage').hide();
                $('#UsernameError').hide();
                $('#usernameGood').show();
            }
        };
        var onError = function (result, context) { };
        $.ajax({
            type: "GET",
            url: "/UserCheck/checkifinvalidusernameforsignup?username=" + username,
            success: onSuccess,
            error: onError
        });
    }

    function CheckEmptyUsernameFields() {
        var isValid = true;
        if ($('#Password').val().length == 0) {
            $('#passwordError').show();
            $('#passwordErrorMessage').html("<p>" + Roblox.SignupFormValidator.Resources.requiredField + "</p>");
            isValid = false;
        }
        if ($('#PasswordConfirm').val().length == 0) {
            $('#passwordConfirmError').show();
            $('#PasswordConfirmMessage').html("<p>" + Roblox.SignupFormValidator.Resources.requiredField + "</p>");
            isValid = false;
        }
        if ($('#UserName').val().length == 0) {
            $('#UsernameError').show();
            $('#usernameErrorMessage').html("<p>" + Roblox.SignupFormValidator.Resources.requiredField + "</p>");
            $('#usernameErrorMessage').show();
            isValid = false;
        }
        if ($('#Email').length > 0) {
            if ($('#Email').val().length == 0) {
                $('#emailError').show();
                $('#emailErrorMessage').html("<p>" + Roblox.SignupFormValidator.Resources.requiredField + "</p>");
                $('#emailErrorMessage').show();
                isValid = false;
            }
        }
        return isValid;
    }

    function checkEmail() {
        var emailElement = $('#Email');
        if (emailElement.val().length == 0) {
            $('#emailError').hide();
            $('#emailGood').hide();
            return;
        }

        var isValidEmail = Roblox.FormValidator.validateElementRegex(emailElement);
        if (isValidEmail) {
            $('#emailError').hide();
            $('#emailGood').show();
        } else {
            $('#emailErrorMessage').html(Roblox.SignupFormValidator.Resources.invalidEmail);
            $('#emailError').show();
            $('#emailGood').hide();
        }
    }

    /* Public interface */
    var my = {
        checkBirthday: checkBirthday,
        checkUsername: checkUsername,
        checkPassword: checkPassword,
        checkGender: checkGender,
        checkPasswordConfirm: checkPasswordConfirm,
        checkEmail: checkEmail,
        ValidateForm: ValidateForm,
        ValidateAndShowResponses: ValidateAndShowResponses
    };
    return my;
} ();
