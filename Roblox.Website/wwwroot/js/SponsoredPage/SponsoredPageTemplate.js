var Roblox = Roblox || {};
Roblox.SponsoredPageTemplate = function () {
    'use strict';
    function MoveMagicLine(tab) {
        var $magicLine = $('#magic-line');        
        if ($magicLine.data("curtab") != tab && !$magicLine.is(":animated")) {
            $magicLine.data("curtab", tab);
            $magicLine.animate({                
                left: ($($("#TopLeftNavLinks").children()[tab]).children().position().left + (25 / 2)) + 'px',
                width: $($("#TopLeftNavLinks").children()[tab]).width()
            });                        
        } 
    }

    function scrollTo(tab, target) {
        var dest = $(target).offset().top;
        $('html, body').animate({
            scrollTop: dest,
            easing: "swing"
        }, 600);        
        MoveMagicLine(tab);

        return false;
    }

    /* ---------------- Ready ---------------- */
    $(function () {        
        $('.prizes-container .pager-container').html($('.prizes-container .content-inner').html());
        $('.related-items-container .pager-container').html($('.related-items-container .content-inner').html());

        var pagerSettings = {
            'windowDisplay': 1, //# of objects displayed in window
            'pageShift': 1, //# of objects to shift when paging
            'orientation': 'horizontal'
        };

        var pagerCallback = function (rootElem) {
            rootElem.find('.item-container').each(function () {
                var elem = $(this);
                var width = elem.width() + 30;
                var str = elem.find('.name a');
                str.html(fitStringToWidthSafe(str.html(), width));
            });
        };

        var prizesPager = Roblox.CarouselDataPager($('.prizes-container .pager-container'), pagerSettings, pagerCallback);
        var relatedItemsPager = Roblox.CarouselDataPager($('.related-items-container .pager-container'), pagerSettings, pagerCallback);

        Roblox.Widgets.ItemImage.populate();

        $('.related-items-container .pager-container .name').each(function (index) {
            var elem = $(this);
            var url = elem.find('a').attr('href');
            var newElem = $('<div>BUY NOW</div>').attr('class', 'buy-link');
            elem.parent().append(newElem);
            elem.parent().find('.buy-link').click(function () {
                window.location.href = url;
            });
        });

        $('.prizes-container').show();
        $('.related-items-container').show();

        $(".item-container").find("a").each(function () { $(this).attr('target', 'blank'); });
        if (Roblox && Roblox.Leaderboards) {
            Roblox.Leaderboards.disableInfiniteScroll();
        }

        function currentSlideTab() {
            var curLoc = $(window).scrollTop() + 5;
            var i = 1;
            var currentTab = -1;
            var order = 0;
            for (i = 1; i <= 10; i++) {
                var target = $('#Target' + i);
                if (target && target.css('top')) {
                    var targetTop = parseInt(target.css('top').replace('px', '')) - 250;
                    if (curLoc >= targetTop) {
                        currentTab = order;                        
                    }
                    order++;
                }
            }            
            return currentTab;
        }
        setInterval(function () {
            MoveMagicLine(currentSlideTab());
        }, 1000);

        MoveMagicLine(0);
    });
    return {
        scrollTo: scrollTo,
        MoveMagicLine: MoveMagicLine
    };
}();