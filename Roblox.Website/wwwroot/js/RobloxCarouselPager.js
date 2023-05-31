var Roblox = Roblox || {};

Roblox.CarouselDataPager = function (rootElem, settingsData, callbackFunction) {
    if (!(this instanceof Roblox.CarouselDataPager)) {
        return new Roblox.CarouselDataPager(rootElem, settingsData, callbackFunction);
    }

    var totalNumOfObjects;
    var currentIndex = 0; //index at top of of viewing window
    var root = rootElem;
    var settings = $.extend({}, this.defaultSettings, settingsData);
    var self = this;
    var objectHeight = 50; //we need it set to something in case we get no objects to get a width and height
    var objectWidth = 50;

    var arrowClick = function (e) {
        if ($(this).hasClass('disabled')) {
            return;
        }
        var direction = e.data.direction;
        var nextIndex = 0;

        if (direction == 'prev') {
            nextIndex = currentIndex - settings.pageShift;
        } else if (direction == 'next') {
            nextIndex = currentIndex + settings.pageShift;
        }
        changeIndex(nextIndex);
    };

    var changeIndex = function (newIndex) {
        if (newIndex <= 0) { //equals sign so that we disable the arrow
            newIndex = 0;
            root.find('.arrow-prev').addClass('disabled');
        } else if (newIndex >= totalNumOfObjects - (settings.windowDisplay)) {
            newIndex = totalNumOfObjects - (settings.windowDisplay);
            root.find('.arrow-next').addClass('disabled');
        }
        if (newIndex > currentIndex) { //going down
            root.find('.arrow-prev').removeClass('disabled');
        }
        if (totalNumOfObjects > settings.windowDisplay && (newIndex < currentIndex || newIndex == 0)) { //have enough items to page, and going up or at first
            root.find('.arrow-next').removeClass('disabled');
        }

        if (self.isVertical(settings)) {
            root.find('.content-inner').animate({ 'top': '-' + newIndex * (self.isVertical(settings) ? objectHeight : objectWidth) + 'px' });
        } else {
            root.find('.content-inner').animate({ 'left': '-' + newIndex * (self.isVertical(settings) ? objectHeight : objectWidth) + 'px' });
        }

        currentIndex = newIndex;
    };

    this.updatePagerContent = function () {
        totalNumOfObjects = root.find('.content-inner').children().length;
        if (totalNumOfObjects != 0) {
            var obj = root.find('.content-inner').children().first();
            objectHeight = obj.outerHeight(true);
            objectWidth = obj.outerWidth(true);
        }
        if (self.isVertical(settings)) {
            $('.content-outer').css({
                'height': (objectHeight * settings.windowDisplay) + 'px'
            });
        } else {
            $('.content-outer').css({
                'width': (objectWidth * settings.windowDisplay) + 'px'
            });
        }
        root.find('.arrow-next').removeClass('disabled');
        if (totalNumOfObjects <= settings.windowDisplay) {
            root.find('.arrow-next').addClass('disabled');
        }

        if (callbackFunction != undefined) {
            callbackFunction(root);
        }

        changeIndex(0);
    };

    /* construct the pager */
    totalNumOfObjects = root.children().length;
    if (totalNumOfObjects != 0) {
        var obj = root.children().first();
        objectHeight = obj.outerHeight(true);
        objectWidth = obj.outerWidth(true);
    }

    var prevArrow = $('<div class="arrow-prev"></div>');
    var nextArrow = $('<div class="arrow-next"></div>');
    var contentIn = $('<div class="content-inner"></div>').css({
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'width': (self.isVertical(settings) ? '100%' : objectWidth * totalNumOfObjects + 'px'),
        'height': (self.isVertical(settings) ? 'auto' : objectHeight + 'px')
    }).html(root.html());
    var contentOut = $('<div class="content-outer"></div>').css({
        'overflow': 'hidden',
        'height': (self.isVertical(settings) ? (objectHeight * settings.windowDisplay) + 'px' : 'auto'),
        'width': (self.isVertical(settings) ? 'auto' : objectWidth * settings.windowDisplay + 'px'),
        'position': 'relative'
    }).append(contentIn);

    root.html('').append(prevArrow).append(contentOut).append(nextArrow);
    prevArrow.addClass('disabled').click({ 'direction': 'prev' }, arrowClick);
    if (totalNumOfObjects <= settings.windowDisplay) {
        nextArrow.addClass('disabled');
    }
    nextArrow.click({ 'direction': 'next' }, arrowClick);

    if (callbackFunction != undefined) {
        callbackFunction(root);
    }

    return this;
};

Roblox.CarouselDataPager.prototype.defaultSettings = {
    'windowDisplay': 5, //# of objects displayed in window
    'pageShift': 4, //# of objects to shift when paging
    'orientation': 'vertical'
};
Roblox.CarouselDataPager.prototype.isVertical = function (settings) {
    return settings.orientation === 'vertical';
};