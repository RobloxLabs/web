if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.PushNotificationRegistrar = function () {
    var registrationSendTimestampKeyPrefix = "Roblox.PushNotificationRegistrar.LastRegistrationSendTimestamp";
    var subscriptionFailureReasons = {
        permissionDenied: "permissionDenied",
        other: "other"
    };

    var settings = {
        notificationsHost: null,
        registrationPath: null,
        registrationResendInterval: null,
        registrationShouldSendDeliveryEndpoint: null,
        platformType: null
    };

    var eventPublisher;

    var isPushSupported = false;
    var isPushBlockedByUser = false;

    var resolveInitializationPromise = null;
    var initializationPromise = new Promise(function (resolve, reject) {
        resolveInitializationPromise = resolve;
    });

    var loadSettings = function () {
        var settingsElement = $('#push-notification-registrar-settings');
        
        settings.notificationsHost = settingsElement.data('notificationshost');
        settings.registrationPath = settingsElement.data('registrationpath');
        settings.registrationResendInterval = settingsElement.data('reregistrationinterval') || (8 * 60 * 60 * 1000) /*8 hours*/;
        settings.registrationShouldSendDeliveryEndpoint = settingsElement.data('shoulddeliveryendpointbesentduringregistration') || false;
        settings.platformType = settingsElement.data('platformtype') || '';
    };

    var sendSubscriptionToServer = function (subscription, initiatedByUser, onSuccess, onFailure) {
        var url = settings.notificationsHost + '/v2/push-notifications/' + settings.registrationPath;
        var token = Roblox.PushNotificationRegistrationUtilities.getRegistrationToken(subscription);
        var payload = {
            notificationToken: token,
            initiatedByUser: initiatedByUser
        }

        if (settings.registrationShouldSendDeliveryEndpoint) {
            payload["notificationEndpoint"] = Roblox.PushNotificationRegistrationUtilities.getRegistrationEndpoint(subscription);
        }

        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(payload),
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            contentType: Roblox.Constants.http.contentType,
            success: function (msg) {
                //RBX registration success
                recordResendingOfRegistrationDetails();
                if (onSuccess && typeof (onSuccess) === 'function') {
                    onSuccess();
                }
            },
            error: function (e) {
                if (onFailure && typeof (onFailure) === 'function') {
                    onFailure(e);
                }
            }
        });
    };

    var getRegistrationSentTimestampKey = function() {
        var sessionId = Roblox.Cookies.getSessionId();
        return registrationSendTimestampKeyPrefix + '_' + sessionId;
    }

    var tooSoonToResendRegistrationDetails = function () {
        var lastPrompt = localStorage.getItem(getRegistrationSentTimestampKey());
        if (!lastPrompt) {
            return false;
        }

        var lastPromptTime = new Date(lastPrompt).getTime();
        var currentTime = new Date().getTime();
        var elapsed = currentTime - lastPromptTime;

        return elapsed <= settings.registrationResendInterval;
    };

    var recordResendingOfRegistrationDetails = function () {
        localStorage.setItem(getRegistrationSentTimestampKey(), new Date());
    };

    var arePushCapabilityPrerequisitesMet = function () {
        // Check Roblox Service Worker Scripts are loaded
        if (!Roblox.ServiceWorkerRegistrar || !Roblox.ServiceWorkerRegistrar.serviceWorkersSupported()) {
            return false;
        }

        // Check browser Service Worker capabilities
        if (!(ServiceWorkerRegistration && ('showNotification' in ServiceWorkerRegistration.prototype))) {
            return false;
        }

        // Check if push messaging is supported  
        if (!('PushManager' in window)) {
            return false;
        }

        // Ensure all required settings have been specified
        if (!(settings.notificationsHost && settings.registrationPath)) {
            return false;
        }

        return true;
    }

    var initialize = function () {
        loadSettings();
        eventPublisher = new Roblox.PushNotificationEventPublishers.Registration(settings.platformType);

        if (!arePushCapabilityPrerequisitesMet()) {
            resolveInitializationPromise();
            return;
        }

        isPushSupported = true;

        // Check the current Notification permission.  
        // If its denied, it's a permanent block until the  
        // user changes the permission  
        if (Notification.permission === 'denied') {
            isPushBlockedByUser = true;
            resolveInitializationPromise();
            return;
        }

        // Ensure the service worker is installed before attempting to re-send registration to server
        if (!(navigator.serviceWorker && navigator.serviceWorker.controller)) {
            resolveInitializationPromise();
            return;
        }

        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            // Do we already have a push message subscription?  
            return serviceWorkerRegistration.pushManager.getSubscription();
        }).then(function (subscription) {
            if (!subscription) {
                // We aren't subscribed to push, so set UI  
                // to allow the user to enable push
                resolveInitializationPromise();
                return;
            }

            // Keep your server in sync with the latest subscriptionId
            if(!tooSoonToResendRegistrationDetails()) {
                    
                sendSubscriptionToServer(subscription, false, function() {
                    resolveInitializationPromise();
                }, function(error) {
                    resolveInitializationPromise();
                });
            } else {
                resolveInitializationPromise();
                return;
            }
        }).catch(function (err) {
            resolveInitializationPromise();
            //error while getting subscription from browser
        });
    };

    var subscribe = function (onSuccess, onFailure) {
        Roblox.ServiceWorkerRegistrar.register();
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
              .then(function (subscription) {
                  // The subscription was successful  
                  sendSubscriptionToServer(subscription, true, onSuccess);
                  
              }).catch(function (e) {
                  if (Notification.permission === 'denied') {
                      // The user denied the notification permission which  
                      // means we failed to subscribe and the user will need  
                      // to manually change the notification permission to  
                      // subscribe to push messages 
                      if (onFailure && typeof (onFailure) === 'function') {
                          onFailure(subscriptionFailureReasons.permissionDenied);
                      }
                  } else {
                      // A problem occurred with the subscription; common reasons  
                      // include network errors, and lacking gcm_sender_id and/or  
                      // gcm_user_visible_only in the manifest.  
                      if (onFailure && typeof (onFailure) === 'function') {
                          onFailure(subscriptionFailureReasons.other);
                      }
                  }
              });
        });
    };

    var unsubscribe = function (onSuccess, onFailure) {
        $.ajax({
            method: "POST",
            url: settings.notificationsHost + '/v2/push-notifications/deregister-current-device',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (msg) {
                if (msg && msg.statusMessage && msg.statusMessage === Roblox.Constants.http.successStatus) {
                    if (onSuccess && typeof (onSuccess) === 'function') {
                        onSuccess(true);
                    }
                }
            },
            error: function (e) {
                if (onFailure && typeof (onFailure) === 'function') {
                    onFailure(e);
                }
            }
        });
    };

    var isPushEnabled = function (callback) {
        if (isPushBlockedByUser) {
            callback(false);
            return;
        }

        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            return serviceWorkerRegistration.pushManager.getSubscription();
        }).then(function (subscription) {
            if (!subscription) {
                callback(false);
                return;
            }

            // wait for initialization to finish before querying the current state
            // to avoid race conditions
            initializationPromise.then(function () {
                $.ajax({
                    method: "GET",
                    url: settings.notificationsHost + '/v2/push-notifications/get-current-device-destination',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (response) {
                        if (response && response.destination) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    }
                });
            });
        });
    };

    return {
        initialize: initialize,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        isPushSupported: function () { return isPushSupported; },
        isPushEnabled: isPushEnabled,
        isPushBlockedByUser: function () { return isPushBlockedByUser; },
        subscriptionFailureReasons: subscriptionFailureReasons,
        getEventPublisher: function () { return eventPublisher; }
    };
}();
$(Roblox.PushNotificationRegistrar.initialize);