var Roblox = Roblox || {};
Roblox.IDE = Roblox.IDE || {};

Roblox.IDE.CreatePlace = (function () {
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

		function switchTabs(nextTabElem) {
			var currentTab = $('.tab-container div.tab.active');
			currentTab.removeClass('active');
			$('.tab-content').removeClass('tab-active');
			nextTabElem.addClass('active');
			$('#' + nextTabElem.data('id')).addClass('tab-active');
			if (nextTabElem.data('id') == 'access_tab') {
				Roblox.PlayerAccess.initializeChosen(); //this function is defined in Access.js
			}
		}


		finishButton.click(function () {
			if (finishButton.hasClass(buttonDisabledClass)) {
				return false;
			}

			$('#TemplateID').val($(".template.template-selected").attr('placeid'));
			$('form').submit();
			$(this).addClass(buttonDisabledClass);
			$(this).prop("disabled", true);
			showProcessingModal();
			return false;
		});

		$("#cancelButton").click(function () {
			document.location = $(this).data('return-url');
		});

		$('div.tab').bind('click', function () {
			switchTabs($(this));
		});

		function showProcessingModal(closeClass) {
			var modalProperties = { overlayClose: false, opacity: 80, overlayCss: { backgroundColor: "#000" }, escClose: false };

			if (typeof closeClass !== "undefined" && closeClass !== "") {
				$.modal.close("." + closeClass);
			}

			$("#ProcessingView").modal(modalProperties);
		};

		//if we came back to this page due to an invalid model, reselect the template we've selected before, if any
		if ($('#TemplateID').val() != "") {
			$(".template").each(function () {
				if ($(this).attr('placeid') == $('#TemplateID').val()) {
					$(this).addClass("template-selected");
				}
			});
		}

		//go to the Basic Settings Tab if there was an error in form submission
		if ($('div.validation-summary-errors').attr('data-valmsg-summary') == 'true') {
			switchTabs($('.tab-container div.tab[data-id="basicsettings_tab"]'));
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
