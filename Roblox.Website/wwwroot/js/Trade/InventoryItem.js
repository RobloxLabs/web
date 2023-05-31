if (typeof Roblox === "undefined") {
    Roblox = {};
}
Roblox.InventoryItem = function (newNode) {
    var _newNode = newNode; //Assumes JQUERY
    var largeClassName = 'LargeInventoryItem', smallClassName = 'SmallInventoryItem';

    function display(JSON) {
        if (typeof JSON !== "undefined") {
            _newNode.find('.InventoryItemName').text(JSON.Name);
            _newNode.find('.InventoryItemLink').attr('href', JSON.ItemLink);
            _newNode.find('.ItemImg').attr('src', JSON.ImageLink);
            _newNode.find('.InventoryItemAveragePrice').text(processPrice(JSON.AveragePrice));
            _newNode.find('.InventoryItemOriginalPrice').text(processPrice(JSON.OriginalPrice));
            _newNode.find('.InventoryItemSerial').text(JSON.SerialNumber);
            _newNode.find('.SerialNumberTotal').text(JSON.SerialNumberTotal);
            _newNode.find('.BuildersClubOverlay').attr('src', JSON.MembershipLevel);
        }
    }

    function processPrice(price) {
        var priceAsNumber = Number(price);
        if (!isNaN(priceAsNumber)) {
            if (priceAsNumber > 1000000) {
                return Math.round(price / 1000000) + 'M';
            }
        } 
        return price;
    }

    return {
        display: display,
        largeClassName: largeClassName,
        smallClassName: smallClassName
    };
};