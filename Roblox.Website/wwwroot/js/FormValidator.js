if (typeof Roblox === "undefined") {
	Roblox = {};
}

Roblox.FormValidator = function() {
    function validateElementRegex(element) {
        var regex = $(element).data("regex");
        var value = $(element).val();
        return validateRegex(value, regex);
    }

    function validateRegex(value, regex) {
        if (typeof(value) === "undefined" || typeof(regex) === "undefined") {
            return false;
        }
        var pattern = new RegExp(regex, "i");
        return pattern.test(value);
    }

    return {
        validateElementRegex: validateElementRegex
    };
}();