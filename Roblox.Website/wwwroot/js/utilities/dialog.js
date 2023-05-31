if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Dialog === "undefined") {
    Roblox.Dialog = function () {

        var BUTTON_CLASS_GREEN = "btn-primary-md";
        var BUTTON_CLASS_BLUE = "btn-secondary-md";
        var BUTTON_CLASS_WHITE = "btn-control-md";

        var BUTTON_CLASS_GREEN_DISABLED = "btn-primary-md disabled";
        var BUTTON_CLASS_BLUE_DISABLED = "btn-secondary-md disabled";
        var BUTTON_CLASS_WHITE_DISABLED = "btn-control-md disabled";

        var BUTTON_CLASS_NONE = "btn-none";

        var BUTTON_SELECTOR_YES = ".modal-btns #confirm-btn";
        var BUTTON_SELECTOR_NO = ".modal-btns #decline-btn";

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
            zIndex: 1040,
            overlayCss: {
                backgroundColor: "#000"
            },
            onClose: onCloseCallback,
            focus: false
        };

        // Usage: pass in object that overrides defaults
        function open(properties) {
            status.isOpen = true;
            // Default Property set for 'open'
            var defaults = {
                titleText: "",
                bodyContent: "",
                footerText: "",
                acceptText: "Yes",
                declineText: "No",
                acceptColor: BUTTON_CLASS_BLUE,
                declineColor: BUTTON_CLASS_WHITE,
                xToCancel: false,
                onAccept: function () { return false; },
                onDecline: function () { return false; },
                onCancel: function () { return false; },
                imageUrl: null,
                allowHtmlContentInBody: false,
                allowHtmlContentInFooter: false,
                dismissable: true,
                fieldValidationRequired: false,
                onOpenCallback: function () { },
                cssClass: null
            };

            properties = $.extend({}, defaults, properties); // merge defaults into passed in properties

            modalProperties.overlayClose = properties.dismissable;
            modalProperties.escClose = properties.dismissable;

            var yesBtn = $(BUTTON_SELECTOR_YES);
            yesBtn.html(properties.acceptText);
            yesBtn.attr("class", properties.acceptColor);
            yesBtn.unbind();
            yesBtn.bind('click', function () {
                if (_buttonIsDisabled(yesBtn)) {
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
            noBtn.attr("class", properties.declineColor);
            noBtn.unbind();
            noBtn.bind('click', function () {
                if (_buttonIsDisabled(noBtn)) {
                    return false;
                }

                btnClick(properties.onDecline);
                return false;
            });

            var modal = $('[data-modal-type="confirmation"]');
            modal.find(".modal-title").text(properties.titleText);
            if (properties.imageUrl == null) {
                modal.addClass('noImage');
            } else {
                modal.find('img.modal-thumb').attr('src', properties.imageUrl);
                modal.removeClass('noImage');
            }

            if (properties.cssClass != null) {
                modal.addClass(properties.cssClass);
            }

            if (properties.allowHtmlContentInBody) {
                modal.find(".modal-message").html(properties.bodyContent);
            } else {
                modal.find(".modal-message").text(properties.bodyContent);
            }

            //Remove extra spacing introduced by the footer if there is no footer
            if ($.trim(properties.footerText) == "") {
                modal.find(".modal-footer").hide();
            }
            else {
                modal.find(".modal-footer").show();
            }
            if (properties.allowHtmlContentInFooter) {
                modal.find(".modal-footer").html(properties.footerText);
            } else {
                modal.find(".modal-footer").text(properties.footerText);
            }

            modal.modal(modalProperties);

            var cancelBtn = $(".modal-header .close");
            cancelBtn.unbind();
            cancelBtn.bind('click', function () {
                btnClick(properties.onCancel);
                return false;
            });
            if (!properties.xToCancel) {
                cancelBtn.hide();
            }

            $("#rbx-body").addClass("modal-mask");
            properties.onOpenCallback();
        }

        function _disableButton(btn) {
            if (btn.hasClass(BUTTON_CLASS_WHITE)) {
                btn.addClass(BUTTON_CLASS_WHITE_DISABLED);
            } else if (btn.hasClass(BUTTON_CLASS_GREEN)) {
                btn.addClass(BUTTON_CLASS_GREEN_DISABLED);
            } else if (btn.hasClass(BUTTON_CLASS_BLUE)) {
                btn.addClass(BUTTON_CLASS_BLUE_DISABLED);
            }
        }
        function _buttonIsDisabled(btn) {
            if (btn.hasClass(BUTTON_CLASS_BLUE_DISABLED)
                    || btn.hasClass(BUTTON_CLASS_WHITE_DISABLED)
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
            var classesToRemove = BUTTON_CLASS_BLUE_DISABLED + " " + BUTTON_CLASS_WHITE_DISABLED + " " + BUTTON_CLASS_GREEN_DISABLED;

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

            $("#rbx-body").removeClass("modal-mask");
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
        }

        function toggleProcessing(isShown, closeClass) {
            var modal = $(".modal-body");
            if (isShown) {
                modal.find(".modal-btns").hide();
                modal.find(".modal-processing").show();
            } else {
                modal.find(".modal-btns").show();
                modal.find(".modal-processing").hide();
            }
            if (typeof closeClass !== "undefined" && closeClass !== "") {
                $.modal.close("." + closeClass);
            }
        }

        return {
            open: open,
            close: close,
            disableButtons: disableButtons,
            enableButtons: enableButtons,
            clickYes: clickYes,
            clickNo: clickNo,
            status: status,
            toggleProcessing: toggleProcessing,
            green: BUTTON_CLASS_GREEN,
            blue: BUTTON_CLASS_BLUE,
            white: BUTTON_CLASS_WHITE,
            none: BUTTON_CLASS_NONE
        };
    }();
}

//keyboard control
$(document).keypress(function (e) {
    if (Roblox.Dialog.isOpen && e.which === 13) {
        Roblox.Dialog.clickYes();
    }
});