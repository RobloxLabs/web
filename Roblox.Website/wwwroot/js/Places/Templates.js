$(function () {

    function getSelectedTemplateType() {
        return $('div.templates[data-templatetype="' + $("ul.templatetypes li.active").attr("data-templatetype") + '"]');
    }

    var templateTypeList = $("ul.templatetypes li");

    templateTypeList.click(function () {
        var visibleTemplateType = getSelectedTemplateType();
        visibleTemplateType.hide();
        $("ul.templatetypes li.active").removeClass("active");
        $(this).addClass("active");
        visibleTemplateType = getSelectedTemplateType();
        visibleTemplateType.show();
        return false;
    });

    var firstTemplateType = templateTypeList.first();

    firstTemplateType.addClass("active");

    getSelectedTemplateType().show();

    Roblox.require('Widgets.PlaceImage', function () {
        Roblox.Widgets.PlaceImage.populate();
    });

    $('.template').click(function () {
        $(".template.template-selected").removeClass("template-selected");
        $(this).addClass("template-selected");
    });

    $('.template a').removeAttr('href');
});