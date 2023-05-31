var Roblox = Roblox || {};

Roblox.BootstrapWidgets = function () {
// trigger and customize bootstrap js components;
    SetupTabs = function () {
    // tabs
    $('#horizontal-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#vertical-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
}

    SetupDropdown = function () {
    // dropdown menu

    $('[data-toggle="dropdown-menu"] li').click(function (e) {
        var target = $(e.currentTarget);
        target.closest('.rbx-input-group-btn')
                .find('[data-bind="label"]')
                .text(target.text())
                .end()
                .toggleClass("open");
            return false;
    });
}

    SetupAccordion = function () {
    // Accordion
    // This event fires immediately when the show instance method is called.
    $('[data-toggle="collapsible-element"]').on('show.bs.collapse', function (e) {
        $(e.target)
            .prev('.rbx-panel-heading')
            .find(".rbx-icon-right-16x16")
            .removeClass('rbx-icon-right-16x16').addClass('rbx-icon-down-16x16');
    });
    // This event is fired immediately when the hide method has been called.
    $('[data-toggle="collapsible-element"]').on('hide.bs.collapse', function (e) {
        $(e.target)
            .prev('.rbx-panel-heading')
            .find(".rbx-icon-down-16x16")
            .removeClass('rbx-icon-down-16x16').addClass('rbx-icon-right-16x16');
    });
}

    SetupTooltip = function () {
        // tooltips
        if (!('ontouchstart' in window)) {
            $('[data-toggle="tooltip"]').tooltip({
                placement: 'bottom'
            });
        }
    }

    UpdateTooltip = function(element, newTitle) {
        $(element).attr('title', newTitle).tooltip('fixTitle');
    }

    SetupPopover = function () {
    // popover with HTML prototypes
    $('[data-toggle="popover"]').popover({
        html: true,
        placement: 'bottom',
        content: function () {
            var selector = $(this).attr('data-bind');
            return $('[data-toggle="' + selector + '"]').html();
        },
    });

    $('body').on('click touchstart', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for links that trigger popups
            //the 'has' for icons within a link that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    }); 
}
// configure mCustomScrollbar
    SetupScrollbar = function () {
    //scroll bar
    $('[data-toggle="scrollbar"]').mCustomScrollbar({
        autoHideScrollbar: false,
        autoExpandScrollbar: false,
        scrollInertia: 500,
        mouseWheel: {
            preventDefault: true
        }
    });
}

// configure twbsPagination
    SetupPagination = function () {
        // pagination
        var pagination = $('[data-toggle="pagination"]');
        var pager = $('[data-toggle="pager"]');
        if (pagination.twbsPagination || pager.twbsPagination) {
            pagination.twbsPagination({
            totalPages: 35,
            visiblePages: 7,
            first: 1,
            last: 35,
            prev: '<i class="rbx-icon-left"></i>',
            next: '<i class="rbx-icon-right"></i>',
        });


            pager.twbsPagination({
            isPager: true,
            totalPages: 35,
            visiblePages: 7,
            first: 1,
            last: 35,
            prev: '<i class="rbx-icon-left"></i>',
            next: '<i class="rbx-icon-right"></i>',
        });
    }
    
}
    Placeholder = function () {
    $('input[placeholder]').focus(function () {
        var input = $(this);
        if (input.val() == input.attr("placeholder")) {
            input.val('');
            input.removeClass("rbx-placeholder");
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr("placeholder")) {
            input.addClass("rbx-placeholder");
            input.val(input.attr("placeholder"));
        }
    });
}
    IsTruncated = function () {
    $(".rbx-para-overflow").each(function () {
        var elem = $(this);
        var clone = $(this).clone().hide().height("auto");
            clone.width(elem.width());

        $("body").append(clone);
            if (clone.height() <= elem.height()) {
            elem.removeClass("rbx-para-overflow");
        }
        clone.remove();
    });

    $(".rbx-text-overflow").each(function () {
        var elem = $(this);
        var clone = $(this).clone().hide().width("auto");
            $("body").append(clone);
            if (clone.width() <= elem.width()) {
                elem.removeClass("rbx-text-overflow");
            }
            clone.remove();
        });
    }

    truncateDynamic = function () {
        $(".rbx-text-overflow-dynamic").each(function () {
            var elem = $(this);
            var clone = $(this).clone().hide().width("auto");
        $("body").append(clone);
        if (clone.width() <= elem.width()) {
            elem.removeClass("rbx-text-overflow");
        }
            else {
                elem.addClass("rbx-text-overflow");
            }
        clone.remove();
    });
}
    
    return {
        SetupTabs: SetupTabs,
        SetupDropdown: SetupDropdown,
        SetupAccordion: SetupAccordion,
        SetupTooltip: SetupTooltip,
        UpdateTooltip: UpdateTooltip,
        SetupPopover: SetupPopover,
        SetupScrollbar: SetupScrollbar,
        SetupPagination: SetupPagination,
        Placeholder: Placeholder,
        IsTruncated: IsTruncated,
        TruncateDynamic: truncateDynamic
    }
}();

$(function () {
    Roblox.BootstrapWidgets.SetupTabs();
    Roblox.BootstrapWidgets.SetupDropdown();
    Roblox.BootstrapWidgets.SetupAccordion();
    Roblox.BootstrapWidgets.SetupTooltip();
    Roblox.BootstrapWidgets.SetupPopover();
    Roblox.BootstrapWidgets.SetupScrollbar();
    Roblox.BootstrapWidgets.SetupPagination();

    if (typeof Modernizr != "undefined" && !Modernizr.input.placeholder) {
        Roblox.BootstrapWidgets.Placeholder();
    }

    Roblox.BootstrapWidgets.IsTruncated();
});
