var Roblox = Roblox || {};

Roblox.FlotChart = function (containerId, chartOptions) {
    //public variables
    this.plot = null;
    this.url = null;

    // private variables
    var chart = this;

    /*
    chartOptions = {
        chartType = "line" || "pie" || "stacked",
        seriesNames = ["Computer", "Tablet", "Phone"],
        seriesUnits = ["Tickets"],
        seriesUnitFormat = "decimal" || "int",
        timeUnit = "hourly" || "daily" || "monthly"
    }
    */

    var chartType = chartOptions.chartType || "line";
    var chartTypes = chartOptions.chartTypes || [];
    var seriesNames = chartOptions.seriesNames || [];
    var seriesUnits = chartOptions.seriesUnits || [];
    var seriesUnitFormat = chartOptions.seriesUnitFormat || "int";
    var timeUnit = chartOptions.timeUnit.toLowerCase();
    var isDevelopApiEndpoint = chartOptions.isDevelopApiEndpoint;

    // indices of series that should be shown in legend but not in graph
    var seriesHidden = {};
    var labelIndex = 0;
    var lastChartType = chartType;

    var legendId = containerId + "-legend";
    var chartTypesId = containerId + "-chart-types";
    var tooltipClass = "flot-tooltip";
    var tooltipEnabled = true;

    var legendLabelFormatter = function (label, series) {
        // We passed index in with the data, but pie plugin clears out this data
        // This is why we need to keep track of index separately
        var index = labelIndex++;
        if (labelIndex >= seriesNames.length) {
            labelIndex = 0;
        }
        var showCheckboxes = (chart.data.length > 1);
        var checked = !seriesHidden[index] ? ' checked="checked" ' : '';
        var checkbox = (showCheckboxes ? '<input data-index="' + index + '"type="checkbox" ' + checked + '></input>' : '');

        return '<td class="legendLabel">' + checkbox + label + '</td>';
    };

    var isPieChart = function (optionalChartType) {
        return ((optionalChartType || chartType) === "pie");
    };

    var isLineChart = function (optionalChartType) {
        return ((optionalChartType || chartType) === "line");
    };

    var isStackedAreaChart = function (optionalChartType) {
        return ((optionalChartType || chartType) === "stacked");
    };

    var addChartTypeIcons = function () {
        var chartTypesDiv = $(chartTypesId);
        if (chartTypesDiv.length) {
            // move to end
            chartTypesDiv.insertAfter($(containerId));
            chartTypesDiv.html("");
            for (var chartTypesIndex = 0; chartTypesIndex < chartTypes.length; chartTypesIndex++) {
                var type = chartTypes[chartTypesIndex];
                var icon = undefined;
                if (isPieChart(type)) {
                    icon = $('<span class="icon-pie-chart"></span>');
                } else if (isLineChart(type)) {
                    icon = $('<span class="icon-line-chart"></span>');
                } else if (isStackedAreaChart(type)) {
                    icon = $('<span class="icon-bar-chart"></span>');
                }
                if (typeof icon !== "undefined") {
                    icon.data("chart-type", type);
                    var anchor = $("<a href=''></a>");
                    anchor.append(icon);
                    chartTypesDiv.append(anchor);
                }
            }
        }
    };

    var redraw = function (hardRedraw) {
        var chartData = transformDataToChartData();

        if (hardRedraw) {
            // when we change chart options, hard redraw is needed
            var options = initializeOptions();
            chart.plot.shutdown();
            chart.plot = $.plot(containerId, chartData, options);
            onPlotDraw();
            // flot may leak some memory here, but it's necessary to reinitialize when we switch chartType.
        } else {
            chart.plot.setData(chartData);
            chart.plot.setupGrid();
            chart.plot.draw();
            onPlotDraw();
        }
    };

    var onPlotDraw = function () {
        addChartTypeIcons();

        $(chartTypesId).find("span").click(function (e) {
            e.preventDefault();
            var iconChartType = $(this).data("chart-type");
            if (typeof iconChartType !== "undefined") {
                lastChartType = chartType;
                chartType = iconChartType;
                redraw(true);
            }
        });

        $(legendId).find("input").click(function () {
            // show/hide the data in graph that was clicked on in legend
            var seriesIndex = $(this).data("index");
            seriesHidden[seriesIndex] = !seriesHidden[seriesIndex];

            redraw(false);
        });
    };

    var calculateBarWidth = function () {
        var data = chart.data;
        if (data && data.length) {
            /* assume data is a time series */
            var series = data[0];
            var bucketOne = series[0][0];
            var bucketTwo = series[1][0];
            return (bucketTwo - bucketOne);
        }

        return 0;
    };

    var initializeOptions = function () {
        var options = {
            legend: {
                position: "sw",
                container: legendId,
                labelFormatter: legendLabelFormatter
            },
            series: {}
        };

        if (tooltipEnabled) {
            var seriesUnit = seriesUnits[0];
            if (typeof seriesUnit === "undefined") {
                seriesUnit = "";
            }
            var isInt = (seriesUnitFormat === "int");
            var content = "%s | " + (isPieChart() ? "%n" : (isInt ? "%y.0" : "%y.2")) + " " + seriesUnit;

            options.tooltip = {
                show: true,
                content: content.escapeHTML(),
                defaultTheme: false,
                cssClass: tooltipClass
            };

            options.grid = {
                hoverable: true,
                clickable: true
            };
        }

        if (isPieChart()) {
            options.series.pie = {
                innerRadius: 0.5,
                show: true
            };
        }

        if (isLineChart()) {
            options.lines = {
                show: true
            };
        }

        if (isStackedAreaChart()) {
            options.series = {
                stack: true,
                bars: {
                    show: true,
                    barWidth: calculateBarWidth()
                }
            };
        }

        if (isLineChart() || isStackedAreaChart()) {
            options.xaxis = {
                mode: "time",
                tickLength: 0,
                timezone: "browser"
            };

            if (seriesUnits.length > 1) {
                options["yaxes"] = [
                    { min: 0, tickFormatter: function (val, axis) { return val < axis.max ? val.toFixed(1) : seriesUnits[0]; } },
                    { min: 0, alignTicksWithAxis: 1, position: "right", tickFormatter: function (val, axis) { return val < axis.max ? val.toFixed(0) : seriesUnits[1]; } }
                ];
            } else {
                options["yaxis"] = { min: 0, tickFormatter: function (val, axis) { return val < axis.max ? val.toFixed(1) : seriesUnits[0]; } };
            }
        }

        return options;
    };

    function getSumOfSeries(series) {
        var seriesLength = series.length;
        var sum = 0;
        for (var i = 0; i < seriesLength; i++) {
            sum += series[i][1];
        }
        return sum;
    }

    function transformDataToChartData() {
        var rawSeries, series, i,
            rawData = chart.data,
            chartData = [],
            isPie = isPieChart(),
            isStacked = isStackedAreaChart(),
            isLine = isLineChart();

        for (i = 0; i < rawData.length; i++) {
            rawSeries = rawData[i];

            if (timeUnit === "hourly" && rawSeries.length > 0) {
                // Remove data point for current hour. Developers might get alarmed by the low stats of
                // unfinished hour.
                // Make a copy of the raw series to avoid modifying it. 
                rawSeries = rawSeries.slice(0, -1);
            }

            if (seriesHidden[i]) {
                // Use zeros to keep the hidden series on legend, which is used for toggling series.
                if (isPie || isStacked) {
                    series = 0;
                } else {
                    series = [0];
                }
            } else {
                // Series is selected.
                if (isPie) {
                    series = getSumOfSeries(rawSeries);
                } else {
                    series = chart.fillMissingDataPoints(rawSeries, timeUnit, isDevelopApiEndpoint);
                }
            }

            // Add to chart data for plotting.
            chartData.push({
                data: series,
                label: seriesNames[i],
                yaxis: 1,
                index: i,
                lines: { show: isLine && !seriesHidden[i] }
            });
        }

        return chartData;
    }

    this.getDataFromUrl = function (onSuccess, onFailure) {
        $.ajax({
            url: chart.url,
            success: onSuccess,
            error: onFailure
        });
    };

    this.setUrl = function (url) {
        chart.url = url;
    };

    this.drawChartFromEndpoint = function (onSuccess, onFailure) {
        /* Expects JSON in format 
        {
            Data: []
            SeriesNames: [] or null
            Version: number
        } 
        */
        chart.getDataFromUrl(function (json) {
            if (typeof onSuccess === "function") {
                onSuccess(json.Data, containerId);
            }
            chart.data = json.Data;
            chart.drawChartFromData(json);
        }, function (json) {
            if (typeof onFailure === "function") {
                onFailure(json, containerId);
            }
        });
    };

    this.drawChartFromData = function (json) {
        /* Expects JSON in format 
        {
            Data: []
            SeriesNames: [] or null
            Version: number
        } 
        */
        var data = json.Data;
        chart.data = data;

        //if the series names are provided by JSON, let them replace the local series names
        if (json.SeriesNames !== null) {
            seriesNames = json.SeriesNames;
        }

        //fill in seriesUnits if it's an empty array
        if (!seriesUnits && seriesNames) {
            seriesUnits = [];
            for (var i = 0; i < seriesNames.length; i++) {
                seriesUnits.push('');
            }
        }

        var options = initializeOptions();

        var chartData = transformDataToChartData();

        this.plot = $.plot(containerId, chartData, options);

        onPlotDraw();
    };
};

/**
 * @description Fill time gaps in series with zero-value data points.
 * @param {any} series Array of datapoints: [ [t1, v1], [t2, v2], ...]
 * @param {string} timeUnit Time unit can be "hourly", "daily", or "monthly".
 * @param {boolean} isDevelopApiEndpoint Whether new statistics endpoints in Develop API site are enabled.
 * @returns {any} Padded array of datapoints.
 */
Roblox.FlotChart.prototype.fillMissingDataPoints = function(series, timeUnit, isDevelopApiEndpoint) {
    if (!isDevelopApiEndpoint || !timeUnit || !series || series.length === 0) {
        return series;
    }

    if (timeUnit !== "hourly" && timeUnit !== "daily" && timeUnit !== "monthly") {
        return series;
    }

    var hourSpan = 3600 * 1000, // Number of milliseconds in an hour.
        paddedSeries = [],
        expectedTime, point, pointTime, i;

    // Helper function returning next time value depending on time unit.
    var nextTimeValue = function (currentTimeValue) {
        if (timeUnit === "hourly") {
            return currentTimeValue + hourSpan;
        }

        var currentDate = new Date(currentTimeValue),
            d = currentDate.getDate(),
            m = currentDate.getMonth();

        if (timeUnit === "daily") {
            currentDate.setDate(d + 1);
        }
        else {
            // Monthly: add 1 month, and go to last date of the month.
            currentDate.setMonth(m + 2, 0);
        }

        return currentDate.getTime();
    };

    // Helper function to detect missing time points between t1 and t2, where t1 <= t2
    var hasGap = function (t1, t2) {
        if (timeUnit === "hourly") {
            return t1 < t2;
        }

        var date1 = new Date(t1), date2 = new Date(t2),
            y1 = date1.getFullYear(), y2 = date2.getFullYear(),
            m1 = date1.getMonth(), m2 = date2.getMonth(),
            d1 = date1.getDate(), d2 = date2.getDate();

        if (timeUnit === "monthly") {
            return y1 < y2 || (y1 === y2 && m1 < m2);
        }

        if (timeUnit === "daily") {
            return y1 < y2 || (y1 === y2 && m1 < m2) || (y1 === y2 && m1 === m2 && d1 < d2);
        }

        // Default for unknown time unit.
        return t1 < t2;
    };

    // Use 2 pointers to detect gap: i moves through each data point, while exepectedTime
    // advances 1 time unit at a time.
    // If a gap is detected between expectedTime and time value of data point at i, fill in
    // the missing points and advance expectedTime until it matches i's time.

    expectedTime = series[0][0];

    for (i = 0; i < series.length; i++) {
        point = series[i];
        pointTime = point[0];

        while (hasGap(expectedTime, pointTime)) {
            // Fill the gap between expected time point and current data point.
            paddedSeries.push([expectedTime, 0]);
            expectedTime = nextTimeValue(expectedTime);
        }

        paddedSeries.push(point);
        expectedTime = nextTimeValue(pointTime);
    }

    return paddedSeries;
};