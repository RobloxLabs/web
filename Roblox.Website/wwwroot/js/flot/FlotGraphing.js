var Roblox = Roblox || {};

Roblox.FlotGraphing = Roblox.FlotGraphing || function () {

    var monthNames =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function drawChartFromEndpoint(getUrl, containerId, onSuccess, onFailure, chartOptions) {
        var chart = new Roblox.FlotChart(containerId, chartOptions);
        chart.setUrl(getUrl);
        chart.drawChartFromEndpoint(onSuccess, onFailure);
    }

    function drawChartFromData(data, containerId, chartOptions) {
        var chart = new Roblox.FlotChart(containerId, chartOptions);
        chart.drawChartFromData(data);
    }

    function convertTimeToReadableString(timestamp, timeFrame) {
        var date = new Date(timestamp);
        var month = date.getMonth() + 1; //JavaScript months are 0-11
        var day = date.getDate();
        var year = date.getFullYear();

        if (timeFrame === "daily") {
            return (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + year;
        } else if (timeFrame === "monthly") {
            return monthNames[date.getUTCMonth()] + " " + year;
        }

        var hour = date.getHours();
        var minutes = date.getMinutes();
        var amPm;

        if (hour > 11) {
            amPm = "PM";
            hour = hour === 12 ? hour : hour - 12;
        } else {
            amPm = "AM";
            hour = hour === 0 ? 12 : hour;
        }

        minutes = minutes < 10 ? "0" + minutes.toString() : minutes.toString();

        return month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + amPm;
    }

    return {
        DrawChartFromEndpoint: drawChartFromEndpoint,
        DrawChartFromData: drawChartFromData,
        ConvertTimeToReadableString: convertTimeToReadableString
    };
}();