/* Usage:
What it does:
If the mouse moves to the right, then there is a delay of 1 second before the hover state refreshes;
otherwise hover state refreshes immediately
Also initializes click state for dropdowns.
Usage:
roblox-hierarchicaldropdown in your dropdown div
data-delay for special handling of certain list elements. possible values are "always", "never", & "ignore"
assumes <li> for list elements, and <ul> for slideout list elements inside those list elements
*/

Roblox.define('Widgets.HierarchicalDropdown', [], function () {

    //Fix for Hover effects in IE7
    function setSlideoutWidth(currentlyActiveMenu) {
        var maxWidth = currentlyActiveMenu.width();
        currentlyActiveMenu.find('li').each(function (index, elem) {
            elem = $(elem);
            if (elem.outerWidth() > maxWidth) {
                maxWidth = elem.outerWidth();
            }
        });
        currentlyActiveMenu.find('li').each(function (index, elem) {
            elem = $(elem);
            if (elem.width() < maxWidth) {
                elem.width(maxWidth);
            }
        });

    }

    function init() {
        var currentX = 0;
        var dir = 0;

		var dropdownButton = $('.roblox-hierarchicaldropdownbutton');
        var dropdown = $('.roblox-hierarchicaldropdown');
		var i = false;
        var listItems = dropdown.find('li');
        var subLists = dropdown.find('li ul');
        var hoverOverSublist = dropdown.find('li ul[hover=true]');
		
        dropdownButton.mouseover(function() {
            dropdownButton.addClass('hover');
        });
		dropdownButton.mouseout(function() {
			if (i) dropdownButton.removeClass('hover');
        });
		dropdownButton.click(function() {
            return dropdown.fadeOut('fast'), i ? (i = false, dropdownBUtton.removeClass('hover')) : (dropdownButton.addClass('hover'), dropdown.fadeIn('fast'), i = true), false;
        });
		$(document).click(function() {
            dropdown.fadeOut('fast');
			i = false;
			dropdownButton.removeClass('hover');
        });

        subLists.mouseover(function () {
            $(this).attr('hover', 'true');
        });
        subLists.mouseout(function () {
            $(this).attr('hover', 'false');
        });

        listItems.mouseover(function () {
            var delay = $(this).data('delay');
            if (delay == 'ignore') return; // for example, the grey divider
            if (hoverOverSublist.length != 0) return; // if already hovering over sublist

            // add a hover effect so we know what the mouse is over right now
            // and can show the appropriate menu after a delay
            $(this).attr('hover', 'true');

            // if the mouse is moving to the right or if special delay attribute
            if (delay != 'never' && (dir == 1 || delay == 'always')) {
                window.setTimeout(function () {
                    // if it's hovering over a slideout menu, don't show anything
                    if (hoverOverSublist.length != 0)
                        return;

                    // show the sublist of whatever is being hovered over right now
                    var currentlyActiveMenu = dropdown.find('li[hover=true] ul');

                    subLists.hide();

                    if (currentlyActiveMenu.length != 0) {
                        currentlyActiveMenu.show();
                        setSlideoutWidth(currentlyActiveMenu);
                    }
                }, 1000);
            } else {
                subLists.hide();
                var activeMenu = $(this).find('ul');
                activeMenu.show(); // show the associated sublist
                setSlideoutWidth(activeMenu);
            }
        });

        // remove the hover attribute on mouseout of the element
        listItems.mouseout(function () {
            $(this).removeAttr('hover');
        });

        // hide all slideout menus when the mouse steps out of the entire dropdown div
        dropdown.mouseleave(function () {
            window.setTimeout(function () {
                subLists.hide();
            }, 100);
            currentX = 0;
            dir = 0;
        });

        // calculate the direction the mouse is moving in when hovering over the dropdown
        // dir is used when calculating whether slideout menus should open or not
        dropdown.mousemove(function (event) {
            var oldX = currentX;
            currentX = event.pageX;
            if (oldX == currentX || oldX == 0) dir = 0;
            if (oldX < currentX) dir = 1;
            else dir = -1;
        });
    }

    var my = {
        init: init,
		InitializeDropdown: init
    };
    return my;
});
