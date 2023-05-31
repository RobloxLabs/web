function handleOnFocus(productId) {
    $(".GCProductSelected").toggleClass("GCProductSelected");
    $(productId).toggleClass("GCProductSelected");
    $("#SelectedProduct").val($(productId).attr('pid'));
}
$(function () {
    $(".GCProduct").click(function () {
        $(".GCProductSelected").toggleClass("GCProductSelected");
        $(this).toggleClass("GCProductSelected");
        $("#SelectedProduct").val($(this).attr('pid'));
    });
    $(".GCTheme").click(function () {
        $(".GCThemeSelected").toggleClass("GCThemeSelected");
        $(this).toggleClass("GCThemeSelected");
        $("#SelectedTheme").val($(this).attr('tid'));
    });
    $(".GCTheme").hover(function () {
        $(".ThemePreview", this).toggle();
    });
    $(".PreviewGiftCard").click(function () {
        var windowProperties = 'height=830,width=640,left=10,top=10,resizable=1,scrollbars=1,toolbar=1,menubar=0,location=0,directories=no,status=yes';
        var url = 'GiftCard.ashx?action=preview&id=' + $(this).data('lookupid');
        var pdfWindow = window.open(url, 'pdfWindow', windowProperties);
        pdfWindow.title = "Preview Certificate.pdf";
    });
    $("#MessageTextArea").bind('keydown keyup keypress paste', function (event) {
        if (event.which == 13) {
            return false;
        }
        var text = $(this).val().replace('\n', '').substring(0, 250);
        var count = text.length;
        $(this).val(text);
        $("#remainingCharacters").html(250 - count);
    });

    $('[pid="' + $("#SelectedProduct").val() + '"]').toggleClass("GCProductSelected");
    $('[tid="' + $("#SelectedTheme").val() + '"]').toggleClass("GCThemeSelected");
    if ($("#MessageTextArea").length > 0) {
        $("#remainingCharacters").html(250 - $("#MessageTextArea").val().length);
    }
});