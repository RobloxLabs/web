$(function () {
    $('#closeButton').click(function () {
        window.close();
    });

    var content = $('div.BuildPageContent');
    if (content.attr('data-gear-menu-enabled') == "False") {
        $('div.gear-button-wrapper').hide();
    }
});