var randomFactsUpdateInterval = 200;
var randomFactsUpdateCounterMax = 10;
var randomFactsStartTime = 0;
var randomFactsCurrentState = 0;

var currentRandomFactIndex = 0;

function getNextRandomFactIndex() {
    var nextRandomFactIndex = currentRandomFactIndex;

    currentRandomFactIndex++;
    currentRandomFactIndex %= randomFactsTextArray.length;

    return nextRandomFactIndex;
}

function updateRandomFact(randomFactDivNumber) {
    var nextRandomFactIndex = getNextRandomFactIndex();
    document.getElementById("RandomFactImage" + randomFactDivNumber).src = randomFactsImagePathArray[nextRandomFactIndex];
    document.getElementById("RandomFactTextContainer" + randomFactDivNumber).innerHTML = randomFactsTextArray[nextRandomFactIndex];
}

function updateRandomFactsControl() {
    var currentDate = new Date();
    randomFactsTimeElapsed = (currentDate.getTime() - randomFactsStartTime) % 16000;

    if ((randomFactsTimeElapsed >= 0 && randomFactsTimeElapsed < 4000) && randomFactsCurrentState != 0) {

        randomFactsCurrentState = 0;
    }
    else if ((randomFactsTimeElapsed >= 4000 && randomFactsTimeElapsed < 8000) && randomFactsCurrentState != 1) {
        //1 out
        $("#RandomFactContainer1").fadeOut(2000);

        randomFactsCurrentState = 1;
    }
    else if ((randomFactsTimeElapsed >= 8000 && randomFactsTimeElapsed < 12000) && randomFactsCurrentState != 2) {
        //1 in
        updateRandomFact("1");
        $("#RandomFactContainer1").fadeIn(2000);

        //2 out
        $("#RandomFactContainer2").fadeOut(2000);

        randomFactsCurrentState = 2;
    }
    else if ((randomFactsTimeElapsed >= 12000 && randomFactsTimeElapsed < 16000) && randomFactsCurrentState != 3) {
        //2 in
        updateRandomFact("2");
        $("#RandomFactContainer2").fadeIn(2000);

        randomFactsCurrentState = 3;
    }
}

$(document).ready(function () {
    updateRandomFact("1");
    updateRandomFact("2");

    var currentDate = new Date();
    randomFactsStartTime = currentDate.getTime();

    setInterval(updateRandomFactsControl, randomFactsUpdateInterval);
});
        