/*
	Author:			Robert Hashemian (http://www.hashemian.com/)
	Modified by:	Munsifali Rashid (http://www.munit.co.uk/)
	Modified by:	Sam Walker (http://blog.bluesam.com)
    Modified by:    Alberto Pareja-Lecaros
*/
if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.CountdownTimer === "undefined") {
    Roblox.CountdownTimer = function () {

        var DaysDisplayFormat = "%%D%% Days";
        var HoursDisplayFormat = "%%HH%%:";
        var MinutesDisplayFormat = "%%MM%%:";
        var SecondsDisplayFormat = "%%SS%%";
        var DisplayStr = "";
        var obj;

        function countdown(properties) {

            var defaults = {
                Div: "clock",
                TotalSeconds: 1000,

                CountActive: true
            };
            obj = $.extend({}, defaults, properties); // merge defaults into passed in properties
            return obj;
        }

        function cd_Calcage(seconds, num1, num2) {
            s = ((Math.floor(seconds / num1)) % num2).toString();
            return (s);
        }

        function removeSIfOne(number, str) {
            if (number == 1) {
                return str.substring(0, str.lastIndexOf('s')) + str.substring(str.lastIndexOf('s') + 1);
            }
            else {
                return str;
            }
        }

        function cd_CountBack(secs) {
            if (secs < 1) {
                obj.CountActive = false;
                clearInterval();
            }
            var days = cd_Calcage(secs, 86400, 100000);
            var hours = cd_Calcage(secs, 3600, 24);
            var minutes = cd_Calcage(secs, 60, 60);
            var seconds = cd_Calcage(secs, 1, 60);
            DisplayStr = "";
            var first = true;
            if (days > 0) {
                first = false;
                DisplayStr += DaysDisplayFormat.replace(/%%D%%/g, days);
                DisplayStr = removeSIfOne(days, DisplayStr);
            }
            if (hours > 0 || days > 0) {
                if (!first) {
                    DisplayStr += " ";
                }
                first = false;
                if (hours < 10) {
                    hours = '0' + hours;
                }
                DisplayStr += HoursDisplayFormat.replace(/%%HH%%/g, hours);
            }
            if (minutes > 0 || hours > 0 || days > 0) {
                if (!first) {
                    DisplayStr += " ";
                }
                first = false;
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                DisplayStr += MinutesDisplayFormat.replace(/%%MM%%/g, minutes);
            }
            if (!first) {
                DisplayStr += " ";
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            DisplayStr += SecondsDisplayFormat.replace(/%%SS%%/g, seconds);

            document.getElementById(obj.Div).innerHTML = DisplayStr;
            obj.TotalSeconds -= 1;
        }

        function cd_Setup() {
            cd_CountBack(obj.TotalSeconds);
            if (obj.CountActive) setInterval(function() { cd_CountBack(obj.TotalSeconds); }, 990);
        }

        return {
            countdown: countdown,
            setup: cd_Setup
        };
    } ();
}