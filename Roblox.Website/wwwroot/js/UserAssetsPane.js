$(document).ready(function () {
    BindMouseClick();
    BindNavPills();
});
Sys.Application.add_load(BindMouseClick);
Sys.Application.add_load(BindMouseOver);
Sys.Application.add_load(BindNavPills);
function BindMouseClick() {
    $('.SetAddButton').click(function () {
        var assetId = $(this).parent().parent().attr('id').replace('setList_', '');
        var setId = $(this).children('.setId')[0].value;
        var setDivId = 'set_' + setId + '_' + assetId;
        var imgId = "waiting" + setDivId;
        $(setDivId).append("<img src='/images/spinners/spinner16x16.gif' id='" + imgId + "'");
        $.ajax(
                {
                    type: "POST",
                    async: true,
                    cache: false,
                    timeout: 50000,
                    url: "/Sets/SetHandler.ashx?rqtype=addtoset&assetId=" + assetId + "&setId=" + setId,
                    success: function (data) {
                        if (data !== null) {
                            // Remove that set from the list of available sets
                            $('#' + setDivId).removeClass('SetAddButton');
                            $('#' + setDivId).addClass('SetAddButtonAlreadyContainsItem');
                            $('#' + setDivId).unbind('click');
                            // Remove the spinner
                            $('#' + imgId).remove();
                        }
                    },
                    failure: function (data) {
                        if (data !== null) {
                            //alert("failure");
                        }
                    }
                });
    });

    $(".creation-context").click(function () {
        var userid = $(".universe-creations-text").data('userid');
        var creationContext = $(this).data('creationcontext');
        $("li.active").removeClass('active');
        $(this).parent().addClass('active');
        var req = { creationContext: creationContext, userId: userid, startIndex: 0 };
        $.get("/universes/get-games-by-context", req, function (respData) {
            $("#RepeatingUserAssetData").html(respData);
        });
        return false;
    });
}
function BindMouseOver() {
    $('.SetList').hover(
            function () {
                var id = $(this).ID;
                // Hide any other visible ones (was an issue where fadeOut was leading to popups staying up.
                $('.SetListDropDown').each(function () { if ($(this).parent().attr('id') != id) $(this).hide(); });

                // If they just moused over, reset the timer
                var currentTime = new Date();
                var timeoutTimeInUTC = Date.parse(currentTime.toUTCString()) + 500;
                $(this).attr('mouseovertimeout', timeoutTimeInUTC);
                $(this).find('div').show();
            },
            function () {
                //alert('mouseout')
                var parent = this;
                window.setTimeout(function () {
                    var timeoutMilliseconds = $(parent).attr('mouseovertimeout');
                    var currentMilliseconds = Date.parse(new Date().toUTCString());
                    if (timeoutMilliseconds > currentMilliseconds) {
                        return;
                    }
                    else {
                        $(parent).find('div').fadeOut();
                    }
                }, 500);

            });
}
function BindNavPills() {
    $("ul.nav-pills li").click(function () {
        $(".nav-pills li.active").removeClass("active");
        $(this).addClass("active");
    });
}
