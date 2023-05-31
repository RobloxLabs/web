if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Trade === "undefined") {
    Roblox.Trade = {};
}
if (typeof Roblox.Trade.Offer === "undefined") {
    Roblox.Trade.Offer = function () {
        var _TradePartnerID, _UserID, _Element, _OfferItems, _MaxItemsPerOffer, _ErrorElement, _ErrorTextContainer, _BlankTemplate, _RobuxTemplate, _YourOffer, _YourRobuxOffer, _YourRequest, _YourRobuxRequest, _TradeSessionID, _TradeSystemMaxRobuxPercent, _TradeSystemCurrencyFee;
        var _TradeHandlerURL = "TradeHandler.ashx";
        var _SendTrade = "send",
            _Pull = "pull",
            _CounterOffer = "counter";

        function initialize(userID, maxItemsPerOffer, tradepartnerID, tradeSystemMaxRobuxPercent, tradeSystemCurrencyFee) {
            $(document).bind("InventoryUpdate", addButtons);

            $('.SendTrade').bind('click', confirmSendTrade);
            $('.RemoveFromOffer').live('click', removeFromOffer);
            $('.AddButton').live('click', addToOffer);
            $('.RequestButton').live('click', requestForOffer);


            _TradePartnerID = tradepartnerID;
            _UserID = userID;
            _MaxItemsPerOffer = maxItemsPerOffer;
            _TradeSystemMaxRobuxPercent = tradeSystemMaxRobuxPercent;
            _TradeSystemCurrencyFee = tradeSystemCurrencyFee;

            _Element = $('.Offer');
            _ErrorElement = $('.ErrorText');
            _ErrorTextContainer = $('.ErrorTextContainer');
            _BlankTemplate = $('#BlankTemplate');

            if (typeof _YourOffer === "undefined") {
                _YourOffer = new Array();
            }
            if (typeof _YourRequest === "undefined") {
                _YourRequest = new Array();
            }

            var tradeSessionID = $('.TradeWindowContainer').attr('tradesessionid');
            if (tradeSessionID !== '') {
                _TradeSessionID = tradeSessionID;
                pull();
            }

            var inputs = $('input.AddRobuxBox');

            inputs.keyup(addRobuxKeyPress);
            setPrefillDisplay(inputs);
            inputs.blur(function () {
                if ($(this).val() == "" || isNaN($(this).val())) {
                    setPrefillDisplay($(this));
                }
            });
            inputs.focus(function () {
                if (Roblox.Trade.Offer.Resources.watermarkText === $(this).val()) {
                    $(this).val("");
                    setToNormalText($(this));
                }
                if ($(this).val() == "") {
                    setToNormalText($(this));
                }
            });

            inputs.filter_input({ regex: "[0-9]" });


            display(buildOfferJSON());
        }

        function setToNormalText(element) {
            element.css('color', 'black');
            element.css('font-style', 'normal');
        }

        function setPrefillDisplay(input) {
            input.val(Roblox.Trade.Offer.Resources.watermarkText);
            input.css('color', '#AAA');
            input.css('font-style', 'italic');
        }

        function display(JSON) {
            //takes in JSON tradeState and displays it to contents
            if (typeof JSON === 'undefined') {
                return;
            }
            var offerAgentCounter = 0;
            var newHTML, offerItem, offerElement, agentOffer, entry, agentElement, offerValue, offerValueElement, offerRobuxElement;
            var _itemTemplate = $('.InventoryItemTemplate');
            _OfferItems = ([]);
            _YourOffer = new Array();
            _YourRequest = new Array();
            while (typeof JSON.AgentOfferList[offerAgentCounter] !== 'undefined') {
                agentOffer = JSON.AgentOfferList[offerAgentCounter];
                newHTML = "";

                offerValue = JSON.AgentOfferList[offerAgentCounter].OfferValue;
                if (_TradePartnerID === agentOffer.AgentID) {
                    agentElement = _Element.find('.OfferItems')[1];
                    offerValueElement = $(_Element.find('.OfferValue')[1]);
                    offerRobuxElement = $(_Element.find('.OfferRobuxWrapper')[1]);
                } else {
                    agentElement = _Element.find('.OfferItems')[0];
                    offerValueElement = $(_Element.find('.OfferValue')[0]);
                    offerRobuxElement = $(_Element.find('.OfferRobuxWrapper')[0]);
                }
                offerValueElement.text("");
                $(agentElement).html("");
                for (entry in agentOffer.OfferList) {
                    offerElement = _itemTemplate.clone();
                    offerItem = new Roblox.InventoryItem(offerElement);
                    offerItem.display(agentOffer.OfferList[entry]);
                    offerElement.find('[fieldname = "InventoryItemSize"]').addClass(offerItem.smallClassName);
                    offerElement.find('.FooterButtonPlaceHolder').replaceWith($('.RemoveFromOffertemplate').html());
                    offerElement.find('.offerElement').click(removeFromOffer);
                    offerElement.find('.InventoryItemContainerOuter').attr('userassetid', agentOffer.OfferList[entry].UserAssetID);
                    _OfferItems.push(agentOffer.OfferList[entry].UserAssetID);
                    newHTML += offerElement.html();
                    if (_TradePartnerID === agentOffer.AgentID) {
                        _YourRequest.push(agentOffer.OfferList[entry]);
                    } else {
                        _YourOffer.push(agentOffer.OfferList[entry]);
                    }
                }

                newHTML += blankItemDisplayHelper(agentOffer.OfferList.length, offerElement);

                robuxDisplayHelper(agentOffer.OfferRobux, offerRobuxElement);

                offerValueElement.text(offerValue);
                $(agentElement).html(newHTML);
                offerAgentCounter++;
            }
            disableButtons($('.InventoryContainer'));
        }

        function blankItemDisplayHelper(offerLength, offerElement, newHTML) {
            var blankHTML = "";
            if (offerLength < _MaxItemsPerOffer) {
                var difference = 4 - offerLength;
                for (var i = 0; i < difference; i++) {
                    offerElement = _BlankTemplate.clone();
                    blankHTML += offerElement.html();
                }
            }
            return blankHTML;
        }

        function robuxDisplayHelper(offerRobux, offerRobuxElement) {
            if (typeof (offerRobux) != 'undefined') {
                if (offerRobux !== 0) {
                    var afterFeeAmount = Number(offerRobux) - Math.ceil(Number(offerRobux * _TradeSystemCurrencyFee));
                    var displayAfterFeeAmount = getShortForm(afterFeeAmount);
                    offerRobuxElement.find('.RobuxCost').text(displayAfterFeeAmount).attr('title', afterFeeAmount).tipsy();
                    offerRobuxElement.find('.AfterFeeRobux').show();
                    var inputElement = offerRobuxElement.find('.AddRobuxBox').val(offerRobux);
                    setToNormalText(inputElement);
                    if (offerRobuxElement.parents('[list-id]').attr('list-id') === "OfferList0") {
                        _YourRobuxOffer = offerRobux;
                    } else {
                        _YourRobuxRequest = offerRobux;
                    }
                } else {
                    setPrefillDisplay(offerRobuxElement.find('.AddRobuxBox'));
                    offerRobuxElement.find('.AfterFeeRobux').hide();
                }
            }
        }

        function errorElementTextDisplay(text) {
            if (text !== "") {
                _ErrorElement.text(text);
                _ErrorTextContainer.show();
            } else {
                _ErrorTextContainer.hide();
            }
        }

        function addButtons(event, elementID) {
            if (typeof elementID === 'undefined') {
                return;
            }

            var inventoryElement = $('#' + elementID),
                inventoryItems = inventoryElement.find('.LargeInventoryItem'),
                thumbs = inventoryItems.find('img.ItemImg'),
                buttons = inventoryItems.find('.FooterButtonPlaceHolder');
            if (inventoryElement.attr("ownedbyuser") === "True") {
                buttons.replaceWith($('.AddButtonTemplate').html());
                thumbs.addClass('AddButton');
            } else {
                buttons.replaceWith($('.RequestButtonTemplate').html());
                thumbs.addClass('RequestButton');
            }
            disableButtons(inventoryElement);
        }

        function disableButtons(inventoryElement) {
            if (typeof _OfferItems === 'undefined') {
                return;
            }
            var inventoryItems = inventoryElement.find('.InventoryItemContainerOuter');
            var i, j, inventoryItem;
            for (j = 0; j <= _OfferItems.length; j++) {
                for (i = 0; i <= inventoryItems.length; i++) {
                    inventoryItem = inventoryItems[i];
                    if ($(inventoryItem).attr('userassetid') === _OfferItems[j]) {
                        $(inventoryItem).find('.TradeItemSilverButton').addClass('TradeItemSilverButtonDisabled').removeClass('TradeItemSilverButton');
                        if (inventoryElement.attr("ownedbyuser") === "True") {
                            $(inventoryItem).find('img.ItemImg').removeClass('AddButton');
                        } else {
                            $(inventoryItem).find('img.ItemImg').removeClass('RequestButton');
                        }
                    }
                }
            }
        }

        function enableButton(inventoryItem) {
            if (typeof inventoryItem === 'undefined') {
                return;
            }
            inventoryItem.find('a.TradeItemSilverButtonDisabled').addClass('TradeItemSilverButton').removeClass('TradeItemSilverButtonDisabled');
            var buttonContainer = inventoryItem.find('div.TradeItemSilverButtonContainer');
            if (buttonContainer.hasClass('AddButton')) {
                inventoryItem.find('img.ItemImg').addClass('AddButton');
            } else if (buttonContainer.hasClass('RequestButton')) {
                inventoryItem.find('img.ItemImg').addClass('RequestButton');
            }

        }

        function addRobuxKeyPress() {
            var robuxInputBox = $(this);
            var addedValueRobuxContainer = robuxInputBox.siblings('.AfterFeeRobux');
            var valueAdded = robuxInputBox.val();

            var offerIndex = robuxInputBox.parents('[list-id]').attr('list-id');
            setRobux(offerIndex, valueAdded);
            addRobuxDisplayValueHelper(offerIndex);

            if (isNaN(valueAdded) || valueAdded === "0" || valueAdded === "") {
                addedValueRobuxContainer.hide();
                return;
            }

            var afterFeeAmount = Number(valueAdded) - Math.ceil(Number(valueAdded * _TradeSystemCurrencyFee));
            var displayAfterFeeAmount = getShortForm(afterFeeAmount);
            var AfterFeeRobux = robuxInputBox.siblings('.AfterFeeRobux');
            AfterFeeRobux.children('.RobuxCost').text(displayAfterFeeAmount).attr('title', afterFeeAmount).tipsy();
            addedValueRobuxContainer.show();
        }

        function getShortForm(number) {
            if (Number(number) > 1000000000) {
                return Math.floor(number / 1000000000) + "B+";
            }
            return number;
        }

        function addRobuxDisplayValueHelper(listID) {
            var newTradeValue;
            var index;
            if (listID == 'OfferList0') {
                index = 0;
                newTradeValue = recalculateOfferValue(_YourOffer, $('[list-id="OfferList0"] .AddRobuxBox'));
            } else {
                index = 1;
                newTradeValue = recalculateOfferValue(_YourRequest, $('[list-id="OfferList1"] .AddRobuxBox'));
            }
            var displayNewTradeValue = getShortForm(newTradeValue);
            $(_Element.find('.OfferValue')[index]).text(displayNewTradeValue).attr('title', newTradeValue).tipsy();
        }
        function setRobux(listID, value) {
            if (listID == 'OfferList0') {
                _YourRobuxOffer = value;
            } else {
                _YourRobuxRequest = value;
            }
        }

        function sendAjax(dataSet) {
            
            var tradeSentTitle = Roblox.Trade.Offer.Resources.tradeSentText,
                tradeSentBody = Roblox.Trade.Offer.Resources.tradeSentBody,
                badNewsTitle = Roblox.Trade.Offer.Resources.badNewsTitle,
                badNewsBody = Roblox.Trade.Offer.Resources.badNewsBody;

            _ErrorTextContainer.hide();
            $.ajax({
                type: 'POST',
                url: _TradeHandlerURL,
                data: dataSet,
                dataType: 'json',
                success: function (json) {
                    if (typeof json !== 'undefined') { // typeof
                        if (json.success) {
                            if ((dataSet.cmd === _SendTrade) || (dataSet.cmd === _CounterOffer)) {
                                $(window).unbind('beforeunload');
                                var properties = { overlayClose: false, escClose: false};
                                Roblox.GenericModal.open(tradeSentTitle, Roblox.Trade.Offer.Resources.thumbsUpUrl, tradeSentBody, function () {
                                    window.close();
                                
                                    if ((dataSet.cmd === _CounterOffer) && (typeof window.opener !== 'undefined')) {
                                        window.opener.$('[TradeUpdater]').click();
                                    }
                                }, false, properties);
                            } else if (dataSet.cmd === _Pull) {
                                var displayJSON = $.parseJSON(json.data);
                                display(displayJSON);
                            }
                        } else if (!json.success) {
                            if (json.data !== '') {
                                Roblox.GenericModal.open(badNewsTitle, Roblox.Trade.Offer.Resources.alertUrl, json.msg + badNewsBody, handleDoubleItemsFaliure(json.data));
                            } else {
                                errorElementTextDisplay(json.msg);
                            }
                        }
                    }
                }
            });
        }

        function handleDoubleItemsFaliure(JSON) {
            var parsedJSON = $.parseJSON(JSON);
            var index, item;
            for (index in parsedJSON) {
                removeHelper(parsedJSON[index]);
            }

        }

        function addToOffer() {
            addRequestHelper(this, _YourOffer, 0);
        }

        function requestForOffer() {
            addRequestHelper(this, _YourRequest, 1);
        }

        function addRequestHelper(buttonElement, list, index) {
            errorElementTextDisplay("");
            if ($(buttonElement).children().hasClass('TradeItemSilverButtonDisabled')) {
                return;
            }
            if (!$(buttonElement).hasClass('TradeItemSilverButtonContainer')) $(buttonElement).removeClass('AddButton').removeClass('RequestButton');

            var itemContainer = $(buttonElement).parents('.InventoryItemContainerOuter');
            var userAssetId = itemContainer.attr('userassetid');
            var inventoryItem = itemContainer.parents('.InventoryContainer').data(userAssetId);
            var i;
            for (i in list) {
                var listItem = list[i];
                if (listItem.UserAssetID === userAssetId) return;
            }
            if (list.length < _MaxItemsPerOffer) { list.push(inventoryItem); }
            //<sl:translate>
            else { errorElementTextDisplay(Roblox.Trade.Offer.Resources.maxItemsErrorText); }
            //</sl:translate>

            display(buildOfferJSON());
        }

        function recalculateOfferValue(offer, robuxInputElement) {
            var value = 0;
            var i, offerItem;
            for (i in offer) {
                offerItem = offer[i];
                if (!isNaN(Number(offerItem.AveragePrice))) value = Number(offerItem.AveragePrice) + Number(value);
                else if (!isNaN(Number(offerItem.OriginalPrice))) value = Number(offerItem.OriginalPrice) + Number(value);
            }
            var addedRobux = robuxInputElement.val();
            if (isNaN(addedRobux) || addedRobux === '0') {
                return value;
            }
            var totalValue = Number(value) + Number(addedRobux);
            return totalValue;
        }

        function buildOfferJSON() {
            var offerLists = new Array();
            var yourRobuxOffer = parseInt(_YourRobuxOffer, 10);
            if (isNaN(yourRobuxOffer))
                yourRobuxOffer = 0;

            var yourRobuxRequest = parseInt(_YourRobuxRequest, 10);
            if (isNaN(yourRobuxRequest))
                yourRobuxRequest = 0;


            if (typeof _YourOffer !== 'undefined') offerLists.push({
                AgentID: _UserID,
                OfferList: _YourOffer,
                OfferRobux: yourRobuxOffer,
                OfferValue: recalculateOfferValue(_YourOffer, $('[list-id="OfferList0"] .AddRobuxBox'))
            });
            else offerLists.push({
                AgentID: _UserID,
                OfferList: new Array(),
                OfferRobux: 0,
                OfferValue: 0
            });
            if (typeof _YourRequest !== 'undefined') offerLists.push({
                AgentID: _TradePartnerID,
                OfferList: _YourRequest,
                OfferRobux: yourRobuxRequest,
                OfferValue: recalculateOfferValue(_YourRequest, $('[list-id="OfferList1"]  .AddRobuxBox'))
            });
            else offerLists.push({
                AgentID: _TradePartnerID,
                OfferList: new Array(),
                OfferRobux: 0,
                OfferValue: 0
            });
            return {
                AgentOfferList: offerLists,
                IsActive: false,
                TradeStatus: "Open"
            };
        }
        function confirmSendTrade() {
            //<sl:translate>
            Roblox.GenericConfirmation.open({
                titleText: Roblox.Trade.Offer.Resources.sendRequestTitleText,
                bodyContent: Roblox.Trade.Offer.Resources.sendRequestText,
                acceptText: Roblox.Trade.Offer.Resources.acceptText,
                declineText: Roblox.Trade.Offer.Resources.cancelText,
                onAccept: sendTrade
                
            });
            //</sl:translate>
        }

        function sendTrade() {
            var data;
            if (typeof _TradeSessionID === 'undefined') {
                data = {
                    cmd: _SendTrade,
                    TradeJSON: JSON.stringify(buildOfferJSON())
                };
                sendAjax(data);
            } else {
                data = {
                    cmd: _CounterOffer,
                    TradeID: _TradeSessionID,
                    TradeJSON: JSON.stringify(buildOfferJSON())
                };
                sendAjax(data);
            }
        }

        function removeFromOffer() {
            errorElementTextDisplay("");
            var itemContainer = $(this).parents('.InventoryItemContainerOuter');
            var userAssetID = itemContainer.attr('userassetid');
            removeHelper(userAssetID);
        }

        function removeHelper(userAssetID) {
            var itemCounter, item;
            for (itemCounter in _YourOffer) {
                item = _YourOffer[itemCounter];
                if (item.UserAssetID === userAssetID) {
                    _YourOffer.splice(itemCounter, 1);
                }
            }
            for (itemCounter in _YourRequest) {
                item = _YourRequest[itemCounter];
                if (item.UserAssetID === userAssetID) {
                    _YourRequest.splice(itemCounter, 1);
                }
            }
            display(buildOfferJSON());
            enableButton($('.InventoryItemContainerOuter[userassetid = "' + userAssetID + '"]'));
        }

        function pull() {
            var data = {
                TradeID: _TradeSessionID,
                cmd: _Pull
            };
            sendAjax(data);
        }

        return {
            initialize: initialize
        };
    } ();
}
