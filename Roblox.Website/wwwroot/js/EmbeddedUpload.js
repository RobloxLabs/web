$(function () {
    var uploadButton = $("#upload-button");
    var estimateButton = $("#estimate-price-button");
    var audioBucketData = $("#audio-bucket-data");
    var assetTypeId = $("#assetTypeId").val();
    var captchaEnabledElem = $("#captchaEnabled");
    var isSound = assetTypeId == 3;
    var invalidFileExtension = isSound ? Roblox.EmbeddedUpload.Resources.invalidSoundFile : Roblox.EmbeddedUpload.Resources.invalidImageFile;
    var validFileExtensions = isSound ? ['.mp3'] : ['.png', '.jpg', '.jpeg', '.jpe', '.bmp'];
    var postMessageMethods = {
        verifyCaptcha: "verifyCaptcha"
    };
 
    if (isSound && $("#isOggUploadEnabled").val().toLowerCase() === "true")
        validFileExtensions.push('.ogg');
    if (!isSound && $("#isTgaUploadEnabled").val().toLowerCase() === "true")
        validFileExtensions.push('.tga');

    disableUploadOnInsufficientFunds();

    $("ul.nav-pills li").click(function (e) {
        e.preventDefault();
        $(".nav-pills li.active").removeClass("active");
        $(this).addClass("active");
        var selectedAssetTypeId = $(this).data('asset-type-id');
        $("input[name=assetTypeId]").val(selectedAssetTypeId);
    });

    // client-side file extension validation
    $('#file').change(function () {

        $('#upload-result').remove();
        $('#file-error').text('');
        $('#name-error').text('');

        if (!$('#file').val())
            return; // no file selected

        var fileName = $('#file').val().replace(/^.*[\\\/]/, '');
        var fileExtension = fileName.substr(fileName.lastIndexOf('.')).toLowerCase();


        if ($.inArray(fileExtension, validFileExtensions) === -1) {
            $('#file-error').text(invalidFileExtension);
        } else {
            $('#name').val(fileName.slice(0, -fileExtension.length));
            $('#name').select();
        }
    });

    function disableUploadOnInsufficientFunds() {
        if (Roblox.EmbeddedUpload.isPlaceSpecificAsset) {
            $('#file').prop('disabled', Roblox.EmbeddedUpload.isInsufficientFunds);            
        }
    }

    function validateName() {
		if (!!$('#file').val() && !$('#name').val().trim()) {
            $('#name-error').text(Roblox.EmbeddedUpload.Resources.noName);
            return false;
        }
        return true;
    }

    function toggleButtonEnabled(button, isEnabled, visible) {
        if (isEnabled) {
            button.addClass("btn-primary").removeClass("btn-disabled-primary");
            button.removeAttr("disabled");
        } else {
            button.addClass("btn-disabled-primary").removeClass("btn-primary");
            button.attr("disabled", "disabled");
        }
        button[isEnabled || visible ? "removeClass" : "addClass"]("invisible");
    }

    $('#name').focusout(validateName);

    function submitUpload(elem) {
        if (elem.attr("disabled")) {
            return;
        }
        toggleButtonEnabled(uploadButton, false, true);

        var onVerificationPageElem = $("#onVerificationPage");
        if (!onVerificationPageElem.get(0) || onVerificationPageElem.val() != 'True') {
            if (!$('#file').val()) {
                $('#file-error').text(Roblox.EmbeddedUpload.Resources.noFile);
                toggleButtonEnabled(uploadButton, true, true);
                return;
            }

            var fileName = $('#file').val().replace(/^.*[\\\/]/, '');
            var fileExtension = fileName.substr(fileName.lastIndexOf('.')).toLowerCase();
            if ($.inArray(fileExtension, validFileExtensions) === -1) {
                $('#file-error').text(invalidFileExtension);
                toggleButtonEnabled(uploadButton, true, true);
                return;
            }

            if (!validateName()) {
                toggleButtonEnabled(uploadButton, true, true);
                return;
            }
        }

        $('#loading-container').show();
        uploadButton.replaceWith($('#loading-container'));
        $('#cancel-upload-button').hide();
        $('#purchase-amount-message').hide();
        var shouldCaptcha = captchaEnabledElem.val().toLowerCase() === "true";
        if (shouldCaptcha) {
            verifyCaptcha(function(success) {
                if (success) {
                    $('#upload-form').submit();
                } else {
                    window.location.reload();
                }
            });
        }
        else {
            $('#upload-form').submit();
        }
    }

    function checkGroupElem() {
        var groupId = $("#groupId").val();
        return groupId && groupId.length > 0;
    }

    function verifyCaptcha(cb) {
        //we do postmessage here. 
        var data = {
            method: postMessageMethods.verifyCaptcha,
            isGroupUpload: checkGroupElem()
        };
        window.parent.postMessage(data, "*");

        //now create listener.
        window.addEventListener("message", function (event) {
            if (event.origin === window.location.origin) {
                if (event.data &&
                    event.data.method === postMessageMethods.verifyCaptcha) {
                    cb(event.data.success);
                }                
            }
        });
    }
        
    uploadButton.click(function () {
        submitUpload($(this));
    });

    estimateButton.click(function () {
        if ($(this).attr("disabled")) {
            return;
        }

        if (isSound) {
            toggleButtonEnabled(estimateButton, false, true);
            $.ajax({
                type: "POST",
                url: Roblox.Endpoints.getAbsoluteUrl("/build/verifyaudio"),
                data: new FormData($("form")[0]),
                contentType: false,
                processData: false,
                success: function (estimate) {
                    $("#file-error").text(estimate.message);
                    if (estimate.price) {
                        uploadButton.text("Purchase for " + estimate.price + " R$");
                    }
                    toggleButtonEnabled(uploadButton, !estimate.message && estimate.canAfford, !!estimate.price);
                    toggleButtonEnabled(estimateButton, false, !estimate.price);
                },
                error: function () {
                    toggleButtonEnabled(estimateButton, true, true);
                }
            });
        }
    });

    //make sure the correct place is selected if page is being redirected from a dropdown
    var selectedPlaceIdElem = $("#selectedPlaceId", parent.document);
    if (selectedPlaceIdElem) {
        var placeSelector = $("#badge-place-select");
        if (placeSelector && placeSelector.children('option').length > 0) {
            var placeId = selectedPlaceIdElem.val();
            var existsPlace = $('#badge-place-select option[value=' + placeId + ']').length > 0;
            if (existsPlace) {
                placeSelector.val(placeId);
            }
        }
    }


    var audioBucketList = [];
    var audioNames = ["shortsoundeffect", "longsoundeffect", "music", "longmusic"];

    for (var i = 0; i < audioNames.length; i++) {
        if (audioBucketData.data(audioNames[i] + "-enabled")) {
            audioBucketList.push({
                size: audioBucketData.data(audioNames[i] + "-size"),
                price: audioBucketData.data(audioNames[i] + "-price")
            });
        }
    }

    if (audioBucketData.data("audiobuckets-enabled") && audioBucketList.length > 0) {
        $("#file[accept='audio/*']").change(function () {
            $("#file-error").text("");
            toggleButtonEnabled(estimateButton, false, true);
            toggleButtonEnabled(uploadButton, false, false);

            var file = this.files && this.files[0];
            if (!file) {
                return;
            }

            var hasBucket = false;
            if (file.size < 1) {
                $("#file-error").text(Roblox.EmbeddedUpload.Resources.fileIsEmpty);
            } else if (file.size <= audioBucketData.data("max-audio-size")) {
                for (var i = 0; i < audioBucketList.length; i++) {
                    var bucket = audioBucketList[i];
                    if (file.size <= bucket.size) {
                        hasBucket = true;
                        break;
                    }
                }
            } else {
                $("#file-error").text(Roblox.EmbeddedUpload.Resources.fileTooLarge);
            }

            toggleButtonEnabled(estimateButton, hasBucket, true);
        });
    }

});