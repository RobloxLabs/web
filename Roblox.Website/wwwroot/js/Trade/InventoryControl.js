var Roblox = Roblox || {};
Roblox.InventoryControl = (function () {
    var availablePageSizes = [10, 25, 50, 100];
    function getLoadPageSize(pageSize) {
        for (var n = availablePageSizes.length - 1; n > 0; n--) {
            if (pageSize > availablePageSizes[n - 1]) {
                return availablePageSizes[n];
            }
        }
        return availablePageSizes[0];
    }


    return function (elementId, assetTypeId, pageSize) {
        var container = $("#" + elementId);
        var errorElement = $(".ErrorText");
        var template = container.find(".InventoryItemTemplate > .InventoryItemContainerOuter");
        var pager;
        var membershipLabels = [
            null,
            container.data("bc-label"),
            container.data("tbc-label"),
            container.data("obc-label")
        ];


        function updatePager() {
            container.find(".paging_next").toggleClass("disabled", !pager.canLoadNextPage());
            container.find(".paging_previous").toggleClass("disabled", !pager.canLoadPreviousPage());
            container.find(".InventoryDropDownContainer").prop("disabled", pager.isBusy());
            container.find(".paging_currentpage").text(pager.getCurrentPageNumber());
            if (container.find(".noItems").is(":hidden")) {
                container.find(".PagingContainerDivTop").show();
            } else {
                container.find(".PagingContainerDivTop").hide();
            }
        }

        pager = Roblox.CursorPagination.createPager({
            pageSize: pageSize,
            loadPageSize: getLoadPageSize(pageSize),

            getRequestUrl: function () {
                return container.data("collectibles-url");
            },

            getCacheKeyParameters: function(pageParameters) {
                return {
                    assetType: pageParameters.assetType
                };
            },

            
            loadSuccess: function (data) {
                // This whole process is just very sad.
                container.find(".InventoryHandle").html("");
                container.removeData();
                if (data.length > 0) {
                    container.find(".noItems").hide();
                    data.forEach(function (item) {
                        var element = template.clone();
                        var tradeWindowItem = new Roblox.InventoryItem(element);
                        // The trade window expects all collectible userasset models to be the same.
                        var mockItem = {
                            UserAssetID: item.userAssetId.toString(),
                            Name: item.name,
                            ItemLink: Roblox.Endpoints.getCatalogItemUrl(item.assetId, item.name),
                            ImageLink: Roblox.Endpoints.getAbsoluteUrl("/asset-thumbnail/image?assetId=" + item.assetId + "&height=110&width=110"),
                            AveragePrice: item.recentAveragePrice || "---",
                            OriginalPrice: item.originalPrice || "---",
                            SerialNumber: item.serialNumber || "---",
                            SerialNumberTotal: item.assetStock || "---",
                            MembershipLevel: membershipLabels[item.buildersClubMembershipType]
                        };
                        container.data(item.userAssetId.toString(), mockItem);
                        tradeWindowItem.display(mockItem);
                        element.attr("userassetid", item.userAssetId);
                        element.find('[fieldname = "InventoryItemSize"]').attr("class", tradeWindowItem.largeClassName);
                        container.find(".InventoryHandle").append(element.fadeIn());
                    });
                } else {
                    container.find(".noItems").show();
                }
                updatePager();
                $(document).trigger("InventoryUpdate", elementId);
            },

            loadError: function () {
                errorElement.text("Error processing request!");
            }
        });
        pager.setPagingParameter("assetType", assetTypeId);
        pager.setPagingParameter("sortOrder", "Desc");

        pager.setAssetType = function (assetType) {
            pager.setPagingParameter("assetType", assetType);
        };


        $(function () {
            container.find(".paging_previous").click(function () {
                if (pager.canLoadPreviousPage()) {
                    pager.loadPreviousPage();
                    updatePager();
                }
            });

            container.find(".paging_next").click(function () {
                if (pager.canLoadNextPage()) {
                    pager.loadNextPage();
                    updatePager();
                }
            });

            container.find(".CategoryDropDown").change(function () {
                pager.setAssetType($(this).val());
                pager.loadFirstPage();
                updatePager();
            });

            pager.loadFirstPage();
            updatePager();
        });


        return pager;
    };
})();
