$(function () {
    if (!Roblox) {
        Roblox = {};
    }
    if (!Roblox.DeveloperProductsForm) {
        Roblox.DeveloperProductsForm = {};
    }

    Roblox.DeveloperProductsForm.init = function () {
        var $parentContainer = $('#AddDeveloperProduct').parent();
        $parentContainer.trigger('onViewChange', ['createEdit']);
        $parentContainer.unbind('onRefreshed').bind('onRefreshed', function (event) {
            Roblox.DeveloperProductsForm.onAjaxStart();
            $.ajax({
                cache: false,
                type: "GET",
                url: $parentContainer.attr('src')
            }).done(function (data) {
                $('#DeveloperProductsLoading').hide();
                $parentContainer.trigger('onActionComplete', [data]);
            }).fail(function () {
                $('#DeveloperProductsLoading').hide();
                $('#DeveloperProductsError').show();
            });
        });
        $("body").unbind('developerProductImageIFrameLoaded').bind('developerProductImageIFrameLoaded', function (evt, data) {
            Roblox.DeveloperProductsForm.onImageUploadComplete(true, data);
        });

        $("body").unbind('developerProductImageIFrameLoadError').bind('developerProductImageIFrameLoadError', function (evt, data) {
            Roblox.DeveloperProductsForm.onImageUploadComplete(false, data);
        });

        //Single bind pattern.
        var developerProductAjaxSuccessHandler = function (data) {
            Roblox.DeveloperProductsForm.onAjaxSuccess();
            $("#AddDeveloperProduct").parent().trigger("onActionComplete", [data]);
        };

        var developerProductAjaxFailureHandler = function () {
            Roblox.DeveloperProductsForm.onAjaxFailure();
        };

        $('#AddDeveloperProduct').off('click').on('click', 'a.developer-product-button', function (event) {
            var url = $(this).data("form-post-url");
            var formValues = Roblox.DeveloperProductsForm.validateAndGetFormValues();
            if (formValues != null) {
                Roblox.DeveloperProductsForm.onAjaxStart();
                $.ajax({
                    cache: false,
                    url: url,
                    type: 'POST',
                    data: formValues,
                    success: developerProductAjaxSuccessHandler,
                    error: developerProductAjaxFailureHandler
                });
            }
        }).on('click', 'a.cancel-button', function (event) {
            var url = $(this).data('url');
            Roblox.DeveloperProductsForm.onAjaxStart();
            $.ajax({
                cache: false,
                url: url,
                type: 'GET',
                success: developerProductAjaxSuccessHandler,
                error: developerProductAjaxFailureHandler
            });
            return false;
        });


        $('#DeveloperProductImageFile').on('change', function (event) {
            var fileValue = $(this).val();
            if (fileValue && fileValue != '') {
                Roblox.DeveloperProductsForm.onAjaxStart(); //technically not an ajax call
                $('#ImageUploadForm').submit();
                var $uploaderIframe = $('#ImageUploaderIframe');
                $uploaderIframe.unbind().load(function () {
                    Roblox.DeveloperProductsForm.onAjaxSuccess(); //technically not an ajax call
                    $('#AddDeveloperProductInnerContainer').show();
                    $uploaderIframe.show();
                });
            }
            return false;
        });

        $("#DeveloperProductName").unbind('focusout').bind('focusout', function () {
            var url = $(this).attr('validation-url');
            var name = $(this).val();
            var $nameValidation = $("#NameValidation");
            $nameValidation.hide();
            $(this).attr('invalid', false);

            if (name != null && name.length > 0) {
                url = url + (url.indexOf('?') !== -1 ? '&' : '?');
                url = url + 'developerProductName=' + name;
                
                $.ajax({
                    cache: false,
                    url: url,
                    type: 'GET'
                }).done(function (data) {
                    if (!data.Success) {
                        $nameValidation.show().text(data.Message);
                        $nameValidation.removeClass('validationMessageInvalid').addClass('validationMessageInvalid');
                        $("#DeveloperProductName").attr('invalid', 'true'); //Not using bool because of cross browser issues
                    } else {
                        $nameValidation.hide();
                        $("#DeveloperProductName").attr('invalid', 'false');
                    }
                }).fail(function () {
                });
            }
            return true;
        });
    };

    Roblox.DeveloperProductsForm.onImageUploadComplete = function (success, data) {
        var $developerProductIconIdElement = $('#DeveloperProductIconId');
        if (success) {
            $developerProductIconIdElement.val(data);
            $developerProductIconIdElement.attr('uploaded', 'true');
        } else {
            $developerProductIconIdElement.attr('uploaded', 'false');
        }
        Roblox.DeveloperProductsForm.onAjaxSuccess(); //technically not an ajax call
        $('#AddDeveloperProductInnerContainer').show();
        $('#ImageUploaderIframe').show();
    };

    Roblox.DeveloperProductsForm.validatePrice = function (value) {
        var errorMessage = isNaN(value) ? "Please enter a valid number" : "";
        errorMessage = errorMessage.length == 0 && (parseInt(value) < 0) ? "Please enter a value above zero" : errorMessage;
        return errorMessage;
    };

    Roblox.DeveloperProductsForm.showValidation = function (selector, value) {
        if (value.length > 0) {
            $(selector).show().text(value);
            $(selector).removeClass('validationMessageInvalid').addClass('validationMessageInvalid');
        }
    };

    Roblox.DeveloperProductsForm.onAjaxStart = function () {
        $('.validationMessage').hide();
        $('#DeveloperProductsLoading').show();
        $('#AddDeveloperProductInnerContainer').hide();
    };

    Roblox.DeveloperProductsForm.onAjaxSuccess = function () {
        $('#DeveloperProductsLoading').hide();
    };

    Roblox.DeveloperProductsForm.onAjaxFailure = function () {
        $('#DeveloperProductsLoading').hide();
        $('#AddDeveloperProductInnerContainer').hide();
        $('#DeveloperProductsError').show();
    };

    Roblox.DeveloperProductsForm.validateAndGetFormValues = function () {
        $('.validationMessage').hide();
        var formValues;
        var universeId = $('#DeveloperProductUniverseID').val();
        var developerProductId = $('#DeveloperProductID').val();
        var $developerProductNameElement = $('#DeveloperProductName');
        var isInvalidName = $developerProductNameElement.attr('invalid');
        var nameErrorMessage = "";
        var name = "";
        if (isInvalidName == 'true') {
            nameErrorMessage = $('#NameValidation').text();
        } else {
            name = $developerProductNameElement.val();
            nameErrorMessage = (!name || $.trim(name).length == 0) ? "Name cannot be empty" : "";
        }
        Roblox.DeveloperProductsForm.showValidation('#NameValidation', nameErrorMessage);
        var priceInRobux = $('#DeveloperProductPriceInRobux').val();
        var robuxPriceErrorMessage = Roblox.DeveloperProductsForm.validatePrice(priceInRobux);
        Roblox.DeveloperProductsForm.showValidation('#RobuxValidation', robuxPriceErrorMessage);

        var description = $('#DeveloperProductDescription').val();
        description = (description != null) ? description : "";

        var $developerProductIconIdElement = $('#DeveloperProductIconId');
        var imageAssetId = $developerProductIconIdElement.val();
        if (nameErrorMessage.length > 0 || robuxPriceErrorMessage.length > 0 || $developerProductIconIdElement.attr('uploaded') == 'false') {
            formValues = null;
        } else {
            formValues = {
                universeId: universeId,
                name: name,
                developerProductId: developerProductId,
                priceInRobux: priceInRobux,
                description: description,
                imageAssetId: imageAssetId
            };
        }
        return formValues;
    };
});
	
