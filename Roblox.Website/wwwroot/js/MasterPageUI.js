// enable tipsy
$(function () {
    try {
        $('.tooltip').tipsy();
        $('.tooltip-top').tipsy({ gravity: 's' });
        $('.tooltip-right').tipsy({ gravity: 'w' });
        $('.tooltip-left').tipsy({ gravity: 'e' });
        $('.tooltip-bottom').tipsy({ gravity: 'n' });
    }
    catch(err) {
    }


    // <a disabled> anchor tags don't support disabled attributes in HTML5
    // Since this is in our master styleguide we just need to add the disabled property when we detect a disabled button
    $('a.btn-disabled-primary[disabled]').prop('disabled', true);

});

if (typeof Roblox === "undefined") {
    Roblox = {};
}

/* Roblox.FixedUI handles hiding iframe ads when conflicting with the fixed header, 
and unfixing the header when the window is resized or we are on mobile devices */
Roblox.FixedUI = function () {

    var ua = navigator.userAgent.toLowerCase(); /* unfix headers for iphone, mobile, android, blackberry or playbook devices */
    var isMobile = /mobile/i.test(ua) || /ipad/i.test(ua) || /iphone/i.test(ua) || /android/i.test(ua) || /playbook/i.test(ua) || /blackberry/i.test(ua);
    var usingNavigation2014;
    /* Run on load */
    $(function () {
        usingNavigation2014 = $('body').hasClass('layout-2014');
        if (isMobile) {
            setHeaderScrollState(false);
        }
        else {
            $(window).on('load resize', function checkIfFixed() {
                setHeaderScrollState(isWindowWiderThanThreshold());
            });
        }
    });


    /* Unfixing header for small windows */
    function setHeaderScrollState(setAsFixed) {
        var elements = ['.forceSpace', '#Container', '.mySubmenuFixed', '.site-header', '#MasterContainer', 'body', '#Footer', '.forceSpaceUnderSubmenu'];

        for (var i = 0; i < elements.length; i++) {
            if (setAsFixed || usingNavigation2014) $(elements[i]).removeClass('unfixed');
            else $(elements[i]).addClass('unfixed');
        }
    }

    function getWindowWidth() {
        var winW = 1024;
        if (document.body && document.body.offsetWidth) winW = document.body.offsetWidth; /* ie */
        if (window.innerWidth && window.innerHeight) winW = window.innerWidth; /* other browsers */
        return winW;
    }

    function isHeaderFixed() {
        return usingNavigation2014 || (!isMobile && isWindowWiderThanThreshold());
    }

    function isWindowWiderThanThreshold() {
        return getWindowWidth() >= 978;
    }



    /* Public interface */
    var my = {
        isMobile: isMobile,
        gutterAdsEnabled: false,
        isHeaderFixed: isHeaderFixed,
        getWindowWidth: getWindowWidth
    };
    return my;
} ();