;// bundle: Pages___CatalogShared___eed372f5184d5ea57b448ca875046a77_m
;// files: modules/Pages/CatalogShared.js

;// modules/Pages/CatalogShared.js
Roblox.CatalogShared=Roblox.CatalogShared||{},Roblox.CatalogShared=function(){function t(t,i,r,u){t&&r&&r.length!==0&&(r.css("cursor","progress"),$.get(t,i,function(i){if(r.html(i),r.css("cursor","default"),!u){var f=$.Event(n,{url:t});r.trigger(f)}}))}var n="CatalogLoadedViaAjax";return{LoadCatalogAjax:t,CatalogLoadedViaAjaxEventName:n}}();
