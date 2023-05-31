if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.InstallationInstructions = (function () {

    function show(mode) {
        if (typeof mode == "undefined") {
            mode = "installation";
        }
        loadImages(mode);
        // Presize modal, if we are showing an image, to fix a bug where some browsers size the modal before loading an image.
        // This bug would show the modal with part of the image cut off.
        // Upon reload, the image is cached, and the modal auto-sizes, "fixing" the bug while the image is cached.
        // But we want to show it right the first time!
        var modalWidth = 0;
        var installInstructionsImage = $('.InstallInstructionsImage');
        if (installInstructionsImage && typeof $(installInstructionsImage).data("modalwidth") != "undefined") {
            modalWidth = $('.InstallInstructionsImage').data('modalwidth');
        }
        if (modalWidth > 0) {
            var leftPercent = ($(window).width() - (modalWidth - 10)) / 2;
            $('#InstallationInstructions').modal({ escClose: true,
                //onClose: function() { Roblox.Client._onCancel(); },
                opacity: 50,
                minWidth: modalWidth,
                maxWidth: modalWidth,
                overlayCss: { backgroundColor: "#000" },
                position: [($(window).height() / 4), leftPercent]
            });
        } else {
            $('#InstallationInstructions').modal({ escClose: true,
                //onClose: function() { Roblox.Client._onCancel(); },
                opacity: 50,
                maxWidth: ($(window).width() / 2),
                minWidth: ($(window).width() / 2),
                overlayCss: { backgroundColor: "#000" },
                position: [($(window).height() / 4), "25%"]
            });
        }
    }

    function hide() {
        $.modal.close();
    }

//This isn't the original unobfuscated loadImages function.
//All unobfuscated javascripts on the Roblox website are like active workspaces for developers. If they're old, they're deleted.
//This function was too new. I just used the obfuscated version.
//It may look very ugly, but idc.


    function loadImages() {
        var n = $(".InstallInstructionsImage");
        navigator.userAgent.match(/Mac OS X 10[_|\.]5/) ? n && typeof $(n).attr("oldmacdelaysrc") != "undefined" && $(".InstallInstructionsImage").attr("src", $(".InstallInstructionsImage").attr("oldmacdelaysrc")) : n && typeof $(n).attr("delaysrc") != "undefined" && $(".InstallInstructionsImage").attr("src", $(".InstallInstructionsImage").attr("delaysrc"))
    }

    var my = {
        show: show,
        hide: hide
    };

    return my;
})();