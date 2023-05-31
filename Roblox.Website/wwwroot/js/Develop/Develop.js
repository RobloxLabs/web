var Roblox = Roblox || {};

Roblox.DevelopPage = function () {
	var ignoreUrlChange = false, doNotUpdateHistory = false, isFirstTimeLoadingLibrary = false;
	var $libraryTabContentElement, $libraryTabLinkElement, $groupCreationsTabLinkElement, $myreationsTabLinkElement;
	var libraryTabLinkUrl, libraryTabLinkID, libraryTabQueryParams, groupCreationsTabLink, myCreationsTabLink;
	var badgeAssetTypeId = 21;
	var gamePassAssetTypeId = 34;

	$(function () {
		$groupCreationsTabLinkElement = $("#GroupCreationsTabLink");
		$myreationsTabLinkElement = $("#MyCreationsTabLink");
		$libraryTabLinkElement = $("#LibraryTabLink");
		$libraryTabContentElement = $("#LibraryTab");
		groupCreationsTabLink = $groupCreationsTabLinkElement.data("url");
		myCreationsTabLink = $myreationsTabLinkElement.data("url");
		libraryTabLinkUrl = $libraryTabLinkElement.data("url");
		libraryTabLinkID = $libraryTabLinkElement.attr("id");

		// Update history so that it knows which tab we started on.
		var $activeTabLink = $("#DevelopTabs .tab-active");
		ignoreUrlChange = true;
		var url = document.URL.indexOf("#") === -1 ? document.URL : document.URL.split('#')[1];
		History.replaceState({ clickTargetID: $activeTabLink.attr("id"), url: document.URL }, document.title, url);
		ignoreUrlChange = false;

		// Load the library tab contents if that's the starting tab.
		if (document.URL.indexOf(libraryTabLinkUrl) !== -1) {
			libraryTabQueryParams = document.URL.split('?')[1];
			var hasCatalogContextParam = libraryTabQueryParams && libraryTabQueryParams.includes("CatalogContext=");
			var hasCategoryParam = libraryTabQueryParams && libraryTabQueryParams.includes("Category=");

			// Either use the params we've been given...
			if (libraryTabQueryParams && Roblox.CatalogValues && Roblox.CatalogValues.CatalogContentsUrl && hasCatalogContextParam && hasCategoryParam) {
				Roblox.CatalogShared.LoadCatalogAjax(Roblox.CatalogValues.CatalogContentsUrl + '?' + libraryTabQueryParams, null, $libraryTabContentElement, true);
			}
			// ... or the defaults for the library.
			else {
				isFirstTimeLoadingLibrary = true;
				Roblox.CatalogShared.LoadCatalogAjax($libraryTabLinkElement.data("library-get-url"), null, $libraryTabContentElement, false, true);
			}
		}

		/* -------------------- Hook up handlers -------------------- */

		History.Adapter.bind(window, "statechange", function () {
			handleURLChange(History.getState().data);
		});
		$("#DevelopTabs").on("tabsactivate", function () {
			handleTabChange($(this).find(".tab-active"));
		});
		$libraryTabContentElement.on(Roblox.CatalogShared.CatalogLoadedViaAjaxEventName, null, null, Roblox.CatalogShared.handleCatalogLoadedViaAjaxEvent);

		/* -------------------- Develop Experimental Mode -------------------- */
		$('.develop-experimental-label').click(function () {
			var wikiUrl = $(".develop-experimental-label").data("learn-more-url");
			Roblox.Dialog.open({
				titleText: "Experimental Mode Games",
				bodyContent: "Experimental mode games are games made by new developers. These games may not be stable and unexpected things could happen here.<br/><a class='text-link' target='_blank' href='" + wikiUrl + "'>Learn more from Wiki</a>",
				showAccept: false,
				declineText: "OK",
				allowHtmlContentInBody: true,
				xToCancel: true
			});
		});

	});


	/* -------------------- History & URL -------------------- */

	/* Gets called when we intentionally change the URL and when user navigates through history.
	* We only care about history-related changes. */
	function handleURLChange(state) {
		if (!ignoreUrlChange && state.clickTargetID) {
			doNotUpdateHistory = true;

			// If we're already on the library tab, then we need to do an AJAX call...
			if (state.clickTargetID === "catalog" || state.clickTargetID === libraryTabLinkID) { //&& state.url
				if (!$libraryTabLinkElement.hasClass("tab-active")) {
					//$libraryTabLinkElement.click();
					$("div.tab-active").removeClass("tab-active");
					$libraryTabLinkElement.addClass("tab-active");
					$libraryTabContentElement.addClass("tab-active");
				}

				if (Roblox.CatalogShared) {
					Roblox.CatalogShared.handleURLChange(state);
				}
			} else {
				$("#" + state.clickTargetID).click();
			}

			doNotUpdateHistory = false;
		}
	}


	/* -------------------- Handlers -------------------- */

	function handleTabChange($targetTabLink) {
		var targetTabUrl = $targetTabLink.data("url");
		var historyUrl = targetTabUrl;
		var clickTarget = $targetTabLink.attr("id");

		var isGroupContext = targetTabUrl === groupCreationsTabLink;
		if (targetTabUrl === libraryTabLinkUrl) {
			clickTarget = "catalog";
			if ($("#LibraryTab #catalog").length == 0) {
				isFirstTimeLoadingLibrary = true;
				Roblox.CatalogShared.LoadCatalogAjax($targetTabLink.data("library-get-url"), null, $libraryTabContentElement, false, true);
			}
			else if (libraryTabQueryParams) {
				historyUrl += '?' + libraryTabQueryParams;
			} else {
				var params = $('#LibraryTabLink').data('query-params');
				if (params) {
					historyUrl += '?' + params;
				}
			}
		} else if (isGroupContext || targetTabUrl === myCreationsTabLink) {
			var assetTypeId = parseInt($("#assetTypeId").val());
			var contentArea = $(isGroupContext ? "#GroupCreationsTab" : "#MyCreationsTab");
			if (assetTypeId === badgeAssetTypeId) {
				Roblox.BuildPage.ItemLoader.loadBadges(contentArea, "");
			} else if (assetTypeId === gamePassAssetTypeId) {
				Roblox.BuildPage.ItemLoader.loadGamePasses(contentArea, 0);
			}
		}

		if (!doNotUpdateHistory) {  // If we're here because of a history change, it means history already knows about this transition.
			ignoreUrlChange = true;
			historyUrl = historyUrl.indexOf("#") === -1 ? historyUrl : historyUrl.split('#')[1];
			History.pushState({ clickTargetID: clickTarget }, document.title, historyUrl);
			ignoreUrlChange = false;
        }

        if (Roblox.EventStream) {
            Roblox.EventStream.SendEvent("tabClick", targetTabUrl, {});
        }
	}
}();
