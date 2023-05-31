var Roblox = Roblox || {};
Roblox.IDE = Roblox.IDE || {};

Roblox.IDE.NewGame = (function () {
	var buttonEnabledClass = "btn-primary";
	var buttonDisabledClass = "btn-disabled-primary";

	function buildTitle(formatString, argArray) {
		return formatString.replace(/{(\d+)}/g, function (match, number) {
			return typeof argArray[number] !== 'undefined'
				? argArray[number]
				: match;
		});
	}

	function init() {
		var finishButton = $("#finishButton");
		var nameInput = $("input#Name");
		var inputValidator = Roblox.IDE.validator({
			button: finishButton,
			enabledClass: buttonEnabledClass,
			disabledClass: buttonDisabledClass
		}, [
			{
				input: nameInput,
				errorSpan: $('#nameRow span')
			}
		], true);

		/*
		*
		*   Each "step" must have a container with a class named one of the following:
		*
		*   - active: this is the step you're currently on (needs to be a <span>)
		*   - neutral: this is a step that you've been on before and is clickable (needs to be an <a>)
		*   - disabled: this is a step that you haven't reached yet and is not clickable (needs to be a <span>)
		*
		*/
		function setupArrows() {
			$('#stepArrows > span').each(function () {
				if ($('#PublishStep').val() == $(this).children('.number').text()) {
					if ($(this).hasClass('disabled')) {
						$(this).removeClass('disabled');
					}
					else if ($(this).hasClass('neutral')) {
						$(this).removeClass('neutral');
					}
					$(this).addClass('active');
				}
				else if ($('#PublishStep').val() > $(this).children('.number').text() || $('#MaxPublishStepReached').val() >= $(this).children('.number').text()) {
					if ($(this).hasClass('disabled')) {
						$(this).removeClass('disabled');
					}
					else if ($(this).hasClass('active')) {
						$(this).removeClass('active');
					}
					$(this).addClass('neutral');
				}
			});
		}

		setupArrows();
		var finalPublishStep = $('#FinalPublishStep').val();
		//remove the next button on the last page
		
		$('#cancelButton').click(function () {
			var url = Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/ide/publishas/") : "/ide/publishas/";
			window.location.href = url;
			return false;
		});

		finishButton.click(function () {
			if ($('form').valid()) {
				//Set it to the last publish step because we're finishing without going through the whole form (potentially)
				$('#PublishStep').val(finalPublishStep);
			}
			$(this).removeClass(buttonEnabledClass).addClass(buttonDisabledClass);
			$('form').submit();
			return false;
		});

		$("#nextButton.gray-arrow").click(function () {
			var publishStep = parseInt($("#stepArrows span.active").children('.number').text());
			var nextStep = publishStep + 1;
			$('#PublishStep').val(nextStep);
			setupArrows();
			var nextElement = "#stepArrows [data-step-arrow=" + nextStep + "]";
			hideAllTabsAndUpdateNav($(nextElement));
			return false;
		});

		$("#stepArrows [data-step-arrow]").each(function () {
			var currentZindex = finalPublishStep - parseInt($(this).data('step-arrow'));
			$(this).css('z-index', currentZindex);
		});

		$("#stepArrows [data-step-arrow]").click(function () {
			if ($(this).hasClass('disabled')) {
				return false;
			}
			hideAllTabsAndUpdateNav($(this));
		});

		function hideAllTabsAndUpdateNav(currentElement) {
			$("#stepArrows span.active").addClass('neutral');
			$("#stepArrows span.active").removeClass('active');
			currentElement.addClass('active');
			$('#playerAccess').hide();
			$('#permissions').hide();
			$('#basicSettings').hide();
			$('#thumbnails').hide();
			$("#navbar div.selected").removeClass('selected');
			currentElement.removeClass("neutral");
			currentElement.addClass("selected");

			var divSelector = "#partialView [data-step=" + currentElement.data('step-arrow') + "]";
			$(divSelector).show();
			if (parseInt(currentElement.data('step-arrow')) >= finalPublishStep) {
				$('#nextButton').hide();
			} else {
				$('#nextButton').show();
			}
		}

		/* Thumbnail Stuff */
		if (window.external.thumbnailTaken !== undefined && window.external.TakeThumbnail !== undefined) {
			window.external.thumbnailTaken.connect(thumbnailCallback);

			function thumbnailCallback(sourceImageWidth, sourceImageHeight) {
				if (sourceImageWidth === undefined) {
					sourceImageWidth = 1400;
				}
				if (sourceImageHeight === undefined) {
					sourceImageHeight = 1000;
				}

			var desiredHeight = 230;
			var desiredWidth = 420;
			var destAspectRatio = desiredWidth / desiredHeight;
			var srcAspectRatio = sourceImageWidth / sourceImageHeight;
			var relativeAspectRatio = srcAspectRatio / destAspectRatio;
			var newWidth, newHeight;
			if (relativeAspectRatio >= 1.0) {
				newWidth = desiredWidth;
				newHeight = desiredHeight / relativeAspectRatio;
			}
			else {
				newWidth = desiredWidth * relativeAspectRatio;
				newHeight = desiredHeight;
			}
			$("#SnapShotPreview").height(newHeight);
			$("#SnapShotPreview").width(newWidth);
		}

			$("#thumbnailImageFile").change(function () {
				var file = $("#thumbnailImageFile")[0].files[0];
				if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
					var reader = new FileReader();
					reader.onload = function (e) {
						$('#SnapShotPreview').attr('src', e.target.result);
						$("#LoadingImage").hide();
						$("#TakeSnapshotButton").show();
						$("#JoystickImage").hide();
						$("#SnapShotPreview").show();
					};
					reader.readAsDataURL(file);
				}
			});

			$("#TakeSnapshotButton").click(function () {
				$("#LoadingImage").show();
				$(this).hide();
				window.external.TakeThumbnail("input[id='thumbnailImageFile']");
			});
		}

		// Use our format string in the #userData span to build the default name of the place
		// We build it here so that Smartling will pick up the format string, for translation
		var userDataStrings = $("#userData");
		nameInput.val(buildTitle(userDataStrings.text(), [userDataStrings.data("name"), userDataStrings.data("placeNumber")]));

		inputValidator.init();
	}

	$(init);

	return {};
})();
