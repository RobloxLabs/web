if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Animations === "undefined") {
    Roblox.Animations = {};
}
Roblox.Animations.Update = function () {

    var nameErrorText = "";

    var initializeStrings = function () {
        nameErrorText = Roblox.Animations.Update.Resources.nameError;
    };

    function showNameError() {
        $('#nameRow span').removeClass("field-validation-valid");
        $('#nameRow span').addClass("field-validation-error");
        $('#nameRow span').text(nameErrorText);
    }

    return {
        initializeStrings: initializeStrings,
        showNameError: showNameError
    };
} ();

$(function () {

    function showOrHideNameError() {
        if ($("input#Name").val().trim() == '') {
            Roblox.Animations.Update.showNameError();
            Roblox.StyleguideConversions.convertMvcErrorToStyleGuide();
        } else {
            $('#nameRow span').html("").removeClass("tool-tip");
        }
    }

    $("input#Name").bind('blur keyup', function () {
        showOrHideNameError();
    });

    $("#okButton").click(function () {
        $('form#animationForm').submit();
        $(this).addClass('btn-disabled-primary');
        $(this).prop("disabled", true);
        showProcessingModal();
        return false;
    });

    $('#cancelButton').click(function () {
        document.location = $(this).attr('href');
    });

    function switchTabs(nextTabElem) {
        var currentTab = $('div.verticaltab.selected');
        currentTab.removeClass('selected');
        $('#' + currentTab.data('id')).hide();
        nextTabElem.addClass('selected');
        $('#' + nextTabElem.data('id')).show();
        $('#navbar').removeClass(currentTab.attr('id'));
        $('#navbar').addClass(nextTabElem.attr('id'));
    }

    $('div.verticaltab').bind('click', function () {
        switchTabs($(this));
    });

    showOrHideNameError();
    Roblox.StyleguideConversions.convertMvcErrorToStyleGuide();
    $('#navbar').addClass($('div.verticaltab.selected').attr('id'));

    function showProcessingModal(closeClass) {
        var modalProperties = { overlayClose: false, opacity: 80, overlayCss: { backgroundColor: "#000" }, escClose: false };

        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }

        $("#ProcessingView").modal(modalProperties);
    };

    //go to the Basic Settings Tab if there was an error in form submission
    if ($('div.validation-summary-errors').attr('data-valmsg-summary') == 'true') {
        switchTabs($('#basicSettingsTab'));
    }
});