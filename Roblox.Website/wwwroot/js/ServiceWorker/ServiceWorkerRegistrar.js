if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.ServiceWorkerRegistrar = function () {

    var getPushNotificationsServiceWorkerJsFileLocation = function () {
        return Roblox.Endpoints.getAbsoluteUrl('/service-workers/push-notifications');
    };

    var serviceWorkersSupported = function () {
        return 'serviceWorker' in navigator;
    }

    var initialize = function () {
        if (serviceWorkersSupported()) {
            // Service workers will be registered as they are needed by the user
            // If already installed, it will be updated.
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(function (registration) {
                    var scopeUrl = new URL(registration.scope);
                    if (scopeUrl.pathname !== "/") {
                        //clean up old service workers if they are on the wrong path!!
                        registration.unregister();
                    } else {
                        // Update existing worker
                        installOrUpdate();
                    }
                });
            }
        }
    };

    var register = function () {
        if (navigator.serviceWorker.controller) {
            // already installed
            return;
        }
        installOrUpdate();
    };

    var installOrUpdate = function () {
        var scriptUrl = getPushNotificationsServiceWorkerJsFileLocation();
        navigator.serviceWorker.register(scriptUrl, { scope: '/' }).then(function (registration) {
            //success
        }).catch(function (error) {
            //failure
        });
    };

    return {
        initialize: initialize,
        register: register,
        serviceWorkersSupported: serviceWorkersSupported
    }
}();
$(Roblox.ServiceWorkerRegistrar.initialize);