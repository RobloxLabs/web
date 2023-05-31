if (typeof Roblox === 'undefined') {
    Roblox = {};
}
if (typeof Roblox.DeveloperConsoleWarning === 'undefined') {
    Roblox.DeveloperConsoleWarning = (function () {
        var warningText = "\n"
            + "      _______      _________      _____       ______     _\n"
            + "     / _____ \\    |____ ____|    / ___ \\     | ____ \\   | |\n"
            + "    / /     \\_\\       | |       / /   \\ \\    | |   \\ \\  | |\n"
            + "    | |               | |      / /     \\ \\   | |   | |  | |\n"
            + "    \\ \\______         | |      | |     | |   | |___/ /  | |\n"
            + "     \\______ \\        | |      | |     | |   |  ____/   | |\n"
            + "            \\ \\       | |      | |     | |   | |        | |\n"
            + "     _      | |       | |      \\ \\     / /   | |        |_|\n"
            + "    \\ \\_____/ /       | |       \\ \\___/ /    | |         _\n"
            + "     \\_______/        |_|        \\_____/     |_|        |_|\n"
            + "\n"
            + "     Keep your account safe! Do not send any information from\n"
            + "     here to anyone or paste any text here.\n"
            + "\n"
            + "     If someone is asking you to copy or paste text here then\n"
            + "     you're giving someone access to your account, your gear,\n"
            + "     and your Robux.\n"
            + "\n"
            + "     To learn more about keeping your account safe you can go to\n"
            + "\n"
            + "     https://www.roblox.com/info/account-safety";

        var showWarning = function () {
            if (typeof console !== "undefined") {
                if (typeof console.log !== "undefined") {
                    console.log(warningText);
                }
            }
        };

        return {
            showWarning: showWarning
        };
    })();
}