if (typeof Roblox === "undefined") {
    Roblox = {};
}
if (typeof Roblox.BuildPage === "undefined") {
    Roblox.BuildPage = {};
}

$(function () {
    var creationContextDivSelector = ".creation-context-filters-and-sorts";
    var placeCreationContextDropDownSelector = ".place-creationcontext-drop-down";
    var placeCreationContextDropDown = $("#MyCreationsTab " + placeCreationContextDropDownSelector);
    var groupPlaceCreationContextDropDown = $("#GroupCreationsTab " + placeCreationContextDropDownSelector);
    var itemDropDown = $("#MyCreationsTab #build-dropdown-menu");
	var buildNewDropDown = $("#MyCreationsTab #build-new-dropdown-menu");
    var groupsItemDropDown = $("#GroupCreationsTab #build-dropdown-menu");
    var activeGameDropDown = null;
	var activeBuildNewDropDown = null;
    var assetLinksEnabled = $('#assetLinks').data('asset-links-enabled');
    $("a[data-retry-url]").loadRobloxThumbnails();  // load thumbnails for images on the page

    function hideGameDropDown() {
        if (activeGameDropDown) {
            var gearButton = $(activeGameDropDown);
            gearButton.removeClass("gear-open");
            gearButton.parent().css({
                "background-color": "#FFFFFF",
                "border-color": "white",
                "z-index": "0"
            });
            activeGameDropDown = null;
        }

        itemDropDown.hide(); // click on the same gear icon twice - hide the menu
        groupsItemDropDown.hide();

        return false;
    }
	
    function hideBuildNewDropDown() {
        if (activeBuildNewDropDown) {
            var buildNewButton = $(activeBuildNewDropDown);
            buildNewButton.removeClass("build-new-open");
            activeBuildNewDropDown = null;
        }

        buildNewDropDown.hide();

        return false;
    }

    function buildFetchPlaceUrl(loadNext, $pageContextContainer) {
        var fetchPlaceUrl = $pageContextContainer.find(creationContextDivSelector).data('fetchplaceurl');
        var universeId = $pageContextContainer.find(creationContextDivSelector).data('universeid');
        var fetchUniversePlaces = $pageContextContainer.find(creationContextDivSelector).data('fetchuniverseplaces');
        var creationContext = $pageContextContainer.find(placeCreationContextDropDownSelector).val();

        var requestObj = {
            creationContext: creationContext,
            assetLinksEnabled: assetLinksEnabled,
            universeId: universeId,
            fetchUniversePlaces: fetchUniversePlaces
        };

        var connector = "?";
        if (fetchPlaceUrl.indexOf("?") != -1) {
            connector = "&";
        }

        var url = fetchPlaceUrl + connector + $.param(requestObj);

        if (loadNext) {
            var rowsDisplayed = $pageContextContainer.find("table.item-table").length;
            var nextPageParams = "&startRow=" + rowsDisplayed;
            url += nextPageParams;
        }
        return url;
    }
    function fetchCreationContext(getUniversePlaces, $pageContextContainer) {
        var loadingImg = $pageContextContainer.find(".build-loading-container").html();
        $pageContextContainer.find(".items-container").html(loadingImg);
        var creationContext = $pageContextContainer.find(placeCreationContextDropDownSelector).val();
        var asideTextSpan = $pageContextContainer.find(".content-area .content-title .aside-text");
        var breadCrumbContext = $pageContextContainer.find(".breadCrumb .breadCrumbContext");
        var creationText = $pageContextContainer.find(placeCreationContextDropDownSelector + " option:selected").text();

        $pageContextContainer.find(".context-game-separator").hide();
        $pageContextContainer.find(".breadCrumbGame").hide();

        if (creationContext != 'NonGameCreation') {
            $pageContextContainer.find(".show-active-places-only").hide();
            $pageContextContainer.find(".creation-context-breadcrumb").show();
            breadCrumbContext.text(creationText);
            asideTextSpan.hide();
            if (getUniversePlaces) {
                $pageContextContainer.find(".context-game-separator").show();
                $pageContextContainer.find(".breadCrumbGame").show();
            }
        } else {
            $pageContextContainer.find(".creation-context-breadcrumb").hide();
            asideTextSpan.show();
            $pageContextContainer.find(".show-active-places-only").show();
        }

        var url = buildFetchPlaceUrl(false, $pageContextContainer);
        $pageContextContainer.find(".items-container").load(url);
    }

    function resetAndFetchCreationContexts(getUniversePlaces, $pageContextContainer) {
        $pageContextContainer.find(creationContextDivSelector).data('universeid', 0);
        $pageContextContainer.find(creationContextDivSelector).data('fetchuniverseplaces', false);
        fetchCreationContext(getUniversePlaces, $pageContextContainer);
    }

    placeCreationContextDropDown.change(function () { resetAndFetchCreationContexts(true, $("#MyCreationsTab")); });
    groupPlaceCreationContextDropDown.change(function () { resetAndFetchCreationContexts(true, $("#GroupCreationsTab")); });

    $("#MyCreationsTab .items-container").on("click", ".view-places-button", function () {
        var $pageContextContainer = $("#MyCreationsTab");
        var viewPlaces = $(this);
        var universeId = viewPlaces.data('universeid');
        var universeName = viewPlaces.data('universename');
        $pageContextContainer.find(creationContextDivSelector).data('universeid', universeId);
        $pageContextContainer.find(creationContextDivSelector).data('fetchuniverseplaces', true);
        $pageContextContainer.find(".breadCrumbGame").text(universeName);
        $pageContextContainer.find(".context-game-separator").show();
        $pageContextContainer.find(".breadCrumbGame").show();
        fetchCreationContext(true, $pageContextContainer);
        return false;
    });

    $("#GroupCreationsTab .items-container").on("click", ".view-places-button", function () {
        var $pageContextContainer = $("#GroupCreationsTab");
        var viewPlaces = $(this);
        var universeId = viewPlaces.data('universeid');
        var universeName = viewPlaces.data('universename');
        $pageContextContainer.find(creationContextDivSelector).data('universeid', universeId);
        $pageContextContainer.find(creationContextDivSelector).data('fetchuniverseplaces', true);
        $pageContextContainer.find(".breadCrumbGame").text(universeName);
        $pageContextContainer.find(".context-game-separator").show();
        $pageContextContainer.find(".breadCrumbGame").show();
        fetchCreationContext(true, $pageContextContainer);
        return false;
    });

    $("#MyCreationsTab").on("click", ".breadCrumbContext", function () {
        resetAndFetchCreationContexts(false, $("#MyCreationsTab"));
        return false;
    });

    $("#GroupCreationsTab").on("click", ".breadCrumbContext", function () {
        resetAndFetchCreationContexts(false, $("#GroupCreationsTab"));
        return false;
    });

    function loadNextPage(moreLink, url, $pageContextContainer) {
        moreLink.hide();
        $.ajax({
            url: url,
            cache: false,
            dataType: "html",
            success: function (html) {
                moreLink.remove();
                var container = $pageContextContainer.find(".items-container");
                var appendedHtml = $(html).hide();
                container.append(appendedHtml);
                appendedHtml.fadeIn();
                appendedHtml.find("a[data-retry-url]").loadRobloxThumbnails();
            },
            fail: function () {
                moreLink.show();
            }
        });
    }

    $("#MyCreationsTab .items-container").on("click", ".load-more-places", function () {
        var moreLink = $(this);
        var $pageContextContainer = $("#MyCreationsTab");
        var url = buildFetchPlaceUrl(true, $pageContextContainer);
        loadNextPage(moreLink, url, $pageContextContainer);
        return false;
    });

    $("#GroupCreationsTab .items-container").on("click", ".load-more-places", function () {
        var moreLink = $(this);
        var $pageContextContainer = $("#GroupCreationsTab");
        var url = buildFetchPlaceUrl(true, $pageContextContainer);
        loadNextPage(moreLink, url, $pageContextContainer);
        return false;
    });

    // configure edit buttons
    $(".BuildPageContent").on("click", "a.roblox-edit-button", function () {
        if ($(".build-page").data("edit-opens-studio") == "False" && !Roblox.Client.isIDE()) {
            // we are not in not studioC
            Roblox.GenericConfirmation.open({
                titleText: Roblox.BuildPage.Resources.editGame,
                bodyContent: Roblox.BuildPage.Resources.openIn + "<a target='_blank' href='http://wiki.roblox.com/index.php/Studio'>" + Roblox.BuildPage.Resources.robloxStudio + "</a>.",
                acceptText: Roblox.BuildPage.Resources.ok,
                acceptColor: Roblox.GenericConfirmation.blue,
                declineColor: Roblox.GenericConfirmation.none,
                imageUrl: "/images/Icons/img-alert.png",
                allowHtmlContentInBody: true,
                dismissable: true
            });
        }
        else {
            var tbl = $(this).closest("table");
            var placeId = tbl.data("rootplace-id") || tbl.data("item-id");
            window.play_placeId = placeId;

            var universeId = tbl.data("universeid") || tbl.data("item-id");
            var isStudioProtocolHandlerEnabled = $("#PlaceLauncherStatusPanel").data("is-protocol-handler-launch-enabled") == "True";

            if (tbl.data('type') == "app-place") {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.appStudioTitle,
                    bodyContent: Roblox.BuildPage.Resources.appStudioBody,
                    acceptText: Roblox.BuildPage.Resources.continueText,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineText: Roblox.BuildPage.Resources.cancel,
                    imageUrl: "/images/Icons/img-alert.png",
                    onAccept: function () {
                        // ReSharper disable UseOfImplicitGlobalInFunctionScope
                        if (isStudioProtocolHandlerEnabled) {
                            Roblox.GameLauncher.editGameInStudio(placeId, universeId, true);
                        }
                        else {
                            editGameInStudio(placeId);   // this function is defined in Games.cshtml
                        }
                        // ReSharper restore UseOfImplicitGlobalInFunctionScope
                    }
                });
            } else {
                // ReSharper disable UseOfImplicitGlobalInFunctionScope
                if (isStudioProtocolHandlerEnabled) {
                    Roblox.GameLauncher.editGameInStudio(placeId, universeId, true);
                }
                else {
                    editGameInStudio(placeId);   // this function is defined in Games.cshtml
                }
                // ReSharper restore UseOfImplicitGlobalInFunctionScope
            }
        }
    });

    // configure build buttons
    $(".BuildPageContent").on("click", "a.roblox-build-button", function () {
		var tbl = $(this).closest("table");
		var play_placeId = tbl.data("rootplace-id") || tbl.data("item-id");

		RobloxLaunch._GoogleAnalyticsCallback = function() {
			GoogleAnalyticsEvents.FireEvent(['Build', 'User', 'Over13', 1]);
		};
		if (Roblox.Client.WaitForRoblox(function() {
			Roblox.VideoPreRoll.showVideoPreRoll = false;
			RobloxLaunch.StartGame('http://www.roblonium.com//Game/visit.ashx?placeId=' + play_placeId , 'visit.ashx', 'https://www.roblonium.com//Login/Negotiate.ashx', 'FETCH', true)
		})) {}
		return false;
    });

    function shutdownInstances(url, data) {
        Roblox.GenericConfirmation.open({
            titleText: "Shut Down Servers",
            bodyContent: data.hasOwnProperty("placeId")
                ? "Are you sure you want to shut down all servers for this place?"
                : "Are you sure you want to shut down all servers in all places in this game?",
            onAccept: function () {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function () {
                        Roblox.GenericConfirmation.open({
                            titleText: Roblox.BuildPage.Resources.errorOccurred,
                            bodyContent: "An error occured while shutting down servers.",
                            acceptText: Roblox.BuildPage.Resources.ok,
                            acceptColor: Roblox.GenericConfirmation.blue,
                            declineColor: Roblox.GenericConfirmation.none,
                            allowHtmlContentInBody: true,
                            dismissable: true
                        });
                    }
                });
            },
            acceptColor: Roblox.GenericConfirmation.blue,
            acceptText: "Yes",
            declineText: "No",
            allowHtmlContentInBody: true
        });
    }

    $("body").on("click", "a.shutdown-all-servers-button[data-universe-id]", function () {
        shutdownInstances("/universes/shutdown-all-games", { universeId: $(this).data("universe-id") });
        return false;
    });

    $("body").on("click", "a.shutdown-all-servers-button[data-place-id]", function () {
        shutdownInstances("/games/shutdown-all-instances", { placeId: $(this).data("place-id") });
        return false;
    });


    // show menu for a game
    $(".BuildPageContent").on("mouseover", "a.gear-button", function () {
        $(this).addClass("gear-hover");
    });

    $(".BuildPageContent").on("mouseout", "a.gear-button", function () {
        $(this).removeClass("gear-hover");
    });
	
	function buildNewButtonEventHandler(event, dropdown) {
        if (activeBuildNewDropDown == this) {
            return hideBuildNewDropDown();
        } else if (activeBuildNewDropDown) {
            hideBuildNewDropDown();
        }
        activeBuildNewDropDown = this;

        var buildNewButton = $(this);
        buildNewButton.addClass("build-new-open");

        // show the drop down menu
        var pos = buildNewButton.offset();
        dropdown.show();

        return false;
    }

    function gearButtonEventHandler(event, dropdown) {
        if (activeGameDropDown == this) {
            return hideGameDropDown();
        } else if (activeGameDropDown) {
            hideGameDropDown();
        }
        activeGameDropDown = this;

        var gearButton = $(this);
        gearButton.addClass("gear-open");

        // update links
        var rowTable = gearButton.closest("table");
        var itemId = rowTable.data("item-id");
        var isModerationApproved = rowTable.data("item-moderation-approved");
        isModerationApproved = isModerationApproved === "True";
        dropdown.find("a").each(function () {
            var link = $(this);
            var isAdvertiseLink = link.hasClass("advertise-link");
            var template = link.data("href-template");
            if (template) {
                var href = template.replace(/=0/g, "=" + itemId).replace(/\/0\//g, "/" + itemId + "/").replace(/\/0$/, "/" + itemId);
                link.attr("href", href);
            };

            if (link.attr("data-place-id")) {
                link.attr("data-place-id", itemId);
            }

            if (link.attr("data-item-id")) {
                link.attr("data-item-id", itemId);
            }

            //Only show "Run Ad" link if Ad can be run
            if (rowTable.data("runnable") === "False" && link.data("ad-activate-link") === "Run") {
                link.hide();
            } else if (rowTable.data("runnable") === "True" && link.data("ad-activate-link") === "Run") {
                link.show();
            }

            // Native ads links here.
            if (gearButton.data("is-sponsored-game")) {
                link.data("parent-sponsored-game-element", gearButton.parents(".sponsored-game")); // This is a hack, but so is this page.
                if (link.hasClass("dropdown-item-run-sponsored-game")) {
                    link.toggle(gearButton.data("show-run"));
                }

                if (link.hasClass("dropdown-item-stop-sponsored-game")) {
                    link.toggle(gearButton.data("show-stop"));
                }
            }

            if (link.data("href-reference")) {
                link.attr("href", rowTable.data(link.data("href-reference")));
            }

            if (link.hasClass("shutdown-all-servers-button")) {
                if (rowTable.data("type") == "universes") {
                    link.attr("data-universe-id", itemId).removeAttr("data-place-id");
                } else {
                    link.attr("data-place-id", itemId).removeAttr("data-universe-id");
                }
            }

            var rootPlaceId = rowTable.data("rootplace-id")
            if (link.data("require-root-place") && !rootPlaceId) {
                link.hide();
            } else if (link.data("require-root-place") && rootPlaceId) {
                link.show();

                if (link.data("configure-place-template")) {
                    link.attr("href", link.data("configure-place-template").replace(/\/\d+\//, "/" + rootPlaceId + "/"));
                }
            }

            // Hide Advertise if it's not moderation approved.
            if (isAdvertiseLink && !isModerationApproved) {
                link.hide();
            } else if (isAdvertiseLink && isModerationApproved) {
                link.show();
            }
        });

        // send an event to Event Stream when configure localization link is clicked.
        $("#configure-localization-link").click(function () {
            if (Roblox && Roblox.EventStream) {
                Roblox.EventStream.SendEventWithTarget("formInteraction", "Create", { universeId: itemId }, Roblox.EventStream.TargetTypes.WWW);
            }
        });

        var dropDownOffset = dropdown.parent().offset();
        var dropDownWidth = dropdown.outerWidth();
        // position the drop down menu and show it
        var pos = gearButton.offset();
        dropdown.css({
            top: ((pos.top - dropDownOffset.top + 21) + gearButton.outerHeight() + 9) + "px",
            left: ((pos.left - dropDownOffset.left + 15) - dropDownWidth + gearButton.outerWidth()) + "px"
        }).show();

        //change the gear-button-wrapper
        gearButton.parent().css({ 'background-color': '#EFEFEF', 'border-color': 'gray', 'z-index': 999 });

        event.preventDefault();
        return false;
    }

    $("#MyCreationsTab").on("click", "a.gear-button", function (event) {
        return gearButtonEventHandler.apply(this, [event, itemDropDown]);
    });

    $("#GroupCreationsTab").on("click", "a.gear-button", function (event) {
        return gearButtonEventHandler.apply(this, [event, groupsItemDropDown]);
    });

    $("#MyCreationsTab").on("click", "#build-new-button", function (event) {
        return buildNewButtonEventHandler.apply(this, [event, buildNewDropDown]);
    });

    // hide all drop down menus
    $(document).click(function () {
        hideGameDropDown();
		hideBuildNewDropDown();
    });

    // hide game drop down menu when user resizes the window to prevent it from floating out
    $(window).resize(hideGameDropDown);

    //Ads Page
    function processAdBuyPurchase(currentAdId, bidAmt, confirmPurchase, useGroupFundsChk, amountHtml) {
        hideGameDropDown();
        var reqData = { adid: currentAdId, bidAmount: bidAmt, confirmed: confirmPurchase, useGroupFunds: useGroupFundsChk };
        var url = '/user-sponsorship/processadpurchase';
        $.post(url, reqData, function (data) {
            if (data.success) {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.purchaseComplete,
                    bodyContent: Roblox.BuildPage.Resources.youHaveBid + amountHtml + bidAmt + "</span> .",
                    acceptText: Roblox.BuildPage.Resources.ok,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.none,
                    onAccept: function () { window.location.reload(); },
                    allowHtmlContentInBody: true,
                    dismissable: true
                });
            } else if (data.requireConfirmation) {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.confirmBid,
                    bodyContent: data.error,
                    acceptText: Roblox.BuildPage.Resources.placeBid,
                    declineText: Roblox.BuildPage.Resources.cancel,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.gray,
                    onAccept: function () { processAdBuyPurchase(currentAdId, bidAmt, true, useGroupFundsChk, amountHtml); },
                    allowHtmlContentInBody: true,
                    dismissable: true
                });
            } else {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.errorOccurred,
                    bodyContent: data.error,
                    acceptText: Roblox.BuildPage.Resources.ok,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.none,
                    allowHtmlContentInBody: true,
                    dismissable: true
                });
            }
        });
    }

    function deleteAd(adId) {
        hideGameDropDown();
        var reqData = { adid: adId };
        var url = '/user-sponsorship/deletead';
        $.post(url, reqData, function (data) {
            if (data.success) {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.adDeleted,
                    bodyContent: Roblox.BuildPage.Resources.theAdWasDeleted,
                    acceptText: Roblox.BuildPage.Resources.ok,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.none,
                    onAccept: function () { window.location.reload(); },
                    allowHtmlContentInBody: true,
                    dismissable: true
                });
            } else {
                Roblox.GenericConfirmation.open({
                    titleText: Roblox.BuildPage.Resources.errorOccurred,
                    bodyContent: data.error,
                    acceptText: Roblox.BuildPage.Resources.ok,
                    acceptColor: Roblox.GenericConfirmation.blue,
                    declineColor: Roblox.GenericConfirmation.none,
                    allowHtmlContentInBody: true,
                    dismissable: true
                });
            }
        });
    }

    function displayBuyAdBox(tbl) {
        hideGameDropDown();
        var bidNowRow = tbl.find("tr.bid-now-row");
        var isRunnnable = tbl.find("a[data-ad-status-toggle]").hasClass("runnable");
        if (isRunnnable) {
            bidNowRow.show();
        }
        return false;
    }

    $("input[data-bid-now-amount]").filter_input({ regex: "[0-9]" });
    $(".items-container").on('click', "a.runnable[data-ad-status-toggle]", function () {
        var tbl = $(this).closest("table.item-table");
        displayBuyAdBox(tbl);
        return false;
    });
    $("a[data-ad-activate-link]").click(function () {
        var tbl = $(activeGameDropDown).closest("table.item-table");
        displayBuyAdBox(tbl);
        return false;
    });
    $("a[data-ad-remove-link]").click(function () {
        var tbl = $(activeGameDropDown).closest("table.item-table");
        var adId = tbl.data('item-id');
        Roblox.GenericConfirmation.open({
            titleText: Roblox.BuildPage.Resources.confirmDelete,
            bodyContent: Roblox.BuildPage.Resources.areYouSureDelete,
            acceptText: Roblox.BuildPage.Resources.ok,
            declineText: Roblox.BuildPage.Resources.cancel,
            acceptColor: Roblox.GenericConfirmation.blue,
            declineColor: Roblox.GenericConfirmation.gray,
            onAccept: function () { deleteAd(adId); },
            allowHtmlContentInBody: false,
            dismissable: true
        });
        return false;
    });
    $(".items-container").on('click', "a.cancel-ad-buy", function () {
        var tbl = $(this).closest("table.item-table");
        var bidNowRow = tbl.find("tr.bid-now-row");
        var bidnowTxt = tbl.find("input[data-bid-now-amount]");
        bidnowTxt.val("");
        bidNowRow.hide();
        return false;
    });

    $(".items-container").on('click', "a.process-ad-buy", function () {
        var tbl = $(this).closest("table.item-table");
        var bidnowTxt = tbl.find("input[data-bid-now-amount]");
        var dataHolder = $("#dataHolder");
        var minRobuxBid = dataHolder.data("minrobuxbid");
        var bidAmount = bidnowTxt.val();
        var adId = tbl.data('item-id');
        var useGroupFundsChk = tbl.find("input[data-use-group-funds]").is(':checked');
        var isNewRobuxIconEnabled = dataHolder.data("new-robux-icon");
        var amountHtml = isNewRobuxIconEnabled === "True"?
                        "<span class='icon-robux-16x16'></span><span>" :
                        "<span class='currency CurrencyColor1'>";

        if (bidAmount < minRobuxBid || isNaN(bidAmount)) {
            Roblox.GenericConfirmation.open({
                titleText: Roblox.BuildPage.Resources.yourRejected,
                bodyContent: Roblox.BuildPage.Resources.bidRange2 + amountHtml + minRobuxBid + "</span>.",
                acceptText: Roblox.BuildPage.Resources.ok,
                acceptColor: Roblox.GenericConfirmation.blue,
                declineColor: Roblox.GenericConfirmation.none,
                allowHtmlContentInBody: true,
                dismissable: true
            });
            return false;
        }
        var costPerImpression = tbl.data('cost-per-impression');
        var impressionToolTip = '<img class="tooltip-bottom"  src="' + Roblox.BuildPage.Resources.questionmarkImgUrl + '" alt="Help" title="' + Roblox.BuildPage.Resources.estimatorExplanation + '"/>';
        var impressionContainer = '';
        if (costPerImpression != '') {
            impressionContainer = "<br />" + Roblox.BuildPage.Resources.estimatedImpressions + impressionToolTip + ": " + Math.round(bidAmount / costPerImpression);
        }

        Roblox.GenericConfirmation.open({
            //<sl:translate>
            titleText: Roblox.BuildPage.Resources.makeAdBid,
            bodyContent: Roblox.BuildPage.Resources.wouldYouLikeToBid + amountHtml + bidAmount + "</span> ?" + impressionContainer,
            acceptText: Roblox.BuildPage.Resources.placeBid,
            declineText: Roblox.BuildPage.Resources.cancel,
            //</sl:translate>
            acceptColor: Roblox.GenericConfirmation.blue,
            declineColor: Roblox.GenericConfirmation.gray,
            onAccept: function () { processAdBuyPurchase(adId, bidAmount, false, useGroupFundsChk, amountHtml); },
            onDecline: "",
            allowHtmlContentInBody: true,
            dismissable: true
        });
        return false;
    });

    $("#MyCreationsTab .items-container").on("click", ".load-more-ads", function () {
        var moreLink = $(this);
        var $pageContextContainer = $("#MyCreationsTab");
        var nextStartRow = moreLink.attr("data-next-start");
        var url = "/build/ads?startRow=" + nextStartRow;
        loadNextPage(moreLink, url, $pageContextContainer);
        return false;
    });
    $("#GroupCreationsTab .items-container").on("click", ".load-more-ads", function () {
        var moreLink = $(this);
        var $pageContextContainer = $("#GroupCreationsTab");
        var nextStartRow = moreLink.attr("data-next-start");
        var groupId = $pageContextContainer.find(".BuildPageContent").data("groupid");
        var url = "/build/ads?startRow=" + nextStartRow + "&groupId=" + groupId;
        loadNextPage(moreLink, url, $pageContextContainer);
        return false;
    });
    $('a.item-image.ad-image').click(function () {
        var tbl = $(this).closest('table.item-table');
        var imgId = tbl.data('item-id');
        var url = '/user-sponsorship/getadimage?adId=' + imgId;
        $.ajax({
            url: url,
            success: function (data) {
                $("#AdPreviewContainer").html(data);
            },
            cache: false
        });
        $("span[data-retry-url]").loadRobloxThumbnails();
        var bannerPosition = ['30%', '30%'], skyscraperPosition = ['10%', '45%'], boxPosition = ['30%', '40%'];
        var adType = tbl.data('ad-type');
        var adPosition = ['10%', '30%'];
        switch (adType) {
            case "Banner":
                adPosition = bannerPosition;
                break;
            case "Box":
                adPosition = boxPosition;
                break;
            case "Skyscraper":
                adPosition = skyscraperPosition;
                break;
        }
        $("#AdPreviewModal").modal({ overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000" }, position: adPosition });
        return false;
    });


    // Save the original query params to preserve them, when switching between tabs they got lost and things get ugly.
    var originalQueryParams = window.location.search;
    $("#GroupCreationsTab .groups-dropdown-container").on("change", "select", function () {
        var groupId = $(this).val();
        var url = $("#GroupCreationsTab .groups-dropdown-container").data("get-url");
        window.location = url + "/" + groupId + originalQueryParams;
    });
});