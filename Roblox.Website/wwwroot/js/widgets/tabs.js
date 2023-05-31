$(function () {
    var tc = $(".tab-container"),
        managesHash = tc.filter(".tab-history-hash");

    /////////// Tab Change handler.
    function changeTab(tabTop) {
        var tabButton = $(tabTop),
            tabSet = tabButton.parent(),
            tabContainer = tabSet.next().children().eq(tabButton.index());

        $.each([tabButton, tabContainer], function (idx, jqElement) {
            jqElement.addClass('tab-active').siblings().removeClass('tab-active');
        });        
    }
    tc.children("div").on("click", function (ev) {
        var tabButton = $(this);
        changeTab(this);
        tabButton.parent().trigger("tabsactivate", { newTab: tabButton });
    });


    ////////// Hash manager: To use, have friendly IDs on content divs. Top div has .tab-history-hash
    if (managesHash.length) {
        function getCurrentContentTabSelector() {
            return "#" + managesHash.next().children(".tab-active").attr('id');
        }
        function changeTabToGivenContentSelector(cs) {
            var idx = $(cs).index();
            if (idx !== -1) {
                changeTab(managesHash.children().eq(idx));
            }
        }

        if (!window.location.hash) {
            var baseTab = getCurrentContentTabSelector();
        } else {
                changeTabToGivenContentSelector(window.location.hash);
        }

        managesHash.on("tabsactivate", function() {
            history.pushState({}, "", getCurrentContentTabSelector());
        });
        $(window).on("popstate", function (ev) {    // on back-button
            changeTabToGivenContentSelector(!window.location.hash ? baseTab : window.location.hash);
        }); 
    }
});