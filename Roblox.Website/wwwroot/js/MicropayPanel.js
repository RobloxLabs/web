function validateAmount() {
    if ($("select[id $= 'lstBokuProducts'] :selected").val() == "") {
        $("#validationError").show();
        return false;
    }
    $("#validationError").hide();
    return true;
}