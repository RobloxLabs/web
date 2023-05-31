$(function () {
    var loginPaneOpened = false;

    $('#header-login').click(function (evt) {
        loginPaneOpened = !loginPaneOpened;
        //Hide the Ad
        hideHeaderAd(loginPaneOpened);
        $('#iFrameLogin').toggle();
        $('#header-login').toggleClass('active');
        evt.stopPropagation();
        return false;
    });
    $('#headerLogin').click(function (evt) {
        loginPaneOpened = !loginPaneOpened;
        //Hide the Ad
        hideHeaderAd(loginPaneOpened);
        $('#iFrameLogin').toggle();
        $('#headerLogin').toggleClass('active');
        evt.stopPropagation();
        return false;
    });

    $(document).click(function (evt) {
        if (loginPaneOpened) {
            $('#header-login').removeClass('active');
            $('#headerLogin').removeClass('active');
            $('#iFrameLogin').hide();
            loginPaneOpened = false;
        }
    });

    var hideHeaderAd = function (mode) {
        $(".IframeAdHide").each(function () {
            //Hide only header.
            if ($(this).height() == 90 && $(this).width() == 728) {
                if (mode)
                    $(this).css('visibility', 'hidden');
                else
                    $(this).css('visibility', 'visible');
            }
        });
    };

    var ParseMessage = function (msg) {
        if (msg.indexOf("resize") != -1) {
            //msg = "resize,270px"
            var args = msg.split(',');
            $('#iFrameLogin').css({ 'height': args[1] });
        }
        if (msg.indexOf("fbRegister") != -1) {
            var args = msg.split('^');
            var qs = "&fbname=" + encodeURIComponent(args[1]) + "&fbem=" + encodeURIComponent(args[2]) + "&fbdt=" + encodeURIComponent(args[3]);
            window.location.href = "../Login/Default.aspx?iFrameFacebookSync=true" + qs;
        }
    };

    $.receiveMessage(function (e) {
        ParseMessage(e.data);
    });

    //show the login iFrame if the optional parameter exists
    if ($('#header-login-wrapper').data('display-opened') == "True") {
        $('#header-login').addClass('active');
        $('#iFrameLogin').css('display', 'block');
    }
});