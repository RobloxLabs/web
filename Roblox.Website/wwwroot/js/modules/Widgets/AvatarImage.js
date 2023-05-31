Roblox.define('Widgets.AvatarImage', [], function () {

    var config = {
        selector: '.roblox-avatar-image',
        //endpoint: '/avatar-thumbnails?jsoncallback=?'
        endpoint: '/thumbs/avatarimage.ashx?jsoncallback=?'
    };

    function parseParams(element) {
        var e = $(element);
        return {
            imageSize: e.attr('data-image-size') || 'medium',
			imageSizeX: e.attr('data-image-size-x') || '70',
			imageSizeY: e.attr('data-image-size-y') || '70',
            noClick: typeof e.attr('data-no-click') !== 'undefined',
            noOverlays: typeof e.attr('data-no-overlays') !== 'undefined',
            userId: e.attr('data-user-id') || 0,
            userOutfitId: e.attr('data-useroutfit-id') || 0,
            name: e.attr('data-useroutfit-name') || ''
        };
    }

    function onload(img, data) {
        if (data.bcOverlayUrl != null) {
            var bcOverlay = $('<img>').attr('src', data.bcOverlayUrl).attr('alt', 'Builders Club').css('position', 'absolute').css('left', '0').css('bottom', '0').attr('border', 0).addClass("bc-overlay");
            img.after(bcOverlay);
        }
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
                        var imageContainer = $(element);

                        var innerDiv = $('<div>').css('position', 'relative');
                        imageContainer.html(innerDiv);
                        imageContainer = innerDiv;

                        if (!params[i].noClick) {
                            var a = $('<a>').attr('href', data.url);
                            imageContainer.append(a);
                            imageContainer = a;
                        }

						if (params[i].imageSize !== 'custom') {
							if (Roblox.GlobalImageSizes) {
								var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', Roblox.GlobalImageSizes[params[i].imageSize]).attr('width', Roblox.GlobalImageSizes[params[i].imageSize]);
							} else{
								var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', 110).attr('width', 110);
							}
						} else{
							var img = $('<img>').attr('title', data.name).attr('alt', data.name).attr('border', 0).attr('height', params[i].imageSizeX).attr('width', params[i].imageSizeY);
						}
						if (!params[i].noOverlays) {
                        img.load(function (innerDiv, element, img, data) {
                            return function () {
                                innerDiv.width(element.width);
                                innerDiv.height(element.height);

                                onload(img, data);
                            };
                        } (innerDiv, element, img, data));
						}
                        imageContainer.append(img);
                        img.attr('src', data.thumbnailUrl);

                        if (!data.thumbnailFinal) {
                            incompletes.push(element);
                        }

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