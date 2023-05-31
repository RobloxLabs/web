if (typeof Roblox === 'undefined') {
    Roblox = {};
};

Roblox.PlayerAccess = function () {
    function initializeChosen() {
        var maxUsersAllowedInList = $('#GamePlaceAccess').data('invite-list-user-limit');

        if ($('#GamePlaceAccess').data('permissions-service-enabled') === "True" && $('.chzn-container').length <= 0) {
            $(".chosen").chosen({ no_results_text: Roblox.PlayerAccess.strings.SearchingFor, max_selected_options: maxUsersAllowedInList, "disable_search": true, "disable_search_threshold": 1 });
            $(".chosen").bind("liszt:maxselected", function () { $('#maxUserNameLimit').show(); });
            $('.chzn-choices').before('<label class="form-label">' + Roblox.PlayerAccess.strings.InviteList + ':</label>');
            //check if invite list selected
            if (!$('#Access_Whitelist').is(':checked') && !$('input[id*=visit]').filter(function () { return /\d+ visit/.test(this.id); }).is(':checked')) {
                $('#customlist_chzn').hide();
            }

            $('.chzn-container input').keyup(function (e) {
                if (e.which !== 13) {
                    $('#customlist-error').remove();
                }
            });

            $("#customlist").chosen().change(function () {

                var value = $("#customlist").val();
                $('#customlist-usernames').val(value);

                //IE7 fix for dynamic content display
                if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
                    if (value == null) {
                        $('.chzn-container-multi .chzn-choices').css('padding-bottom', '0');
                    } else {
                        $('.chzn-container-multi .chzn-choices').css('padding-bottom', '3px');
                    }
                }
            });


            $('.search-choice-close').click(function (e) {
                e.stopPropagation();
            });

            //TODO: Implement name search
            /*var typingTimer;                //timer identifier
            var doneTypingInterval = 1000;  //time in ms

            $('.chzn-container input').keyup(function () {
            clearTimeout(typingTimer);
            if ($(this).val) {
            typingTimer = setTimeout(getNames, doneTypingInterval);
            }
            });

            function getNames() {
            var customList = $('#customlist');
            customList.append('<option style="background-image: url(/images/img-13icon-v1.png); background-repeat:no-repeat;background-position:2% 50%;padding-left:40px;">Choice2</option><option>Choice3</option><option>Choice4</option><option>Choice5</option><option>Choice6</option><option>Choice7</option><option>Choice8</option><option>Choice9</option><option>Choice10</option>');
            customList.trigger("liszt:updated");
            }*/
        }
    }

    function displayGamePlace() {
        $('#PlayerLimit').show();
        $('#NumPlayers').show();
        $('#GamePlaceAccess').show();
        $('#PrivateServersAccess').show();
        var playerAccess = $('#playerAccess');
        if (playerAccess.is(':visible') && $('#GamePlaceAccess').is(':visible')) {
            Roblox.PlayerAccess.initializeChosen();
            $('#navbar').height(playerAccess.height());
        }
    }

    function checkSaleOptions() {
        if ($('#SellGameAccessCheckbox').attr('checked')) {
            $('#PricingPanel').show();
            calculateFeeAndProfit('Robux');
            $('#PlayerLimit').show();
            $('#NumPlayers').show();
            $("#PlaceTypePanel").hide();
            $("#copyLock").hide();
            $("#comments").hide();
        }
        else {
            $('#PricingPanel').hide();
            displayGamePlace();
            $("#PlaceTypePanel").show();
            $("#copyLock").show();
            $("#comments").show();
        }
    }

    function validatePricing() {
        var sellGameAccess = $('#SellGameAccess');
        var minPriceRobux = sellGameAccess.data('minprice');
        var maxPriceRobux = sellGameAccess.data('maxprice');
        var value = $('#PriceInput').val();
        $('#PricingError').hide();
        $('#PricingErrorMax').hide();
        if (isNaN(value)) {
            $('#PriceInput').val(value.replace(/\D/g, ''));
            $('#PricingError').show();
        } else if (value < minPriceRobux) {
            $('#PriceInput').val(minPriceRobux);
            $('#PricingError').show();
        } else if (maxPriceRobux !== null && value > maxPriceRobux) {
            $('#PriceInput').val(maxPriceRobux);
            $('#PricingErrorMax').show();
        }
    }

    function validatePrivateServerPricing(minPriceRobux, inputPrice) {
        var errorContainer = $("#PrivateServerPricingError").hide();
        if (!isNaN(inputPrice) && !isNaN(minPriceRobux) && inputPrice < minPriceRobux) {
            $("#PrivateServerPriceInput").val(minPriceRobux);
            errorContainer.show();
            return minPriceRobux;
        }
        return inputPrice;
    }

    function calculateFeeAndProfit() {
        var sellGameAccess = $('#SellGameAccess');
        var minPriceRobux = sellGameAccess.data('minprice');
        var maxPriceRobux = sellGameAccess.data('maxprice');

        if (minPriceRobux !== maxPriceRobux) {
            validatePricing();
        }
        $('#MarketPlaceFee').html(getMarketplaceFee());
        $('#Profit').html(getUserProfit());
    }

    function calculatePrivateServerFeeAndProfit() {
        var privateServerPriceContainer = $("#PrivateServerPriceContainer");
        var marketplaceTaxRate = privateServerPriceContainer.data("taxrate");
        var minPriceRobux = privateServerPriceContainer.data("minprice");
        var inputPrice = $("#PrivateServerPriceInput").val();

        inputPrice = validatePrivateServerPricing(minPriceRobux, inputPrice);

        $("#PrivateServerMarketplaceFeeText").html(getPrivateServerMarketplaceFee(marketplaceTaxRate, minPriceRobux, inputPrice));
        $("#PrivateServerUserProfitText").html(getPrivateServerUserProfit(marketplaceTaxRate, minPriceRobux, inputPrice));
    }

    function getMarketplaceFee() {
        var sellGameAccess = $('#SellGameAccess');
        var minPriceRobux = sellGameAccess.data('minprice');
        var maxPriceRobux = sellGameAccess.data('maxprice');
        var marketplaceTaxRate = sellGameAccess.data('commisionrate');
        var inputPrice = $('#PriceInput').val();
        return getMarketplaceFeeBasedOnPriceRangeAndTax(marketplaceTaxRate, minPriceRobux, maxPriceRobux, inputPrice);
    }

    function getPrivateServerMarketplaceFee(marketplaceTaxRate, minPriceRobux, inputPrice) {
        return getMarketplaceFeeBasedOnPriceRangeAndTax(marketplaceTaxRate, minPriceRobux, -1, inputPrice);
    }

    function getMarketplaceFeeBasedOnPriceRangeAndTax(marketplaceTaxRate, minPriceRobux, maxPriceRobux, inputPrice) {
        var minMarketplaceFeeRobux = 1;
        var fee;
        var itemPrice;

        var minimumFee = minMarketplaceFeeRobux;
        if (minPriceRobux !== maxPriceRobux) {
            itemPrice = inputPrice;
        } else {
            itemPrice = minPriceRobux;
        }
        var derivedFee = Math.round(itemPrice * marketplaceTaxRate);

        if (derivedFee > minimumFee)
            fee = derivedFee;
        else
            fee = minimumFee;

        return fee;
    }

    function getUserProfit() {
        var sellGameAccess = $('#SellGameAccess');
        var minRobuxPrice = sellGameAccess.data('minprice');
        var maxRobuxPrice = sellGameAccess.data('maxprice');
        var marketplaceTaxRate = sellGameAccess.data('commisionrate');
        var inputPrice = $('#PriceInput').val();

        return getUserProfitBasedOnPriceRangeAndTax(marketplaceTaxRate, minRobuxPrice, maxRobuxPrice, inputPrice);
    }

    function getPrivateServerUserProfit(marketplaceTaxRate, minPriceRobux, inputPrice) {
        return getUserProfitBasedOnPriceRangeAndTax(marketplaceTaxRate, minPriceRobux, -1, inputPrice);
    }

    function getUserProfitBasedOnPriceRangeAndTax(marketplaceTaxRate, minRobuxPrice, maxRobuxPrice, inputPrice) {
        var itemPrice;
        if (minRobuxPrice !== maxRobuxPrice) {
            itemPrice = inputPrice;
        } else {
            itemPrice = minRobuxPrice;
        }
        return itemPrice - getMarketplaceFeeBasedOnPriceRangeAndTax(marketplaceTaxRate, minRobuxPrice, maxRobuxPrice, inputPrice);
    }

    return {
        initializeChosen: initializeChosen,
        displayGamePlace: displayGamePlace,
        checkSaleOptions: checkSaleOptions,
        calculateFeeAndProfit: calculateFeeAndProfit,
        calculatePrivateServerFeeAndProfit: calculatePrivateServerFeeAndProfit
    };
} ();


$(function () {
    "use strict";

    var maxPlayersInput = $("#MaxPlayersInput");
    var preferredPlayersInput = $("#PreferredPlayersInput");
    var friendSlotInput = $("#FriendSlotsInput");
    var friendSlotRadioButton = $("#FriendSlotRadioButtons");
    var customFriendSlotDropdown = $("#CustomFriendSlotDropdown");
    var emptyFriendSlotError = $("#EmptyFriendSlotError")
    var consolePlatformAcceptCheckbox = $("label[data-device='Console'] input[type='checkbox']");
    var consolePlatformAcceptDialogEnabled = $("div[data-console-agreement-enabled]").attr("data-console-agreement-enabled") === "True";

    var sellGameAccess = $('#SellGameAccess');
    var userIsSellerBanned = sellGameAccess.data('is-seller-banned');

    var privateServersDetailsContainer = $("#PrivateServerDetails");
    var privateServerPriceContainer = $("#PrivateServerPriceContainer");
    var privateServerPriceInput = $("#PrivateServerPriceInput");
    var privateServerErrorContainer = $("#PrivateServerPricingError");
    var privateServerPriceChangeWarning = $("#PrivateServerPriceChangeWarning");

    // Labels
    var sellGameAccessLabel = $('#SellGameAccessLabel');
    var privateServerLabel = $('#PrivateServerAccessLabel');

    // Tooltips
    var sellAccessTooltip = $('.sell-access-tooltip');
    var placeAccessTooltip = $('.place-access-tooltip');
    var privateServerTooltip = $('.private-server-tooltip');
    var numberOfPlayersPreferredTooltip = $('.number-of-players-preferred-tooltip');
    var numberOfPlayersMaxTooltip = $('.number-of-players-max-tooltip');

    // Exclusive access components
    var sellGameAccessCheckbox = $('#SellGameAccessCheckbox');
    var gameAccessDropdown = $('#Access');
    var allowPrivateServersCheckbox = $('#AllowPrivateServersCheckbox');
    var emptyFriendSlotsRadio = $('#EmptyFriendSlots');
    var customFriendSlotsRadio = $('#CustomFriendSlots');
    var privateServersErrorMessage = $('#PrivateServersError');

    function sellGameAccessDisplayState(isSellGameAccessDisabled) {
        sellGameAccessCheckbox.attr("disabled", isSellGameAccessDisabled ? true : null);
        sellGameAccessLabel.toggleClass("disabled", isSellGameAccessDisabled);
        if (isSellGameAccessDisabled) {
            sellAccessTooltip.show();
        } else {
            sellAccessTooltip.hide();
        }
    };

    function gameAccessDisplayState(isPlaceAccessDisabled) {
        gameAccessDropdown.attr("disabled", isPlaceAccessDisabled ? true : null);
        gameAccessDropdown.toggleClass("disabled", isPlaceAccessDisabled);
        if (isPlaceAccessDisabled) {
            placeAccessTooltip.show();
        } else {
            placeAccessTooltip.hide();
        }
    };


    function privateServersDisplayState(isPrivateServerDisabled) {
        allowPrivateServersCheckbox.attr("disabled", isPrivateServerDisabled ? true : null);
        privateServerLabel.toggleClass("disabled", isPrivateServerDisabled);
        if (isPrivateServerDisabled) {
            privateServersErrorMessage.show();
        } else {
            privateServersErrorMessage.hide();
        }

        // Handle the private servers own independent display state
        if (allowPrivateServersCheckbox.prop("checked")) {
            privateServerPriceContainer.show();
            privateServersDetailsContainer.show();
        } else {
            privateServerPriceContainer.hide();
            privateServersDetailsContainer.hide();
        }
    };

    function recalculateAccessDisplayState() {
        var isPaidAccessChecked = sellGameAccessCheckbox.prop("checked");
        var isGameAccessForEveryone = gameAccessDropdown.val() === "Everyone";
        var isPrivateServerChecked = allowPrivateServersCheckbox.prop("checked");

        var isSellGameAccessDisabled = !isGameAccessForEveryone || isPrivateServerChecked;
        sellGameAccessDisplayState(isSellGameAccessDisabled);

        var isGameAccessDisabled = isPaidAccessChecked || isPrivateServerChecked;
        gameAccessDisplayState(isGameAccessDisabled);

        var isPrivateServerDisabled = isPaidAccessChecked || !isGameAccessForEveryone;
        privateServersDisplayState(isPrivateServerDisabled);
    };


    consolePlatformAcceptCheckbox.change(function () {
        if (consolePlatformAcceptDialogEnabled && this.checked) {
            consolePlatformAcceptCheckbox.prop('checked', false);
            Roblox.GenericConfirmation.open({
                titleText: Roblox.PlayerAccess.strings.ConsoleAccessContentAgreementTitleText,
                bodyContent: Roblox.PlayerAccess.strings.ConsoleAccessContentAgreementBodyContent,
                acceptText: Roblox.PlayerAccess.strings.ConsoleAccessContentAgreementAcceptText,
                declineText: Roblox.PlayerAccess.strings.ConsoleAccessContentAgreementDeclineText,
                acceptColor: Roblox.GenericConfirmation.gray,
                declineColor: Roblox.GenericConfirmation.gray,
                onAccept: function () {
                    consolePlatformAcceptCheckbox.prop('checked', true);
                },
                allowHtmlContentInBody: true
        });
        }
    });

    $("#Genre").change(function () {
        $("#advancedsettings_genre").text($(this).find(":selected").text());
    });

    if (customFriendSlotsRadio.is(":checked")) {
        $(customFriendSlotDropdown).attr("hidden", null);
        $(emptyFriendSlotError).prop("hidden", "hidden");
    }
    else if (emptyFriendSlotsRadio.is(":checked")) {
        $(emptyFriendSlotError).prop("hidden", null);
        $(customFriendSlotDropdown).prop("hidden", "hidden");
    }

    $("#NumPlayers").on("change", "#MaxPlayersInput", function () {
        var min = 1;
        var max = Number(maxPlayersInput.val());
        var currFriendSlotInput = Number($(friendSlotInput).val());
        var currPreferredPlayerInput = Number($(preferredPlayersInput).val());

        $(friendSlotInput).empty();
        $(preferredPlayersInput).empty();

        for (i = min; i < max; i++) {
            $(friendSlotInput).append($("<option></option>")
                .attr("value", i)
                .text(i));
        }

        for (i = min; i <= max; i++) {
            $(preferredPlayersInput).append($("<option></option>")
                .attr("value", i)
                .text(i));
        }

        if (currFriendSlotInput < max && currFriendSlotInput > 0) {
            friendSlotInput.val(currFriendSlotInput);
        }
        else {
            friendSlotInput.val(1);
        }

        if (currPreferredPlayerInput < max && currPreferredPlayerInput > 0) {
            preferredPlayersInput.val(currPreferredPlayerInput);
        }
        else {
            preferredPlayersInput.val(1);
        }
    });

    $(friendSlotRadioButton).change(function () {
        if (customFriendSlotsRadio.is(":checked")) {
            $(customFriendSlotDropdown).attr("hidden", null);
            $(emptyFriendSlotError).prop("hidden", "hidden");
        }
        else if (emptyFriendSlotsRadio.is(":checked")) {
            $(emptyFriendSlotError).prop("hidden", null);
            $(customFriendSlotDropdown).prop("hidden", "hidden");
        }
        else {
            $(emptyFriendSlotError).prop("hidden", "hidden");
            $(customFriendSlotDropdown).prop("hidden", "hidden");
        }
    });

    if ($(friendSlotRadioButton).length > 0) {
        $("#NumPlayers").on("change", "#MaxPlayersInput, #FriendSlotsInput", function () {
            var maxPlayers = Number(maxPlayersInput.val());
            if (maxPlayers == 1) {
                $(emptyFriendSlotsRadio).prop("checked", true).change();
                $(customFriendSlotsRadio).prop("disabled", true);
            }
            else {
                $(customFriendSlotsRadio).prop("disabled", false);
                var friendSlots = Number(friendSlotInput.val());
                if (friendSlots > maxPlayers - 1) {
                    friendSlotInput.val(maxPlayers - 1);
                }
            }
        });
    }
    else {
        $("#NumPlayers").on("change", "#MaxPlayersInput, #PreferredPlayersInput", function () {
            var maxPlayers = Number(maxPlayersInput.val());
            var preferredPlayers = Number(preferredPlayersInput.val());
            if (preferredPlayers > maxPlayers) {
                preferredPlayersInput.val(maxPlayers);
            }
        });
    }

    if (privateServerTooltip.length > 0) {
        privateServerTooltip.tipsy();
    }
    if (numberOfPlayersPreferredTooltip.length > 0) {
        numberOfPlayersPreferredTooltip.tipsy();
    }
    if (numberOfPlayersMaxTooltip.length > 0) {
        numberOfPlayersMaxTooltip.tipsy();
    }
    if (sellAccessTooltip.length > 0) {
        sellAccessTooltip.tipsy();
    }
    if (placeAccessTooltip.length > 0) {
        placeAccessTooltip.tipsy();
    }

    privateServerErrorContainer.hide();
    privateServerPriceChangeWarning.hide();
    Roblox.PlayerAccess.calculatePrivateServerFeeAndProfit();

    Roblox.PlayerAccess.checkSaleOptions();
    sellGameAccessCheckbox.click(function () {
        if (sellGameAccessCheckbox.attr('checked')) {
             if (userIsSellerBanned == "True") {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.PlayerAccess.strings.SellingSuspendedTitleText,
                    bodyContent: Roblox.PlayerAccess.strings.SellingSuspendedBodyContent,
                    acceptText: Roblox.PlayerAccess.strings.OKText,
                    declineColor: Roblox.GenericConfirmation.none,
                    imageUrl: Roblox.PlayerAccess.AlertImageUrl
                });
                sellGameAccessCheckbox.attr('checked', false);
                return;
            }
        }
        recalculateAccessDisplayState();
        Roblox.PlayerAccess.checkSaleOptions();
    });

    $('#PriceInput').change(function () {
        Roblox.PlayerAccess.calculateFeeAndProfit();
    });

    privateServerPriceInput.change(function () {
        privateServerPriceChangeWarning.show();
        Roblox.PlayerAccess.calculatePrivateServerFeeAndProfit();
    });

    Roblox.PlayerAccess.displayGamePlace();

    if ($('#GamePlaceAccess').data('permissions-service-enabled') === "True") {
        $('#GamePlaceAccess input').change(function () {
            if ($(this).is(':checked') && ($(this).is('#Access_Whitelist') || $(this).attr('id').indexOf("visit") > -1)) {
                $('#customlist_chzn').show();
            } else {
                $('#customlist_chzn').hide();
            }
        });

        //add existing usernames to custom list
        var usernameData = $('#customlist-usernames').val();
        if (usernameData.length > 0) {
            var usernames = usernameData.split(',');
            for (var i = 0; i < usernames.length; i++) {
                $('#customlist').append('<option selected="selected">' + usernames[i] + '</option>');
            }
        }
    }

    $("#playerAccessTab").one("click", function () {
        if(!Roblox.AccessData.isDevelopSiteForVipServersEnabled) {
            return false;
        }
        var container = $("#ActivePrivateServersSubscriptions");
        var errorMessageContainer = $("#PrivateServerDetailsError");
        errorMessageContainer.hide();
        $.ajax({
            cache: false,
            type: "GET",
            url: Roblox.AccessData.vipServerConfigurationLink
        }).done(function (jsonData) {
            // The API returns more information, we're only using this value now because it's the slowest to load
            container.text("There are currently " + jsonData.activeSubscriptionsCount + " VIP Server Subscriptions active for this place. Changing the price will cancel all of these subscriptions.");
        }).fail(function () {
            container.hide();
            errorMessageContainer.show();
        });
        return false;
    });

    $("#placeForm div.tab[data-id = 'access_tab']").one("click", function () {
        if (!Roblox.AccessData.isDevelopSiteForVipServersEnabled) {
            return false;
        }
        $("#ActivePrivateServersCount").hide();
        $("#ActivePrivateServersSubscriptions").hide();
        $("#PrivateServerDetailsError").hide();
    });

    gameAccessDropdown.change(recalculateAccessDisplayState);
    allowPrivateServersCheckbox.click(recalculateAccessDisplayState);

    recalculateAccessDisplayState();
});