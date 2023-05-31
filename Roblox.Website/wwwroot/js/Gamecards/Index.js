$(function () {
    $('.assetname-wrapper').dotdotdot({
        height: 50
    });

    //disable any tabs that have no items in them
    $(".gamecarditems").each(function () {
        if ($(this).children(".gamecardItem").length == 0) {
            var tabID = $(this).attr('id') + "Tab";
            var tab = $('#' + tabID);
            var disabledFlagImage = $('#' + tabID + ' .flag-disabled');
            var flagImage = $('#' + tabID + ' img:not(.flag-disabled)');
            disabledFlagImage.removeClass('flag-disabled');
            flagImage.addClass('flag-disabled');
            tab.addClass('disabled');
        }
    });
    
    //move all disabled tabs to the bottom
    $('#Gamecardnavbar > div.disabled').each(function() {
        $(this).appendTo(this.parentNode);
    });
    
    //switch tabs logic
    $('.verticaltab:not(.disabled)').click(function () {
        var id = $(this).attr('id');
        var tabName = id.substring(0, id.indexOf('Tab'));
        $('.gamecarditems').hide();
        $('#' + tabName).show();
        $("#Gamecardnavbar div.selected").removeClass('selected');
        $(this).addClass("selected");
    });

    //initial selected tab
    var firstId = $('.verticaltab:first').attr('id');
    var firstTabName = firstId.substring(0, firstId.indexOf('Tab'));
    $('.gamecarditems').hide();
    $('#' + firstTabName).show();
    $('.verticaltab:first').addClass('selected');

    //countdown timer initialization
    var timer = Roblox.CountdownTimer.countdown('cdclockWrapper');
    timer.Div = "clockWrapper";
    timer.TotalSeconds = $('#clockWrapper').data('timeleft');
    Roblox.CountdownTimer.setup();

    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    $('#EndDate').text("(" + Roblox.CountdownTimer.Resources.months[lastDay.getMonth()] + " " + lastDay.getDate() + ", " + lastDay.getFullYear() + " 11:59:59 PST)");
});