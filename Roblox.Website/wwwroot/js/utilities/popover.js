var Roblox = Roblox || {};

Roblox.Popover = (function () {
    "use strict";
    var popoverClassName = ".roblox-popover";
    var popoverContentClassName = ".roblox-popover-content";
    var popoverContainerClassName = ".roblox-popover-container";
    var arrowClassName = ".arrow";
    var hiddenClassName = "hidden";

    function setUpTrianglePosition(popoverContentElm, popoverContainerElm) {
        var popoverContentSelector = $(popoverContentElm);
        var popoverContainerSelector = $(popoverContainerElm);
        var popoverTriggerSelector = $(popoverClassName);
        var popoverTrigerWidth = popoverTriggerSelector.outerWidth();
        var triangleWidth = popoverContentSelector.find(arrowClassName).outerWidth();
        var popoverTriggerOffsetLeft = popoverTriggerSelector.offset().left;
        var right = 0;

        if (popoverContentSelector.hasClass("bottom") || popoverContentSelector.hasClass("top")) {
            var popoverContainerOffsetLeft = $("body").outerWidth() - parseInt(popoverContainerSelector.width() + popoverContainerSelector.offset().left);
            right = $("body").outerWidth() - popoverTriggerOffsetLeft - popoverContainerOffsetLeft - popoverTrigerWidth / 2 - triangleWidth / 2;
            popoverContentSelector.find(arrowClassName).css("right", right);
        }
    }

    function getHiddenClassName(contentSelector) {
        if (contentSelector.data("hiddenClassName")) {
            hiddenClassName = contentSelector.data("hiddenClassName");
        }
        return hiddenClassName;
    }

    function togglePopover() {
        $(popoverClassName).on('click', function (e) {
            var dataBind = $(this).data("bind");
            var popoverContentElm = dataBind ? ("#" + dataBind) : popoverContentClassName;
            var popoverContentSelector = $(popoverContentElm);
            var dataContainer = $(this).data("container");
            var popoverContainerElm = dataContainer ? ("#" + dataContainer) : popoverContainerClassName;
            hiddenClassName = getHiddenClassName(popoverContentSelector);
            if (!popoverContentSelector.hasClass("manual")) {
                popoverContentSelector.toggleClass(hiddenClassName);
            }
            var isOpen = !popoverContentSelector.hasClass(hiddenClassName);
            $(document).triggerHandler("Roblox.Popover.Status", { isOpen: isOpen, eventType: e.type });
            if (!isOpen) {
                setUpTrianglePosition(popoverContentElm, popoverContainerElm);
            }
        });
    }

    function closePopover() {
        $("body").on('click', function (e) {
            $(popoverClassName).each(function () {
                var elemBinded = $(this).data("bind");
                var popoverContentSelector = elemBinded ? $("#" + elemBinded) : $(popoverContentClassName);
                var popoverAlwaysOpenClassName = "roblox-popover-open-always";
                var popoverCloseClassName = "roblox-popover-close";
                hiddenClassName = getHiddenClassName(popoverContentSelector);

                if ($(popoverContentSelector).hasClass(popoverAlwaysOpenClassName)
                     && !$(e.target).hasClass(popoverCloseClassName)) {
                    return false;
                }
                //the 'is' for links that trigger popups
                //the 'has' for icons within a link that triggers a popup
                if ($(e.target).hasClass(popoverCloseClassName)
                    || (!$(this).is(e.target)
                        && $(this).has(e.target).length === 0
                        && popoverContentSelector.has(e.target).length === 0
                        && !popoverContentSelector.hasClass(hiddenClassName)
                        && e.type === "click")
                    ) {
                    popoverContentSelector.addClass(hiddenClassName);
                    $(document).triggerHandler("Roblox.Popover.Status", { isHidden: true, eventType: e.type });
                }
            });
        });
    }

    function init() {
        togglePopover();
        closePopover();
    }

    $(function () {
        init();
    });

    return {
        init: init,
        setUpTrianglePosition: setUpTrianglePosition
    }
})();