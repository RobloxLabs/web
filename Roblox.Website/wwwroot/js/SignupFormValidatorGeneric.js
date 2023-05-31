if (typeof Roblox === "undefined") {
    Roblox = {};
}

if (typeof Roblox.Resources === "undefined") {
    Roblox.Resources = {};
}

if (typeof Roblox.Resources.AnimatedSignupFormValidator === "undefined") {
    var intl = Roblox.I18nData && Roblox.I18nData.isI18nEnabledOnLanding && Roblox.Lang && Roblox.Lang.SignUpResources && Roblox.Intl && new Roblox.Intl();
    if (intl) {
        var langResources = Roblox.Lang.SignUpResources;
        Roblox.Resources.AnimatedSignupFormValidator = {
            maxValid: intl.f(langResources["Response.TooManyAccountsWithSameEmailError"]),
            invalidEmail: intl.f(langResources["Response.InvalidEmail"]),
            invalidBirthday: intl.f(langResources["Response.InvalidBirthday"]),
            loginFieldsRequired: intl.f(langResources["Response.UsernamePasswordRequired"]),
            loginFieldsIncorrect: intl.f(langResources["Response.UsernameOrPasswordIncorrect"]),
            doesntMatch: intl.f(langResources["Response.PasswordMismatch"]),
            passwordIsUsername: intl.f(langResources["Response.PasswordContainsUsernameError"]),
            requiredField: intl.f(langResources["Label.Required"]),
            passwordBadLength: intl.f(langResources["Response.PasswordBadLength"]),
            weakKey: intl.f(langResources["Response.PasswordComplexity"]),
            invalidCharacters: intl.f(langResources["Response.SpaceOrSpecialCharaterError"]),
            invalidName: intl.f(langResources["Response.UsernameAllowedCharactersError"]),
            cantBeUsed: intl.f(langResources["Response.BadUsername"]),
            cantBeUsedPii: intl.f(langResources["Response.UsernamePrivateInfo"]),
            alreadyTaken: intl.f(langResources["Response.UsernameAlreadyInUse"]),
            userNameInvalidLength: intl.f(langResources["Response.UsernameInvalidLength"]),
            startsOrEndsWithUnderscore: intl.f(langResources["Response.UsernameInvalidUnderscore"]),
            moreThanOneUnderscore: intl.f(langResources["Response.UsernameTooManyUnderscores"]),
            birthdayRequired: intl.f(langResources["Response.BirthdayMustBeSetFirst"]),
            passwordRequired: intl.f(langResources["Response.PleaseEnterPassword"]),
            usernameRequired: intl.f(langResources["Response.PleaseEnterUsername"]),
            passwordConfirmationRequired: intl.f(langResources["Response.PasswordConfirmation"]),
            usernameNoRealNameUse: intl.f(langResources["Message.Username.NoRealNameUse"]),
            passwordMinLength: intl.f(langResources["Message.Password.MinLength"]),
            usernameNotAvailable: intl.f(langResources["Response.UsernameNotAvailable"])
        };
    }
    else {
        Roblox.Resources.AnimatedSignupFormValidator = {
            maxValid: "Too many accounts use this email.",
            invalidEmail: "Invalid email address.",
            invalidBirthday: "Invalid birthday.",
            loginFieldsRequired: "Username and Password are required.",
            loginFieldsIncorrect: "Your username or password is incorrect.",
            doesntMatch: "Passwords do not match.",
            passwordIsUsername: "Password shouldn't match username.",
            requiredField: "Required",
            passwordBadLength: "Passwords must be between 8 and 200 characters long.",
            weakKey: "Please create a more complex password.",
            invalidCharacters: "Spaces and special characters are not allowed.",
            invalidName: "Usernames may only contain letters, numbers, and _.",
            cantBeUsed: "Username not appropriate for Roblox.",
            cantBeUsedPii: "Username might contain private information.",
            alreadyTaken: "This username is already in use.",
            userNameInvalidLength: "Usernames can be 3 to 20 characters long.",
            startsOrEndsWithUnderscore: "Usernames cannot start or end with _.",
            moreThanOneUnderscore: "Usernames can have at most one _.",
            birthdayRequired: "Birthday must be set first.",
            passwordRequired: "Please enter a password.",
            usernameRequired: "Please enter a username.",
            passwordConfirmationRequired: "Please enter a password confirmation.",
            usernameNoRealNameUse: "Don't use your real name",
            passwordMinLength: "Min length 8",
            usernameNotAvailable: "Username not available. Please try again."
        };
    }
}

/* Roblox.SignupFormValidatorGeneric should be used for all sign up handles */
Roblox.SignupFormValidatorGeneric = (function () {
    function containsHtml(inputText) {
        // this wil not catch html with leading whitespace in tag, like < a>
        // however, this is not valid html: https://www.w3.org/TR/REC-xml/#sec-starttags
        var matches = inputText.match(/<[a-z][\s\S]*>/i);
        return matches && matches.length > 0;
    }

    // Assumes you pass in option:selected .val()
    function invalidBirthday(month, day, year) {
        return (year <= 0 || month <= 0 || day <= 0 || day > new Date(year, month, 0).getDate());
    }

    // Assumes you pass in option:selected .val()
    function selectedBirthday(month, day, year) {
        return year != 0 && month != 0 && day != 0;
    }

    // Assumes you pass in :checked
    function genderSelected(male, female) {
        return ($(male).length != 0 || $(female).length != 0);
    }

    function usernameTooLong(username) {
        return username.length > 20;
    }

    function usernameTooShort(username) {
        return username.length < 3;
    }

    function usernameStartsOrEndsWithUnderscore(userName) {
        userName = userName.trim();
        var l = userName.length;
        if (userName[0] == "_" || userName[l - 1] == "_")
            return true;
    }

    function usernameHasMoreThanOneUnderscore(userName) {
        return userName.split("_").length > 2;
    }

    function usernameRegexInvalid(username) {
        var regexFail = username.indexOf(" ") != -1;
        var re = /^[a-zA-Z0-9_]*$/;
        regexFail = regexFail || !username.match(re);
        return regexFail;
    }

    function passwordsMatch(pwd0, pwd1) {
        return pwd0 === pwd1;
    }

    function passwordBadLength(pwd) {
        return pwd.length < 8 || pwd.length > 200;
    }

    function passwordIsUsername(pwd, username) {
        return pwd == username;
    }

    function weakPassword(pwd) {
        var weakPasswords = ["roblox123", "password", "password1", "password12", "password123", "trustno1",
            "iloveyou", "princess", "abcd1234", "qwertyui", "qwerty", "football", "baseball",
            "michael", "jennifer", "michelle", "babygirl", "superman", "12345678",
            "123456789", "1234567890", "123123123", "69696969", "11111111", "22222222",
            "33333333", "44444444", "55555555", "66666666", "77777777", "88888888",
            "99999999", "00000000"];
        pwd = pwd.toLowerCase();
        for (var i = 0; i < weakPasswords.length; i++) {
            if (pwd === weakPasswords[i]) {
                return true;
            }
        }
        if (/^[\s]*$/.test(pwd)) { // if the password only contains whitespace characters, consider it weak
            return true;
        }
        return false;
    }

    function getInvalidEmailMessage(email) {
        if (containsHtml(email)) {
            return Roblox.Resources.AnimatedSignupFormValidator.invalidEmail;
        }
        return "";
    }

    function getInvalidUsernameMessage(username) {
        if (usernameTooShort(username) || usernameTooLong(username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.userNameInvalidLength;
        }
        if (usernameStartsOrEndsWithUnderscore(username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.startsOrEndsWithUnderscore;
        }
        if (usernameHasMoreThanOneUnderscore(username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.moreThanOneUnderscore;
        }
        if (containsHtml(username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.invalidName;
        }
        if (usernameRegexInvalid(username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.invalidName;
        }        
        return "";
    }

    function getInvalidPasswordMessage(password, username) {
        if (passwordBadLength(password)) {
            return Roblox.Resources.AnimatedSignupFormValidator.passwordBadLength;
        }
        if (passwordIsUsername(password, username)) {
            return Roblox.Resources.AnimatedSignupFormValidator.passwordIsUsername;
        }
        if (weakPassword(password)) {
            return Roblox.Resources.AnimatedSignupFormValidator.weakKey;
        }
        return "";
    }


    /* Public interface */
    return {
        invalidBirthday: invalidBirthday,
        selectedBirthday: selectedBirthday,
        genderSelected: genderSelected,
        usernameTooLong: usernameTooLong,
        usernameTooShort: usernameTooShort,
        usernameRegexInvalid: usernameRegexInvalid,
        usernameStartsOrEndsWithUnderscore: usernameStartsOrEndsWithUnderscore,
        usernameHasMoreThanOneUnderscore: usernameHasMoreThanOneUnderscore,
        getInvalidUsernameMessage: getInvalidUsernameMessage,
        getInvalidEmailMessage: getInvalidEmailMessage,
        passwordIsUsername: passwordIsUsername,
        passwordsMatch: passwordsMatch,
        weakPassword: weakPassword,
        passwordBadLength: passwordBadLength,
        getInvalidPasswordMessage: getInvalidPasswordMessage
    };
})();
