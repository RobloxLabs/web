$(function () {

	$('#shareWithFriends').click(function () {
		//TODO: need a window.external call
	});

	$('#doneButton').click(function () {
		window.close();
		return false;
	});
	
	$('#gameLink').click(function () {
		$(this).select();
	});

});