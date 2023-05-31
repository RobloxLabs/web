var Roblox = Roblox || {};

Roblox.SubmitButton = (function () {
    //constants: css class to get properties of the submit button
    var buttonCssSelector = ".submit-button";
    var clickableCssSelector = "clickable";
    var multiClickCssSelector = "allow-multi-click";
    var clickCallbackCssSelector = "callback";
    //constants: css class to change the looking for buttons
    var buttonEnabledClass = "btn-primary";
    var buttonDisabledClass = "btn-disabled-primary";
    var disabledClass = "disabled";
    //constants: toggle event for submit button
    var submitToggleEvent = "Roblox.SubmitButton.toggleButton";

    function init()
    {
        $(buttonCssSelector).each(function (idx, element) {
            var button = $(element);
            var callbackObject = button.data(clickCallbackCssSelector);
            if (!callbackObject || typeof callbackObject !== "object")
                return;
            
            var canMultiClick = button.data(multiClickCssSelector) === "true";
            var clickCallback = getClickHandler(button, callbackObject, canMultiClick);
            var toggleButtonFunc = getToggleButtonHandler(button, clickCallback);

            // bind event "toggleButton" with toggleButtonFunc
            button.on(submitToggleEvent, toggleButtonFunc);

            // init button
            var clickable = button.data(clickCallbackCssSelector) !== "false";
            toggleButtonFunc(null, clickable);
        });
    }

    function getClickHandler(button, callbackObject, allowMultiClick)
    {
        return function (e) {
            var clickable = button.data(clickableCssSelector) === "true";
            if (!clickable) {
                e.preventDefault();
                return;
            }

            var successFlag = false;
            if (callbackObject) {
                var caller = callbackObject.object.split(".");
                var target = window[caller[0]];
                for (var i = 1; i < caller.length; i++) {
                    target = target[caller[i]];
                }
                if (target) {
                    var callback = target[callbackObject.func];
                    if (typeof callback === "function") {
                        try {
                            callback();
                            successFlag = true;
                        }
                        catch(e) {
                            successFlag = false;
                        }
                    }
                }
            }

            //disable button if multiclick = false and no error
            if (!allowMultiClick && successFlag) {
                button.trigger(submitToggleEvent, false);
            }
        }
    }

    function getToggleButtonHandler(button, clickCallback)
    {
        return function (event, enabled) {
            if (enabled) {
                button.data(clickableCssSelector, "true");
                button.addClass(buttonEnabledClass).removeClass(buttonDisabledClass).removeClass(disabledClass);
                button.on("click", clickCallback);
            }
            else {
                button.addClass(buttonDisabledClass).addClass(disabledClass).removeClass(buttonEnabledClass);
                button.data(clickableCssSelector, "false");
                button.off("click");
            }
        }
    }
    
    return {
        init: init,
        submitToggleEvent: submitToggleEvent
    }
})();

$(function () {
    Roblox.SubmitButton.init();
});