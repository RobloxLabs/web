$(function () {
    /*<sl:translate>*/
    var translatedInJsFile = "Hi! I'm variable value from a js file. This text should be translated";
    /*</sl:translate>*/
    var untranslatedInJsFile = "Hi! I'm variable value from a js file. This text should be translated";
    
    $("#fromfiletranslated").html(translatedInJsFile);
    $("#fromfileuntranslated").html(untranslatedInJsFile);
    
    $.post("/reference/translationgetjson")
      .done(function (data) {
          $("#fromrequesttranslated").html(data.should_be_translated);
    });
    
});