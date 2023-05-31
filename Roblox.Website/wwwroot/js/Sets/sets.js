var MySetView = 0;
var SubscribedSetView = 1;
var GuestSetView = 2;

var currentSetView = MySetView;
var currentSetId = []; // Tab specific current set
var setIdList = new Array();
setIdList[MySetView] = [];
setIdList[SubscribedSetView] = [];
setIdList[GuestSetView] = [];
var currentPage = [];
currentPage[MySetView] = [];
currentPage[SubscribedSetView] = [];
currentPage[GuestSetView] = [];

var totalNumberOfItemsInCurrentSet;
var numItemsShownPerPage = 25;
var numItemsPerRow = 6;
var forceShowSetInfo = true;
var oldOrder = [];
var orderChanged = false;

var setsPager;

$(function () {
    // If they pass in a setid via query string, treat it like a guest/public viewing
    $('#AssetSetItems').sortable();
    var paramSetId = getParameterByName("id");
    if (paramSetId != "") {
        setIdList[GuestSetView][0] = paramSetId;
        ChangeSetView(GuestSetView);
    }
    else {
        // Populate our set list
        $('#MySets_Tab').click(function () {
            if (currentSetView != MySetView) {
                ChangeSetView(MySetView);
            }
        });
        $('#SubscribedSets_Tab').click(function () {
            if (currentSetView != SubscribedSetView) {
                //check currentlysorting
                CurrentlySorting(ChangeSetView, SubscribedSetView);
            }
        });
        var pagerProperties = {
            'windowDisplay': 10,
            'pageShift': 5,
            'orientation': 'vertical'
        };
        setsPager = new Roblox.CarouselDataPager($('#SetsList'), pagerProperties);
        $('#AssetSetItems').sortable({
            handle: '.handle',
            containment: '#AssetSetItems',
            distance: 1,
            disabled: true,
            cursor: 'move',
            tolerance: 'pointer',
            zIndex: 6100,
            change: function (event, ui) { orderChanged = true; }
        });
        $('.moveItemContainerDiv .dropdown').change(SubmitMoveItem);
        ChangeSetView(currentSetView);
        //in case of errors in creating a set, show in modal

        if (errorOnPage) {
            $('#CreateSetPopupContainerDiv').modal({ appendTo: 'form', escClose: true, opacity: 80, overlayCss: { backgroundColor: '#000' }, position: [120, 0] });
        }
    }

    $('#PagingContainerDivTop').bind('click', Paging_Click);
    $('#PagingContainerDivBottom').bind('click', Paging_Click);
    $('.Paging_Input').bind('keyup', Page_Select);

});

// Array.indexOf( value, begin, strict ) - Return index of the first element that matches value
[ ].indexOf || (Array.prototype.indexOf = function (v) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (Number(this[i]) === Number(v)) { return i; }
    }
    return -1;
});

function LoadSets() {
    // Give it half a second to load the sets.  If it's stalling longer than that, throw up a "Loading..." sign
    window.setTimeout(function () {
        if (!$('#setTabs').is(":visible")) {
            $('#LoadingSets').show();
        }
    }, 1000);


    // Get our sets
    var setRetrievalType = "getsets";
    if (currentSetView == SubscribedSetView)
        setRetrievalType = "getsubscribedsets";

    $.getJSON("/Sets/SetHandler.ashx?rqtype=" + setRetrievalType + "&maxsets=10",
        function (data) {
            $('#LoadingSets').hide();

            // Populate our tabs
            var innerHtml = "";
            if (data.length < 1) {
                if (currentSetView == MySetView) {
                    ToggleViews('HasNoOwnedSetsPanel');
                }
                else if (currentSetView == SubscribedSetView) {
                    ToggleViews('HasNoSubscribedSetsPanel');
                }
            }
            else {
                ToggleViews('HasSetPanel');
                setIdList[currentSetView] = [];
                // Create the set tabs
                for (var i = 0; i < data.length; i++) {
                    var AssetSet = data[i];
                    var id = AssetSet.ID;
                    var name = AssetSet.Name.escapeHTML();
                    setIdList[currentSetView].push(id);
                    currentPage[currentSetView].push(0);
                    if (i < 1) {
                        innerHtml += "<div id=\"setTabsListli" + id + "\" alt=\"" + name + "\" class=\"SetList-Set selected\" onclick=\"CurrentlySorting(PopulateSet," + id + ");\">";
                    }
                    else {
                        innerHtml += "<div id=\"setTabsListli" + id + "\" alt=\"" + name + "\" class=\"SetList-Set\" onclick=\"CurrentlySorting(PopulateSet," + id + ");\">";
                    }
                    innerHtml += "<div class=\"SetList-SetContainer\">" +
                                    "<div class=\"image\"><img id=\"img_" + AssetSet.ImageAssetID + "\" onclick=\"CurrentlySorting(PopulateSet," + id + ");\" /></div>" +
                                    "<div class=\"name\"><a id=\"setTab_" + id + "\" onclick=\"CurrentlySorting(PopulateSet," + id + ");\" >" + name + "</a></div>";

                    innerHtml += "</div><div class=\"clear;\"></div>" +
                                    "<div id=\"setdescription" + id + "\" style=\"display:none;\">" + AssetSet.Description.escapeHTML() + "</div></div>";

                    GetSetAssetImageThumbnail(AssetSet.ImageAssetID, 'img_' + AssetSet.ImageAssetID);
                    //populate move item modal
                    if (currentSetView == MySetView) {
                        $('.moveItemContainerDiv .dropdown').append($('<option></option>').val(id).html(fitStringToWidthSafe(name, 200)));
                    }
                }

                // Populate tabs
                $('#SetsList .content-inner').html(innerHtml);

                //Bind description popup
                for (var i = 0; i < data.length; i++) {
                    $('#setTabsListli' + data[i].ID).tipsy({ fade: true, gravity: 'w', title: 'alt', fallback: 'N/A' });
                }

                var w = $($('.SetList-SetContainer .name')[0]).width();
                $('.SetList-SetContainer .name').each(function () {
                    $(this).text(htmlDecode(fitStringToWidthSafe($(this).text(), w)));
                });
                // Populate first set
                PopulateSet(data[0].ID);
                setsPager.updatePagerContent();
            }
        });
    }
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
function ToggleViews(viewNameToDisplay) {
    $('#HasSetPanel').hide();
    $('#HasNoSubscribedSetsPanel').hide();
    $('#HasNoOwnedSetsPanel').hide();
    $('#' + viewNameToDisplay).show();
    if (viewNameToDisplay == 'HasSetPanel') {
        $('#setTabs').show();
        /*$('#SetNameLong').show();
        $('#SelectedSetDescription').show();
        $('#SetSubscribersOwner').show();*/
        $('.DisplaySetInfo').show();
        $('#SetUrlDiv').show();
    }
    if (viewNameToDisplay == 'HasNoSubscribedSetsPanel' || viewNameToDisplay == 'HasNoOwnedSetsPanel') {
        $('.DisplaySetInfo').hide();
        $('#PagingContainerDivTop').hide();
        $('#PagingContainerDivBottom').hide();
        $('#SetUrlDiv').hide();
        $('#AssetSetItems').html('');
        setsPager.updatePagerContent();
    }
}
function PopulateSet(setId) {
    if (currentSetView != GuestSetView) {
        // Deselect current button
        var prevselected = $("#SetsList").find('.selected');
        prevselected.removeClass('selected');
        var previd = prevselected.attr('id').split('setTabsListli')[1];
        prevselected.tipsy({ fade: true, gravity: 'w', title: 'alt', fallback: 'N/A' });

        // Change to selected button style
        $('#setTabsListli' + setId).attr('class', 'SetList-Set selected');
        $('#setTabsListli' + setId).unbind('mouseenter mouseleave').bind('mouseleave', function () {
            $('.tipsy').css('display', 'none');
        });
        if (currentSetView == MySetView) {
            $('#DeleteUnsubscribe_delete').show();
            $('#DeleteUnsubscribe_unsubscribe').hide();
        }
        else {
            $('#DeleteUnsubscribe_delete').hide();
            $('#DeleteUnsubscribe_unsubscribe').show();
        }
    } else {
        $('.setspage_subscribe_btn').show();
    }

    // set our currentsetid
    currentSetId[currentSetView] = setId;

    // Empty the current items
    $('#AssetSetItems').html("");

    // Throw up a loading symbol if it's been more than half a second
    window.setTimeout(function () {
        if ($('#AssetSetItems').is(':empty')) {
            $('#AssetSetItems').append("<div class='loading' ></div>");
        }
    }, 500);

    LoadAssetSetItems(setId);
    LoadSetInfo(setId);
}
function LoadAssetSetItems(setId) {
    // Make a request to get the setitems for a set
    // Set all of their images to a default one as we asynchronously get the actual thumbnails
    var index = setIdList[currentSetView].indexOf(currentSetId[currentSetView]);
    $.getJSON(
        "/Sets/SetHandler.ashx?rqtype=getsetitems&startRowIndex=" + currentPage[currentSetView][index] * numItemsShownPerPage
        + "&maximumRows=" + numItemsShownPerPage
        + "&setid=" + setId,
        function (objects) {
            if (objects !== null) {
                if (objects.length > 0 && objects[0].error) {
                    //errorCode = parseInt(data.substr(6, 4), 10);
                    // Set mustve been deleted
                    $('#AssetSetItems').html("<span>" + Roblox.Sets.Resources.doesNotExist + "</span>");
                    if (currentSetView == SubscribedSetView) {
                        $('#AssetSetItems').append("<div class='loading'></div>");
                        window.setTimeout(function () { PopulateSetAfterDeletionOrUnSubscribing(setId); }, 3000);
                    }
                }
                else {
                    var imagesHtml = "";
                    if (objects.length < 1) {
                        var html = "<div class='message-container'>" + Roblox.Sets.Resources.noItems;
                        if (currentSetView == MySetView) {
                            html += "<br/><a href='/Catalog/'>" + Roblox.Sets.Resources.addSome + "</a>";
                        }
                        $('#AssetSetItems').html(html + "</div>");
                    }
                    else {
                        for (var i = 0; i < objects.length; i++) {
                            var AssetSetItem = objects[i];
                            var assetVersionId = AssetSetItem.AssetVersionID;
                            var itemname = AssetSetItem.Name.escapeHTML();
                            var assetSetItemID = AssetSetItem.ID;
                            var isNewerVersionAvailable = (AssetSetItem.NewerVersionAvailable == "True");
                            imagesHtml += GenerateAssetSetItemHtml(assetVersionId, itemname, assetSetItemID, isNewerVersionAvailable, AssetSetItem.SortOrder, false, AssetSetItem.AssetID);
                        }
                        imagesHtml += "<div class='clear'></div>";
                        $('#AssetSetItems').html(imagesHtml);
                        applyOptionsDropDownJS('#AssetSetItems');
                    }
                }
            }
        });
    }
    function LoadAssetSetAllItems(setId) {
        $('#AssetSetItems').empty().append('<div class="loading"></div>');
        $('#PagingContainerDivTop').hide();
        $('#PagingContainerDivBottom').hide();
        orderChanged = false;

        if (totalNumberOfItemsInCurrentSet < 1) {
            var html = "<div class='message-container'>" + Roblox.Sets.Resources.noItems;
            if (currentSetView == MySetView) {
                html += "<br/><a href='/Catalog/'>" + Roblox.Sets.Resources.addSome + "</a>";
            }
            $('#AssetSetItems').html(html + "</div>");
            $('#editSetContainerDiv .sort-msg').hide();
            $('#AssetSetItems').sortable('option', 'disabled', false);
            return;
        }
        $('#editSetContainerDiv .sort-msg').show();

        $.getJSON(
                "/Sets/SetHandler.ashx?rqtype=getsetitems&startRowIndex=0&maximumRows=" + totalNumberOfItemsInCurrentSet
                + "&setid=" + setId,
                function (objects) {
                    if (objects !== null) {
                        var imagesHtml = "";
                        $('#AssetSetItems').empty();
                        if (objects.length < 1) {
                            var html = "<div class='message-container'>" + Roblox.Sets.Resources.noItems;
                            if (currentSetView == MySetView) {
                                html += "<br/><a href='/Catalog/'>" + Roblox.Sets.Resources.addSome + "</a>";
                            }
                            $('#AssetSetItems').html(html + "</div>");
                            $('#editSetContainerDiv .sort-msg').hide();
                            $('#AssetSetItems').sortable('option', 'disabled', false);
                        }
                        else {
                            oldOrder = [];
                            for (var i = 0; i < objects.length; i++) {
                                var AssetSetItem = objects[i];
                                var assetVersionId = AssetSetItem.AssetVersionID;
                                var itemname = AssetSetItem.Name.escapeHTML();
                                var assetSetItemID = AssetSetItem.ID;
                                var sortOrder = AssetSetItem.SortOrder;
                                var isNewerVersionAvailable = (AssetSetItem.NewerVersionAvailable == "True");
                                imagesHtml += GenerateAssetSetItemHtml(assetVersionId, itemname, assetSetItemID, isNewerVersionAvailable, sortOrder, true, AssetSetItem.AssetID);
                                oldOrder.push(AssetSetItem.ID);
                            }
                            $('#AssetSetItems').append(imagesHtml);
                            $('#AssetSetItems').append("<div class='clear'></div>");
                            //prevent default image dragging
                            $('#AssetSetItems .item img').mousedown(function (event) { event.preventDefault(); });
                            $('#AssetSetItems').sortable('option', 'disabled', false);
                            applyOptionsDropDownJS('#AssetSetItems');
                        }
                    }
                }
            );
    }
    function LoadSetInfo(setId) {
    $('#SetURL').hide();
    if (setId == undefined) return;
    $.getJSON(
    "/Sets/SetHandler.ashx?rqtype=getsetinfo&setid=" + setId,
    function (object) {

        // Get our JSON response object
        if (object.Error && object.Error.substr(0, 6) == "ERROR_") {
            $('#PrivateSetText').show();
            $('#DeleteUnsubscribe_delete').hide();
            $('.ReportAbuse').hide();
            $('#DeleteUnsubscribe_unsubscribe').hide();
            //errorCode = parseInt(text.substr(6, 4), 10);
        }
        else {
            var assetSet = object[0];
            var user = object[1];
            var numItems = object[2];
            var setName = assetSet.Name.escapeHTML();
            var setDesc = assetSet.Description.escapeHTML();
            var creatorUserId = user.ID;
            var creatorName = user.Name;
            var imageAssetId = assetSet.ImageAssetID;
            totalNumberOfItemsInCurrentSet = numItems.TotalNumAssetsInSet;
            var isSubscribable = assetSet.IsSubscribable;
            var subscriberCount = assetSet.SubscriberCount;
            var created = assetSet.Created;

            if (currentSetView == GuestSetView) {
                var innerHtml = "<div id='setTabsListli" + setId + "' class='SetList-Set selected' onclick='PopulateSet(" + setId + ");'>";
                innerHtml += "<div class='SetList-SetContainer'>" +
                                    "<div class='image'><img id='img_" + assetSet.ImageAssetID + "' onclick='PopulateSet(" + setId + ");' /></div>" +
                                    "<div class='name'><a id='setTab_" + setId + "' onclick='PopulateSet(" + setId + ");' >" + setName + "</a></div>" +
                                "</div><div class='clear'></div>" +
                                "<div id='setdescription" + setId + "' style='display:none;'>" + assetSet.Description.escapeHTML() + "</div></div>";

                GetSetAssetImageThumbnail(assetSet.ImageAssetID, 'img_' + assetSet.ImageAssetID);

                $('#SetsList').html(innerHtml);
                $('#DeleteUnsubscribe_delete').hide();
                $('#DeleteUnsubscribe_unsubscribe').hide();
                $('#SetsListContainer').css('text-align', 'left');
                $('#SetUrlDiv').html('');
            }

            RenderPaging();

            $('#SetNameLong').html((fitStringToWidthSafe(setName, $($('#SelectedSetDescription')[0]).width() - 100)));
            $('#SelectedSetDescription').html(ShortenDescription($('#setdescription' + setId).html()));
            GetSetAssetImageThumbnail(assetSet.ImageAssetID, 'SetIconIMG');
            $('#editSetContainerDiv iframe').attr('src', '../Sets/EditImage.aspx?imgID=' + imageAssetId);

            var ownersName;
            if (currentSetView == MySetView) {
                $('#SetSubscribersOwner .stat-label').text('Subscribers: ');
                $('#SetSubscribersOwner .stat').text(subscriberCount);
                $('#SetUrlDiv').html(Roblox.Sets.Resources.shareLink+'<br />' + domainUrl + '/My/Sets.aspx?id=' + setId);
            }
            else {
                ownersName = creatorName;
                $('#SetSubscribersOwner .stat-label').text('Owner: ');
                $('#SetSubscribersOwner .stat').text(ownersName);
            }

            $('#SetUrlDiv').html(Roblox.Sets.Resources.shareLink + '<br />' + domainUrl + '/My/Sets.aspx?id=' + setId);
            $('#isloaded').val("false");

            $('#SetNameEditable').val(setName);
            $('#SetDescriptionEditable').val(setDesc);

            if (!isSubscribable) {
                $('#PrivateSetText').show();
                $('.setspage_subscribe_btn').hide();
                $('.EditDeleteSubscribe_Container').hide();
            }
            else {
                $('#PrivateSetText').hide();
            }

            // Add a spinner if it's taking a while
            window.setTimeout(function () {
                if ($('#isloaded').val() == "false") {
                    $('#assetSetImageThumbnail').attr("src", "/images/ProgressIndicator4.gif");
                }
            }, 750);

            GetSetAssetImageThumbnail(imageAssetId);
        }
    });
}
function GetThumbnail(assetVersionId, divId, attemptCount) {
    $.get(
        "/Thumbs/RawAsset.ashx?AssetVersionID=" + assetVersionId + "&Width=110&Height=110&ImageFormat=png",
        function (data) {
            if (data !== null) {
                if (data == "PENDING") {
                    if (attemptCount < 4) {
                        window.setTimeout(function () { GetThumbnail(assetVersionId, divId, attemptCount + 1); }, 3000);
                    }
                    return;
                }
                $('#img_' + divId).attr("src", data);
            }
        });
}
function GetSetAssetImageThumbnail(assetId, elementID) {
    var wh = 30;
    if (elementID == 'SetIconIMG') wh = 75;

    $.get(
        "/Thumbs/RawAsset.ashx?AssetID=" + assetId + "&Width=" + wh + "&Height=" + wh + "&ImageFormat=png",
        function (data) {
            if (data !== null) {
                if (data == "PENDING") {
                    $('#' + elementID).attr("src", '/images/spinners/spinner16x16.gif');
                    window.setTimeout(function () { GetSetAssetImageThumbnail(assetId, elementID); }, 2000);
                    return;
                }
                $('#' + elementID).attr("src", data);
                $('#SetInfoPanelDiv').css('height', '');
                //$('#isloaded').val("true");
            }
        });
}
function RemoveSetItem(assetSetItemId, divId) {
    $('#' + divId).append("<img src='/images/spinners/spinner16x16.gif' />");
    $('#removeButton_' + assetSetItemId).attr('disabled', true);

    $.post("/Sets/SetHandler.ashx?rqtype=removefromset&assetSetItemId=" + assetSetItemId,
    function (data) {
        if (data !== null) {
            // Remove the item from the list
            $('#' + divId).remove();
            totalNumberOfItemsInCurrentSet -= 1;
            if (totalNumberOfItemsInCurrentSet == 0) {
                var html = "<div class='message-container'>" + Roblox.Sets.Resources.noItems;
                if (currentSetView == MySetView) {
                    html += "<br/><a href='/Catalog/'>" + Roblox.Sets.Resources.addSome + "</a>";
                }
                $('#AssetSetItems').html(html + "</div>");
            }
            else if ($('#AssetSetItems .item').length < 1 && $('#AssetSetItems').sortable('option', 'disabled') == true) {
                currentPage[currentSetView][setIdList[currentSetView].indexOf(currentSetId[currentSetView])]--;
                RenderPaging();
                // Empty the current items
                $('#AssetSetItems').html("");

                // Throw up a loading symbol if it's been more than half a second
                window.setTimeout(function () {
                    if ($('#AssetSetItems').is(':empty')) {
                        $('#AssetSetItems').append("<div class='loading' ></div>");
                    }
                }, 500);
                LoadAssetSetItems(currentSetId[currentSetView]);
            }
        }

    });
}
function RenderPaging() {
    //do we need to show paging at all?
    if (totalNumberOfItemsInCurrentSet > 25) {
        $('#PagingContainerDivTop').show();
        $('#PagingContainerDivBottom').show();


        var index = setIdList[currentSetView].indexOf(currentSetId[currentSetView]);

        //disable/enable buttons
        if (currentPage[currentSetView][index] > 0) {
            $('.pager.previous').removeClass('disabled');
        }
        else {
            $('.pager.previous').addClass('disabled');
        }
        if ((currentPage[currentSetView][index] + 1) * numItemsShownPerPage < totalNumberOfItemsInCurrentSet) {
            $('..pager.next').removeClass('disabled');
        }
        else {
            $('.pager.next').addClass('disabled');
        }

        //how many pages do we have, what page are we currently on?
        var numPages = Math.ceil(totalNumberOfItemsInCurrentSet / numItemsShownPerPage);

        $('.paging_pagenums_container').html(numPages);
        $('.Paging_Input').val(currentPage[currentSetView][index] + 1);

    } else {
        $('#PagingContainerDivTop').hide();
        $('#PagingContainerDivBottom').hide();
    }
}
function Paging_Click(e) {
    var target = $(e.target);
    var key = "";
    if (target.hasClass('next')) {
        key = 'next';
    } else if (target.hasClass('previous')) {
        key = 'previous';
    }
    var index = setIdList[currentSetView].indexOf(currentSetId[currentSetView]);
    var numPages = Math.ceil(totalNumberOfItemsInCurrentSet / numItemsShownPerPage);
    var atLastPage = ((currentPage[currentSetView][index] + 1) * numItemsShownPerPage < totalNumberOfItemsInCurrentSet);
    var atFirstPage = (currentPage[currentSetView][index] > 0);

    if (key == 'previous' && atFirstPage) {
        currentPage[currentSetView][index]--;
    } else if (key == 'next' && atLastPage) {
        currentPage[currentSetView][index]++;
    } else {
        return false;
    }
    RenderPaging();
    // Empty the current items
    $('#AssetSetItems').html("");

    // Throw up a loading symbol if it's been more than half a second
    window.setTimeout(function () {
        if ($('#AssetSetItems').is(':empty')) {
            $('#AssetSetItems').append("<div class='loading'></div>");
        }
    }, 500);
    LoadAssetSetItems(currentSetId[currentSetView]);
}

function ShortenItemName(name) {
    if (name.length > 26) {
        name = name.substring(0, 23) + '...';
    }
    return name;
}

function GenerateAssetSetItemHtml(assetVersionId, itemname, assetSetItemId, isNewerVersionAvailable, sortOrder, nolinks, assetId) {
    var html = "";
    var divId = 'div_setitem_' + assetSetItemId;
    html += "<div class='item' id='" + divId + "' sortorder='" + sortOrder + "' assetId='"+assetId+"' assetVId='"+assetVersionId+"'>";
    if (nolinks) {
        html += "<div class=\"link_container handle\" >";
    } else {
        html += "<a class=\"link_container\" href='/item.aspx?setItemId=" + assetSetItemId + "&avID=" + assetVersionId + "'>";
    }
    html += "<img alt='" + itemname.escapeHTML() + "' id='img_" + divId + "' src='/thumbs/unavailable.jpg' class='handle' />";
    html += "<br/>";
    html += ShortenItemName(itemname);
    html += "<br/>";
    if(nolinks){
        html += "</div>";
    } else{
        html += "</a>";
    }
    if (currentSetView == MySetView) {
        if (isNewerVersionAvailable) {
            html += "<div class='newversion_banner'></div>";
        }
        html += "<div class='setitem_options " + isNewerVersionAvailable + "'>";
        html += "<div class='spacer'></div>";
        html += "<div class='container outer'><div class='container inner'>";
        html += "<div id='removeButton_" + assetSetItemId + "' class='removeButton NewVersionDropDownItem' onclick=\"RemoveSetItemModal('" + assetSetItemId + "','" + divId + "');\" >Delete</div>";
        html += "<div class='moveItem NewVersionDropDownItem' onclick=\"openMoveItemModal(this);\">Move to Another Set</div>";
        if (isNewerVersionAvailable) {
            html += "<div class='NewVersionDropDownItem' onclick=\"window.location='/item.aspx?setItemId=" + assetSetItemId + "&avID=" + assetVersionId + "'\">Preview Update</div>";
            html += "<div class='NewVersionDropDownItem' onclick=\"GetNewVersion('" + assetSetItemId + "');\">Update</div>";
        }
        html +=     "</div></div>";
        html += "</div>";
    }
    html += "</div>";
    // Spawn off a thumbnail request
    GetThumbnail(assetVersionId, divId, 0);
    return html;
}
function GetNewVersion(assetSetItemId) {
    var divId = 'div_setitem_' + assetSetItemId;
    $('#'+divId+' img').attr('src', '/images/ProgressIndicator4.gif');
    $.post(
        "/Sets/SetHandler.ashx?rqtype=getnewestversion&assetSetItemId=" + assetSetItemId,
        function (data) {
            var idName = data.split('\n'); // AssetVersionID NAME AssetId-- format
            var newAssetVersionId = idName[0];
            var itemname = idName[1];
            var assetId = idName[2];
            var nolinks = ($('.sort-msg').css('display') == 'block');

            $('#' + divId).attr('assetVId', assetId);
            $('#' + divId + ' .newversion_banner').remove();
            $('#' + divId + ' .NewVersionDropDownItem:nth-child(3)').remove();
            $('#' + divId + ' .NewVersionDropDownItem:nth-child(3)').remove();
            $('#' + divId + ' .setitem_options').removeClass('true').unbind();
            $('#' + divId + ' .setitem_options .inner').css('top', '-75px');
            applyOptionsDropDownJS('#' + divId);

            GetThumbnail(newAssetVersionId, divId, 0);
        });
    }
    function DeleteSetModal(setId) {
        Roblox.GenericConfirmation.open({
            titleText: Roblox.Sets.Resources.deleteSet,
            bodyContent: Roblox.Sets.Resources.areYouSureDelete,
            onAccept: function () {
                DeleteSet(setId);
            },
            acceptColor: Roblox.GenericConfirmation.blue,
            acceptText: Roblox.Sets.Resources.ok
        });
}

function DeleteSet(setId) {
    //var setId = currentSetId[currentSetView];
    if (setId == null) {
        setId = currentSetId[currentSetView];
    }
    $.post(
            "/Sets/SetHandler.ashx?rqtype=deleteset&setId=" + setId,
            function (data) {
                $('#createSetTab').show();
                PopulateSetAfterDeletionOrUnSubscribing(setId);
            });
        }
function UnsubscribeSetModal(setId) {
    Roblox.GenericConfirmation.open({
        titleText: Roblox.Sets.Resources.unsubscribeSet,
        bodyContent: Roblox.Sets.Resources.unsubscribeSure,
        onAccept: function () {
            UnsubscribeSet(setId);
        },
        acceptColor: Roblox.GenericConfirmation.blue,
        acceptText: Roblox.Sets.Resources.ok
    });
}

function UnsubscribeSet(setId) {
    //var setId = currentSetId[currentSetView];
    if (setId == null) {
        setId = currentSetId[currentSetView];
    }
    $.post(
            "/Sets/SetHandler.ashx?rqtype=unsubscribe&setId=" + setId,
            function (data) {
                PopulateSetAfterDeletionOrUnSubscribing(setId);
            });
}
function PopulateSetAfterDeletionOrUnSubscribing(setId) {
    // Visually remove it
    $('#setTabsListli' + setId).hide();
    window.setTimeout(function () { $('#setTabsListli' + setId).remove(); setsPager.updatePagerContent(); }, 1000);

    // Remove it from our list and choose the next selected tab
    var setIndex = setIdList[currentSetView].indexOf(setId);
    if (setIdList[currentSetView].length == 1) {
        setIdList[currentSetView] = [];
        currentPage[currentSetView] = [];
    } else {
        setIdList[currentSetView].splice(setIndex, 1);
        currentPage[currentSetView].splice(setIndex, 1);
    }
    // No sets left in current view?
    if (setIdList[currentSetView].length == 0) {
        if (currentSetView == MySetView) {
            ToggleViews('HasNoOwnedSetsPanel');
        }
        else if (currentSetView == SubscribedSetView) {
            ToggleViews('HasNoSubscribedSetsPanel');
        }
    }
    else {
        // Otherwise repopulate the first set in this view
        PopulateSet(setIdList[currentSetView][0]);
    }
}
function ChangeSetView(newSetView) {
    $('#SetsList .content-inner').empty();
    $('#AssetSetItems').empty();
    currentSetView = newSetView;

    if (newSetView == GuestSetView) {
        // TODO: Should this just be combined with the request for paged sets + some special logic ?
        // Only one set, add it to the list.
        // This gives us the ability to render someone elses sets by adding multiple setids to the query string...
        $('#MySets_Tab').hide();
        $('#SubscribedSets_Tab').hide();
        $('[roblox-create-find]').hide();
        $('#Edit_button').hide();
        $('#SetsList').hide();

        $('#SetsPane').removeClass('StandardBox');

        // Set the paging
        currentPage[GuestSetView][0] = 0;
        PopulateSet(setIdList[GuestSetView][0]);
        return;
    }

    LoadSets();
    if (newSetView == MySetView) {
        var crispEnabled = $('#Edit_button').data('crisp') == true;
        if (!IsSuperSafe || crispEnabled) {
            $('#Edit_button').show();
        }
        else {
            $('#Edit_button').hide();
        }

        $('#MySets_Tab').addClass('selected');
        $('#SubscribedSets_Tab').removeClass('selected');
        //$('[roblox-create-find]').html('<span><a id="CreateFind_Link" class="" onclick="$(\'#CreateSetPopupContainerDiv\').modal({ appendTo:\'form\', escClose: true, opacity: 80, overlayCss: { backgroundColor: \'#000\' }, position: [120, 0] });">Create</a></span>');
        $('[roblox-create-find]').attr('class', 'btn-large btn-primary').html("Create New <span class='btn-text'>Create New</span>");
        $('[roblox-create-find]').unbind('click');
        $('[roblox-create-find]').click(function () {
            $('#CreateSetPopupContainerDiv').modal({ appendTo: 'form', escClose: true, opacity: 80, overlayCss: { backgroundColor: '#000' }, position: [120, 0] });
        });
    }
    else if (newSetView == SubscribedSetView) {
        $('#Edit_button').hide();

        if ($('.EditSetInfo').is(':visible')) {
            toggleEditView(true);
        }

        $('#MySets_Tab').removeClass('selected');
        $('#SubscribedSets_Tab').addClass('selected');
        //$('[roblox-create-find]').html('<span><a id="CreateFind_Link" class="" href="/Catalog/Lists.aspx?m=AssetSets&q=">Find</a></span>');
        $('[roblox-create-find]').attr('class', 'btn-large btn-neutral').html(Roblox.Sets.Resources.findSet+"<span class='btn-text'>" + Roblox.Sets.Resources.findSet + "</span>");
        $('[roblox-create-find]').unbind('click');
        $('[roblox-create-find]').click(function () {
            window.location.href = "/catalog/lists.aspx?m=AssetSets&q=";
        });
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href.toLowerCase());
    if (results == null)
        return "";
    else
        return results[1];
}

function UpdateSetHandler() {
    $('#SetsPane').append('<div class="loading"></div>');
    UpdateName();
    UpdateDescription();
    if (!UpdateImage()) { //we need to chain updateimage and savesort, as we need them both to finish before we toggleEdit
        SaveSort();       //if update image doesn't make an ajax call, call SaveSort ourselves
    }
}

function UpdateImage() {
    if ($('#editSetContainerDiv iframe').contents().find('#newAssetID').val().length == 0) {
        //nothing to update, we didn't make ajax call
        return false;
    }
    var newAssetID = $('#editSetContainerDiv iframe').contents().find('#newAssetID').val();
    $.ajax({
        url: "/Sets/SetHandler.ashx?rqtype=updateimage&setId=" + currentSetId[currentSetView] + "&imgID=" + newAssetID,
        data: {},
        type: "POST",
        complete: function (xmlHttp) {
            if (xmlHttp.status != 200) {
                alert(Roblox.Sets.Resources.problemWithImage);
                SaveSort();
                return true;
            }
            else {
                GetSetAssetImageThumbnail(newAssetID, 'SetIconIMG');
                $('#editSetContainerDiv iframe').attr('src', '../Sets/EditImage.aspx?imgID=' + newAssetID);
                $('#setTabsListli' + currentSetId[currentSetView] + ' img').attr('id', 'img_' + newAssetID);
                GetSetAssetImageThumbnail(newAssetID, 'img_' + newAssetID);
                SaveSort();
                return true;
            }
        }
    });
}

function UpdateDescription() {
    var desc = $('#SetDescriptionEditable').val();
    $.ajax({
        url: "/Sets/SetHandler.ashx?rqtype=updatedescription&setId=" + currentSetId[currentSetView] + "&desc=" + desc,
        data: {},
        type: "POST",
        complete: function (xmlHttp) {
            if (xmlHttp.status != 200) {
                alert(Roblox.Sets.Resources.problemWithDesc);
            }
            else {
                //update descrip
                $('#SelectedSetDescription').html(ShortenDescription(desc).escapeHTML());
                $('#setdescription' + currentSetId[currentSetView]).html(desc.escapeHTML());
            }
        }
    });
}


function UpdateName() {
    var setId = currentSetId[currentSetView];
    var name = $('#SetNameEditable').val();
    $.ajax({
        url: "/Sets/SetHandler.ashx?rqtype=updatename&setId=" + setId + "&name=" + name,
        data: {},
        type: "POST",
        complete: function (xmlHttp) {
            if (xmlHttp.status != 200) {
                if (xmlHttp.responseText == "ERROR_7006") {
                    alert(Roblox.Sets.Resources.nameExists);
                }
                else {
                    alert(Roblox.Sets.Resources.nameProblem);
                }

            }
            else {
                $('#setTabsListli' + setId + ' .name').html(fitStringToWidthSafe(name.escapeHTML(), $($('.SetList-SetContainer .name')[0]).width()));
                $('#SetNameLong').html(fitStringToWidthSafe(name.escapeHTML(), $($('#SelectedSetDescription')[0]).width()));
                $('#setTabsListli' + currentSetId[currentSetView]).attr('alt', name.escapeHTML()); //update tooltip
            }
        }
    });
}

function SaveSort() {
    if (!orderChanged) {
        $('#SetsPane .loading').remove();
        toggleEditView(true);
        return;
    }

    var order = "";
    var count = 0;
    $('#AssetSetItems').find('.item').each(function () {
        var assetid = $(this).attr('id').split('_')[2];
        if (assetid != oldOrder[count] || $(this).attr('sortorder') == '2147483647') {
            order += ('_' + assetid + "." + (count+1));
        }
        count++;
    });

    $.ajax({
        url: '/Sets/SetHandler.ashx?rqtype=updatesortorder&setId=' + currentSetId[currentSetView] + '&neworder=' + order,
        data: {},
        type: "POST",
        complete: function (xmlHttp) {
            if (xmlHttp.status != 200) {
                alert('There was a problem saving your sort.');
                $('#SetsPane .loading').remove();
            }
            else {
                $('#SetsPane .loading').remove();
                toggleEditView(true);
            }
        }
    });
}
function MoreDescription() {
    $('#SelectedSetDescription').html($('#setdescription' + currentSetId[currentSetView]).html() + '<a id="MoreDescButton" onclick="LessDescription();return false;">&nbsp;' + Roblox.Sets.Resources.less + '</a>');
}
function LessDescription() {
    $('#SelectedSetDescription').html(ShortenDescription($('#setdescription' + currentSetId[currentSetView]).html()));
    //for Mozilla. I don't know why it's refusing to move up.. doesn't matter if what I do shows or not, just needs to change
    if ($('#EditDeleteSubscribe_Container')[0].style.position == 'relative') {
        $('#EditDeleteSubscribe_Container').css('position', 'static');
    } else {
        $('#EditDeleteSubscribe_Container').css('position', 'relative');
    }
}
function ShortenDescription(desc) {
    if (desc != null && desc.length > 300) {
        return desc.substring(0, 280) + '... <a id="MoreDescButton" onclick="MoreDescription();return false;">&nbsp;' + Roblox.Sets.Resources.more + '</a>';
    }
    else {
        return desc;
    }
}
function Page_Select(event) {
    var index = setIdList[currentSetView].indexOf(currentSetId[currentSetView]);
    var numPages = Math.ceil(totalNumberOfItemsInCurrentSet / numItemsShownPerPage);
    var val = Math.ceil($(event.target).val());

    if (event.keyCode == 13) {
        if (val > numPages || val < 1 || isNaN(val)) {
            return false;
        }
        currentPage[currentSetView][index] = val - 1;
        RenderPaging();
        // Empty the current items
        $('#AssetSetItems').html("");

        // Throw up a loading symbol if it's been more than half a second
        window.setTimeout(function () {
            if ($('#AssetSetItems').is(':empty')) {
                $('#AssetSetItems').append("<div class='loading' ></div>");
            }
        }, 500);
        LoadAssetSetItems(currentSetId[currentSetView]);
    }
    return false;
}
function CurrentlySorting(continueFn, continueVar) {
    if($('#AssetSetItems').sortable('option', 'disabled') == false){
        Roblox.GenericConfirmation.open({
            titleText: Roblox.Sets.Resources.saveSort,
            bodyContent: Roblox.Sets.Resources.doYouWantToSave,
            onAccept: function () {
                UpdateSetHandler();
                continueFn(continueVar);
            },
            onDecline: function () {
                continueFn(continueVar);
            },
            acceptColor: Roblox.GenericConfirmation.blue,
            acceptText: Roblox.Sets.Resources.ok
        });
    } else {
        continueFn(continueVar);
    }
}

function toggleEditView(reset) {
    if (reset == undefined) { reset = false; }

    if ($('#AssetSetItems').sortable('option', 'disabled') == false || reset) {
        $('.EditSetInfo').hide();
        $('.ButtonDiv.bottom').hide();
        $('.DisplaySetInfo').show();
        $('[roblox-create-find]').show();
        $('#AssetSetItems').sortable('option', 'disabled', true);
        LoadSetInfo(currentSetId[currentSetView]);
        if (currentSetId.length != 0) LoadAssetSetItems(currentSetId[currentSetView]);
    } else {
        $('.DisplaySetInfo').hide();
        $('[roblox-create-find]').hide();
        $('.EditSetInfo').show();
        $('.ButtonDiv.bottom').show();
        $('#SetNameEditable').val($('#setTabsListli' + currentSetId[currentSetView]).attr('alt'));
        $('#editSetContainerDiv iframe').contents().find('#Name').val($('#SetNameEditable').val());
        $('#SetDescriptionEditable').val($('#setdescription' + currentSetId[currentSetView]).html());
        LoadAssetSetAllItems(currentSetId[currentSetView]);
    }
}
function openMoveItemModal(elem) {
    var img = $(elem).parents('.item').find('img');

    if ($('.moveItemContainerDiv .dropdown option:nth-child(1)').attr('value') != currentSetId[currentSetView]) {
        $('.moveItemContainerDiv .dropdown option[value="' + currentSetId[currentSetView] + '"]').insertBefore($('.moveItemContainerDiv .dropdown option:nth-child(1)'));
        $('.moveItemContainerDiv .dropdown')[0].selectedIndex = 0;
    }

    $('.moveItemContainerDiv .itemName').html(img.attr('alt'));
    $('.moveItemContainerDiv img').attr('src', img.attr('src'));
    $('.moveItemContainerDiv #assetItemIDHidden').val((img.attr('id').split('_'))[3]);
    $('.moveItemContainerDiv').modal({ appendTo: 'form', escClose: true, opacity: 80, overlayCss: { backgroundColor: '#000' }, position: [120, 0] });
}
function SubmitMoveItem() {
    if ($('.moveItemContainerDiv option:selected').val() == currentSetId[currentSetView]) {
        alert(Roblox.Sets.Resources.cantMove);
        return;
    }
    var setitemid = $('.moveItemContainerDiv #assetItemIDHidden').val();
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        timeout: 50000,
        url: "/Sets/SetHandler.ashx?rqtype=addtoset&assetId=" + $("#div_setitem_" + setitemid).attr('assetid') +
             "&setId=" + $('.moveItemContainerDiv option:selected').val() +
             "&assetVId=" + $("#div_setitem_" + setitemid).attr('assetvid'),
        data: {},
        complete: function (xmlHttp) {
            if (xmlHttp.status != 200) {
                alert(Roblox.Sets.Resources.moveProblem);
            }
            else {
                RemoveSetItem($('.moveItemContainerDiv #assetItemIDHidden').val(), "div_setitem_" + $('.moveItemContainerDiv #assetItemIDHidden').val());
                $.modal.close();
            }
        }
    });
}
function applyOptionsDropDownJS(elemId) {
    $(elemId+' .setitem_options').hover(
        function () { //mousein
            $(this).addClass('true2').find('.outer').css('display', 'block');
            $(this).find('.spacer').css('display', 'block');
            $(this).find('.inner').stop(true, true).animate({
                top: '+=75px'
            }, 500);
        },
        function () { //mouseout
            $(this).find('.spacer').css('display', 'none');
            $(this).find('.inner').stop(true, true).animate({
                top: '-=75px'
            }, 500, function () { $(this).parent('.outer').css('display', 'none').parent('.setitem_options').removeClass('true2'); });
        });
    }

    function RemoveSetItemModal(assetSetItemId, divId) {
        Roblox.GenericConfirmation.open({
            titleText: Roblox.Sets.Resources.deleteItem,
            bodyContent: Roblox.Sets.Resources.removeItem,
            onAccept: function () {
                RemoveSetItem(assetSetItemId, divId);
            },
            acceptColor: Roblox.GenericConfirmation.blue,
            acceptText: Roblox.Sets.Resources.ok
        });
    }