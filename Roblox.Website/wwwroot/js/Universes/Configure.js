
$(function () {
    function makeTabActive(tab) {
        hideAllTabsAndUpdateNav(tab);
        var mainDiv = tab.data('maindiv');
        $("#" + mainDiv).show();
        $.address.hash(mainDiv);
    }

    $(".verticaltab").click(function () {
        makeTabActive($(this));
        // Don't change navigation address, the address is manipulated makeTabActive
        return false;
    });

    var originalAvatarType = $("#UniverseAvatarType:checked").attr('value');


    $(document).ready(function () {
        $(".gameavatartype:checked").click();
    });

    $("#okButton").click(function () {
        saveUniverseConfigurationChanges();
    });

    function saveUniverseConfigurationChanges() {
        var name = $("#Name").val().trim();
        $(".name-error").hide();
        if (name == '') {
            $(".name-error").show();
            return;
        }
        $("#configureUniverseForm").submit();
        showProcessingModal();
    }

    function showProcessingModal() {
        var modalProperties = { overlayClose: false, opacity: 80, overlayCss: { backgroundColor: "#000" }, escClose: false };
        if (typeof closeClass !== "undefined" && closeClass !== "") {
            $.modal.close("." + closeClass);
        }
        $("#ProcessingView").modal(modalProperties);
    }

    function hideAllTabsAndUpdateNav(currentElement) {
        $(".configure-tab").hide();
        $("#navbar div.selected").removeClass('selected');
        currentElement.addClass("selected");
    }

    $("#universe-configure").on("click", ".add-place-button", function () {
        var selector = this;
        Roblox.PlaceSelector.Open(function (placeId) {
            var url = $("#universe-configure").data('addplaceurl');
            doAddOrRemove(selector, placeId, url);
        });
    });

    $("#universe-configure").on("click", ".remove-place-button", function () {
        var placeId = $(this).data('placeid');
        var url = $("#universe-configure").data('removeplaceurl');
        doAddOrRemove(this, placeId, url);
    });

    function doAddOrRemove(element, placeId, url) {
        $("#universe-error").hide();
        $(element).toggle();
        $(element).next('.loading-button').toggle();
        var universeId = $("#universe-configure").data('universeid');
        var req = { placeId: placeId, universeId: universeId };
        var configureplaceurl = $("#universe-configure").data('configureplaceurl');
        $.post(url, req, function (data) {
            if (data.success) {
                $.ajax({
                    url: configureplaceurl,
                    data: req,
                    success: function (resp) {
                        $("#places").html(resp);
                    },
                    cache: false
                });
            } else {
                $(element).toggle();
                $(element).next('.loading-button').toggle();
                $("#universe-error").text(data.message);
                $("#universe-error").show();
            }
        });
        $("[data-retry-url]").loadRobloxThumbnails();
        $('.tooltip-top').tipsy({ gravity: 's' });
    }

    $("#universe-configure").on("click", ".load-more-places-button", function () {
        var moreLinkContainer = $(this).parent();
        var container = moreLinkContainer.parent();
        var rowsDisplayed = container.find(".universe-place-container").length;
        var universeId = $("#current-places").data('universeid');
        var isUniverseCreation = container.data('isuniversecreation');
        var req = { startRow: rowsDisplayed, universeId: universeId, isUniverseCreation: isUniverseCreation };
        var url = $("#universe-configure").data('loadmoreplacesurl');
        $.ajax({
            url: url,
            cache: false,
            data: req,
            dataType: "html",
            success: function (html) {
                moreLinkContainer.remove();
                var appendedHtml = $(html);
                appendedHtml.hide().appendTo(container).fadeIn(); //slow fade in
                $("[data-retry-url]").loadRobloxThumbnails();
            }
        });
        return false;
    });
    $("[data-retry-url]").loadRobloxThumbnails();

    function checkForTabFromAddressHash() {
        var tabName = $.address.hash(); //Write it so it's easier to debug. It gets minified anyway
        tabName = tabName.replace('/', '').escapeHTML();
        if (tabName.length == 0) {
            tabName = "basicSettings";
        }
        var tab = $('[data-maindiv="' + tabName + '"]');
        if (tab.length > 0) {
            makeTabActive(tab);
        }
    }

    checkForTabFromAddressHash();
    $.address.externalChange(checkForTabFromAddressHash);
});