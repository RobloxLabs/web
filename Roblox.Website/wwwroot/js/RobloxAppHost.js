var RobloxAppHost = {
    UseAppHost: true,
    OpenPicFolder: function () {
        if (RobloxAppHost.UseAppHost) {
            window.external.AppHostOpenPicFolder();
        }
        else {
            window.external.OpenPicFolder();
        }
    },
    OpenVideoFolder: function () {
        if (RobloxAppHost.UseAppHost) {
            window.external.AppHostOpenVideoFolder();
        }
        else {
            window.external.OpenVideoFolder();
        }
    },
    PostImage: function (doPost, postSetting, filename, seostr) {
        if (RobloxAppHost.UseAppHost) {
            // note: signature has changed, seostr goes before filename. Different the the old method!
            var doPostValue = doPost ? 1 : 0;
            window.external.AppHostPostImage(doPostValue, postSetting, seostr, filename);
        }
        else {
            window.external.PostImage(doPost, postSetting, filename, seostr);
        }
    },
    UploadVideo: function (sessionKey, doPost, postSetting, title) {
        if (RobloxAppHost.UseAppHost) {
            var doPostValue = doPost ? 1 : 0;
            window.external.AppHostUploadVideo(sessionKey, doPostValue, postSetting, title);
        }
        else {
            window.external.UploadVideo(sessionKey, doPost, postSetting, title);
        }
    }
};

try {
    window.external.CheckAppHost();
}
catch (e) {
    RobloxAppHost.UseAppHost = false;
}