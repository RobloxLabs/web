if (typeof Roblox.Studio === "undefined") {
    Roblox.Studio = {};
}

if (typeof Roblox.Studio.AssetUpload === "undefined") {

    Roblox.Studio.AssetUpload = function () {
        var uploadProgress = 0;

        //Not to be called externally
        var uploadSuccess = function (result) {
            $('#uploadProgressCounter').text('100%');
            $('#progressAmount').width('100%');
            //change button to OK
            $('#progressBarWrapper a').removeClass('btn-gray');
            $('#cancelButton').hide();

            var newUpload = $('#uploadProgressBar').data('newupload') == 'True';

            if (newUpload && Roblox.Studio.AssetUpload.IsPlace) { //don't show share if new place
                $('#nextButton').show();
            } else if (newUpload && !Roblox.Studio.AssetUpload.IsPlace) { //if new model, we need to get avid
                $('#okButton').show();
                if (result != true && Number(result)) {
                    var elem = $('#shareWithFriends input');
                    elem.val(elem.val() + result + "/redirect");
                    $('#shareWithFriends').show();
                }
            } else {
                $('#okButton').show();
                $('#shareWithFriends').show();
            }
        };

        var loadingAnimation = function () {
            function run() {
                var current = parseInt($('#progressAmount')[0].style.width, 10);
                current += 1 + Math.floor(Math.random() * 10);
                if (current >= 90) {
                    current = 90;
                    clearInterval(Roblox.Studio.LoadingTimer);
                }
                $('#progressAmount').css('width', (current) + '%');
                $('#uploadProgressCounter').text(current + '%');
            }

            return setInterval(run, 550);
        };

        //Not to be called externally
        var uploadError = function (msg) {
            if (uploadError.arguments.length <= 0) {
                msg = Roblox.Studio.Resources.errorMSG;
            }
            $('#progressAmount').width('100%').removeClass("progress-blue-bar").addClass("progress-error-bar");
            $('#errorMessageContainer').html(msg).addClass("error-text");
            $('#cancelButton').hide();
            $('#okButton').show();
        };

        // Usage: custom onSuccess and onError
        var complete = function (success, msg) {
            clearInterval(Roblox.Studio.LoadingTimer);
            if (success) {
                uploadSuccess(msg);
            } else if (complete.arguments.length <= 1) {
                uploadError();
            } else {
                uploadError(msg);
            }
        };

        var updateProgress = function (amountDone, totalAmount) {
            uploadProgress = Math.round(amountDone / totalAmount * 100);
            $('#uploadProgressCounter').text(uploadProgress + "%");
            $('#progressAmount').width(uploadProgress + "%");
        };

        var uploadData = function () {
            var result = false;
            try {
                result = window.external.SaveUrl($('#uploadProgressBar').data('upload-url'));
                complete(result);
            } catch (ex) {
                try {
                    result = window.external.SaveUrl($('#uploadProgressBar').data('upload-url'));
                    complete(result);
                } catch (ex2) {
                    complete(false);
                }
            }
        };

        function doUpload(contentGetter) {
            var result = null;
            var tryCount = 2;
            while (tryCount > 0) {
                var content = contentGetter();
                if (content) {
                    // If it succeeds, it returns Qtstring, which is assetID.
                    // If it fails, it returns empty string.
                    result = content.Upload($('#uploadProgressBar').data('upload-url'));
                    if (result === true || Number(result)) {
                        complete(true, result);
                        return;
                    }
                }
                tryCount -= 1;
            }

            if (result === Roblox.Studio.Resources.inappropriateTextError) {
                complete(false, result);
                return;
            }
            complete(false);
        }

        var uploadAssetData = function () {
            var workspace = window.external;
            doUpload(workspace.WriteSelection);
        };

        // same to uploadAssetData but for package
        var uploadPackageData = function () {
            var workspace = window.external;
            doUpload(workspace.WritePackage);
        };

        return {
            complete: complete
                , loadingAnimation:	loadingAnimation
                , updateProgress:	updateProgress
                , uploadAssetData:	uploadAssetData
                , uploadPackageData: uploadPackageData
                , uploadData:		uploadData
        };
    } ();
}

$(function () {
    Roblox.Studio.AssetUpload.IsPlace = $('#uploadProgressBar').data('isplace') != "False";
    Roblox.Studio.AssetUpload.IsPackage = $('#uploadProgressBar').data('ispackage') != "False";

    $('#cancelButton').click(function () {
        var previousUrl = $('#uploadProgressBar').data('previous-url');
        if (!isBlank(previousUrl)) {
            document.location.href = previousUrl;
            return false;
        } else {
            window.close();
            return false;
        }
    });

    $('#nextButton').click(function () {
        if (Roblox.Studio.AssetUpload.IsPlace) {
            document.location.href = "/ide/publishas/newgame/addons?assetid=" + $('#uploadProgressBar').data('assetid');
        } else {
            window.close();
        }
        return false;
    });

    $('#okButton').click(function () {
        window.close();
        return false;
    });

    $('#shareWithFriends input').click(function () {
        $(this).select();
    });

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    // Keep track of the loading animation, to cancel it when we actually finish uploading
    Roblox.Studio.LoadingTimer = Roblox.Studio.AssetUpload.loadingAnimation();
    
    if (Roblox.Studio.AssetUpload.IsPackage) {
        Roblox.Studio.AssetUpload.uploadPackageData();
    } else if (Roblox.Studio.AssetUpload.IsPlace) {
        Roblox.Studio.AssetUpload.uploadData();
    } else {
        Roblox.Studio.AssetUpload.uploadAssetData();
    }
});