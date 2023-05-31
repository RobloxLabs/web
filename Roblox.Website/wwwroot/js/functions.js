function autofilltop3() {
    $("#ctl00_cphRoblox_number1name").val($("#1").text());
    $("#ctl00_cphRoblox_number2name").val($("#2").text());
    $("#ctl00_cphRoblox_number3name").val($("#3").text());
}

function previewNewAlert() {
    var hardcodedcolor = $("#ctl00_cphRoblox_alerttype").val();
    if (hardcodedcolor == "") {
        hardcodedcolor = "[#FF0000]";
    }
    var alertText = $("#ctl00_cphRoblox_txtText").val();
    if (alertText != "") {
        $("#previewNewAlert").show("slow");
        if ((alertText.toString().indexOf("[") != -1) && (alertText.toString().indexOf("]") != -1)) {
            var startColor = alertText.toString().indexOf("[") + 1;
            var colorLength = alertText.toString().indexOf("]") - startColor;
            var alertColor = alertText.toString().substr(startColor, colorLength);
            if (alertColor != "") {
                alertText = alertText.replace("[" + alertColor + "]", "");
                $("#previewAlertWrapper").css("background-color", alertColor);
            }
        }
        else {
            var alertColor = hardcodedcolor.replace("[", "").replace("]", "");
            $("#previewAlertWrapper").css("background-color", alertColor);
        }
        $("#previewAlertText").text(alertText);
    }
    else {
        $("#previewNewAlert").hide("slow");
    }
}

function moderateScript(approve, scriptHash, divId) {
    $.ajax({
        type: "GET",
        async: true,
        cache: false,
        timeout: 50000,
        url: "/admi/UserScripts/ScriptApproval.ashx?approved=" + approve + "&hash=" + scriptHash,
        success: function(data) {
            if (data !== null) {
                var text = "--Banned";
                if (approve == "true")
                    text = "--Approved";
                $("#" + divId).text(text);
            }
        }
    });
}

function displayScript(id) {
    $("#ScriptViewPanel").html("<img src='/images/waiting.gif' />");
    $.get("/admi/LoadScript.ashx?id=" + id, function(data) {
        if (data !== null) {
            $("#ScriptViewPanel").html(data.toString());
            $("#ScriptViewPanel").visible = true;
        }
    }
    );
}
