// My/MyItem.js modified to support Tickets by Brent Da Mage
var MyItemPage = new function () {
    var MinMarketplaceFeeRobux;
    var MinMarketplaceFeeTickets;
    var MinPriceRobux;
    var MinPriceTickets;
    var MarketplaceTaxRate;
    var MaxPriceRobux;
    var MaxPriceTickets;
    var UserHasBCSellRequirement;
    var UserIsSellerBanned;
    var PlaceAssetType;
    var PriceChangeable;
    var RobuxTextBoxDefault;
    var TicketsTextBoxDefault;

    function GetMarketplaceFee(currencyType) {
        var fee,
            itemPrice;

        if (currencyType == 'Robux') {
            var minimumFee = MinMarketplaceFeeRobux;
            if (MinPriceRobux != MaxPriceRobux) {
                itemPrice = $('.PricingField_Robux [type=text]').val();
            } else {
                itemPrice = MinPriceRobux;
            }
        }
        else
        {
            var minimumFee = MinMarketplaceFeeTickets;
            if (MinPriceTickets != MaxPriceTickets) {
                itemPrice = $('.PricingField_Tickets [type=text]').val();
            } else {
                itemPrice = MinPriceTickets;
            }
        }

        var derivedFee = Math.round(itemPrice * MarketplaceTaxRate);

        if (derivedFee > minimumFee)
            fee = derivedFee;
        else
            fee = minimumFee;

        return fee;
    }
    function GetUserProfit(currencyType) {
        var itemPrice;
        if (currencyType == 'Robux') {
            if (MinPriceRobux != MaxPriceRobux) {
                itemPrice = $('.PricingField_Robux [type=text]').val();
            } else {
                itemPrice = MinPriceRobux;
            }
        }
        else
        {
            if (MinPriceTickets != MaxPriceTickets) {
                itemPrice = $('.PricingField_Tickets [type=text]').val();
            } else {
                itemPrice = MinPriceTickets;
            }
		}
        return itemPrice - GetMarketplaceFee(currencyType);
    }

    function TogglePlayerLimits(show) {
        if (show) {
            //alert("Public On");
            $("#PlayerLimitDefault").hide(); //.slideUp(slow);
            $("#PlayerLimitOptions").show('clip', "slow"); //.slideDown(slow);
        }
        else {
            $("#PlayerLimitOptions").hide();
            $("#PlayerLimitDefault").show('clip', "slow");
        }
    }

    function ToggleLoadingPersonalServer(show, personalClientId, publicClientId) {
        if (show) {
            $(publicClientId).hide("fast");
            TogglePlayerLimits(false);
            if ($(personalClientId).css("display") !== "none") {
                $(personalClientId).hide('fast');
            }
            $("#LoadingPersonalServer").show('clip', "fast");
        }
        else {
            $("#LoadingPersonalServer").hide();
        }
    }

    function ValidatePricing(priceFieldId, minValue, maxValue) {
        var value = $(priceFieldId).val();
        $('#PricingError').hide();
        $('#PricingErrorMax').hide();
        if (isNaN(value)) {
            $(priceFieldId).val(value.replace(/\D/g, ''));
            $('#PricingError').show();
        } else if (value < minValue) {
            $(priceFieldId).val(minValue);
            $('#PricingError').show();
        } else if (maxValue != null && value > maxValue) {
            $(priceFieldId).val(maxValue);
            $('#PricingErrorMax').show();
        }
    }

    function CalculateFeeAndProfit(currencyType) {
        if (currencyType == 'Robux') {
            if (MinPriceRobux != MaxPriceRobux) {
                $('.PricingField_Robux [type="text"]').prop('disabled',false);
                ValidatePricing('.PricingField_Robux [type="text"]', Math.max(MinMarketplaceFeeRobux, MinPriceRobux), MaxPriceRobux);
            }
            $('.MarketplaceFeeInRobuxLabel').html(GetMarketplaceFee('Robux'));
            $('.UserProfitInRobuxLabel').html(GetUserProfit('Robux'));
        }
        else
        {
            if (MinPriceTickets != MaxPriceTickets) {
                $('.PricingField_Tickets [type="text"]').prop('disabled',false);
                ValidatePricing('.PricingField_Tickets [type="text"]', Math.max(MinMarketplaceFeeTickets, MinPriceTickets), MaxPriceTickets);
            }
            $('.MarketplaceFeeInTicketsLabel').html(GetMarketplaceFee('Tickets'));
            $('.UserProfitInTicketsLabel').html(GetUserProfit('Tickets'));
        }
    }

    function ClearText() {
        if (!$('.PricingField_Robux [type=checkbox]').attr('checked')) {
            var pricingFieldRobux = $('.PricingField_Robux [type="text"]');
            var valFieldRobux = pricingFieldRobux.val();
            if (!RobuxTextBoxDefault)
                RobuxTextBoxDefault = !valFieldRobux ? MinPriceRobux : valFieldRobux;
            pricingFieldRobux.val('');
            pricingFieldRobux.prop('disabled', true);
            $('.MarketplaceFeeInRobuxLabel').text("0");
            $('.UserProfitInRobuxLabel').text("0");
        }
        if (!$('.PricingField_Tickets [type=checkbox]').attr('checked')) {
            var pricingFieldTickets = $('.PricingField_Tickets [type="text"]');
            var valFieldTickets = pricingFieldTickets.val();
            if (!TicketsTextBoxDefault)
                TicketsTextBoxDefault = !valFieldTickets ? MinPriceTickets : valFieldTickets;
            pricingFieldTickets.val('');
            pricingFieldTickets.prop('disabled', true);
            $('.MarketplaceFeeInTicketsLabel').text("0");
            $('.UserProfitInTicketsLabel').text("0");
        }
    }

    ResizeFieldSet = function (newWidth, newHeight) {
        var options = { to: { height: newHeight} };
        $("#PlaceAccessOptionsField").css({ 'height': newHeight, "display": "block" });
    };

    this.SelectPlaceType_Public = function (personalClientId, publicClientId, publicAccessId, privateAccessId, personalHelpId) {
        setTimeout(function () {
            TogglePlayerLimits(true);
        }, 1);
        $(personalClientId).hide();
        $(publicClientId).show('clip', "fast");
        $("#" + personalHelpId).hide();
        if ($(publicAccessId).attr('checked') === false && $(privateAccessId).attr('checked') === false) {
            $(publicAccessId).attr('checked', true);
        }
        $("#SellThisItem").show();
    };

    this.SelectPlaceType_Personal = function (isValidUser, personalClientId, publicClientId, personalHelpId) {
        if (!isValidUser) {
            showBCOnlyModal("BCOnlyModalPersonalServer");
            return false;
        }
        else {
            setTimeout(function () {
                TogglePlayerLimits(false);
            }, 1);
            $(publicClientId).hide("slow", function () {
                $(personalClientId).show("fast");
            });
            $("#" + personalHelpId).show();
            $("#SellThisItem").hide();
            return true;
        }
    };

    function DisablePricing() {
        //disabled inputs will not be sent via POST
        DisableInputs('.PricingField_Robux');
        DisableInputs('.PricingField_Tickets');
    }

    function EnablePricing() {
        //disabled inputs will not be sent via POST
        EnableInputs('.PricingField_Robux');
        EnableInputs('.PricingField_Tickets');
    }

    function DisableInputs(parentSelector)
    {
        if (!$('input', parentSelector).prop('disabled')) {
            $('input', parentSelector).prop('disabled', true);
        }
    }

    function EnableInputs(parentSelector) {
        if ($('input', parentSelector).prop('disabled')) {
            $('input', parentSelector).prop('disabled', false);
        }
    }

    function EnsurePriceChangeable() {
        if (!PriceChangeable) {
            //disabled inputs will not be sent via POST but readonly will
            $('.PricingField_Robux input').prop('readonly', true);
            $('.PricingField_Tickets input').prop('readonly', true);
        }
    }

    function PriceChangingThrottledModal()
    {
        Roblox.GenericConfirmation.open({
            titleText: Roblox.MyItem.strings.PriceChangingThrottledTitleText,
            bodyContent: Roblox.MyItem.strings.PriceChangingThrottledBodyContent,
            acceptText: Roblox.MyItem.strings.OKText,
            declineColor: Roblox.GenericConfirmation.none,
            imageUrl: Roblox.MyItem.AlertImageUrl
        });
    }

    // POST to develop API for asset archival/restore
    function SetArchivalStatus(archiveUrl) {
        $.ajax(
            {
                url: archiveUrl,
                method: "POST",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }
        ).done(function () {
            location.reload();
        }).fail(function () {
            location.reload();
        });
    }

    this.Initialize = function (minMarketplaceFeeRobux, minMarketplaceFeeTickets, marketplaceTaxRate, minPriceRobux, minPriceTickets, maxPriceRobux, maxPriceTickets, userHasBCSellRequirement, userIsSellerBanned, placeAssetType, priceChangeable) {

        MinMarketplaceFeeRobux = minMarketplaceFeeRobux;
        MinPriceRobux = minPriceRobux;
        MarketplaceTaxRate = marketplaceTaxRate;
        MaxPriceRobux = maxPriceRobux;
        MinMarketplaceFeeTickets = minMarketplaceFeeTickets;
        MinPriceTickets = minPriceTickets;
        MarketplaceTaxRate = marketplaceTaxRate;
        MaxPriceTickets = maxPriceTickets;
        UserHasBCSellRequirement = userHasBCSellRequirement;
        UserIsSellerBanned = userIsSellerBanned;
        PlaceAssetType = placeAssetType;
        PriceChangeable = priceChangeable;

        //variables
        var SellThisItemCheckbox = $('.SellThisItemRow').children('[type="checkbox"]');
        var PricingPanel = $('.PricingPanel');
        var RobuxCheckBox = $('.PricingField_Robux [type=checkbox]');
        var RobuxTextBox = $('.PricingField_Robux [type=text]');
        var MarketFeeRobux = $('.MarketplaceFeeInRobuxLabel');
        var RobuxProfit = $('.UserProfitInRobuxLabel');
        var TicketsCheckBox = $('.PricingField_Tickets [type=checkbox]');
        var TicketsTextBox = $('.PricingField_Tickets [type=text]');
        var MarketFeeTickets = $('.MarketplaceFeeInTicketsLabel');
        var TicketsProfit = $('.UserProfitInTicketsLabel');
        var PayToPlayFAQ = $('#PayToPlayFAQ');

        RobuxTextBoxDefault = !RobuxTextBox.val() ? MinPriceRobux : RobuxTextBox.val();
        TicketsTextBoxDefault = !TicketsTextBox.val() ? MinPriceTickets : TicketsTextBox.val();
		

        //Decide which currency to use
        if ($('.PricingField_Robux [type="text"]').val() == null && $('.PricingField_Tickets [type="text"]').val() !== null) {
            CurrencyType = 'Tickets';
        }
        else if ($('.PricingField_Robux [type="text"]').val() !== null && $('.PricingField_Tickets [type="text"]').val() == null) {
            CurrencyType = 'Robux';
        }
        else
        {
            CurrencyType = 'Robux';
        }

        //initialization of page
        if (SellThisItemCheckbox.attr('checked')) {
            PricingPanel.show();
            if (RobuxCheckBox.attr('checked')) {
                CalculateFeeAndProfit('Robux');
            }
            else if (TicketsCheckBox.attr('checked')) {
                CalculateFeeAndProfit('Tickets');
            }
            else
            {
                ClearText();
            }
            if (PlaceAssetType) {
                $(".PlaceTypeOptions").hide();
                $("#PlaceAccess").hide();
                $("#PlaceOptions").hide();
                $("#PlaceCopyProtection").hide();
                $("#Comments").hide();
                $(".BCOptions").hide();
            }
        }
        else {
            PricingPanel.hide();
            if (CurrencyType == 'Robux') {
                RobuxTextBox.attr('checked', false);
            }
            else
            {
                TicketsTextBox.attr('checked', false);
            }
            if (PlaceAssetType) {
                $(".PlaceTypeOptions").show();
                $("#PlaceAccess").show();
                $("#PlaceOptions").show();
                $("#PlaceCopyProtection").show();
                $("#Comments").show();
                $(".BCOptions").show();
            }
        }

        EnsurePriceChangeable(); //set to readonly if needed

        //change check
        var madeChanges = false;

        $('.PersonalServerAccessCtrls input,select').change(function () { madeChanges = true; });
        $('.papListRemoveUserIcon').click(function () { madeChanges = true; });
        $('.SaveButton').click(function () { window.onbeforeunload = null; });

        window.onbeforeunload = function () {
            if (madeChanges)
                return "Your changes have not been saved.";
        };

        //handlers
        RobuxCheckBox.change(function () {
            if ($(this).prop('readonly')) {
                PriceChangingThrottledModal();
                return false;
            }

            if ($(this).attr('checked')) {
                RobuxTextBox.val(RobuxTextBoxDefault);
                CalculateFeeAndProfit('Robux');
            }
            else {
                RobuxTextBoxDefault = RobuxTextBox.val();
                ClearText();
            }
        });
        RobuxTextBox.change(function () {
            CalculateFeeAndProfit('Robux');
        });
        RobuxTextBox.click(function () {
            if ($(this).prop('readonly')) {
                PriceChangingThrottledModal();
                return false;
            }
        });
        TicketsCheckBox.change(function () {
            if ($(this).prop('readonly')) {
                PriceChangingThrottledModal();
                return false;
            }

            if ($(this).attr('checked')) {
                TicketsTextBox.val(TicketsTextBoxDefault);
                CalculateFeeAndProfit('Tickets');
            }
            else {
                TicketsTextBoxDefault = TicketsTextBox.val();
                ClearText();
            }
        });
        TicketsTextBox.change(function () {
            CalculateFeeAndProfit('Tickets');
        });
        TicketsTextBox.click(function () {
            if ($(this).prop('readonly')) {
                PriceChangingThrottledModal();
                return false;
            }
        });
        $('.PublicDomainRow [type="checkbox"]').click(function () {
            if ($(this).attr('checked')) {
                SellThisItemCheckbox.attr('checked', false);
                RobuxCheckBox.attr('checked', false);
                TicketsCheckBox.attr('checked', false);
                PricingPanel.hide();
                ClearText();
            }
            else if (SellThisItemCheckbox.attr('checked')) {
                PricingPanel.show();
            }
        });
        SellThisItemCheckbox.click(function () {
            if (!UserHasBCSellRequirement) {
                showBCOnlyModal("BCOnlyModalSelling");
                return false;
            }
            if ($(this).attr('checked')) {

                if (UserIsSellerBanned) {
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.MyItem.strings.SellingSuspendedTitleText,
                        bodyContent: Roblox.MyItem.strings.SellingSuspendedBodyContent,
                        acceptText: Roblox.MyItem.strings.OKText,
                        declineColor: Roblox.GenericConfirmation.none,
                        imageUrl: Roblox.MyItem.AlertImageUrl
                    });
                    return false;
                }

                $('.PublicDomainRow [type="checkbox"]').attr('checked', false);
                PricingPanel.show();

                EnablePricing();
                if (!RobuxCheckBox.prop('readonly') && !TicketsCheckBox.prop('readonly')) {
                    ClearText();
                }
                CalculateFeeAndProfit(CurrencyType);

                if (PlaceAssetType) {
                    $(".PlaceTypeOptions").hide();
                    $("#PlaceAccess").hide();
                    $("#PlaceOptions").hide();
                    $("#PlaceCopyProtection").hide();
                    $("#Comments").hide();
                    $(".BCOptions").hide();
                }
                if (!RobuxCheckBox.prop('readonly') && $('.PricingField_Robux').css('display') === 'none') {
                    RobuxCheckBox.attr('checked', true).change();
                }
                    //why is this all the way out here?
                if (!TicketsCheckBox.prop('readonly') && $('.PricingField_Tickets').css('display') === 'none') {
                    TicketsCheckBox.attr('checked', true).change();
                }
            }
            else {
                DisablePricing();
                if (!RobuxCheckBox.prop('readonly')) {
                    RobuxCheckBox.attr('checked', false).change();
                }
                    //why is this all the way out here?
                if (!TicketsCheckBox.prop('readonly')) {
                    TicketsCheckBox.attr('checked', false).change();
                }

                PricingPanel.hide();
                if (PlaceAssetType) {
                    $(".PlaceTypeOptions").show();
                    $("#PlaceAccess").show();
                    $("#PlaceOptions").show();
                    $("#PlaceCopyProtection").show();
                    $("#Comments").show();
                    $(".BCOptions").show();
                }
            }
        });
        PayToPlayFAQ.click(function () {
            window.open(this.href, 'PayToPlayFAQ', 'left=100,top=100,width=500,height=500,toolbar=0,resizable=0,scrollbars=1');
            return false;
        });

        var archiveUrl = $("#archive-url").attr("data-url");
        $(".button-archive-restore").click(function () {
            SetArchivalStatus(archiveUrl);
        });
        $(".button-archive-archive").click(function () {
            SetArchivalStatus(archiveUrl);
        });
    };
};
