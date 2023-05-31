$(function () {
	if (!Roblox) {
		Roblox = {};
	}
	if (!Roblox.DeveloperProductsListing) {
		Roblox.DeveloperProductsListing = {};
	}
	Roblox.DeveloperProductsListing.init = function () {
		var $parentContainer = $('#DevProducts').parent();
		$parentContainer.trigger('onViewChange', ['listing']);
		$('#DevProducts').bind('click', function(event) {
			var $target = $(event.target);
			if ($target.is('span.next') || $target.is('span.previous')) {
				$target = $target.closest('a');
			} else if ($target.is('td.edit')) {
				$target = $('a.edit', $target);
			} else if ($target.is('div.createNewButtonSection')) {
				$target = $('#createNewButton', $target);
			}
			if ($target.is('.nextPager') || $target.is('.prevPager') || $target.is('a.edit') || $target.is('#createNewButton')) {
				if ($target.data('url').length > 0) {
					Roblox.DeveloperProductsListing.onAjaxStart();
					$.ajax({
						cache: false,
						type: "GET",
						url: $target.data('url') 
					})
						.done(function(data) {
							Roblox.DeveloperProductsListing.onDeveloperProductsReceived(data, $('#DevProducts').parent());
						}).fail(function() {
							$('#DeveloperProductsLoading').hide();
							$('#DeveloperProductsError').show();
						});
				}
				return false;
			}
			return true;
		});
		$parentContainer.unbind('onRefreshed').bind('onRefreshed', function(event) {
			var $container = $(this);
			Roblox.DeveloperProductsListing.onAjaxStart();
			$.ajax({
				cache: false,
				type: "GET",
				url: $container.attr('src')
			}).done(function(data) {
				Roblox.DeveloperProductsListing.onDeveloperProductsReceived(data, $container);
			}).fail(function() {
				$('#DeveloperProductsLoading').hide();
				$('#DeveloperProductsError').height($('#DeveloperProductsInnerContainer').height());
				$('#DeveloperProductsError').show();
				
			});
		});
		$parentContainer.unbind('onActionComplete').bind('onActionComplete', function(event, data) {
			Roblox.DeveloperProductsListing.onDeveloperProductsReceived(data, $(this));
			Roblox.DeveloperProductsListing.init();
		});
	};
	Roblox.DeveloperProductsListing.init();

	Roblox.DeveloperProductsListing.onAjaxStart = function () {
		var $developerProductsInnerContainer = $('#DeveloperProductsInnerContainer');
		$developerProductsInnerContainer.hide();
		$('#DeveloperProductsLoading').height($developerProductsInnerContainer.height());
		$('#DeveloperProductsLoading').show();
		$('#DeveloperProductsError').hide();
	};
	Roblox.DeveloperProductsListing.onDeveloperProductsReceived = function(data, $dataContextElement) {
		$('#DeveloperProductsLoading').hide();
		$dataContextElement.html(data);
		Roblox.DeveloperProductsListing.init();
	};
});	