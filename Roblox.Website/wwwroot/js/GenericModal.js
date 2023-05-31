if (typeof Roblox.GenericModal === "undefined") {
    Roblox.GenericModal = function () {
        var BUTTON_CLASS_GREEN = "btn-primary";
        var BUTTON_CLASS_BLUE = "btn-neutral";
        var BUTTON_CLASS_GRAY = "btn-negative";

        var BUTTON_SELECTOR = '.ImageButton.btn-neutral.btn-large.roblox-ok';

        var status = {
            isOpen: false
        };

        var modalProperties = {
            overlayClose: true,
            escClose: true,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            },
            acceptColor: BUTTON_CLASS_BLUE
        };
        var _CloseCallBack;
        $(function () {
            $(document).on('click', '.GenericModal .roblox-ok', function () {
                close();
            });
        });

        function open(title, imageURL, message, closeCallBack, isLarge, properties) {
            status.isOpen = true;
            modalProperties = $.extend({}, modalProperties, properties); // merge defaults into passed in properties
            _CloseCallBack = closeCallBack;
            var modal = $('div.GenericModal').filter(':first');
            modal.find('div.Title').text(title);
            if (imageURL === null) {
                modal.addClass('noImage');
            } else {
                modal.find('img.GenericModalImage').attr('src', imageURL);
                modal.removeClass('noImage');
            }
            modal.find('div.Message').html(message);
            if (isLarge) {
                modal.removeClass('smallModal');
                modal.addClass('largeModal');
            }
            var button = modal.find(BUTTON_SELECTOR);
            button.attr("class", "btn-large " + modalProperties.acceptColor);
            button.unbind();
            button.bind('click', function() { close(); });
            modal.modal(modalProperties);
        }

        function close() {
            status.isOpen = false;
            $.modal.close();
            if (typeof _CloseCallBack === 'function') {
                _CloseCallBack();
            }
        }
        return {
            close: close,
            open: open,
            status: status,
            green: BUTTON_CLASS_GREEN,
            blue: BUTTON_CLASS_BLUE,
            gray: BUTTON_CLASS_GRAY
        };
    } ();
}

Roblox.GenericModal.Resources = {
    ErrorText: 'Error',
    ErrorMessage: 'Sorry, an error occurred.'
};

//keybaord control
$(document).keypress(function (e) {
    if (e.which === 13 && Roblox.GenericModal.status.isOpen) {
        Roblox.GenericModal.close();
    }
});