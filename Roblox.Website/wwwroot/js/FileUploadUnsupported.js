$(function () {
    if (typeof Roblox != "undefined" && typeof Roblox.FileUploadUnsupported != "undefined" && typeof Roblox.FileUploadUnsupported.Resources != "undefined") {
        $("input[type='file']:disabled").after("<div style='color:red;font-size:11px'>" + Roblox.FileUploadUnsupported.Resources.notSupported + "</div>");
    }
});

/*
if(typeof Roblox === "undefined"){
    Roblox = {};
}
if(typeof Roblox.FileUploadUnsupported === "undefined"){
    Roblox.FileUploadUnsupported = {};
}
Roblox.FileUploadUnsupported.Resources = {
    notSupported: " This device does not support file upload."
}

*/