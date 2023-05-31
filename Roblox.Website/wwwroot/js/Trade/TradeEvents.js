if (typeof Roblox === "undefined") {
    Roblox = {};
}

Roblox.TradeEvents = Roblox.TradeEvents || function () {
    var currentPage = "v1";

    function sendEvent(eventName, context, properties) {
        properties = properties || {};
        properties.pg = currentPage;
        Roblox.EventStream.SendEvent(eventName, context, properties);
    }

    function setPage(page) {
        currentPage = page;
    }

    return {
        SetPage: setPage,
        SendEvent: sendEvent,
        Events: {
            tradesList: "tradesListInteraction",
            tradeRequest: "tradeRequestInteractionV2",
            tradeRequestSent: "tradeRequestSent"
        }
    };
}();