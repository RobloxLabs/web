import {
    Dialog,
    Endpoints,
    FormEvents,
    TranslationResourceProvider
} from 'Roblox';
import $ from 'jquery';

let translationProvider;
let langMap;

const soliConstants = {
    modalClassName: 'soli-modal',
    loginUrl: '/login?returnurl=',
    signupUrl: '/?returnurl=',
    eventContext: 'gameDetails',
    loginField: 'gameLaunch_login',
    signupField: 'gameLaunch_signup'
};

function redirectToSignupWithEvent(eventField) {
    const eventContext = 'gameDetails';
    if (FormEvents) {
        FormEvents.SendInteractionClick(eventContext, eventField);
    }
    const signupUrl =
        soliConstants.signupUrl +
        encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = Endpoints
        ? Endpoints.getAbsoluteUrl(signupUrl)
        : signupUrl;
}

function restrictGuests(params) {
    const deferred = new $.Deferred();
    if ($('#PlaceLauncherStatusPanel').data('is-user-logged-in') === 'True') {
        deferred.resolve(params);
        return deferred;
    }

    Dialog.open({
        titleText: langMap.get('Heading.Dialog.SignUpOrLogin'),
        bodyContent: langMap.get('Description.Dialog.SignUpOrLogin'),
        cssClass: soliConstants.modalClassName,
        acceptColor: Dialog.green,
        acceptText: langMap.get('Action.Dialog.SignUp'),
        declineText: langMap.get('Action.Dialog.Login'),
        onDecline: () => {
            if (FormEvents) {
                FormEvents.SendInteractionClick(
                    soliConstants.eventContext,
                    soliConstants.loginField
                );
            }
            const loginUrl =
                soliConstants.loginUrl +
                encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = Endpoints
                ? Endpoints.getAbsoluteUrl(loginUrl)
                : loginUrl;
        },
        onAccept: () => {
            redirectToSignupWithEvent(soliConstants.signupField);
        }
    });

    return deferred;
}

// set the translation provider
$(document).ready(() => {
    translationProvider = new TranslationResourceProvider();
    langMap = translationProvider.getTranslationResource(
        'Feature.GameLaunchGuestMode'
    );
});

const AuthenticationChecker = {
    restrictGuests
};

export default AuthenticationChecker;