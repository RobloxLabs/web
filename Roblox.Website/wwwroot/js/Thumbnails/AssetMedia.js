if (typeof Roblox === "undefined") {
	Roblox = {};
}
if (typeof Roblox.AssetMedia === "undefined") {
	Roblox.AssetMedia = {};
}
if (typeof Roblox.AssetMedia.Resources === "undefined") {
	Roblox.AssetMedia.Resources = {};
}

Roblox.AssetMedia.Init = function () {
	var autotransition = false;
	var muted = true;

	function autotransitionNext() {
		if (!autotransition)
			return;

		var next = $('.SelectedYouTubeGalleryIcon').next();
		if (next.length > 0)
			transitionGallery(next);
	}

	function transitionGallery(divSmallGalleryItem) {
		var thisItem = $(divSmallGalleryItem).find('.smallGalleryThumbItem');
		var youTubeVideoItem = thisItem.find('.youtube-video-player');
		if (youTubeVideoItem.length != 0) {
			thisItem = $(youTubeVideoItem.children()[0].cloneNode(true)); //jQuery has an issue with IE9 and .clone() for objects - $(youTubeVideoItem.children()[0]).clone();
			if (thisItem.is("object") || thisItem.is("iframe")) {
				thisItem.height('230');
				thisItem.attr('Height', '230px'); // Iframes need height and width?
				thisItem.width('420');
				thisItem.attr('Width', '420px');
				var video = RobloxYouTubeVideoManager.GetVideo(thisItem.attr('id'));
				video.Muted = muted;
				video.Autoplay = true;
			}
		} else {
			var assetImageChild = thisItem.find('img')[0]; // Asset Image
			thisItem = $(assetImageChild).clone();
			thisItem.height('230');
			thisItem.width('420');
			setTimeout(function () { autotransitionNext(); }, 5000);
		}

		// Clear our any existing transitions incase they're going fast through them.
		$('#divTransitionLargeGalleryItem').remove();
		$('#ItemThumbnail').append("<div id='divTransitionLargeGalleryItem' style='display: none; position: absolute;'>");
		$('#divTransitionLargeGalleryItem').append(thisItem);
		$('#divTransitionLargeGalleryItem').fadeIn('slow', function () {
		});
		$('#bigGalleryThumbItem').fadeOut('slow', function () {
			$('#divTransitionLargeGalleryItem').attr('id', 'bigGalleryThumbItem');
			$(this).remove();
		});
		$('.divSmallGalleryItem').removeClass('SelectedYouTubeGalleryIcon');
		$(divSmallGalleryItem).addClass('SelectedYouTubeGalleryIcon');
	}

	function initYoutubeVideo(ranPlayerId, videoId, width, height) {
		function videoStateChange(newState, playerId, videoObject) {
			if (newState == RobloxYouTube.Events.States.Ended) {
				muted = videoObject.Player().isMuted();
			}
		}
		var ytPlayerId = ranPlayerId;
		var video = RobloxYouTubeVideoManager.AddVideo(new RobloxYouTubeVideo(ytPlayerId, videoStateChange));
		var youTubeVideoId = videoId;
		var divToFillId = "divYouTubeNotSupported_ytPlayerId" + ranPlayerId;
		var chromeless = false;
		var autoplay = false;
		video.Init(youTubeVideoId, chromeless, divToFillId, width, height, autoplay);
	}

	$(".youtube-video-player").each(function () {
		var uniqueRandomId = $(this).data("unique-random-id");
		var uniqueHash = $(this).data("unique-hash");
		var isMainVideo = $(this).data("main-media");
		var width = $(this).data("width");
		var height = $(this).data("height");
		if (height !== undefined && width !== undefined) {
            initYoutubeVideo(uniqueRandomId, uniqueHash, width, height);
        } else if (isMainVideo) {
			initYoutubeVideo(uniqueRandomId, uniqueHash, 420, 230);
		} else {
			initYoutubeVideo(uniqueRandomId, uniqueHash, 120, 70);
		}
	});

	$('.youTubeVideoOverlay').click(function () {
		muted = false;
		transitionGallery($(this).parent());
	});
	var smallGalleryWidth = $("#ThumbnailDisplayContainer").data("small-gallery-width");
	$("#GalleryScrollContainer").width(smallGalleryWidth);
	
	if ($("#ThumbnailDisplayContainer").data('iseditable')) {
		$("#GalleryScrollContainer").sortable({
			update: function() { updateSort(); }
		});
	}

	function updateSort() {
		var sortOrder = [];
		$('.divSmallGalleryItem').each(function (i) {
		    var itemId = $(this).data('asset-media-item-id');
			sortOrder[i] = itemId;
		});
		var sortOrderString = '';
		for (key in sortOrder) {
			sortOrderString += sortOrder[key] + ',';
		}
		var sortUrl = $("#ThumbnailDisplayContainer").data('sort-url');
		$.post(sortUrl, { "sort": sortOrderString });
	}
};