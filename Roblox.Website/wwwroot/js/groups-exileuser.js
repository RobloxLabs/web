/* 
Summary: This file is a namespace containing logic to kick a user from a group, with an option to delete the user's posts. 
Referenced by: group admin pane, group wall pane
Requires: call InitializeGlobalVars(., .) to initialize currentRoleSetId and currentGroupId
Implementation: use an update button with class .RefreshUpdatePanel & a modal #ExileModal that calls ExileUser(., .)
*/

if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.ExileModal = function () {

    var userIdToExile;
    var currentGroupId;
    var currentRoleSetId;
    var deletePostsBool = false;

    function Close() {
        $.modal.close("#ExileModal");
    };

    function Show(userId) {
        var modalProperties = { overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };
        userIdToExile = userId;
        deletePostsBool = false;
        $("#ExileModal").modal(modalProperties);
    }

    function InitializeGlobalVars(rolesetId, groupId) {
        currentRoleSetId = rolesetId;
        currentGroupId = groupId;
    }

    /* flip the bool on checkbox click. A GetElementById('.').checked test within modals doesn't work in IE 7 & 8 */
    function SetDeletePostsBool() {
        deletePostsBool = !deletePostsBool;
    }

    function Exile() {
        // See above comment. var deleteAllPostsBool = ($('#deleteAllPostsByUser:checked').length > 0) ? true : false;
        var param = { userId: userIdToExile, deleteAllPostsOption: deletePostsBool, rolesetId: currentRoleSetId, selectedGroupId: currentGroupId };

        $.ajax({
            type: "POST",
            url: "Groups.aspx/ExileUserAndDeletePosts",
            data: JSON.stringify(param),
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                $('.RefreshUpdatePanel').click();
                Close();
            }
        });
    }

    /* Public interface */
    return {
        Exile: Exile,
        Close: Close,
        Show: Show,
        InitializeGlobalVars: InitializeGlobalVars,
        SetDeletePostsBool: SetDeletePostsBool
    }
} ();