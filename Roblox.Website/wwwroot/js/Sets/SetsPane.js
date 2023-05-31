if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.SetsPane = function (BaseUrl, DisplayedUserID) {
    function formatSetObject(obj) {
        var newDiv = $('#SetsPaneItemTemplate').clone().removeAttr('id').addClass('TiledSets').show();
        for (var property in obj) {
            if (typeof (obj[property]) === "string") {
                obj[property] = obj[property].escapeHTML();
            }
            newDiv.html(newDiv.html().replace("$" + property, obj[property]));
        }
        newDiv.html(newDiv.html().replace("$BaseUrl", BaseUrl));
        return newDiv;
    };
    this.isVisible = function (elem) {
        if (elem.attr("style").toLowerCase().indexOf("display:none") > -1 || elem.attr("style").toLowerCase().indexOf("display: none") > -1) {
            return false;
        }
        return true;
    };
    this.addEllipses = function (setObj) {
        var isSetObj = !(setObj === null || setObj === undefined);
        var setnameelem = $(".TiledSets .AssetName a" + (isSetObj ? ":contains('" + setObj.Name + "')" : ""));
        if (setnameelem != null) {
            setnameelem.each(function () {
                $(this).html(fitStringToWidthSafe($(this).html(), 90));
            });
        }
        var creatornameelem = $(".TiledSets .AssetCreator .Detail a" + (isSetObj ? ":contains('" + setObj.CreatorName + "')" : ""));
        if (creatornameelem != null) {
            creatornameelem.each(function () {
                $(this).html(fitStringToWidthSafe($(this).html(), 55));
            });
        }
    };
    this.getSetsPaged = function (start, maxRows) {
        $.getJSON("/Sets/SetHandler.ashx?rqtype=getsets&maxsets=10&UserID=" + DisplayedUserID,
        function (response) {
            Roblox.OwnedSetsJSDataPager.update({ data: response.slice(start - 1, start - 1 + maxRows), totalItems: response.length }); //sets does not have a paginated data call, but that's what pager uses
        });
    };
    this.getSubscribedSetsPaged = function (start, maxRows) {
        $.getJSON("/Sets/SetHandler.ashx?rqtype=getsubscribedsets&maxsets=10&UserID=" + DisplayedUserID,
        function (response) {
            Roblox.SubscribedSetsJSDataPager.update({ data: response.slice(start - 1, start - 1 + maxRows), totalItems: response.length });
        });
    };
    this.ownedItemFormatter = function (obj) {
        if (typeof (obj) === undefined || obj === null || obj.length === 0) {
            return '<div class="NoSets">This user has no sets.</div>';
        }
        return formatSetObject(obj);
    };
    this.subscribedItemFormatter = function (obj) {
        if (typeof (obj) === undefined || obj === null || obj.length === 0) {
            return '<div class="NoSets">This user is not subscribed to any sets.</div>';
        }
        return formatSetObject(obj);
    };
    this.getSetAssetImageThumbnail = function (setObj) {
        $.get(
            "/Thumbs/RawAsset.ashx?AssetID=" + setObj.ImageAssetID + "&Width=75&Height=75&ImageFormat=png",
            function (data) {
                if (data !== null) {
                    if (data == "PENDING") {
                        $('.AssetThumbnail .' + setObj.ImageAssetID).attr("src", '/images/spinners/spinner16x16.gif');
                        window.setTimeout(function () { Roblox.SetsPaneObject.getSetAssetImageThumbnail(setObj); }, 2000);
                        return;
                    }
                    $('.AssetThumbnail .' + setObj.ImageAssetID).attr("src", data);
                }
            });
        Roblox.SetsPaneObject.addEllipses();
    };
    this.toggleBetweenSetsOwnedSubscribed = function () {
        var ownedSetsElem = $("#OwnedSetsContainerDiv");
        var subscribedSetsElem = $("#SubscribedSetsContainerDiv");

        if (!Roblox.SetsPaneObject.isVisible(subscribedSetsElem)) { //turn subscribed on, turn off owned
            ownedSetsElem.css("display", "none");
            subscribedSetsElem.css("display", "block");
            $('#ToggleBetweenOwnedSubscribedSets').text("View Owned");
            $('#ToggleBetweenOwnedSubscribedSets').append('<span class="btn-text" id="SetsToggleSpan">View Owned</span>');
        } else {
            subscribedSetsElem.css("display", "none");
            ownedSetsElem.css("display", "block");
            $('#ToggleBetweenOwnedSubscribedSets').text("View Subscribed");
            $('#ToggleBetweenOwnedSubscribedSets').append('<span class="btn-text" id="SetsToggleSpan">View Subscribed</span>');
        }
        Roblox.SetsPaneObject.addEllipses();
    };

    return this;
};