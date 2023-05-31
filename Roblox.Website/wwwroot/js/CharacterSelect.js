if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.CharacterSelect = (function () {

    var gender = { male: 2, female: 3 };

    $(function () {
        $('.VisitButtonGirlGuest').click(visitButtonGirlGuestClick);
        $('.VisitButtonBoyGuest').click(visitButtonBoyGuestClick);
    });

    function visitButtonBoyGuestClick() {
        my.genderID = gender.male;
        visitButtonClick(1, 'Male', gender.male);
        return false;
    }

    function visitButtonGirlGuestClick() {
        my.genderID = gender.female;
        visitButtonClick(0, 'Female', gender.female);
        return false;
    }

    function visitButtonClick(genderIDforGA, genderNameForRbxEvent, genderIDforReqGame) {
        $.modal.close('.GuestModePromptModal');
        // this is currently handled within generated JS code.  Hopefully someday we will fire these events here instead.
        /*
        $(function () {
        RobloxEventManager.triggerEvent('rbx_evt_play_guest', {
        age: 'Unknown',
        gender: genderNameForRbxEvent
        });
        });
        GoogleAnalyticsEvents.FireEvent(['Play', 'Guest', '', genderIDforGA]);
        */
        my.robloxLaunchFunction(genderIDforReqGame);
    }

    function show() {
        $('#GuestModePrompt_BoyGirl').modal({
            overlayClose: true,
            escClose: true,
            opacity: 80,
            overlayCss: {
                backgroundColor: '#000'
            },
            onShow: correctIE7ModalPosition
        });
    }

    function correctIE7ModalPosition(dialog) {
        if (dialog.container.innerHeight() == 15) {
            // this must be IE 6/7 (or equally stupid).  shift the modal up.
            var shiftDistance = -Math.floor($('#GuestModePrompt_BoyGirl').innerHeight() / 2);
            $('#GuestModePrompt_BoyGirl').css({ position: "relative", top: shiftDistance + "px" });
        }
    }

    function hide() {
        $.modal.close('.GuestModePromptModal');
    }

    // external interface (internally referenced as "my")
    var my = {
        robloxLaunchFunction: function (genderIDforReqGame) { },
        genderID: null,
        show: show,
        hide: hide,
        // This is kind of a hack.  we lose the clicked element's context when we call robloxLaunchFunction().
        // The property below is so that $(this).attr("placeid") returns the correct value.
        // This should be set, but if not, undefined will set placeid = play_placeID (which is something, if not always
        // correct).
        placeid: undefined
    };

    return my;
})();