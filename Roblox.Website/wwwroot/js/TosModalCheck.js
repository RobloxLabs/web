$(function () {
    var title, body, accept, agreeUrl;
    var submitUrl = "/UserCheck/show-tos";
    var tosCheckNeeded = $("#TosAgreementInfo").data("terms-check-needed");
    $.ajax({
        type: "GET",
        url: submitUrl,
        data: { isLicensingTermsCheckNeeded: tosCheckNeeded },
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.PartialViewName) {
                // In I18n is enabled create a Roblox.Intl object
                var intl = data.IsI18nEnabled && Roblox.Intl && new Roblox.Intl();

                var tosLink = '<a href="' + data.TermsOfServiceUrl+'" class="text-link" target="_blank">';
                var privacyLink = ' <a href="' + data.PrivacyUrl +'" class="text-link" target="_blank">';
                var legalChangesLink = '<a href="' + data.LegalChangesUrl +'" class="text-link" target="_blank">';

                if (data.PartialViewName === "CaptureTosAgreement_v2") {
                    if (intl) {
                        title = intl.f(data.LangResources["Heading.TosHaveChangedTitle"]);
                        body = intl.f(data.LangResources["Message.AgreeToTosAndPrivacyBody"], { 'tosLinkStart': tosLink, 'tosLinkEnd': '</a>', 'privacyLinkStart': privacyLink, 'privacyLinkEnd': '</a>', 'legalChangesLinkStart': legalChangesLink, 'legalChangesLinkEnd': '</a>' });
                        accept = intl.f(data.LangResources["Label.IAgree"]);
                    }
                    else {
                        title = "TERMS OF USE HAVE CHANGED";
                        body = 'By clicking "I Agree", you are agreeing to the <a href="https://www.roblox.com/info/terms" class="text-link" target="_blank">Terms of Use</a> and <a href="https://www.roblox.com/info/privacy" class="text-link" target="_blank">Privacy Policy</a>. You can learn more about what is changing <a href="https://www.roblox.com/info/latest-changes" class="text-link" target="_blank">here</a>.';
                        accept = "I AGREE";
                    }
                    agreeUrl = "/UserCheck/update-tos";
                }
                else if (data.PartialViewName === "CaptureTosAgreementWithExplicitLicenseClause") {
                    if (intl) {
                        title = intl.f(data.LangResources["Heading.TosAgreementTitle"]);
                        body = intl.f(data.LangResources["Message.TosAgreementBody"], { 'tosLinkStart': tosLink, 'tosLinkEnd': '</a>', 'legalChangesLinkStart': legalChangesLink, 'legalChangesLinkEnd': '</a>', });
                        accept = intl.f(data.LangResources["Label.IAgree"]);
                    }
                    else {
                        title = "TERMS OF USE AGREEMENT";
                        body = 'By clicking "I Agree", you are agreeing to the <a href="https://www.roblox.com/info/terms" class="text-link" target="_blank">Roblox Terms of Use</a>. This includes the license to Roblox of past and future content you provide to the service for our use online, offline, and in tangible items. You can learn more about what is changing <a href="https://www.roblox.com/info/latest-changes" class="text-link" target="_blank">here</a>.';
                        accept = "I AGREE";
                    }
                    agreeUrl = "/UserCheck/update-tos-licensing";
                }
                showTosModal(title, body, accept, agreeUrl);
            }
        },
        error: function (error) {

        }
    });
});

function showTosModal(title, body, accept, agreeUrl) {
    Roblox.Dialog.open({
        titleText: title,
        bodyContent: body,
        acceptText: accept,
        onAccept: function () { submitTosAgreement(agreeUrl); },
        acceptColor: Roblox.Dialog.blue,
        fieldValidationRequired: false,
        dismissable: false,
        xToCancel: false,
        declineColor: Roblox.Dialog.none,
        allowHtmlContentInBody: true
    });
}

function submitTosAgreement(agreeUrl) {
    $.ajax({
        type: "POST",
        url: agreeUrl,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
        }
    });
}