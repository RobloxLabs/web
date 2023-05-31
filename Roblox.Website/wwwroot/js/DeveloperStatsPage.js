var Roblox = Roblox || {};
Roblox.DeveloperStats = function () {
    var ReportType = { CSV: "CSV", XLSX: "XLSX" };
    var ReportStatusType = { NotGenerated: "NotGenerated", Queued: "Queued", ReadyForDownload: "ReadyForDownload" };
    var RevenueReportStatusType = { NotGenerated: 0, Queued: 1, ReadyForDownload: 2 };

    function DownloadForm(type, downloadButton, errorDiv, warningText, monthSelect, dataDiv) {
        this.type = type;
        this.downloadButton = downloadButton;
        this.errorDiv = errorDiv;
        this.warningText = warningText;
        this.monthSelect = monthSelect;
        this.dataDiv = dataDiv;

        this.statusUrl = dataDiv.data("csvrequesturl");
        this.downloadUrl = dataDiv.data("csvdownloadurl");
        this.universeId = dataDiv.data("universeid");

        this.data = {};
        if (type === ReportType.CSV) {
            var options = monthSelect.children();
            for (var i = 1; i < options.length; ++i) {
                var parts = $(options[i]).val().split('-');
                this.data[parts[2] + "-" + parts[1]] = {
                    status: parts[0],
                    month: parts[1],
                    year: parts[2],
                    universeId: this.universeId
                };
            }
        }

        var requestIntervalMs = 5000;
        this.requestIntervalId = null;
        this.numberPolls = 0;

        var downloadButtonEnabledCssClass = "btn-primary";
        var downloadButtonDisabledCssClass = "btn-disabled-primary";

        var that = this;

        this.enableButton = function (text) {
            that.downloadButton.removeClass(downloadButtonDisabledCssClass).addClass(downloadButtonEnabledCssClass).text(text);
        };

        this.disableButton = function (text) {
            that.downloadButton.removeClass(downloadButtonEnabledCssClass).addClass(downloadButtonDisabledCssClass).text(text);
        };

        this.pollStatus = function () {
            that.numberPolls = 0;
            that.disableButton("Generating...");
            that.errorDiv.hide();
            switch (that.type) {
                case ReportType.CSV:
                    var selectedDate = that.monthSelect.val().split('-');
                    if (selectedDate.length === 3) {
                        var requestParams = {
                            universeId: that.universeId,
                            month: selectedDate[1],
                            year: selectedDate[2]
                        };
                        selectedDate = selectedDate[2] + "-" + selectedDate[1];
                        that.requestIntervalId = setInterval(function () {
                            that.checkStatus(
                                {
                                    type: 'GET',
                                    url: that.statusUrl,
                                    data: requestParams
                                },
                                function (data) {
                                    if (data.revenueReportStatus === RevenueReportStatusType.ReadyForDownload) {
                                        that.data[selectedDate].status = ReportStatusType.ReadyForDownload;
                                        that.updateButtonFunctionality();
                                    }
                                }
                            );
                        }, requestIntervalMs);
                    }
                    break;
                case ReportType.XLSX:
                    var selectedDate = that.monthSelect.val();
                    that.data[selectedDate].status = ReportStatusType.Queued;
                    that.requestIntervalId = setInterval(function () {
                        that.checkStatus(
                            {
                                type: 'GET',
                                url: that.statusUrl + "/" + selectedDate
                            },
                            function (data) {
                                that.data[selectedDate] = data;
                                if (data.status === ReportStatusType.ReadyForDownload) {
                                    that.updateButtonFunctionality();
                                }
                            }
                        );
                    }, requestIntervalMs);
                    break;
            }
        }

        this.checkStatus = function (request, cb) {
            request.error = that.requestError;
            $.ajax(request).done(function (data) {
                that.numberPolls += 1;
                cb(data);
                if (that.numberPolls > 10) {
                    that.warningText.show();
                }
                if (that.numberPolls > 100) {
                    that.requestError();
                }
            });
        }

        this.updateButtonFunctionality = function () {
            clearInterval(that.requestIntervalId);
            that.downloadButton.off("click");
            that.numberPolls = 0;
            that.errorDiv.hide();
            that.warningText.hide();

            var type = that.type, status = null, downloadParam = null;

            switch (type) {
                case ReportType.CSV:
                    var selectedDate = that.monthSelect.val().split('-');
                    if (selectedDate.length === 3) {
                        selectedDate = selectedDate[2] + "-" + selectedDate[1];
                        var d = that.data[selectedDate];
                        status = d.status;
                        downloadParam = "?universeId=" + that.universeId + "&month=" + d.month + "&year=" + d.year;
                    }
                    break;
                case ReportType.XLSX:
                    downloadParam = that.monthSelect.val();
                    if (downloadParam !== "none") {
                        status = that.data[downloadParam].status;
                        downloadParam = downloadParam + "/download";
                    }
                    break;
            }

            if (status === ReportStatusType.NotGenerated) {
                that.downloadButton.on("click", function () {
                    if (that.type === ReportType.XLSX) {
                        $.ajax({
                            url: that.downloadUrl + that.monthSelect.val() + "/generate",
                            type: 'POST',
                            error: that.requestError
                        });
                    }
                    that.pollStatus();
                });
                that.enableButton("Generate " + type);
            }
            else if (status === ReportStatusType.Queued) {
                that.pollStatus();
            }
            else if (status === ReportStatusType.ReadyForDownload) {
                that.downloadButton.on("click", function () {
                    window.location = that.downloadUrl + downloadParam;
                });
                that.enableButton("Download " + type);
            }
            else {
                that.disableButton("Download " + type);
            }
        }

        this.requestError = function() {
            clearInterval(that.requestIntervalId);
            that.errorDiv.show();
        }
    }

    function initForms() {
        var MonthlyRevenueForm = new DownloadForm(
            ReportType.CSV,
            $(".download-btn"),
            $("#csv-error").hide(),
            $("#csv-warning").hide(),
            $("#revenue-csv-month"),
            $("#dataForCSV")
        );

        var MonthlyGameStatsForm = new DownloadForm(
            ReportType.XLSX,
            $(".dev-stats-download-btn"),
            $("#dev-stats-error").hide(),
            $("#dev-stats-warning").hide(),
            $("#dev-stats-month"),
            $("#dev-stats-data")
        );

        var monthsList = new Roblox.Intl().getMonthsList('long');
        var months = {};
        for (var i = 0, len = monthsList.length; i < len; ++i) {
            var m = monthsList[i];
            months[(m.value < 10) ? "0" + m.value : m.value] = m.name;
        }

        if (MonthlyRevenueForm.monthSelect.length > 0) {
            MonthlyRevenueForm.updateButtonFunctionality();

            MonthlyRevenueForm.monthSelect.on("change", function () {
                MonthlyRevenueForm.updateButtonFunctionality();
            });
        }

        $.ajax({
            url: MonthlyGameStatsForm.statusUrl,
            type: 'GET',
            error: MonthlyGameStatsForm.requestError
        }).done(function (data) {
            MonthlyGameStatsForm.monthSelect.find("option").text("Select Month");
            var myRegexp = /^(\d\d\d\d)-(\d\d)$/;
            for (var i in data.reports) {
                var report = data.reports[i];
                var match = myRegexp.exec(report.yearDashMonth);
                var label = months[match[2]] + " " + match[1];
                var option = new Option(label, report.yearDashMonth);
                MonthlyGameStatsForm.data[report.yearDashMonth] = report;
                MonthlyGameStatsForm.monthSelect.append($(option));
            }
            MonthlyGameStatsForm.monthSelect.prop('disabled', false);
            MonthlyGameStatsForm.updateButtonFunctionality();

            MonthlyGameStatsForm.monthSelect.on("change", function () {
                MonthlyGameStatsForm.updateButtonFunctionality();
            });
            MonthlyGameStatsForm.errorDiv.text("Error Generating XLSX");
        });
    }

    $(function () {
        $(".tab-container").on("tabsactivate", function () {
            drawGraphs();
        });

        $("ul.nav.nav-pills li").on('click', function () {
            var that = $(this);

            that.addClass('active');
            that.siblings().each(function () {
                $(this).removeClass('active');
            });

            drawGraphs();
        });

        $(".developer-revenue-aggregation-dropdown").on('change', function () {
            var thisTime = $(this).data('rbx-time');
            var thisDevice = $(this).val();
            $('.pie-chart-container[data-rbx-time=' + thisTime + '] [data-rbx-device]').each(function () {
                $(this).toggle($(this).data('rbx-device') === thisDevice);
            });
        });

        initForms();

        function drawGraphs() {
            var visibleTab = $('.content-container .tab-active');
            var visibleTime = $('.nav.nav-pills li.active', visibleTab).data('rbx-time');

            $('.stats-chart-container', visibleTab).each(function() {
                $(this).toggle($(this).data('rbx-time') === visibleTime);
            });

            $('table.stats-table tr', visibleTab).each(function () {
                $(this).toggle($(this).hasClass(visibleTime) || $(this).hasClass('table-header'));
            });

            $('.stats-chart[data-rbx-time=' + visibleTime + ']', visibleTab).each(function(index) {
                var that = $(this);

                //short out if we've already loaded this one
                if (!that.hasClass('loading')) {
                    return;
                }

                var url = that.data('rbx-endpoint');
                var divisionType = that.data("rbx-division-type");

                //Some of the endpoints already have query string arg
                url += (url.indexOf("?") === -1) ? "?" : "&";
                url += "timeFrame=" + visibleTime;

                if (divisionType && divisionType.length > 0) {
                    url += "&divisionType=" + divisionType;
                }

                var seriesNames = that.data('rbx-series-names');
                var seriesUnits = that.data('rbx-series-units');
                var seriesUnitFormat = that.data('rbx-series-unit-format');
                var chartTypes = that.data('rbx-chart-types');

                // This is really bad. We are plotting the graphs and adding the data to the data table based on an index. If a new graph is added in between, it messes the data plots.
                // This page needs a revamp since currently we are reading the data table from the graphs and not the actual data.
                var shouldPlotData = that.data('rbx-should-plot-data');
                var indexToPlotData = that.data('rbx-index-to-plot-data');

                var isDevelopApiEndpoint = that.data("rbx-is-develop-endpoint");

                var chartOptions = {
                    chartTypes: chartTypes,
                    chartType: (chartTypes) ? chartTypes[0] : "line",
                    seriesNames: seriesNames,
                    seriesUnits: seriesUnits,
                    seriesUnitFormat: seriesUnitFormat,
                    timeUnit: visibleTime,
                    isDevelopApiEndpoint: isDevelopApiEndpoint
                }

                Roblox.FlotGraphing.DrawChartFromEndpoint(
                    url,
                    "#" + that.attr('id'),
                    // Success handler.
                    function (data) {
                        var isPlayTimeData = (that.attr("id").indexOf("game-play-time") !== -1),
                            format = isPlayTimeData ? "decimal" : null;

                        if (isPlayTimeData && isDevelopApiEndpoint) {
                            // New statistics endpoint returns play time data in seconds.
                            // Need to convert to minutes.
                            convertPlayTimeSecondsToMinutes(data);
                        }

                        if (shouldPlotData) {
                            addRowsToDataTable(visibleTab, visibleTime, data, index, format, indexToPlotData);
                        }

                        that.removeClass('loading');
                    },
                    // Failure handler.
                    function () {
                        that.removeClass('loading');
                        that.text("Sorry, an error occurred. Please try again later.");
                    },
                    chartOptions
                );
            });

            drawDelayedPieCharts(visibleTab, visibleTime);
        }

        /**
         * Helper to convert play time data from seconds to minutes.
         * @param {any} data Array of series, each of which is an array of data points:
         * [
         *      [ [t1, v1], [t2, v2], [t3, v3], ...],
         *      [ [t4, v4], [t5, v5], [t6, v6], ...],
         *      ...
         * ]
         */
        function convertPlayTimeSecondsToMinutes(data) {
            var seriesIndex, pointIndex, series, point;

            for (seriesIndex = 0; seriesIndex < data.length; seriesIndex++) {
                series = data[seriesIndex];

                for (pointIndex = 0; pointIndex < series.length; pointIndex++) {
                    point = series[pointIndex];

                    // Convert data point's value from seconds to minutes.
                    point[1] = point[1] / 60;
                }
            }
        }

        function addRowsToDataTable(visibleTab, visibleTime, data, index, format, indexToPlotData) {
            var isGame = visibleTab.attr('id') === "game-tab";
            var isPromotion = visibleTab.attr('id') === "promotion-tab";
            var table = $('.stats-table', visibleTab);
            
            //A previous call might have added the tr elements already - don't duplicate
            var isTimeAdded = $('table.stats-table tr.' + visibleTime, visibleTab).length > 0;

            //Add entries in reverse chronological order
            for (var i = data[0].length - 1; i >= 0; i--) {
                var timeStamp = data[0][i][0];
                //Create the tr if necessary
                var newRow;
                if (!isTimeAdded) {
                    if (isPromotion) {
                        newRow = $('<tr class="' + visibleTime + '" data-rbx-time="' + timeStamp + '"><td class="first">' + Roblox.FlotGraphing.ConvertTimeToReadableString(timeStamp,visibleTime) + '</td><td class="promotion-acquisitions"></td><td class="promotion-conversions"></td><td class="promotion-revenue"></td></tr>');
                    } else if (isGame) {
                        newRow = $('<tr class="' + visibleTime + '" data-rbx-time="' + timeStamp + '"><td class="first">' +Roblox.FlotGraphing.ConvertTimeToReadableString(timeStamp,visibleTime) + '</td><td class="game-traffic-visits"></td><td class="game-traffic-average-time"></td><td class="game-revenue-robux"></td></tr>');
                    }

                    if (newRow) {
                        newRow.appendTo(table);
                    }
                } else {
                    newRow = $('table.stats-table tr.' + visibleTime + '[data-rbx-time="' + timeStamp + '"]', visibleTab);
                }

                if (isPromotion || isGame) {
                    //expect only one series and the table columns to be in order
                    var value = (format === "decimal") ? data[0][i][1].toFixed(2) : data[0][i][1];
                    $($('td', newRow)[indexToPlotData || index + 1]).text(value);
                }
            }
        }

        function drawDelayedPieCharts(visibleTab, visibleTime) {
            var chartContainers = visibleTab.find('.pie-chart-container[data-rbx-url][data-rbx-time=' + visibleTime + ']');
            chartContainers.each(function () {
                var container = $(this);
                if (!container.hasClass("loading") && !container.hasClass("waiting")) {
                    return;
                }
                var subCharts = $(this).find('.pie-chart');
                $.ajax({
                    url: $(this).data('rbx-url') + "?timeFrame=" + $(this).data('rbx-time'),
                    method: "GET",
                    success: function (data, status, xhr) {
                        if (xhr.status === 202) { //request queued, but we have no data, so don't bother charting it
                            subCharts.each(function () {
                                $(this).removeClass('loading').addClass('waiting');
                                $(this).text("This information is currently being calculated. The chart will automatically load when the calculation is finished.");
                            });
                        } else { //success! we have data
                            //Expected format: Array(Array({label: string, data: number}))
                            container.removeClass("loading");
                            var i = 0;
                            $(data).each(function () {
                                var chart = $(subCharts[i++]);
                                chart.removeClass('loading').removeClass('waiting').text("");
                                var dataPoints = $(this);
                                if (dataPoints.length === 0) {
                                    chart.addClass("nodata").text("No data available.");
                                    return;
                                }
                                $(dataPoints).each(function () {
                                    if (this.label) {
                                        this.label = this.label.escapeHTML();
                                    }
                                });
                                var legendId = '#' + chart.attr('id') + "-legend";
                                $.plot(chart, dataPoints, {
                                    series: {
                                        pie: {
                                            show: true,
                                            radius: 1,
                                            label: {
                                                show: true,
                                                radius: 3 / 4,
                                                background: { opacity: 0.5, color: '#000' },
                                                formatter: function (label, series) {
                                                    return "<div class='rbx-pie-label'>" + label + "<br/>" + series.data[0][1] + " R$<br/>" + Math.round(series.percent) + "%</div>";
                                                }
                                            }
                                        }
                                    },
                                    grid: { hoverable: true },
                                    legend: { show: true, container: legendId }
                                });
                                chart.bind('plothover', function (event, position, item) {
                                    if (item) {
                                        var targetLabel = $($(event.target).find('.rbx-pie-label')[item.seriesIndex]);
                                        $('.rbx-pie-label.shown').each(function () {
                                            if (this !== targetLabel[0]) {
                                                $(this).removeClass('shown');
                                            }
                                        });
                                        targetLabel.addClass('shown').delay(10000).fadeOut('slow', function() {
                                            targetLabel.removeClass('shown').removeAttr('style'); //unfortunately fadeOut will stick a style='display:none' on
                                        });
                                    }
                                });
                            });
                        }
                    },
                    error: function () {
                        $(this).removeClass('loading').text("Sorry, an error occurred. Please try again later.");
                    }
                });
            });
        }

        if (Roblox.RealTime && Roblox.RealTime.Factory) {
            var realTimeClient = Roblox.RealTime.Factory.GetClient();

            realTimeClient.Subscribe(
                "RevenueReports",
                function(data) {
                    if (data.Type === "DeveloperProductRevenueAggregationCalculated" &&
                        data.UniverseId === universeId) {
                        var visibleTab = $('.content-container .tab-active');
                        var visibleTime = $('.nav.nav-pills li.active', visibleTab).data('rbx-time');
                        drawDelayedPieCharts(visibleTab, visibleTime);
                    }
                }
            );
        }

        drawGraphs();
    });
}();