function reset_EnterContest() {
    $('#EnterContestModal').hide();
    $('.EnterContestButtons').show();
    $('#SelectPlace').remove();
    $('.VibModalBack').hide();
    $('#OverwritePlaceDialog').hide();
    $('#UseExistingPlaceDialog').hide();
    $('#TitleText').html('');
    $('#TitleText').hide();
}

function countdown_help(secondsbetween) {
    var minutesbetween = secondsbetween / 60;
    var hoursbetween = minutesbetween / 60;
    var daysbetween = Math.floor(hoursbetween / 24);
    if (daysbetween == 1) {
        daysbetween = daysbetween.toString() + " day ";
    }
    else if (daysbetween == 0) {
        daysbetween = "";
    }
    else {
        daysbetween = daysbetween.toString() + " days ";
    }
    var timeremaininghours = Math.floor(hoursbetween % 24);
    if (timeremaininghours == 1) {
        timeremaininghours = timeremaininghours.toString() + " hour ";
    }
    else {
        timeremaininghours = timeremaininghours.toString() + " hours ";
    }
    if (daysbetween == "" && timeremaininghours == "0 hours ") {
        timeremaininghours = "";
    }
    var timeremainingminutes = Math.floor(minutesbetween % 60);
    if (timeremainingminutes == 1) {
        timeremainingminutes = timeremainingminutes.toString() + " minute ";
    }
    else {
        timeremainingminutes = timeremainingminutes.toString() + " minutes ";
    }
    if (daysbetween == "" && timeremaininghours == "" && timeremainingminutes == "0 minutes ") {
        timeremainingminutes = "";
    }
    var timeremainingseconds = Math.floor(secondsbetween % 60);
    if (timeremainingseconds == 1) {
        timeremainingseconds = timeremainingseconds.toString() + " second ";
    }
    else {
        timeremainingseconds = timeremainingseconds.toString() + " seconds ";
    }
    $("#timer_countdown").html("Contest ends in " + daysbetween + timeremaininghours + timeremainingminutes + timeremainingseconds);
}