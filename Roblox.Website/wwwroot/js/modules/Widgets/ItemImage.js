Roblox.define('Widgets.ItemImage', [], function () {

    var config = {
        selector: '.roblox-item-image',
        //endpoint: '/item-thumbnails?jsoncallback=?'
        endpoint: '/thumbs/itemimage.ashx?jsoncallback=?'
    };

    function parseParams(element) {
        var e = $(element);
        return {
            imageSize: e.attr('data-image-size') || 'large',
            imageSizeX: e.attr('data-image-size-x') || '420',
            imageSizeY: e.attr('data-image-size-y') || '420',
			isStatic: typeof e.attr('data-is-static') !== 'undefined',
            noClick: typeof e.attr('data-no-click') !== 'undefined',
            noOverlays: typeof e.attr('data-no-overlays') !== 'undefined',
            assetId: e.attr('data-item-id') || 0
        };
    }
    
    //For some reason this function only exists in the old obfuscated 2013 js
    function onload(img, data) {
        var bcOverlay, limitedOverlay, deadlineOverlay, iosOverlay, saleOverlay, newOverlay;
        data.bcOverlayUrl != null && (bcOverlay = $('<img>').attr('src', data.bcOverlayUrl).attr('alt', 'Builders Club').css('position', 'absolute').css('left', '0').css('bottom', '0').attr('border', 0),
        img.after(bcOverlay)),
        data.limitedOverlayUrl != null && (limitedOverlay = $('<img>').attr('alt', data.limitedAltText).css('position', 'absolute').css('left', '0').css('bottom', '0').attr('border', 0),
        data.bcOverlayUrl != null && (data.imageSize == 'small' ? limitedOverlay.load(function() {
            limitedOverlay.css('left', 34)
        }) : limitedOverlay.load(function() {
            limitedOverlay.css('left', 46)
        })),
        limitedOverlay.attr('src', data.limitedOverlayUrl),
        img.after(limitedOverlay)),
        data.deadlineOverlayUrl != null && (deadlineOverlay = $('<img>').attr('alt', 'Deadline').attr('border', 0),
        deadlineOverlay.attr('src', data.deadlineOverlayUrl),
        img.after(deadlineOverlay)),
        data.iosOverlayUrl != null ? (iosOverlay = $('<img>').attr('alt', 'iOS Only').attr('border', 0),
        iosOverlay.attr('src', data.iosOverlayUrl),
        img.after(iosOverlay)) : data.saleOverlayUrl != null ? (saleOverlay = $('<img>').attr('alt', 'Sale').attr('border', 0),
        saleOverlay.attr('src', data.saleOverlayUrl),
        img.after(saleOverlay)) : data.newOverlayUrl != null && (newOverlay = $('<img>').attr('alt', 'New').attr('border', 0).css(style='position', 'absolute').css('top', '0px').css('right', '0px'),
        newOverlay.attr('src', data.newOverlayUrl),
        img.after(newOverlay))
    }

    function load(elements, attempt) {
        if ($.type(elements) !== 'array')
            elements = [elements];

        while (elements.length > 0) {
            var chunk = elements.splice(0, 10);

            var i, params = [];
            for (i = 0; i < chunk.length; i++) {
                params.push(parseParams(chunk[i]));
            }

            $.getJSON(config.endpoint, { params: JSON.stringify(params) }, function (elements, params) {
                return function (results) {
                    var incompletes = [];
                    for (var i = 0; i < results.length; i++) {
                        var data = results[i];
                        if (data == null)
                            continue;

                        var element = elements[i];
						//if (element.childNodes) {
						//skip thumbnails that've already been processed
						//if (element.childNodes.length < 1) {
                        var imageContainer = $(element);

                        var innerDiv = $('<div>').css('position', 'relative').css('overflow', 'hidden');
                        imageContainer.html(innerDiv);
                        imageContainer = innerDiv;

                        if (!params[i].noClick) {
                            var a = $('<a>').attr('href', data.url);
                            imageContainer.append(a);
                            imageContainer = a;
                        }

                        if (params[i].imageSize !== 'custom') {
							if (Roblox.GlobalImageSizes) {
                            var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', Roblox.GlobalImageSizes[params[i].imageSize]).attr('width', Roblox.GlobalImageSizes[params[i].imageSize]).addClass('original-image modal-thumb');
							}else {
							var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', 110).attr('width', 110).addClass('original-image modal-thumb');
							}
						} else{
							var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', params[i].imageSizeY).attr('width', params[i].imageSizeX).addClass('original-image modal-thumb');
						}
                        img.load(function (innerDiv, element, img, data) {
                            return function () {
                                innerDiv.width(element.width);
                                innerDiv.height(element.height);
                                //jeez
                                onload(img, data);
                            };
                        } (innerDiv, element, img, data));
                        imageContainer.append(img);
                        img.attr('src', data.thumbnailUrl);

                        if (!data.thumbnailFinal) {
                            incompletes.push(element);
                        }
						//}
						//}
                    }

                    attempt = attempt || 1;
                    if (attempt < 4)
                        window.setTimeout(function () { load(incompletes, attempt + 1); }, attempt * 2000);
                };
            } (chunk, params));
        }
    }

    function populate() {
        load($(config.selector + ":empty").toArray());
    }

    return {
        config: config,
        load: load,
        populate: populate
    };
});
