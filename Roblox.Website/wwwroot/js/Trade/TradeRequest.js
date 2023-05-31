if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.Trade === "undefined") {
    Roblox.Trade = {};
}
if (typeof Roblox.Trade.TradeRequestModal === "undefined") {
    Roblox.Trade.TradeRequestModal = function () {
        var _ModalProperties = {
            overlayClose: true,
            escClose: true,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            }
        };
        var _TradeHandlerURL = "/Trade/TradeHandler.ashx",
             _ErrorThumbURL = '/images/Icons/img-alert.png',
            _TicksPerDay = 86400000,
            _TicksPerHour = _TicksPerDay / 24,
            _DefaultLong = 0;
        var _Command = {
            pull: "pull",
            decline: "decline",
            accept: "maketrade"
        };
        var _PartnerID,
            _TradeID,
            _MaxItemsPerOffer,
            _blankTemplate,
            _robuxTemplate,
            _MissingUserAssetTemplate,
            _DeletedUserAssetTemplate,
            _itemTemplate,
            _TradePartner,
            _ModalElement,
            _UserID,
            _OfferHeader1,
            _OfferHeader2,
            _ErrorElement,
            _StatusElement,
            _TradeHasRobux,
            _TradeSystemWriteEnabled,
            _TradeSystemRobuxFee;

        //Initialization and Event handlers
        $(function () {
            _ModalElement = $("#TradeRequest");
            _UserID = _ModalElement.attr('UserID');
            _OfferHeader1 = _ModalElement.find('[list-id="OfferList0"] h3.OfferHeader');
            _OfferHeader2 = _ModalElement.find('[list-id="OfferList1"] h3.OfferHeader');
            _ErrorElement = _ModalElement.find('.GenericModalErrorMessage');
            _StatusElement = $('#TradeItems_tab .status-confirm');

            _ModalElement.find('#ButtonAcceptTrade').live('click', function () {
                var tradeJSON = _ModalElement.data('trade-json');
                close();
                //<sl:translate>
                Roblox.GenericConfirmation.open({
                    titleText: 'Accept Request',
                    bodyContent: "Are you sure you want to accept this Trade?",
                    onAccept: function () { acceptTrade(tradeJSON); },
                    onDecline: openHelper
                });
                //</sl:translate>
            });

            _ModalElement.find('#ButtonCounterTrade').live('click', function () {
                close();
                window.open("/Trade/TradeWindow.aspx?TradeSessionId=" + _TradeID + "&TradePartnerID=" + _PartnerID, "_blank", "scrollbars=0, height=608, width=914");
            });
            _ModalElement.find('#ButtonDeclineTrade').live('click', function () {
                close();
                //<sl:translate>
                Roblox.GenericConfirmation.open({
                    titleText: 'Decline Request',
                    bodyContent: "Are you sure you want to decline this Trade?",
                    onAccept: declineTrade,
                    onDecline: openHelper,
                    footerText: "Tired of lowball trades?<br />Update your Trade Quality setting on the <a href=\"" + Roblox.Endpoints.getAbsoluteUrl("/my/account#!/privacy") + "\">Privacy page</a> within My Settings.",
                    allowHtmlContentInFooter: true
                });
                //</sl:translate>
            });
            _ModalElement.find('#ButtonCancelTrade').live('click', function () {
                close();
                //<sl:translate>
                Roblox.GenericConfirmation.open({
                    titleText: 'Decline Request',
                    bodyContent: "Are you sure you want to decline this Trade?",
                    onAccept: declineTrade,
                    onDecline: openHelper
                });
                //</sl:translate>
            });
            $('#TradeRequest [roblox-ok]').live('click', close);

            $('.ViewTradeLink').live('click', open);
            $('[TradeUpdater]').bind('click', function () {
                $(document).trigger('TradeUpdate');
            });

            _blankTemplate = $('#BlankTemplate');
            _MissingUserAssetTemplate = $('[missing-user-asset-template]');
            _DeletedUserAssetTemplate = $('[deleted-user-asset-template]');
            _itemTemplate = $('#InventoryItemTemplate');
            _robuxTemplate = $('#RobuxTemplate');
        });

        //Display logic
        function open() {
            _ModalElement.modal(_ModalProperties);
            _StatusElement.hide();
            _TradeID = $(this).attr('tradesessionid');
            _PartnerID = $(this).attr('tradepartnerid');
            _TradePartner = ProcessPartnerName($(this).parents('tr').find('.TradePartner').attr('tradepartnername'));

            _ModalElement.find('div.roblox-avatar-image').attr('data-user-id', _PartnerID);

            Roblox.Widgets.AvatarImage.load($('#TradeRequest .roblox-avatar-image').toArray());

            sendAjax(_Command.pull);
        }
        function ProcessPartnerName(name) {
            if (name.length > 10) {
                return name.slice(0, 10) + '...';
            }
            return name;
        }

        function openHelper() {
            _ModalElement.modal(_ModalProperties);
            sendAjax(_Command.pull);
        }

        function close() {
            _ModalElement.find('.OfferItems').html("");
            _ModalElement.find('.ViewButtonContainer').hide();
            _ModalElement.find('.ActionButtonContainer').hide();
            _ModalElement.find('.ReviewButtonContainer').hide();
            _ModalElement.find('.TradeRequestText').hide();
            _ModalElement.find('.OfferValue').text("");
            _ModalElement.find('.roblox-avatar-image[data-image-size="medium"]').html("");
            $.modal.close();
        }

        _ModalProperties.onClose = close;

        //Helpers
        function acceptTrade(tradeJSON) {
            sendAjax(_Command.accept, tradeJSON);
        }

        function declineTrade() {
            sendAjax(_Command.decline);
        }

        function process(JSON) {
            if (typeof JSON === 'undefined') {
                return;
            }

            _ModalElement.data('trade-json', JSON);
            var tradeJSON = $.parseJSON(JSON);

            _TradeHasRobux = false;
            expirationHelper(tradeJSON.Expiration);

            var offerAgentCounter = 0;
            var newHTML, offerItem, offerElement, agentOffer, entry, agentElement, offerValueElement, offerIndex;
            var element = _ModalElement.find('.unifiedModalContent');
            while (typeof tradeJSON.AgentOfferList[offerAgentCounter] !== 'undefined') {
                agentOffer = tradeJSON.AgentOfferList[offerAgentCounter];
                newHTML = "";

                if (agentOffer.AgentID === Number(_UserID))
                    offerIndex = 0;
                else
                    offerIndex = 1;
                agentElement = element.find('.OfferItems')[offerIndex];
                $(agentElement).html("");

                offerValueElement = $(element.find('.OfferValue')[offerIndex]);
                offerValueElement.text("");
                offerValueElement.text(agentOffer.OfferValue);

                for (entry in agentOffer.OfferList) {
                    if (agentOffer.OfferList[entry].UserAssetID === _DefaultLong) {
                        if (tradeJSON.StatusType === "Finished") {
                            offerElement = _DeletedUserAssetTemplate.clone();
                        } else {
                            offerElement = _MissingUserAssetTemplate.clone();
                        }
                    } else {
                        offerElement = _itemTemplate.clone();
                        offerItem = new Roblox.InventoryItem(offerElement);
                        offerItem.display(agentOffer.OfferList[entry]);

                        offerElement.find('[fieldname = "InventoryItemSize"]').addClass(offerItem.largeClassName);
                        offerElement.find('.FooterButtonPlaceHolder').remove();
                        offerElement.find('.HeaderButtonPlaceHolder').replaceWith($('.RemoveFromOffertemplate').html());
                        offerElement.find('.InventoryItemContainerOuter').attr('userassetid', agentOffer.OfferList[entry].UserAssetID);
                    }
                    newHTML += offerElement.html();
                }

                if (typeof (agentOffer.OfferRobux) != 'undefined') {

                    if (agentOffer.OfferRobux === 0) {
                        if (offerIndex === 1) {
                            $('[data-js="feenote"]').hide();
                        }
                        offerElement = _blankTemplate.clone();
                        newHTML += offerElement.html();
                    } else {
                        offerElement = _robuxTemplate.clone();
                        if (offerIndex === 1) {
                            $('[data-js="feenote"]').show();
                            offerElement.find('.RobuxItemAsterisk').show();
                            var afterFeeRobux = Number(agentOffer.OfferRobux) - Math.ceil(Number(agentOffer.OfferRobux) * Number(_TradeSystemRobuxFee));
                            offerElement.find('.RobuxAmount').text(afterFeeRobux);
                        } else {
                            offerElement.find('.RobuxItemAsterisk').hide();
                            offerElement.find('.RobuxAmount').text(agentOffer.OfferRobux);
                        }

                        newHTML += offerElement.html();
                        _TradeHasRobux = true;
                    }
                }

                if (agentOffer.OfferList.length < _MaxItemsPerOffer) {
                    var difference = _MaxItemsPerOffer - agentOffer.OfferList.length;
                    for (var i = 0; i < difference; i++) {
                        offerElement = _blankTemplate.clone();
                        newHTML += offerElement.html();
                    }
                }

                $(agentElement).html(newHTML);
                offerAgentCounter++;
            }
            messagingHelper(tradeJSON.StatusType, tradeJSON.IsActive);
        }

        function messagingHelper(status, active) {

            _ModalElement.find('.ViewButtonContainer').toggle(!active);
            _ModalElement.find('.ActionButtonContainer').toggle(active);
            _ModalElement.find('.ReviewButtonContainer').hide();

            //<sl:translate>
            var tradeWidth = 'Trade with ';
            var tradeHeaders = {
                wouldHaveGiven: "ITEMS YOU WOULD HAVE GIVEN",
                wouldHaveReceived: "ITEMS YOU WOULD HAVE RECEIVED",
                gave: "ITEMS YOU GAVE",
                received: "ITEMS YOU RECEIVED",
                willGive: "ITEMS YOU WILL GIVE",
                willReceive: "ITEMS YOU WILL RECEIVE"
            };
            //</sl:translate>

            _ModalElement.find("p.TradeRequestText .TradePartnerName").attr("href","/users/" + _PartnerID + "/profile").text(_TradePartner);
            var statusTextSpan = _ModalElement.find("p.TradeRequestText .TradeStatusText");
            var expirationContainer = _ModalElement.find("p.TradeExpiration");

            switch (status) {
                case "Open":
                    statusTextSpan.text("has been opened.");

                    _ModalElement.find('.ReviewButtonContainer').toggle(!active);
                    _ModalElement.find('.ViewButtonContainer').hide();
                    
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.willGive);
                    _OfferHeader2.text(tradeHeaders.willReceive);
                    //</sl:translate>
                    expirationContainer.show();
                    break;
                case "Finished":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.gave);
                    _OfferHeader2.text(tradeHeaders.received);
                    //</sl:translate>
                    statusTextSpan.text("was completed!");
                    expirationContainer.hide();
                    break;
                case "Expired":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.wouldHaveGiven);
                    _OfferHeader2.text(tradeHeaders.wouldHaveReceived);
                    //</sl:translate>
                    statusTextSpan.text("has expired.");
                    expirationContainer.hide();
                    break;
                case "Pending":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.willGive);
                    _OfferHeader2.text(tradeHeaders.willReceive);
                    //</sl:translate>
                    statusTextSpan.text("is pending.");
                    expirationContainer.show();
                    break;
                case "Rejected":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.wouldHaveGiven);
                    _OfferHeader2.text(tradeHeaders.wouldHaveReceived);
                    //</sl:translate>
                    statusTextSpan.text("was rejected.");
                    expirationContainer.hide();
                    break;
                case "Declined":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.wouldHaveGiven);
                    _OfferHeader2.text(tradeHeaders.wouldHaveReceived);
                    //</sl:translate>
                    statusTextSpan.text("was declined.");
                    expirationContainer.hide();
                    break;
                case "Countered":
                    //<sl:translate>
                    _OfferHeader1.text(tradeHeaders.wouldHaveGiven);
                    _OfferHeader2.text(tradeHeaders.wouldHaveReceived);
                    //</sl:translate>
                    statusTextSpan.text("was countered.");
                    expirationContainer.hide();
                    break;
            }

            if (!_TradeSystemWriteEnabled) {
                _ModalElement.find('.ViewButtonContainer').show();
                _ModalElement.find('.ActionButtonContainer').hide();
                _ModalElement.find('.ReviewButtonContainer').hide();
            }

            _ModalElement.find('.TradeRequestText').show();
        }

        function expirationHelper(expirationDate) {
            var days, hours;
            expirationDate = new Date(Number(expirationDate.substring(6, 19)));
            var now = (new Date()).getTime();
            var TTL = expirationDate - now;
            //_ModalElement.find('p.TradeExpiration').toggle(now < expirationDate.valueOf());
            days = Math.floor(TTL / _TicksPerDay);
            hours = Math.floor(TTL / _TicksPerHour);
            //<sl:translate>
            var inText = "in ",
                dayText = " days.",
                hourText = " hours.",
                soonText = " soon.";
            //</sl:translate>
            if (days > 1)
                _ModalElement.find('span#TradeRequestExpiration').text(inText + days + dayText);
            else if (hours > 1)
                _ModalElement.find('span#TradeRequestExpiration').text(inText + hours + hourText);
            else {
                _ModalElement.find('span#TradeRequestExpiration').text(soonText);
            }

        }

        function initialize(maxItemsPerOffer, tradeSystemWriteEnabled, tradeSystemRobuxFee) {
            _MaxItemsPerOffer = maxItemsPerOffer;
            _TradeSystemWriteEnabled = tradeSystemWriteEnabled;
            _TradeSystemRobuxFee = tradeSystemRobuxFee;
        }

        function sendAjax(requestCommand, tradeJSON) {
            var dataSet = {
                TradeID: _TradeID,
                cmd: requestCommand
            };
            if (requestCommand === "maketrade") {
                dataSet.TradeJSON = tradeJSON;
            }
            $.ajax({
                type: 'POST',
                url: _TradeHandlerURL,
                data: dataSet,
                dataType: 'json',
                success: function (json) {
                    if (typeof json !== 'undefined') {
                        _ErrorElement.toggle(!json.success);
                        if (json.success === true) {
                            if (requestCommand === _Command.pull) process(json.data);
                            else if (requestCommand === _Command.accept) {
                                var acceptMessage = 'You have accepted ' + _TradePartner + '\'s trade request. The trade is now being processed by our system.';
                                close();
                                _StatusElement.text(acceptMessage);
                                _StatusElement.show();
                                $(document).trigger('TradeUpdate');
                            } else if (requestCommand === _Command.decline) {
                                var declineMessage = 'You have declined ' + _TradePartner + '\'s trade request.';
                                close();
                                _StatusElement.text(declineMessage);
                                _StatusElement.show();
                                $(document).trigger('TradeUpdate');
                            } else {
                                $(document).trigger('TradeUpdate');
                            }
                        }
                        else {
                            if (requestCommand !== _Command.pull) {
                                _StatusElement.text(json.msg);
                                _StatusElement.show();
                            } else {
                                close();
                                //<sl:translate>
                                Roblox.GenericModal.open('Trade Error', _ErrorThumbURL, json.msg + '.  Please try again later.', function () { });
                                //</sl:translate>

                            }
                        }
                    }
                }
            });
        }

        return {
            initialize: initialize
        };
    } ();
}
