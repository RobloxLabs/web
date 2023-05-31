var Roblox = Roblox || {};
Roblox.IDE = Roblox.IDE || {};
Roblox.IDE.Resources = Roblox.IDE.Resources || {};

Roblox.IDE.Thumbnails = Roblox.IDE.Thumbnails || (function () {
    var enabledNeutralButtonClass = "btn-neutral";
    var disabledNeutralButtonClass = "btn-disabled-neutral";

    function doPurchase(onAcceptFunction) {
        var thumbnailtypeSelection = $("input[name=thumbnailType]:checked");
        var cost = "<span class='robux'>" + thumbnailtypeSelection.attr("data-cost-in-robux") + "</span>";
        Roblox.GenericConfirmation.open({
            titleText: Roblox.IDE.Resources.AddtitleText,
            bodyContent: Roblox.IDE.Resources.AddbodyContent + cost + "?",
            acceptText: Roblox.IDE.Resources.AddacceptText,
            declineText: Roblox.IDE.Resources.CancelText,
            allowHtmlContentInBody: true,
            acceptColor: Roblox.GenericConfirmation.green,
            onAccept: onAcceptFunction
        });
    }

    function checkGeneratedThumbnailLoad() {
        var setButton = $("#addGeneratedImageButton");
        setButton.addClass(disabledNeutralButtonClass);

        var check = setInterval(function () {
            var stillLoading = $("#autogenerate span").attr("data-retry-url");
            if (!stillLoading) {
                setButton.removeClass(disabledNeutralButtonClass);
                clearInterval(check);
            }
        }, 300);
    }

    function toggleButton(button, enabled) {
        button.toggleClass("btn-neutral", enabled).toggleClass(disabledNeutralButtonClass, !enabled);
        if (enabled) {
            button.removeAttr("disabled");
        } else {
            button.attr("disabled", "");
        }
    }

    function init() {
        var removeThumbnailError = $("#remove-thumbnail-error");
        var uploadThumbnailButton = $("#addImageButton");
        var uploadThumbnailFileInput = $("#thumbnailImageFile");
        var uploadImageValidator = Roblox.IDE.validator({
            button: uploadThumbnailButton,
            enabledClass: enabledNeutralButtonClass,
            disabledClass: disabledNeutralButtonClass
        }, [
            {
                input: uploadThumbnailFileInput,
                errorSpan: $("#ImageUpload .field-validation-valid")
            }
        ], false);

        $("[data-retry-url]").loadRobloxThumbnails();
        checkGeneratedThumbnailLoad();

        var placeId = $("#ThumbnailDisplayContainer").data("place-id");
        $("a[data-remove-url]").click(function () {
            var button = $(this);
            var url = $("#ThumbnailDisplayContainer").data("remove-url");
            var requestData = { thumbnailid: button.data("thumbnailid"), id: placeId };
            Roblox.GenericConfirmation.open({
                titleText: Roblox.IDE.Resources.DeletetitleText,
                bodyContent: Roblox.IDE.Resources.DeletebodyContent,
                acceptText: Roblox.IDE.Resources.DeleteacceptText,
                declineText: Roblox.IDE.Resources.CancelText,
                onAccept: function () {
                    $.post(url, requestData, function (data) {
                        if(data.success) {
                            button.parent().remove();
                        } else {
                            removeThumbnailError.addClass("field-validation-error").text(data.message);
                        }
                    });
                }
            });
            return false;
        });
        $("#thumbnails").on("click", "input[name='thumbnailType']", function () {
            if ($(this).attr("id") === "imageThumbnail") {
                $("#thumbnails #VideoUpload").hide();
                $("#thumbnails #autogenerate").hide();
                $("#thumbnails #ImageUpload").show();
            } else if ($(this).attr("id") === "youtubeThumbnail") {
                $("#thumbnails #ImageUpload").hide();
                $("#thumbnails #autogenerate").hide();
                $("#thumbnails #VideoUpload").show();
            } else {
                $("#thumbnails #ImageUpload").hide();
                $("#thumbnails #VideoUpload").hide();
                $("#thumbnails #autogenerate").show();
            }
        });

        uploadThumbnailButton.click(function () {
            var button = $(this);
            if (button.hasClass(disabledNeutralButtonClass)) {
                return;
            }

            var loadingImage = $("#LoadingImage");

            function onAcceptFunction() {
                var formData = new FormData();
                formData.append("thumbnailImageFile", uploadThumbnailFileInput[0].files[0]);
                formData.append("id", placeId);
                formData.append("__RequestVerificationToken", $("[name=__RequestVerificationToken]").val());
                loadingImage.show();

                button.hide();
                $.ajax({
                    url: button.data("form-post-url"),
                    type: "POST",
                    //Ajax events
                    success: function (data) {
                        $("#thumbnails").html(data);
                        loadingImage.hide();
                        button.show();
                    },
                    error: function() {
                        loadingImage.hide();
                        button.show();
                    },
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                });
            }

            var thumbnailtypeSelection = $("input[name=thumbnailType]:checked");
            if (thumbnailtypeSelection) {
                var cost = thumbnailtypeSelection.attr("data-cost-in-robux");
                if (cost) {
                    doPurchase(onAcceptFunction);
                } else {
                    Roblox.GenericConfirmation.open({
                        titleText: Roblox.IDE.Resources.AddtitleText,
                        bodyContent: Roblox.IDE.Resources.AddGeneratedThumbBodyText,
                        acceptText: Roblox.IDE.Resources.AddGeneratedThumbAcceptText,
                        declineText: Roblox.IDE.Resources.AddGeneratedThumbCancelText,
                        onAccept: onAcceptFunction

                    });
                }
            }
        });

        $("a#addGeneratedImageButton").click(function () {
            var button = $(this);
            var loadingImage = $("#LoadingImage");

            if (button.hasClass(disabledNeutralButtonClass)) {
                event.preventDefault();
                return;
            }

            function addAutoGeneratedThumbnail() {
                var formData = new FormData();
                formData.append("id", placeId);
                loadingImage.show();

                button.hide();
                $.ajax({
                    url: button.data("form-post-url"),
                    type: "POST",
                    success: function (data) {
                        $("#thumbnails").html(data);
                        loadingImage.hide();
                        button.show();
                    },
                    error: function () {
                        loadingImage.hide();
                        button.show();
                    },
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false
                });
            }

            Roblox.GenericConfirmation.open({
                titleText: Roblox.IDE.Resources.AddGeneratedThumbTitleText,
                bodyContent: Roblox.IDE.Resources.AddGeneratedThumbBodyText,
                acceptText: Roblox.IDE.Resources.AddGeneratedThumbAcceptText,
                declineText: Roblox.IDE.Resources.AddGeneratedThumbCancelText,
                onAccept: addAutoGeneratedThumbnail
            });
        });

        $("a#addVideoButton").click(function () {
            var button = $(this);
            if (button.hasClass("btn-disabled-neutral")) {
                return;
            }

            var loadingImage = $("#LoadingImage");

            var youtubeUrl = $("#txtYouTubeVideoUrl").val();
            var token = $("[name=__RequestVerificationToken]").val();
            function onAcceptFunction() {
                loadingImage.show();
                button.hide();
                $.post(button.data("form-post-url"), { id: placeId, thumbnailYoutubeUrl: youtubeUrl, __RequestVerificationToken: token }, function (data) {
                    $("#thumbnails").html(data);
                    loadingImage.hide();
                    button.show();
                });
            }

            doPurchase(onAcceptFunction);
        });


        $("#txtYouTubeVideoUrl").on("input", function () {
            var hasLink = $(this).val().length > 0;
            toggleButton($("a#addVideoButton"), hasLink);
        });
        
        uploadImageValidator.init();
    }

    return {
        init: init
    }
})();

