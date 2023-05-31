Roblox = Roblox || {};
Roblox.Resources = Roblox.Resources || {};
Roblox.Icons = Roblox.Icons || {};
Roblox.Icons.Init = function() {
    $("[data-retry-url]").loadRobloxThumbnails();

    checkGeneratedIcon();

    var container = $("#IconDisplayContainer");
    var placeId = container.data('place-id');
    var placeIconId = container.data('place-icon-id');
    var uploadStatus = $("#UploadStatus");
    var loadingImage = $("#LoadingImage");
    var btnDisableClass = "btn-disabled-neutral";
    var icons = $("#icons");
    var checkIconLoadedTimeInMilliseconds = 300;

    if (!uploadStatus.html()) {
        uploadStatus.hide();
    }

    $("a[data-remove-icon-url]").click(function () {
        var button = $(this);
        var url = container.data("remove-icon-url");
        var requestData = { placeId: placeId, placeIconId: placeIconId };
        Roblox.GenericConfirmation.open({
            titleText:   Roblox.Resources.Icons.DeletetitleText,
            bodyContent: Roblox.Resources.Icons.DeletebodyContent,
            acceptText:  Roblox.Resources.Icons.DeleteacceptText,
            declineText: Roblox.Resources.Icons.CancelText,
            onAccept: function () {
                $.post(url, requestData, function (data) {
                    icons.html(data);
                });
            }
        });
        return false;
    });

    icons.on("click", "input[name='iconType']", function () {
        if ($(this).attr("id") === "imageIcon") {
            icons.find("#autogenerate").hide();
            icons.find("#ImageUpload").show();
        } else {
            icons.find("#ImageUpload").hide();
            icons.find("#autogenerate").show();
        }
    });

    $('a#addIconButton').click(function () {
        var button = $(this);

        if ($("#iconImageFile").val()) {
            Roblox.GenericConfirmation.open({
                titleText:   Roblox.Resources.Icons.AddtitleText,
                bodyContent: Roblox.Resources.Icons.AddbodyContent,
                acceptText:  Roblox.Resources.Icons.AddacceptText,
                declineText: Roblox.Resources.Icons.CancelText,
                allowHtmlContentInBody: true,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: function () {
                    var formData = new FormData();
                    formData.append("iconImageFile", $("#iconImageFile")[0].files[0]);
                    formData.append("placeId", placeId);

                    loadingImage.show();
                    button.hide();

                    $.ajax({
                        url: button.data("form-post-url"),
                        type: 'POST',
                        success: function (data) {
                            $("#icons").html(data);
                            loadingImage.hide();
                            button.show();
                        },
                        error: function () {
                            loadingImage.hide();
                            button.show();
                            uploadStatus.html(Roblox.Resources.Icons.ErrorText)
                                .removeClass("status-confirm")
                                .addClass("error-message")
                                .show();
                        },
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }
            });
        } else {
            uploadStatus.html(Roblox.Resources.Icons.EmptyText)
                .removeClass("status-confirm")
                .addClass("error-message")
                .show();
        }
    });

    $('a#addGeneratedIconImageButton').click(function () {
        var button = $(this);
        if (button.hasClass(btnDisableClass)) {
            event.preventDefault();
            return;
        }

        function addGeneratedImage() {
            var formData = new FormData();
            formData.append("placeId", placeId);
            loadingImage.show();

            button.hide();
            $.ajax({
                url: button.data("form-post-url"),
                type: 'POST',
                success: function (data) {
                    $("#icons").html(data);
                    loadingImage.hide();
                    button.show();
                },
                error: function () {
                    loadingImage.hide();
                    button.show();
                    uploadStatus.html(Roblox.Resources.Icons.ErrorText)
                        .removeClass("status-confirm")
                        .addClass("error-message")
                        .show();
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        }

        Roblox.GenericConfirmation.open({
            titleText: Roblox.Resources.Icons.AddGeneratedThumbTitleText,
            bodyContent: Roblox.Resources.Icons.AddGeneratedThumbBodyText,
            acceptText: Roblox.Resources.Icons.AddGeneratedThumbAcceptText,
            declineText: Roblox.Resources.Icons.AddGeneratedThumbCancelText,
            onAccept: addGeneratedImage
        });
        
    });

    function checkGeneratedIcon() {
        var setButton = $("#addGeneratedIconImageButton");

        setButton.addClass(btnDisableClass);

        var check = setInterval(function () {
            var stillLoading = $("#autogenerate span").attr("data-retry-url");
            if (!stillLoading) {
                setButton.removeClass(btnDisableClass);
                clearInterval(check);
            }
        }, checkIconLoadedTimeInMilliseconds);
    }
};
