$(function () {
    "use strict";
    var deviceTypeError = $("#device-type-error").hide();
    var deviceCheckBoxes = $("div.deviceTypeSection input:checkbox");
    deviceCheckBoxes.on("change", function () {
        if (!this.checked) {
            var numChecked = 0;
            for (var i = 0; i < deviceCheckBoxes.length; i++) {
                if (deviceCheckBoxes[i].checked) {
                    numChecked += 1;
                }
            }
            if (numChecked < 1) {
                deviceTypeError.show();
                this.checked = true;
            } else {
                deviceTypeError.hide();
            }
        } else {
            deviceTypeError.hide();
        }
    });
});
