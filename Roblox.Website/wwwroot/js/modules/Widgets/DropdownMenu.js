Roblox.define('Widgets.DropdownMenu', [], function () {

    function LazyInitializeDropdown(parentSelector) {
        $(parentSelector).on("click", ".button", function () {
            var target = $(this);
            if (!target.hasClass('init')) {
                var buttonWidth = $(this).outerWidth() - parseInt(target.css('border-left-width')) - parseInt(target.css('border-right-width'));
                target.siblings('.dropdown-list').css('min-width', buttonWidth);
                var rightAlignList = target.siblings('.dropdown-list[data-align="right"]').first();
                rightAlignList.css('right', 0);
                target.addClass('init');
            }

            if (target.hasClass('active')) {
                target.removeClass('active');
                target.siblings('.dropdown-list').hide();
            } else {
                target.addClass('active');
                target.siblings('.dropdown-list').show();
            }

            $(document).click(function () {
                $('.button.init.active').removeClass('active');
                $('.dropdown-list').hide();
            });

            return false;

        });
    }

    function InitializeDropdown() {
        var browseButton = $('.button').not('.init');
        browseButton.each(function () {
            var buttonWidth = $(this).outerWidth() - parseInt($(this).css('border-left-width')) - parseInt($(this).css('border-right-width'));
            $(this).siblings('.dropdown-list').css('min-width', buttonWidth);
            var rightAlignList = $(this).siblings('.dropdown-list[data-align="right"]').first();
            rightAlignList.css('right', 0);
        });
        $('.dropdown-list').hide();

        browseButton.click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).siblings('.dropdown-list').hide();
            } else {
                $(this).addClass('active');
                $(this).siblings('.dropdown-list').show();
            }
            return false;
        });

        $(document).click(function () {
            browseButton.removeClass('active');
            $('.dropdown-list').hide();
        });
        browseButton.addClass('init');
    }
    return {
        InitializeDropdown: InitializeDropdown,
        LazyInitializeDropdown: LazyInitializeDropdown
    };

});