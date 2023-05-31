$(function () {
	var validateEntry = (function () {
		var year = parseInt($('#YearDropDown option:selected').val());
		var month = parseInt($('#MonthDropDown option:selected').val());
		var day = parseInt($('#DayDropDown option:selected').val());

		if (year == 0 || day == 0 || month == 0 || day > new Date(year, month, 0).getDate()) {
			$('#InvalidDate').show();
			window.scrollTo(0, 0);
			return false;
		} else {
			$('#InvalidDate').hide();
		}

		var enteredDate = new Date(year, month, day);
		var under13Date = new Date();
		under13Date.setFullYear(under13Date.getFullYear() - 13);
		if (enteredDate > under13Date) {
			$('#ChildPrivacy').show();
		} else {
			$('#ChildPrivacy').hide();
		}
	});
	$('#YearDropDown').change(function () {
		validateEntry();
	});
	$('#DayDropDown').change(function () {
		validateEntry();
	});
	$('#MonthDropDown').change(function () {
		validateEntry();
	});
	$('#Submit').click(function () {
		if (validateEntry() == false)
			return false;
		$("#VerifyForm").submit();
	});


	function addMonths() {
	    $('<option>').attr('value', 1).text(Roblox.Verify.Resources.january).appendTo('select[name="Month"]');
	    $('<option>').attr('value', 2).text(Roblox.Verify.Resources.february).appendTo('select[name="Month"]');
		$('<option>').attr('value', 3).text(Roblox.Verify.Resources.march).appendTo('select[name="Month"]');
		$('<option>').attr('value', 4).text(Roblox.Verify.Resources.april).appendTo('select[name="Month"]');
		$('<option>').attr('value', 5).text(Roblox.Verify.Resources.may).appendTo('select[name="Month"]');
		$('<option>').attr('value', 6).text(Roblox.Verify.Resources.june).appendTo('select[name="Month"]');
		$('<option>').attr('value', 7).text(Roblox.Verify.Resources.july).appendTo('select[name="Month"]');
		$('<option>').attr('value', 8).text(Roblox.Verify.Resources.august).appendTo('select[name="Month"]');
		$('<option>').attr('value', 9).text(Roblox.Verify.Resources.september).appendTo('select[name="Month"]');
		$('<option>').attr('value', 10).text(Roblox.Verify.Resources.october).appendTo('select[name="Month"]');
		$('<option>').attr('value', 11).text(Roblox.Verify.Resources.november).appendTo('select[name="Month"]');
		$('<option>').attr('value', 12).text(Roblox.Verify.Resources.december).appendTo('select[name="Month"]');
	}
	function addDays() {
		for (var i = 1; i <= 31; i++) {
			$('<option>').attr('value', i).text(i).appendTo('select[name="Day"]');
		}
	}
	function addYears() {
		for (var i = new Date().getFullYear(); i >= new Date().getFullYear() - 100; i--) {
			$('<option>').attr('value', i).text(i).appendTo('select[name="Year"]');
		}
	}
	addMonths();
	addDays();
	addYears();
});