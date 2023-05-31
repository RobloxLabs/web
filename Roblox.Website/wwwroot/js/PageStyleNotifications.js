$(function () {
    $(".pagification .pagification-showall, .pagification .pagification-collapse").click(function () {
        $(this).parents(".pagification-body").toggleClass("collapsed");
    });
});