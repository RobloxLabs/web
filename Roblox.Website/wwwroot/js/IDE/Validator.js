var Roblox = Roblox || {};
Roblox.IDE = Roblox.IDE || {};
Roblox.IDE.validator = (function () {
    var valueRequiredAttributeName = "val-required";
    var valueRegexPatternAttributeName = "val-regex-pattern";
    var valueRegexFailureMessageAttributeName = "val-regex";

    function showError(errorSpan, message, convertMvcErrors) {
        errorSpan.toggleClass("field-validation-valid", !message);
        errorSpan.toggleClass("field-validation-error", !!message);
        if (message) {
            errorSpan.text(message);
            if (convertMvcErrors) {
                Roblox.StyleguideConversions.convertMvcErrorToStyleGuide();
            }
        } else {
            errorSpan.html("").removeClass("tool-tip");
        }
    }

    function getInputValidationError(input) {
        if (input.attr("type") === "file") {
            if (input[0].files.length <= 0) {
                return "You must select a file.";
            }

            if (input.attr("accept")) {
                var acceptedFileTypes = input.attr("accept").split("/")[0];
                var acceptedTypeRegEx = new RegExp(input.attr("accept").replace("*", ".\*"));
                for (var n = 0; n < input[0].files.length; n++) {
                    if (!acceptedTypeRegEx.test(input[0].files[n].type)) {
                        return "File type must be " + acceptedFileTypes;
                    }
                }
            }
        } else {
            if (input.data(valueRequiredAttributeName) && !input.val().trim()) {
                return input.data(valueRequiredAttributeName);
            }

            if (input.data(valueRegexPatternAttributeName)) {
                var regexp = new RegExp(input.data(valueRegexPatternAttributeName));
                if (!regexp.test(input.val())) {
                    return input.data(valueRegexFailureMessageAttributeName);
                }
            }
        }

        return "";
    }

    return function (button, inputs, convertMvcErrors) {
        function validateInputs(showErrors) {
            var validationPass = true;

            inputs.forEach(function (input) {
                var errorMessage = getInputValidationError(input.input);
                if (errorMessage) {
                    validationPass = false;
                }
                if (showErrors || !errorMessage) {
                    showError(input.errorSpan, errorMessage, convertMvcErrors);
                }
            });

            if (validationPass) {
                button.button.removeAttr("disabled");
            } else {
                button.button.attr("disabled", "disabled");
            }
            button.button.toggleClass(button.enabledClass, validationPass)
                .toggleClass(button.disabledClass, !validationPass)
                .prop("disabled", !validationPass);

            return validationPass;
        }

        function init() {
            inputs.forEach(function (input) {
                if (input.input.attr("type") === "file") {
                    input.input.change(function () {
                        validateInputs(true);
                    });
                } else {
                    input.input.on("blur keyup", function () {
                        validateInputs(true);
                    });
                }
            });
            validateInputs(false);
        }

        return {
            init: init,
            validateInputs: validateInputs
        };
    };
})();
