var Roblox = Roblox || {};
Roblox.CookieConstraint = Roblox.CookieConstraint || {};
Roblox.CookieConstraint.Timer = (function () {
    function countDownLayout (isVisible) {
        $("#countDown").toggle(isVisible);
    }

    function formatCountDown(time) {
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;

        var days = Math.floor(time / _day);
        var hours = Math.floor((time % _day) / _hour);
        var minutes = Math.floor((time % _hour) / _minute);
        var countdownString = "";
        if (days) {
            countdownString = (days == 1) ? days + " day " : days + " days ";
        }

        if (hours == 1 || hours == 0) {
            countdownString += "0" + hours + " hr ";
        } else {
            if (hours < 10) {
                hours = "0" + hours;
            }
            countdownString += hours + " hrs ";
        }

        if (minutes == 1 || minutes == 0) {
            countdownString += "0" + minutes + " min ";
        } else {
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            countdownString += minutes + " mins ";
        }

        if (time <= _minute) {
            var seconds = Math.floor((time % _minute) / _second);
            countdownString += seconds + " secs ";
        }

        return countdownString;
    }
    function timer() {
        var refreshIntervalId;
        var endTimeString = $("#cookie-constraint-container").attr("data-count-down-utc-time") + " UTC";

        function setTime() {
            var end = new Date(endTimeString);
            var now = new Date();
            var remaining = end - now;
            if (remaining > 0) {
                var countdownString = formatCountDown(remaining);
                if (!$("#countDown").is(":visible")) {
                    countDownLayout(true);
                }
                var countdownTimerElm = $("#timer");
                countdownTimerElm.html(countdownString);

            } else {
                clearInterval(refreshIntervalId);
                countDownLayout(false);
                return;
            }
        }

        refreshIntervalId = setInterval(setTime, 1000);
    }

    return {
        init: timer
    }
})();

Roblox.CookieConstraint.Timer.init();