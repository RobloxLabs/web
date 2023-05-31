;// DropDownNav.js
typeof Roblox=="undefined"&&(Roblox={}),(Roblox.DropDownNav=function(){function i(n){var i=$(n.target),f,u;i.attr("drop-down-nav-button")||(i=i.parents("[drop-down-nav-button]")),i.addClass("active"),f=i.attr("drop-down-nav-button"),u=t.filter('[drop-down-nav-container="'+f+'"]'),u.show(),t.not(u).hide(),r.not(i).removeClass("active"),n.stopPropagation(),i.trigger("showDropDown")}function u(n){$("[drop-down-nav-button]").unbind("click",f),i(n),$("[drop-down-nav-button]").bind("mouseleave",e)}function e(){n(),$("[drop-down-nav-button]").unbind("mouseleave",e)}function f(t){$("[drop-down-nav-button]").unbind("mouseenter",u),i(t),$(document).bind("click",function(){n()}),$("[drop-down-nav-button]").bind("click",o)}function o(){$(document).unbind("click",function(){n()}),n(),$("[drop-down-nav-button]").bind("click",i)}function n(){t.hide(),r.removeClass("active")}var t,r;$(function(){t=$("[drop-down-nav-container]"),r=$("[drop-down-nav-button]"),$("[drop-down-nav-button]").bind("click",f),$("[drop-down-nav-button]").bind("mouseenter",u)})})();
/*;(function () {
    //by convention, all dropdownNav styling should use the class 'active'
    //apply attr 'data-drop-down-nav-container' to the container
    //apply attr 'drop-down-nav-button' to the button
    //this module will run it's self; also note it works for click and hover
    var dropDownNavContainers;
    var dropDownNavButtons;
      
    $(function() {
        dropDownNavContainers = $('[data-drop-down-nav-container]');
        dropDownNavButtons = $('[drop-down-nav-button]');
        
        $('[drop-down-nav-button]').bind('click', openDropDownNavClick);
        $('[drop-down-nav-button]').bind('mouseenter', openDropDownNavHover);
    });

    function showDropDownNav(event) {
        var clicked = $(event.target);
        if (!clicked.attr('drop-down-nav-button')) {
            clicked = clicked.parents('[drop-down-nav-button]');
        }
        clicked.addClass('active');
        var navName = clicked.attr('drop-down-nav-button');
        var navcontainer = dropDownNavContainers.filter('[data-drop-down-nav-container="' + navName + '"]');
        navcontainer.show();
        dropDownNavContainers.not(navcontainer).hide();
        dropDownNavButtons.not(clicked).removeClass('active');
        event.stopPropagation();
        clicked.trigger('showDropDown');
        
    }
    function openDropDownNavHover(event) {
        $('[drop-down-nav-button]').unbind('click', openDropDownNavClick);
        showDropDownNav(event);
        $('[drop-down-nav-button]').bind('mouseleave', closeDropDownNavHover);
    }
    function closeDropDownNavHover() {
        hideDropDownNavs();
        $('[drop-down-nav-button]').unbind('mouseleave', closeDropDownNavHover);
    }
    
    function openDropDownNavClick(event) {
        $('[drop-down-nav-button]').unbind('mouseenter', openDropDownNavHover);
        showDropDownNav(event);
        $(document).bind('click', function(event) {
            hideDropDownNavs();
        });
        $('[drop-down-nav-button]').bind('click', closeDropDownNavClick);
    }
    function closeDropDownNavClick() {
        $(document).unbind('click', function(event) {
            hideDropDownNavs();
        });
        hideDropDownNavs();
        $('[drop-down-nav-button]').bind('click', showDropDownNav);
    }

    function hideDropDownNavs() {
        dropDownNavContainers.hide();
        dropDownNavButtons.removeClass('active');
    }
})();*/