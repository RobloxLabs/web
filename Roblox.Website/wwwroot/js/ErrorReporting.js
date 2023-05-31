
var robloxAppReport;

function updateRobloxError() {
var er = robloxAppReport.ErrorReporting;
    if (er == 0) {
        // Skip error reporting
        return false;
    }
    if (robloxAppReport.HasErrorFiles) {
        if (er == 1)
            document.getElementById("ErrorReporting").style.display = "block";
        else if (er == 2)
            sendRobloxErrorFiles();
    }
    else {
        document.getElementById("ErrorReporting").style.display = "none";
    }

    //document.getElementById("ErrorReportingThanks").style.display = robloxAppReport.IsUploadingErrorFiles ? "block" : "none";

    return true;
}

function updateRobloxErrorTimer() {
    if (updateRobloxError())
        window.setTimeout("updateRobloxErrorTimer()", 1000);
}

try {
robloxAppReport = new ActiveXObject("Roblox.App");
robloxAppReport.IsUploadingErrorFiles;  // Quick check that the API exists
window.setTimeout("updateRobloxErrorTimer()", 100);
}
catch (e) {
}