$(function () {
    $(".accordion").each(function (idx, accordionDiv) {
        var previous = 0,
            accordion = $(accordionDiv);
        accordion.on("click", ".accord-header", function () {
            var sections = accordion.children(),
	    		current = sections.index($(this).parent().addClass("accord-section-open"));
            sections.eq(previous).removeClass("accord-section-open");
            previous = current === previous ? /* All closed */ NaN : current;
        });
    });
});
