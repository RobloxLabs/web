if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.GenericConfirmation === "undefined") {
    Roblox.GenericConfirmation = function () {

        var BUTTON_CLASS_GREEN = "btn-primary";
        var BUTTON_CLASS_BLUE = "btn-neutral";
        var BUTTON_CLASS_GRAY = "btn-negative";

        var BUTTON_CLASS_GREEN_DISABLED = "btn-disabled-primary";
        var BUTTON_CLASS_BLUE_DISABLED = "btn-disabled-neutral";
        var BUTTON_CLASS_GRAY_DISABLED = "btn-disabled-negative";

        var BUTTON_CLASS_NONE = "btn-none";

        var BUTTON_SELECTOR_YES = "#roblox-confirm-btn";
        var BUTTON_SELECTOR_NO = "#roblox-decline-btn";

        var status = {
            isOpen: false
        };

        function onCloseCallback() {
            status.isOpen = false;
            close();
        }

        var modalProperties = {
            overlayClose: true,
            escClose: true,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            },
            onClose: onCloseCallback
        };

        // Usage: pass in object that overrides defaults
        function open(properties) {
            status.isOpen = true;
            // Default Property set for 'open'
            var defaults = {
                titleText: "",
                bodyContent: "",
                footerText: "",
                acceptText: Roblox.Resources.GenericConfirmation.yes,
                declineText: Roblox.Resources.GenericConfirmation.No,
                acceptColor: BUTTON_CLASS_BLUE,
                declineColor: BUTTON_CLASS_GRAY,
                xToCancel: false,
                onAccept: function () { return false; },
                onDecline: function () { return false; },
                onCancel: function () { return false; },
                imageUrl: null,
                allowHtmlContentInBody: false,
                allowHtmlContentInFooter: false,
                dismissable: true,
                fieldValidationRequired: false,
                onOpenCallback: function () { }
            };
            
            properties = $.extend({}, defaults, properties); // merge defaults into passed in properties

            modalProperties.overlayClose = properties.dismissable;
            modalProperties.escClose = properties.dismissable;

            var yesBtn = $(BUTTON_SELECTOR_YES);
            yesBtn.html(properties.acceptText);
            yesBtn.attr("class", "btn-large " + properties.acceptColor);
            yesBtn.unbind();
            yesBtn.bind('click', function () {
                if (_buttonIsDisabled(yesBtn))
                {
                    return false;
                }
                
                if (properties.fieldValidationRequired) {
                    btnClickCallbackFirst(properties.onAccept);
                } else {
                    btnClick(properties.onAccept);
                }
                return false;
            });

            var noBtn = $(BUTTON_SELECTOR_NO);
            noBtn.html(properties.declineText);
            noBtn.attr("class", "btn-large " + properties.declineColor);
            noBtn.unbind();
            noBtn.bind('click', function () {
                if (_buttonIsDisabled(noBtn))
                {
                    return false;
                }
                
                btnClick(properties.onDecline);
                return false;
            });

            $('[data-modal-handle="confirmation"] div.Title').text(properties.titleText);

            var modal = $("[data-modal-handle='confirmation']");
            if (properties.imageUrl == null) {
                modal.addClass('noImage');
            } else {
                modal.find('img.GenericModalImage').attr('src', properties.imageUrl);
                modal.removeClass('noImage');
            }

            if (properties.allowHtmlContentInBody)
                $("[data-modal-handle='confirmation'] div.Message").html(properties.bodyContent);
            else
                $("[data-modal-handle='confirmation'] div.Message").text(properties.bodyContent);

            //Remove extra spacing introduced by the footer if there is no footer
            if ($.trim(properties.footerText) == "") {
                $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').hide();
            }
            else {
                $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').show();
            }
            if (properties.allowHtmlContentInFooter)
                $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').html(properties.footerText);
            else
                $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').text(properties.footerText);

            $("[data-modal-handle='confirmation']").modal(modalProperties);

            var cancelBtn = $("a.genericmodal-close");
            cancelBtn.unbind();
            cancelBtn.bind('click', function () {
                btnClick(properties.onCancel);
                return false;
            });
            if (!properties.xToCancel) {
               cancelBtn.hide();           
            }
            

            properties.onOpenCallback();
        }

        function _disableButton(btn) {
            if (btn.hasClass(BUTTON_CLASS_GRAY)) {
                btn.addClass(BUTTON_CLASS_GRAY_DISABLED);
            } else if (btn.hasClass(BUTTON_CLASS_GREEN)) {
                btn.addClass(BUTTON_CLASS_GREEN_DISABLED);
            } else if (btn.hasClass(BUTTON_CLASS_BLUE)) {
                btn.addClass(BUTTON_CLASS_BLUE_DISABLED);
            }
        }
        function _buttonIsDisabled(btn) {
            if (btn.hasClass(BUTTON_CLASS_BLUE_DISABLED)
                    || btn.hasClass(BUTTON_CLASS_GRAY_DISABLED)
                    || btn.hasClass(BUTTON_CLASS_GREEN_DISABLED)) {
                return true;
            }

            return false;
        }

        function disableButtons() {
            var yesBtn = $(BUTTON_SELECTOR_YES);
            var noBtn = $(BUTTON_SELECTOR_NO);

            _disableButton(yesBtn);
            _disableButton(noBtn);

        }

        function enableButtons() {
            var yesBtn = $(BUTTON_SELECTOR_YES);
            var noBtn = $(BUTTON_SELECTOR_NO);
            var classesToRemove = BUTTON_CLASS_BLUE_DISABLED + " " + BUTTON_CLASS_GRAY_DISABLED + " " + BUTTON_CLASS_GREEN_DISABLED;

            yesBtn.removeClass(classesToRemove);
            noBtn.removeClass(classesToRemove);
        }

        function clickYes() {
            if (status.isOpen) {
            var yesBtn = $(BUTTON_SELECTOR_YES);
            yesBtn.click();
        }
        }

        function clickNo() {
            var noBtn = $(BUTTON_SELECTOR_NO);
            noBtn.click();
        }

        function close(id) {
            status.isOpen = false;
            if (typeof id !== 'undefined') {
                $.modal.close(id);
            } else {
                $.modal.close();
            }
        }

        function btnClick(callBack) {
            close();
            if (typeof callBack === 'function') {
                callBack();
            }
        }

        function btnClickCallbackFirst(callBack) {
            if (typeof callBack === 'function') {
                var returnVal = callBack();
                if (returnVal !== 'undefined') {
                    if (returnVal == false) {
                        return false;
                    }
                }
            }
            close();
        };

        return {
            open: open,
            close: close,
            disableButtons: disableButtons,
            enableButtons: enableButtons,
            clickYes: clickYes,
            clickNo: clickNo,
            status: status,

            green: BUTTON_CLASS_GREEN,
            blue: BUTTON_CLASS_BLUE,
            gray: BUTTON_CLASS_GRAY,
            none: BUTTON_CLASS_NONE
        };
    } ();
}

//keyboard control
$(document).keypress(function (e) {
    if (Roblox.GenericConfirmation.status.isOpen && e.which === 13) {
        Roblox.GenericConfirmation.clickYes();
    }
});