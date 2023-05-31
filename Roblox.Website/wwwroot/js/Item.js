var Roblox = Roblox || {};

$(document).ready(function () {
    var desc = $('.DescriptionPanel .Description.Full').text();
    if (desc.length > 150) {
        desc = desc.substring(0, 147) + '... <a onclick="Roblox.Item.toggleDesc(\'more\');">More</a>';
    }
    $('.DescriptionPanel .Description.body').html(desc);


    $('.PutItemUpForSaleBtn').click(function (event) {
        event.preventDefault();
        var modalInFormProperties = { escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000" }, appendTo: "form" };
        $("#SellItemModalContainer").modal(modalInFormProperties);
    });
    $('#SellItemModalContainer input').keyup(function (event) {
        Roblox.Item.validateResellInput();
    });

    $("#TakeOffSale").click(function (event) {
        event.preventDefault();
        var modalInFormProperties = { escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000" }, appendTo: "form" };
        $("#TakeOffSaleModalContainer").modal(modalInFormProperties);
    });
    $('.SetAddButton').click(function (event) {
        event.preventDefault();
        var setDiv = $(this);
        var assetId = setDiv.attr('assetid');
        var setId = setDiv.attr('setid');
        var imgId = "waiting" + setId + "_" + assetId;
        setDiv.append("<img src='/images/spinners/spinner16x16.gif' id='" + imgId + "'");
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            timeout: 50000,
            url: "/Sets/SetHandler.ashx?rqtype=addtoset&assetId=" + assetId + "&setId=" + setId,
            success: function (data) {
                if (data !== null) {
                    // Remove that set from the list of available sets
                    setDiv.removeClass('SetAddButton');
                    setDiv.addClass('SetAddButtonAlreadyContainsItem');
                    setDiv.unbind('click');
                    // Remove the spinner
                    $('#' + imgId).remove();
                }
            },
            failure: function (data) {
                if (data !== null) {
                    //alert("failure");
                }
            }
        });
    });

    $('#MasterContainer').click(function (event) {
        var dropdowns = $('.SetListDropDownList,.SetListDropDownList .menu');
        var btn = $('.btn-dropdown,.btn-dropdown-active');
        dropdowns.each(function (i, elem) {
            if (!$(elem).hasClass('invisible'))
                $(elem).toggleClass('invisible');
        });
        btn.each(function (i, elem) {
            if ($(elem).hasClass('btn-dropdown-active')) {
                $(elem).toggleClass('btn-dropdown-active');
                $(elem).toggleClass('btn-dropdown');
            }
        });
    });

    $(document).on("click", function () {
        $('.SetListDropDownList').addClass('invisible');
        $('.SetListDropDownList .menu').addClass('invisible');
        $('.btn-dropdown-active').attr('class', 'btn-dropdown');
    });

    function toggleDropDownMenu(optionAttr) {
        var dropdown = $(optionAttr + ' .SetListDropDownList');
        var dropdownmenu = $(optionAttr + ' .SetListDropDownList .menu');
        var btn = $(optionAttr + ' .btn-dropdown,' + optionAttr + ' .btn-dropdown-active');
        dropdown.toggleClass('invisible');
        dropdownmenu.toggleClass('invisible');
        btn.toggleClass('btn-dropdown');
        btn.toggleClass('btn-dropdown-active');
    }

    $('.SetOptions .btn-dropdown').click(function (event) {
        toggleDropDownMenu('.SetOptions');
        return false;
    });

    $('.ItemOptions .btn-dropdown').click(function (event) {
        toggleDropDownMenu('.ItemOptions');
        return false;
    });

    $('.SetListDropDownList .UpdateSet').click(function (event) {
        Roblox.Item.UpdateSets(Roblox.AddToSets.setItemId, false, event);
    });
    $('.SetListDropDownList .UpdateAllSets').click(function (event) {
        Roblox.Item.UpdateSets(Roblox.AddToSets.setItemId, true, event);
    });
    $('.CreateSetButton').click(function () {
        $('#CreateSetPopupContainerDiv').modal({ appendTo: 'form', escClose: true, opacity: 80, overlayCss: { backgroundColor: '#000' }, position: [120, 0] });
    });

    $('.PurchaseButton').each(function (index, htmlElem) {
        $(htmlElem).unbind().click(function () {
            Roblox.CatalogItemPurchase.openPurchaseVerificationView(htmlElem);
            return false;
        });
    });

    $('.fadeInAndOut').fadeIn(1000, "swing", function () {
        $(this).delay(6000).fadeOut(3000);
    });

    Roblox.CatalogItemPurchase = new Roblox.ItemPurchase(function (obj) {
        if (obj.IsMultiPrivateSale) {
            // page is out-of-date
            $(".ConfirmationModal").on("remove", function () { window.location.reload(); });
        } else {
            //<sl:translate>
            var message = 'You already own this item.';
            //</sl:translate>
            $('.PurchaseButton').addClass('btn-disabled-primary').attr('original-title', message).tipsy();
        }
        unhideDropDown();
    });

    function unhideDropDown() {
        var wasDropDownInitiallyHidden = $('.ItemOptions').data("isdropdownhidden") == "True";
        var isItemLimited = $('.ItemOptions').data("isitemlimited") == "True";
        var isItemResellable = $('.ItemOptions').data("isitemresellable") == "True";

        if (wasDropDownInitiallyHidden && (!isItemLimited || isItemResellable)) {
            $('.ItemOptions, .ItemOptions .menu .invisible').removeClass('invisible');
        }
        if (!isItemResellable) {
            $('.ItemOptions .delete-item-btn').removeClass('invisible');
        }
    }
});

Roblox.Item = function () {
    var marketPlaceFee = 0.3;

    function setMarketPlaceFee(fee) {
        marketPlaceFee = fee;
    };
    function validateResellInput() {
        var price = $('#SellItemModalContainer input').val();

        if (isNaN(parseInt(price)) || price != parseInt(price) + "" || price <= 0) {
            //<sl:translate>
            var positiveIntegerMessage = 'Price must be a positive integer.';
            //</sl:translate>
            $('#SellItemModalContainer .error-message').text(positiveIntegerMessage).show();
            return;
        }
        $('#SellItemModalContainer .error-message').hide();

        var derivedfee = Math.round(price * marketPlaceFee);
        var commission = (derivedfee > 1) ? derivedfee : 1;
        var profit = price - commission;
        $('#SellItemModalContainer .lblCommision').text(commission > 0 ? commission : "");
        $('#SellItemModalContainer .lblLeftover').text(profit >= 0 ? profit : "");
    }

    function toggleDesc(action) {
        var descElem = $('.DescriptionPanel .Description.body');
        var fullDesc = $('.DescriptionPanel .Description.Full');
        if (action == 'more') {
            //<sl:translate>
            var less = "Less";
            //</sl:translate>
            descElem.html(fullDesc.text() + '   <a onclick="Roblox.Item.toggleDesc(\'less\');">' + less + '</a>');

        } else if (action == 'less') {
            //<sl:translate>
            var more = "More";
            //</sl:translate>
            descElem.html(fullDesc.text().substring(0, 147) + '... <a onclick="Roblox.Item.toggleDesc(\'more\');">' + more + '</a>');

        }
    };
    function showProcessingModal(closeClass) {
        var modalProperties = { overlayClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };

        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }

        $("#ProcessingView").modal(modalProperties);
    };
    function updateSets(assetSetItemId, updateAllSets, event) {
        var setId = $(event.target).attr('setid');
        $.post(
        "/Sets/SetHandler.ashx?rqtype=getnewestversion&assetSetItemId=" + assetSetItemId + (updateAllSets ? "&allsets=true" : ""),
        function () {
            $('.UpdateInSetsContainerDiv').remove();
            $('a[setid=' + setId + ']').removeClass('SetAddButton').addClass('SetAddButtonAlreadyContainsItem');
        });
    };

    return {
        showProcessingModal: showProcessingModal,
        updateSets: updateSets,
        toggleDesc: toggleDesc,
        validateResellInput: validateResellInput,
        setMarketPlaceFee: setMarketPlaceFee
    };
} ();
