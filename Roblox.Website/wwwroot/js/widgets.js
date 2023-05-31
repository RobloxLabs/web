(function () {
    
    var roblox_domains = {
        www: '//sitetest1.roblonium.com'
        //Henlo :)
    };

    function loadScript(id, src, onload) {
        var js, fjs = document.getElementsByTagName('script')[0];
        if (!document.getElementById(id)) {
            js = document.createElement('script');
            js.id = id;
            js.src = src;
            if (typeof onload !== 'undefined') {
                js.onload = onload;
                js.onreadystatechange = function () {
                    if (this.readyState == 'complete' || this.readyState == 'loaded')
                        onload();
                };
            }
            fjs.parentNode.insertBefore(js, fjs);
        }
    }

    function registerWidgets() {

        Roblox.require('Widgets.AvatarImage', function (avatarImage) {
            avatarImage.config.endpoint = roblox_domains.www + avatarImage.config.endpoint;
            avatarImage.populate();
        });
        Roblox.require('Widgets.ItemImage', function (itemImage) {
            itemImage.config.endpoint = roblox_domains.www + itemImage.config.endpoint;
            itemImage.populate();
        });
        Roblox.require('Widgets.PlaceImage', function (placeImage) {
            placeImage.config.endpoint = roblox_domains.www + placeImage.config.endpoint;
            placeImage.populate();
        });
        //Why wasn't this here?
        Roblox.require('Widgets.GroupImage', function (groupImage) {
            groupImage.config.endpoint = roblox_domains.www + groupImage.config.endpoint;
            groupImage.populate();
        });
    }
	
		function waitForImageSizes(){
		if(typeof Roblox.GlobalImageSizes !== "undefined"){
			registerWidgets();
		}
		else{
			setTimeout(waitForImageSizes, 250);
		}
		}

    if (typeof Roblox === 'undefined' || typeof Roblox.require === 'undefined') {
        loadScript('roblox', roblox_domains.www + '/js/roblox.js', registerWidgets);
    }
    else {
		Roblox.GlobalImageSizes = {
			tiny: 48,
            small: 110,
            medium: 230,
            big: 320,
            native: 420
        };
        waitForImageSizes()
    }

} ());
