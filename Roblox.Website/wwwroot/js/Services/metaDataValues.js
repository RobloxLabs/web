"use strict";

//Consolidate all meta-tag data that we parse into this one file later.
var Roblox = Roblox || {};
Roblox.MetaDataValues = function () {
    var metaTagPageName = document.querySelector('meta[name="page-meta"]');
    
    function getPageName() {
        return metaTagPageName && metaTagPageName.dataset && metaTagPageName.dataset.internalPageName;
    }
    
    return {
        getPageName: getPageName
    }

}();