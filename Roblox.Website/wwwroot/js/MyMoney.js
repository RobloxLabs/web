$(function () {
    function SwitchTabs(nextTabElem) {
        $.address.hash(nextTabElem.attr('contentid'));

        $('.WhiteSquareTabsContainer .selected, #TabsContentContainer .selected').removeClass('selected');
        nextTabElem.addClass('selected');
        $('#' + nextTabElem.attr('contentid')).addClass('selected');

        var contentid = nextTabElem.attr('contentid');
        if (contentid == 'Summary_tab') {
            LoadSummaryPage();
        }
        else if (contentid == 'MyTransactions_tab') {
            $('.TransactionsContainer table tr.datarow,.TransactionsContainer table tr.morerecords').remove();
            myTransactionsStartIndex = 0;
            LoadMyTransactions();
        }
        else if (contentid == 'TradeItems_tab') {
            $('.TradeItemsContainer table tr.datarow,.TradeItemsContainer table tr.morerecords').remove();
            LoadMyItemTrades();
        }
    }

    function FormatSummaryNumber(str) {
        str = (str == "" || str === "0" ? "&nbsp;" : str);
        return str;
    }
    function FormatNumber(str) {
        str.replace('-', '');
        return (str == "" ? "&nbsp;" : str);
    }

    function LoadSummaryPage() {
        var summaryTab = $("#Summary_tab");
        var timeperiod = $('#TimePeriod').val();

        //throw up loading screen
        summaryTab.append('<div class="loading"></div>');
        
        //var requestUrl = Roblox.EnvironmentUrls.economyApi + "/v1/users/" + Roblox.CurrentUser.userId + "/revenue/summary/" + timeperiod;
        var requestUrl = Roblox.EnvironmentUrls.websiteUrl + "/My/Summary.ashx?time=" + timeperiod;
        var summaryClassMap = {
            recurringRobuxStipend: "BCStipend",
            itemSaleRobux: "SaleOfGoods",
            purchasedRobux: "CurrencyPurchase",
            tradeSystemRobux: "TradeSystem",
            pendingRobux: "PendingSales",
            groupPayoutRobux: "GroupPayouts"
        };

        $.get(requestUrl).done(function (summaryData) {
            var total = 0;

            for (var summaryIndex in summaryData) {
                var robux = summaryData[summaryIndex];
                if (typeof (robux) === "number") {
                    if (summaryIndex !== "pendingRobux") {
                        total += robux;
                    }

                    if (summaryClassMap.hasOwnProperty(summaryIndex)) {
                        summaryTab.find("." + summaryClassMap[summaryIndex]).html(FormatSummaryNumber(Roblox.NumberFormatting.commas(robux)));
                    }
                }
            }

            $('.RobuxColumn .total .money').html(Roblox.NumberFormatting.commas(total));
            $('#Summary_tab .loading').remove();
        }).fail(function () {
            $('#Summary_tab .loading').addClass('error').text('Sorry, something went wrong. Please try again.');
        });
    }

    var myTransactionsRowTemplate = $('<tr class="datarow"></tr>').append('<td class="Date"></td><td class="Member"></td><td class="Description"></td><td class="Amount"><span>&nbsp;</span></td>');
    var myTransactionsPaymentRowTemplate = $('<tr class="datarow paymentrow"></tr>').append('<td class="Date"></td><td class="Member"></td><td class="Description"></td><td class="Amount"><span>&nbsp;</span></td>');
    var noRecordsMessage = "No records found.";
    var noSalesMessage = "You have not sold any items!";
    var noPurchasesMessage = "You have not purchased any items! Browse the <a href='" + (Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/Catalog") : "/Catalog") + "'>Catalog</a> to buy items.";
    var noPayoutsMessage = "You have not received any Group Payouts.";
    var myTransactionsStartIndex = 0;

    function CreateTransactionRow(obj, template) {
        var newRow = template.clone();
        newRow.find('.Date').text(obj.Date);
        newRow.find(".Member").attr("title", obj.Member);
        newRow.find('.Member').append($("<span class=\"text-overflow\"></span>").text(obj.Member));
        newRow.find('.Amount span').html(FormatNumber(obj.Amount)).addClass(obj.Amount_Class);
        newRow.find('.Description').text(obj.Description + " ");
        if (obj.Successful_Payments == 0 && obj.Has_Payments) {
            newRow.find('.Description').prepend($("<a href='#'>\u25BE<\a>").attr('onClick', '$(".payment' + obj.Sale_ID + '").toggle();return false;'));
        }
        if (obj.Successful_Payments > 0) {
            newRow.addClass('payment' + obj.Sale_ID);
        }

        if (obj.Member_ID == "1") {
            newRow.find('.Member').prepend($('<div></div>').attr('class', 'Roblox'));
        } else {
            if (obj.MemberIsGroup == "True") {
                newRow.find('.Member').prepend($('<div></div>').attr('class', 'roblox-group-image').attr('data-group-id', obj.Group_ID).attr('data-image-size', 'small').attr('data-no-overlays', 'true'));
            }
            else {
                newRow.find('.Member').prepend($('<div></div>').attr('class', 'avatar avatar-headshot-sm roblox-avatar-image').attr('data-user-id', obj.Member_ID).attr('data-image-size', 'tiny').attr('data-no-overlays', 'true'));
            }

        }
        if (obj.Item_Url != undefined && obj.Item_Url != "") {
            var descriptionColumn = newRow.find('.Description').append($('<a></a>').attr('href', obj.Item_Url).html(obj.Item_Name));
            if (obj.EventDate != undefined) {
                descriptionColumn.append(' on ' + obj.EventDate);
            }
        } else {
            newRow.find('.Description').html(" " + obj.Item_Name);
        }
        return newRow;
    }

    function LoadMyTransactions() {
        var transactiontype = $('#MyTransactions_TransactionTypeSelect').val();

        $('.TransactionsContainer table tr.morerecords').remove();
        $('.TransactionsContainer table .loading').parent().remove();
        $('#MyTransactions_tab table').append('<tr class="datarow"><td class="loading" colspan=4 ></td></tr>');
        $.ajax({
            type: "POST",
            url: "Transactions.ashx",
            data: JSON.stringify({ transactiontype: transactiontype, startindex: myTransactionsStartIndex }),
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                var response = $.parseJSON(msg.d);
                if (response.Data.length == 0) {
                    var noDataMessage = noRecordsMessage;
                    if (transactiontype === 'purchase') {
                        noDataMessage = noPurchasesMessage;
                    } else if (transactiontype === 'sale') {
                        noDataMessage = noSalesMessage;
                    } else if (transactiontype === 'grouppayout') {
                        noDataMessage = noPayoutsMessage;
                    }
                    $('.TransactionsContainer table .loading').html(noDataMessage).removeClass('loading').addClass('empty');
                } else {
                    $('.TransactionsContainer table tr .loading').parent().remove();
                    for (var i = 0; i < response.Data.length; i++) {
                        if (transactiontype === 'devex') {
                            $('.TransactionsContainer table').append(CreateImbursementRow($.parseJSON(response.Data[i]), myTransactionsRowTemplate));
                        } else {
                            var data = $.parseJSON(response.Data[i]);
                            if (data.Successful_Payments == 0) {
                                $('.TransactionsContainer table').append(CreateTransactionRow(data, myTransactionsRowTemplate));
                            }  else {
                                $('.TransactionsContainer table').append(CreateTransactionRow(data, myTransactionsPaymentRowTemplate));
                            }
                        }
                    }
                    Roblox.Widgets.AvatarImage.populate();
                    Roblox.Widgets.GroupImage.populate();
                }
                myTransactionsStartIndex = parseInt(response.StartIndex);
                var totalCount = parseInt(response.TotalCount);
                if (myTransactionsStartIndex < totalCount) {
                    var moreRecordsText = "More Records";
                    $('.TransactionsContainer table').append('<tr class="morerecords"><td colspan=4><a class="btn-control btn-control-small">' + moreRecordsText + '</a></td></tr>');
                    $('.TransactionsContainer table .morerecords a').bind('click', LoadMyTransactions);
                }
            },
            error: function (msg, text) {
                var errorText = "Sorry, something went wrong. Please try again.";
                $('.TransactionsContainer .loading').addClass('error').removeClass('loading').text(errorText);
            }
        });
    }

    function CreateTradeItemRow(obj) {
        var newRow = $('#TradeItems_tab .template tr').clone();
        newRow.find('.Date').text(obj.Date);
        if (obj.Expires !== "") {
            newRow.find('.Expires').text(obj.Expires);
        } else {
            //This is for IE9/IE7mode
            newRow.find('.Expires').text("  ");
        }
        newRow.find('.Status').text(obj.Status + obj.StatusAddon);
        newRow.find('.Action').html('<a class="text-link ViewTradeLink" tradePartnerID="' + obj.TradePartnerID + '" tradeSessionID="' + obj.TradeSessionID + '" >View Details</a>');
        newRow.find('.TradePartner').append($("<span class=\"text-overflow\"></span>").text(obj.TradePartner)).attr('TradePartnerName', obj.TradePartner);
        newRow.find('.TradePartner').prepend($('<div></div>')
            .addClass('avatar avatar-headshot-sm roblox-avatar-image')
            .attr('data-user-id', obj.TradePartnerID)
            .attr('data-image-size', 'tiny')
            .attr('data-no-overlays', 'true'));
        Roblox.Widgets.AvatarImage.load(newRow.find('.roblox-avatar-image'));

        return newRow;
    }

    function LoadMyItemTrades() {
        var startindex = $('.TradeItemsContainer table .datarow').length;
        var tradetype = $('#TradeItems_TradeType').val();

        $('.TradeItemsContainer table tr.morerecords').remove();
        $('.TradeItemsContainer table .loading').parent().remove();
        $('.TradeItemsContainer table').append('<tr class="datarow"><td class="loading" colspan=5 ></td></tr>');
        $.ajax({
            type: "POST",
            url: "ItemTrades.ashx",
            data: JSON.stringify({ statustype: tradetype, startindex: startindex }),
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                var response = $.parseJSON(msg.d);
                var showTradeWriteDisabled = (response.tradeWriteEnabled === "False") && ((tradetype === "inbound") || (tradetype === "outbound"));
                $('[data-js-trade-write-disabled]').toggle(showTradeWriteDisabled);
                $('#trade-help-link').toggle(!showTradeWriteDisabled);
                if (response.Data.length == 0) {
                    //<sl:translate>
                    var notrades1 = 'You have no ',
                        notrades2 = ' trade requests.';
                    //</sl:translate>
                    $('.TradeItemsContainer table .loading').html(notrades1 + tradetype + notrades2).removeClass('loading').addClass('empty');
                } else {
                    $('.TradeItemsContainer table tr .loading').parent().remove();
                    for (var i = 0; i < response.Data.length; i++) {
                        $('.TradeItemsContainer table').append(CreateTradeItemRow($.parseJSON(response.Data[i])));
                    }
                }
                if ($('.TradeItemsContainer table .datarow').length < response.totalCount) {
                    //<sl:translate>
                    var moreRecordsText = "More Records";
                    //</sl:translate>
                    $('.TradeItemsContainer table').append('<tr class="morerecords"><td colspan=4><a class="btn-control btn-control-small">' + moreRecordsText + '</a></td></tr>');
                    $('.TradeItemsContainer table .morerecords a').bind('click', LoadMyItemTrades);
                }
            },
            error: function (msg, text) {
                //<sl:translate>
                var errorText = "Sorry, something went wrong. Please try again.";
                //</sl:translate>
                $('.TradeItemsContainer .loading').addClass('error').removeClass('loading').text(errorText);
            }
        });
    }

    function CreateImbursementRow(obj, template) {
        var newRow = template.clone();
        newRow.find('.Date').text(obj.Date);
        newRow.find('.Member').append($('<span></span>').html(fitStringToWidthSafe(obj.Member, 90)));
        newRow.find('.Description').text(obj.Description + " ");
        newRow.find('.Amount span').html(FormatNumber(obj.Amount)).addClass(obj.Amount_Class);
        newRow.find('.Member').prepend($('<div></div>').attr('class', 'Roblox'));

        return newRow;
    }

    $('.MyMoneyPage .WhiteSquareTabsContainer li').bind('click', function () {
        SwitchTabs($(this));
    });
    $('.MyMoneyPage #TimePeriod').bind('change', LoadSummaryPage);
    $('#MyTransactions_TransactionTypeSelect').bind('change', function () {
        $('.TransactionsContainer table tr.datarow,.TransactionsContainer table tr.morerecords').remove();
        myTransactionsStartIndex = 0;
        LoadMyTransactions();
    });
    $('#TradeItems_TradeType').bind('change', function () {
        $('.TradeItemsContainer table tr.datarow,.TradeItemsContainer table tr.morerecords').remove();
        LoadMyItemTrades();
    });

    $('.MyMoneyPage .tooltip').tipsy({ gravity: 's', fade: true, delayOut: 1000, html: true });

    function checkURL() {
        var selector = $.address.hash().replace('/', '').escapeHTML();
        if (selector != '') {
            var correctTab = $('[contentid=' + selector + ']');
            if (typeof (correctTab[0]) !== 'undefined') {
                var currentTab = $('.SquareTabGray.selected');
                if (currentTab.attr('contentid') !== correctTab.attr('contentid')) {
                    SwitchTabs(correctTab);
                    return true;
                }
            }
        }
        return false;
    }

    if (!checkURL()) {
        var tab = $('.SquareTabGray.selected');
        SwitchTabs(tab);
    }

    $(document).bind('TradeUpdate', function () {
        $('.TradeItemsContainer table tr.datarow,.TradeItemsContainer table tr.morerecords').remove();
        LoadMyItemTrades();
    });

    $.address.externalChange(checkURL);

});
