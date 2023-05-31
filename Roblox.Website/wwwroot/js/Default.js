function FBLogout(appid) {

    window.fbAsyncInit = function () {
        FB.init({
            appId: appid,
            status: true,
            cookie: true,
            oauth: true,
            channelUrl: 'http://' + window.location.host + '/fbChannel.aspx'
        });

        // fetch the status on load
        FB.getLoginStatus(handleLogout);

    };
    (function () {
        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        document.getElementById('fb-root').appendChild(e);
    } ());

};

// handle a session response from any of the auth related calls
function clearSession(response) {
    // if we dont have a session, just hide the user info
    if (!response.authResponse) {
        $('#user-info').fadeOut();
        $("#facepile").fadeOut();
        return;
    }
}
