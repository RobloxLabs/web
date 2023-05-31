var Roblox = Roblox || {};
Roblox.IDE = Roblox.IDE || {};

Roblox.IDE.Update = (function () {
    var buttonEnabledClass = "btn-neutral";
    var buttonDisabledClass = "btn-disabled-neutral";

    function isExistingPlace() {
        return $("#navbar").data("is-update");
    }

    function verifyAllowCopyingChangeWasIntentional(success) {
        Roblox.Dialog.open({
            titleText: Roblox.IDE.Resources.AllowCopyingTitleText,
            bodyContent: Roblox.IDE.Resources.AllowCopyingTitleContent,
            acceptText: Roblox.IDE.Resources.AllowCopyingAcceptText,
            declineText: Roblox.IDE.Resources.AllowCopyingCancelText,
            imageUrl: "/images/Icons/img-alert.png",
            onAccept: success
        });
    }

    function verifyDisablingPrivateServersWasIntentional(success) {
        Roblox.Dialog.open({
            titleText: Roblox.IDE.Resources.DisableVIPServersWarningTitleText,
            bodyContent: Roblox.IDE.Resources.DisableVIPServersWarningBodyContent,
            acceptText: Roblox.IDE.Resources.DisableVIPServersWarningAcceptText,
            declineText: Roblox.IDE.Resources.DisableVIPServersWarningCancelText,
            imageUrl: "/images/Icons/img-alert.png",
            onAccept: success
        });
    }

    function submitForm() {
        var button = $("#okButton");
        $('form#placeForm').submit();
        button.addClass(buttonDisabledClass);
        button.prop("disabled", true);
        showProcessingModal();
    }

    function hideAllTabsAndUpdateNav(currentElement) {
        $('#playerAccess').hide();
        $('#permissions').hide();
        $('#basicSettings').hide();
        $('#icons').hide();
        $('#thumbnails').hide();
        $('#versionHistory').hide();
        $('#developerProducts').hide();
        $('#universe').hide();
        $("#navbar div.selected").removeClass('selected');
        $('div.actionButtons').show();
        currentElement.addClass("selected");
    }

    function showProcessingModal(closeClass) {
        var modalProperties = {
            overlayClose: false, opacity: 80, overlayCss: {
                backgroundColor: "#000"
            }, escClose: false
        };

        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }

        $("#ProcessingView").modal(modalProperties);
    };

    function init() {
        var allowCopyingCheckBox = $("#copyLock input");
        var wasCopyingAllowedOnPageLoad = allowCopyingCheckBox.prop("checked");
        var allowPrivateServersCheckbox = $("#AllowPrivateServersCheckbox");
        var werePrivateServersAllowedOnPageLoad = allowPrivateServersCheckbox.prop("checked");
        var nameInput = $("input#Name");
        var saveButton = $("#okButton");
        var inputValidator = Roblox.IDE.validator({
            button: saveButton,
            enabledClass: buttonEnabledClass,
            disabledClass: buttonDisabledClass
        }, [
                {
                    input: nameInput,
                    errorSpan: $("#nameRow span")
                }
            ], true);

        function wasPlaceChangedToAllowCopying() {
            var isCopyingAllowedNow = allowCopyingCheckBox.prop("checked");
            return (!wasCopyingAllowedOnPageLoad && isCopyingAllowedNow);
        }

        function werePrivateServersDisabled() {
            var arePrivateServersAllowedNow = allowPrivateServersCheckbox.prop("checked");
            return (werePrivateServersAllowedOnPageLoad && !arePrivateServersAllowedNow);
        }

        function onSaveClickHandlePrivateServers() {
            if (isExistingPlace && werePrivateServersDisabled()) {
                verifyDisablingPrivateServersWasIntentional(function () { submitForm(); });
            } else {
                submitForm();
            }

            return false;
        }

        function onSaveClick() {
            if (saveButton.hasClass(buttonDisabledClass)) {
                return false;
            }
            if (isExistingPlace && wasPlaceChangedToAllowCopying()) {
                verifyAllowCopyingChangeWasIntentional(function () { onSaveClickHandlePrivateServers(); });
                return false;
            }

            return onSaveClickHandlePrivateServers();
        }

        saveButton.click(onSaveClick);

        $('#cancelButton').click(function () {
            document.location = $(this).attr('href');
        });

        $('#permissionsTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#permissions').show();
        });

        $('#playerAccessTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#playerAccess').show();
            if ($('#GamePlaceAccess').is(':visible')) {
                Roblox.PlayerAccess.initializeChosen(); //this function is defined in Access.js
                Roblox.PlayerAccess.checkSaleOptions(); //this function is defined in Access.js
            }
        });

        $('#basicSettingsTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#basicSettings').show();
        });

        $('#iconsTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#icons').show();
        });

        $('#thumbnailTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#thumbnails').show();
        });

        $('#versionHistoryTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#versionHistory').show();
        });

        $('#developerProductsTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            var $developerProductsSection = $('#developerProducts');
            if ($developerProductsSection.attr('loaded')) {
                $developerProductsSection.trigger('onRefreshed', []);
            } else {
                $developerProductsSection.attr('loaded', true);
            }
            $developerProductsSection.show();
            $('div.actionButtons').show();
            $developerProductsSection.off('onViewChange').on('onViewChange', function (view, data) {
                if (data === 'listing') {
                    $('div.actionButtons').show();
                } else {
                    $('div.actionButtons').hide();
                }
            });
        });

        $('#universeTab').click(function () {
            hideAllTabsAndUpdateNav($(this));
            $('#universe').show();
        });

        inputValidator.init();

        //go to the Basic Settings Tab if there was an error in form submission
        if ($('div.validation-summary-errors').attr('data-valmsg-summary') === 'true') {
            $('#basicSettings').show();
            $('#playerAccess').hide();
            $('#permissions').hide();
            $("#navbar div.selected").removeClass('selected');
            $('#basicSettingsTab').addClass("selected");
        }

        $("#versionHistoryItems").on("click", ".previous", function (e) {
            if (this.className.indexOf("disabled") >= 0) return false;
            changeVersionHistoryPage(parseInt($(".robloxVersionHistoryPageNum").text()) - 1);
        });

        $("#versionHistoryItems").on("click", ".next", function (e) {
            if (this.className.indexOf("disabled") >= 0) return false;
            changeVersionHistoryPage(parseInt($(".robloxVersionHistoryPageNum").text()) + 1);
        });

        $("#versionHistoryItems").on("click", ".revertLink", function (e) {
            var assetVersionId = $(this).data("asset-version-id");
            Roblox.Dialog.open({
                titleText: Roblox.IDE.Resources.RevertTitleText,
                bodyContent: Roblox.IDE.Resources.RevertBodyContent,
                acceptText: Roblox.IDE.Resources.RevertAcceptText,
                declineText: Roblox.IDE.Resources.CancelText,
                onAccept: function () {
                    $("#versionHistoryItems").html("");
                    $("#versionHistoryLoading").show();
                    $.ajax({
                        url: $("#versionHistoryItems").data("revert-url"),
                        type: "POST",
                        cache: false,
                        data: {
                            assetVersionID: assetVersionId
                        },
                        success: function () {
                            changeVersionHistoryPage(1);
                        },
                        error: function () {
                            $("#versionHistoryLoading").hide();
                            $("#versionHistoryRevertError").show();
                        }
                    });
                }
            });
        });

        function changeVersionHistoryPage(pageNum) {
            var assetId = $("#versionHistoryItems").data("asset-id");
            $("#versionHistoryItems").html("");
            $("#versionHistoryLoading").show();

            $.ajax({
                url: $("#versionHistoryItems").data("version-history-items-url"),
                cache: false,
                data: { assetID: assetId, page: pageNum },
                success: function (data) {
                    $("#versionHistoryLoading").hide();
                    $("#versionHistoryItems").html(data);
                },
                error: function () {
                    $("#versionHistoryLoading").hide();
                    $("#versionHistoryError").show();
                }
            });
        }
    }

    $(init);

    return {};
})();
