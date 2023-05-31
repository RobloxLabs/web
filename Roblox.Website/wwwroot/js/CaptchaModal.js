Roblox = Roblox || {};
Roblox.Resources = Roblox.Resources || {};

Roblox.Resources.CaptchaModal = {
    title: "Are you human?",
    message: "To finish, please verify that you are human.",
    captchaEmptyMessage: "The CAPTCHA field should not be empty, please fill it.",
    captchaErrorMessage: "The CAPTCHA you entered is invalid. Please try again.",
    finish: "Finish"
};

Roblox.CaptchaModal = function () {
    "use strict";
    function create(form) {
        function onCancel() {
            captchaDiv.hide();
            captchaDiv.appendTo(form);
        }

        function onAccept() {
            Roblox.GenericConfirmation.disableButtons();
            //copy over the inputs into the form and submit
            form.find(captchaDivSelector).remove();
            captchaDiv.hide();
            captchaDiv.appendTo(form);
            captchaDiv.removeClass("roblox-captcha-modal");
            form.submit();
        }

        function onOpen() {
            var modal = $(".ConfirmationModal");
            var noBtn = modal.find("#roblox-decline-btn");
            noBtn.hide();

            var finishBtn = modal.find("#roblox-confirm-btn");
            finishBtn.addClass("btn-large").addClass("btn-primary");
            finishBtn.width("200px");

            var body = modal.find(".TopBody");

            if (captchaDiv.length == 0) {
                captchaDiv = form.find(captchaDivSelector);
            }

            captchaDiv.css("position", "relative");
            captchaDiv.css("left", "50%");
            captchaDiv.css("margin-left", "-159px");
            captchaDiv.css("padding-top", "5px");
            captchaDiv.appendTo(body);
            captchaDiv.show();

            var message = modal.find(".Message");
            message.css("top", "0");
        }

        var captchaDiv = form.find(captchaDivSelector);

        if (typeof Roblox.GenericConfirmation === 'undefined') {
            captchaDiv.remove();
            form.submit();
            return;
        }

        Roblox.GenericConfirmation.open({
            titleText: Roblox.Resources.CaptchaModal.title,
            bodyContent: Roblox.Resources.CaptchaModal.message,
            allowHtmlContentInBody: true,
            acceptColor: Roblox.GenericConfirmation.green,
            acceptText: Roblox.Resources.CaptchaModal.finish,
            dismissable: false,
            xToCancel: true,
            onAccept: onAccept,
            onCancel: onCancel,
            onOpenCallback: onOpen
        });
    }

    function formNeedsCaptcha(form) {
        return (form.find(captchaDivSelector).length != 0);
    }

    var captchaDivSelector = ".roblox-captcha-modal";

    return {
        Create: create,
        FormNeedsCaptcha: formNeedsCaptcha
    };
}();

$(function () {
    $("form").submit(function (e) {
        "use strict";
        var form = $(this);
        if (Roblox.CaptchaModal.FormNeedsCaptcha(form)) {
            e.preventDefault();
            Roblox.CaptchaModal.Create(form);
        }
    });
});