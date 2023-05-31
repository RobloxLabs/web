$(document).ready(function () {
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
});