if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.PushNotificationRegistrationUI = function () {
    var promptActiveKeyPrefix = "Roblox.PushNotificationRegistrationUI.PromptActive";
    var promptMessageKeyPrefix = "Roblox.PushNotificationRegistrationUI.PromptMessage";

    var nonContextualPromptAllowed = false;
    var promptOnFriendRequestSentEnabled = false;
    var promptOnPrivateMessageSentEnabled = false;
    var pushPromptIntervals = [60*60*24, 60*60*24*7]; // Default to 1 day, 7 days
    var notificationsDomain;
    var userId;
    var promptIntervalTracker = null;

    var callbackOnCompletion;
    var currentModal = null;
    var currentModalInsertionPoint = null;

    var loadSettings = function () {
        var settings = $('#push-notification-registration-ui-settings');

        nonContextualPromptAllowed = settings.data('noncontextualpromptallowed');
        promptOnFriendRequestSentEnabled = settings.data('promptonfriendrequestsentenabled');
        promptOnPrivateMessageSentEnabled = settings.data('promptonprivatemessagesentenabled');
        pushPromptIntervals = settings.data('promptintervals');
        notificationsDomain = settings.data('notificationsdomain');
        userId = settings.data('userid');
    }

    var getLocalStorageKey = function (keyPrefix) {
        return keyPrefix + '_' + userId;
    };

    var localStorageGet = function (keyPrefix) {
        return localStorage.getItem(getLocalStorageKey(keyPrefix));
    };
    var localStorageSet = function (keyPrefix, value) {
        localStorage.setItem(getLocalStorageKey(keyPrefix), value);
    };
    var localStorageRemove = function (keyPrefix) {
        localStorage.removeItem(getLocalStorageKey(keyPrefix));
    };

    var clearAllPromptsAndModals = function () {
        if(currentModal) {
            currentModal.hide();
            currentModalInsertionPoint.removeClass('modal-open');
            $('.modal-backdrop').hide();
            currentModal = null;
            currentModalInsertionPoint = null;
        }
        
        $('#push-notifications-registration-prompt').remove();
    };

    var insertIntoPage = function (holder) {
        var legacyPageHolder = $('#navContent');
        if (legacyPageHolder.length > 0) {
            legacyPageHolder.prepend(holder);
        } else {
            $('#wrap .container-main').prepend(holder);
        }
    };

    var loadPrompt = function (name) {
        clearAllPromptsAndModals();

        var template = $('#' + name + '-template');
        var holder = $('<div id="push-notifications-registration-prompt"></div>');
        holder.append(template.html());
        insertIntoPage(holder);
    };

    var loadModal = function (name) {
        clearAllPromptsAndModals();

        var template = $('#' + name + '-template');
        var holder = $('<div id="push-notifications-registration-prompt"></div>');
        holder.append(template.html());
        currentModalInsertionPoint = $('#rbx-body');
        currentModalInsertionPoint.append(holder);
        currentModal = $('#' + name + '-modal').bootstrapModal({
            backdrop: 'static',
            show: true,
            keyboard: false
        });
    };

    var showFeedback = function (name) {
        loadPrompt(name);
        var messageSelector = $('#push-notifications-registration-prompt .alert-success');
        Roblox.BootstrapWidgets.ToggleSystemMessage(messageSelector, 100, 3000);
    }

    var promptToAllowPush = function (customMessage, ignoreTimeSinceLastPrompt) {
        if (!Roblox.PushNotificationRegistrar || !Roblox.PushNotificationRegistrar.isPushSupported()) {
            // shouldn't prompt if push notifications are not supported by the client
            return;
        }

        if (!ignoreTimeSinceLastPrompt && promptIntervalTracker.IsTooSoon()) {
            // don't pester the user
            return;
        }

        if ($('.push-notifications-global-prompt .alert-info').length === 0 && ($('.alert-info').length > 0 || $('.alert-cookie-notice').length > 0) ) {
            // site-wide banner is already being displayed, should not show our prompt
            return;
        }

        $.when(isAlreadyRegistered(), isOptedOutOfDesktopPush()).done(function (isRegistered, isOptedOut) {
            if(isRegistered || isOptedOut) {
                recordPromptFinished(true);
            } else {
                loadPrompt('push-notifications-initial-global-prompt');
                if (customMessage) {
                    $('#push-notifications-registration-prompt .push-notifications-prompt-text').text(customMessage);
                }
                var promptActions = $('#push-notifications-registration-prompt .push-notifications-prompt-actions');
                promptActions.find('.push-notifications-prompt-accept').click(acceptPrompt);
                promptActions.find('.push-notifications-dismiss-prompt').click(declinePrompt);

                if(!ignoreTimeSinceLastPrompt) {
                    Roblox.PushNotificationRegistrar.getEventPublisher().Publish(Roblox.PushNotificationEventPublishers.RegistrationEventTypes.promptShown);
                }
                recordPrompting(customMessage);
            }
        }).fail(function (error) {
            // if we encounter an error when checking the current status, let's not do
            // anything and have another go next page load
        });
    };

    var isAlreadyRegistered = function () {
        var deferred = $.Deferred();
        Roblox.PushNotificationRegistrar.isPushEnabled(function(result) {
            deferred.resolve(result);
        });
        return deferred;
    };

    var isOptedOutOfDesktopPush = function () {
        var deferred = $.Deferred();
        $.ajax({
            method: "GET",
            url: notificationsDomain + '/v2/notifications/get-settings',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (response) {
                if (response && response.optedOutReceiverDestinationTypes && response.optedOutReceiverDestinationTypes.indexOf('DesktopPush') !== -1) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            }
        });
        return deferred;
    };

    var watchForPermissionChange = function () {
        navigator.permissions.query({ name: 'notifications' }).then(function (permissionStatus) {
            permissionStatus.onchange = function () {
                attemptToEnable();
            };
        });
    };

    var onSubscriptionSuccess = function () {
        showFeedback('push-notifications-successfully-enabled');
        recordPromptFinished(true);
        if (callbackOnCompletion && typeof callbackOnCompletion === "function") {
            callbackOnCompletion(true);
        }
    };

    var onSubscriptionFailure = function (failureReason) {
        if (failureReason === Roblox.PushNotificationRegistrar.subscriptionFailureReasons.permissionDenied) {
            watchForPermissionChange();
            loadModal('push-notifications-permissions-disabled-instruction');
        }
        if (callbackOnCompletion && typeof callbackOnCompletion === "function") {
            callbackOnCompletion(false);
        }
    };

    var enablePushNotifications = function (callback) {
        callbackOnCompletion = callback;
        attemptToEnable();
    };

    var disablePushNotifications = function (callback) {
        clearAllPromptsAndModals();
        recordPromptSettingsForDisabled();
        Roblox.PushNotificationRegistrar.unsubscribe(function () {
            showFeedback('push-notifications-successfully-disabled');
            if (callback && typeof callback === "function") {
                callback();
            }
        });
    };

    var attemptToEnable = function () {
        clearAllPromptsAndModals();

        if (Notification.permission === 'granted') {
            Roblox.PushNotificationRegistrar.subscribe(onSubscriptionSuccess, onSubscriptionFailure);
        } else if (Notification.permission === 'denied') {
            watchForPermissionChange();
            loadModal('push-notifications-permissions-disabled-instruction');
        } else {
            loadModal('push-notifications-permissions-prompt');
            Roblox.PushNotificationRegistrar.subscribe(onSubscriptionSuccess, onSubscriptionFailure);
        }
    };

    var recordPrompting = function (message) {
        localStorageSet(promptActiveKeyPrefix, true);
        if (message) {
            localStorageSet(promptMessageKeyPrefix, message);
        } else {
            localStorageRemove(promptMessageKeyPrefix);
        }
    };

    var recordPromptFinished = function (success) {
        localStorageSet(promptActiveKeyPrefix, false);
        localStorageRemove(promptMessageKeyPrefix);
        if (success === true) {
            promptIntervalTracker.Reset();
        } else {
            promptIntervalTracker.RecordAction();
        }
    };

    var recordPromptSettingsForDisabled = function () {
        // clear the prompt history, then increment to the first failed state
        promptIntervalTracker.Reset();
        promptIntervalTracker.RecordAction();
    };

    var declinePrompt = function () {
        Roblox.PushNotificationRegistrar.getEventPublisher().Publish(Roblox.PushNotificationEventPublishers.RegistrationEventTypes.promptDeclined);
        clearAllPromptsAndModals();
        recordPromptFinished(false);
    };

    var acceptPrompt = function () {
        Roblox.PushNotificationRegistrar.getEventPublisher().Publish(Roblox.PushNotificationEventPublishers.RegistrationEventTypes.promptAccepted);
        enablePushNotifications();
    };

    var closeMessage = function () {
        clearAllPromptsAndModals();
    };

    var handleFriendRequestSent = function () {
        try {
            if (promptOnFriendRequestSentEnabled) {
                promptToAllowPush('Do you want to know when your friend request is accepted?');
            }
        } catch (e) {
        } 
    };

    var handlePrivateMessageSent = function () {
        try {
            if (promptOnPrivateMessageSentEnabled) {
                promptToAllowPush('Do you want to know when you receive messages?');
            }
        } catch (e) {
        }
    };

    var initialize = function () {
        loadSettings();

        promptIntervalTracker = new Roblox.PersistedBackoffIntervalTracker(pushPromptIntervals, 'Roblox.PushNotificationRegistrationUI.Prompt.' + userId);
        var promptActive = localStorageGet(promptActiveKeyPrefix);
        if (promptActive && promptActive === 'true') {
            // If a prompt has previously been triggered, but hasn't been resolved by the user, show it
            var customMessage = localStorageGet(promptMessageKeyPrefix);
            promptToAllowPush(customMessage, true);
        } else if (nonContextualPromptAllowed && promptIntervalTracker.HasBeenTooLong(2)) {
            // If they haven't been prompted before, or if it has been twice the current minimum prompting 
            // interval, then lets prompt them anyway
            promptToAllowPush();
        }

        // Wire up event handlers
        $(document).on('Roblox.Friendship.FriendRequestSent', handleFriendRequestSent);
        $(document).on('Roblox.Messages.MessageSent', handlePrivateMessageSent);
    };

    return {
        initialize: initialize,
        prompt: promptToAllowPush,
        enable: enablePushNotifications,
        disable: disablePushNotifications,
        closeMessage: closeMessage
    };
}();
$(Roblox.PushNotificationRegistrationUI.initialize);