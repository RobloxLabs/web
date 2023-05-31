;// bundle: page___4fd27312ad352a94b31405050b5bc1d1_m
;// files: PlaceProductPromotion.js, GamePass.js, VotingPanel.js, jquery.dotdotdot-1.5.7-packed.js, GPTAdScript.js, NewGamePage.js, fileUploadUnsupported.js, GenericModal.js, ItemPurchase.js, CommentsPane.js, GenericConfirmation.js

;// PlaceProductPromotion.js
var Roblox=Roblox||{};Roblox.PlaceProductPromotion=function(){function o(n){return n.__RequestVerificationToken=$("input[name=__RequestVerificationToken]").val(),n}function e(n,t){var i=Math.floor(Math.random()*9001);$.ajax({type:"GET",url:"/PlaceItem/GetPlaceProductPromotions?placeId="+Roblox.PlaceProductPromotion.PlaceID+"&startIndex="+n+"&maxRows="+t+"&cachebuster="+i,contentType:"application/json; charset=utf-8",success:function(n){Roblox.PlaceProductPromotionPager.update(n)},error:function(){$("#PromotionsItemContainer").addClass("empty").text(Roblox.Resources.PlaceProductPromotion.anErrorOccurred)}})}function f(){function t(n){return n.__RequestVerificationToken=$("input[name=__RequestVerificationToken]").val(),n}var i=$("#PlaceProductPromotionInput").val(),n;$(".PromoteModalErrorMessage").hide(),n=$("#PlaceProductPromotionSelectionPanel"),$.ajax({type:"POST",url:"/PlaceItem/AddProductPromotionToPlace?placeId="+i+"&productId="+Roblox.PlaceProductPromotionData.ProductID,data:t({}),dataType:"json",success:function(t){if(t.ErrorMsg)n.find(".PromoteModalErrorMessage").text(t.ErrorMsg).show();else{var i=$("<div>"+Roblox.Resources.PlaceProductPromotion.youhaveAdded+"<span></span>"+Roblox.Resources.PlaceProductPromotion.toYourGame+"<a></a></div>");i.find("span").html(Roblox.PlaceProductPromotionData.ProductName),i.find("a").attr("href",t.PlaceURL).text(t.PlaceName),n.find(".roblox-item-image").html("").addClass("thumbs-up-green"),n.find(".PurchaseModalMessageText").html(i).addClass("SuccessMsg"),n.find(".PurchaseModalButtonContainer .promoteBtn").hide(),n.find(".titleBar").text(Roblox.Resources.PlaceProductPromotion.success),n.find(".PurchaseModalFooter").text(""),n.find(".PurchaseModalButtonContainer .btn-negative").removeClass("btn-negative").addClass("btn-neutral").html(Roblox.Resources.PlaceProductPromotion.ok+'<span class="btn-text">'+Roblox.Resources.PlaceProductPromotion.ok+"</span>")}},error:function(n){$(".PromoteModalErrorMessage").text(n.ErrorMsg).show()}})}function n(n){$.ajax({type:"POST",url:"/PlaceItem/DeletePlaceProductPromotion?promotionId="+n,data:o({}),success:function(){var i=$('.DeleteProductPromotion[data-delete-promotion-id="'+n+'"]').parent().find(".NameDiv").html();$("#DeleteProductPromotionModal .titleBar").text(Roblox.Resources.PlaceProductPromotion.success),$("#DeleteProductPromotionModal .PurchaseModalMessageText").html(Roblox.Resources.PlaceProductPromotion.youhaveRemoved+"<a>"+i+"</a>"+Roblox.Resources.PlaceProductPromotion.fromYourGame),$("#DeleteProductPromotionModal").modal(Roblox.PlaceProductPromotion.modalProperties),Roblox.PlaceProductPromotionPager.getItemsPaged(1,3)},error:function(){$("#DeleteProductPromotionModal .titleBar").text(Roblox.Resources.PlaceProductPromotion.error),$("#DeleteProductPromotionModal .PurchaseModalMessageText").text(Roblox.Resources.PlaceProductPromotion.sorryWeCouldnt),$("#DeleteProductPromotionModal").modal(Roblox.PlaceProductPromotion.modalProperties)}})}function r(n){if(n.length==0&&$("#PromotionsItemContainer .PlaceProductPromotionItem").length==0){$("#PromotionsItemContainer").addClass("empty").html($(".PromotionsItemContainer.empty").html());return}var t=$(".PlaceProductPromotionItem.template").clone().removeClass("template");return t.find(".ItemURL").attr("href",n.ItemUrl).html(fitStringToWidthSafe(n.Name,185)),t.find(".TotalSales").text(n.TotalSales),t.find(".DeleteProductPromotion").attr("data-delete-promotion-id",n.PromotionID),n.PriceInRobux!=undefined?(t.find(".Price").text(n.PriceInRobux),t.find(".PurchaseButton").attr("data-expected-price",n.PriceInRobux).attr("data-promotion-id",n.PromotionID)):n.PriceInTickets!=undefined?(t.find(".Price").removeClass("robux").addClass("tickets").text(n.PriceInTickets),t.find(".PurchaseButton").attr("data-expected-currency",2).removeAttr("data-promotion-id").attr("data-expected-price",n.PriceInTickets).removeAttr("data-placeproductpromotion-id")):t.find(".Price").remove(),n.IsForSale||(t.find(".PurchaseButton").hide(),t.find(".UserOwns").html(Roblox.Resources.PlaceProductPromotion.notForSale).show()),t.find(".PurchaseButton").attr("data-expected-seller-id",n.SellerID).attr("data-seller-name",n.SellerName).attr("data-item-name",n.Name),n.UserOwns===!0&&(t.find(".PurchaseButton").hide(),t.find(".UserOwns").show()),n.IsRentable===!0&&t.find(".PurchaseButton").html(Roblox.Resources.PlaceProductPromotion.rent+"<span class=btn-text>"+Roblox.Resources.PlaceProductPromotion.rent+"</span>"),t.find("[data-bc-requirement]").attr("data-bc-requirement",n.BCRequirement),t.find("[data-item-id]").attr("data-item-id",n.AssetID),t.find("[data-product-id]").attr("data-product-id",n.ProductID),t.find("[data-placeproductpromotion-id]").attr("data-placeproductpromotion-id",n.PromotionID),t}function i(n){var i=$(".PlaceProductPromotionItem .roblox-item-image[data-item-id="+n.AssetID+"]").parent(),r=i.find(".roblox-item-image"),t;Roblox.require("Widgets.ItemImage",function(n){n.load(r)}),t=i.find(".PurchaseButton"),t.unbind(),t.click(function(){return Roblox.PlaceProductPromotionItemPurchase.openPurchaseVerificationView(t[0]),!1}),i.find(".DeleteProductPromotion").click(function(){var n=$(this).data("delete-promotion-id");Roblox.PlaceProductPromotion.DeleteProductPromotion(n)})}function t(n){var t=$("#PlaceProductPromotionInput");$.each(n.UserPlaces,function(n,i){t.append($("<option></option>").attr("value",i.value).html(i.label))}),$(".promoteBtn").click(function(){return Roblox.PlaceProductPromotion.AddPlaceProductPromotion(),!1}),$(".PromoteModalBtn").click(function(){var n={escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"}};$("#PlaceProductPromotionSelectionPanel").modal(n),Roblox.require("Widgets.ItemImage",function(n){n.populate($("#PlaceProductPromotionSelectionPanel .roblox-item-image"))})})}var s,u={escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"}};return{GetPlacePromotions:e,FormatPlacePromotion:r,FormatPlacePromotionCallback:i,DeleteProductPromotion:n,modalProperties:u,AddPlaceProductPromotion:f,SetUpAddPlaceProductPromotion:t}}();

;// GamePass.js
var Roblox=Roblox||{};Roblox.GamePass=function(){function i(n){var t,i,r;return n.length==0&&($(".GamePassesDisplayContainer").hasClass("OwnerIsViewing")?($("#GamePassesItemContainer").text(Roblox.GamePass.Resources.noneforSale),$("#GamePassesPagerContainer").hide()):$(".GamePassesDisplayContainer").hide()),t=$(".GamePasses.PlacePagePagersItem.template").clone().removeClass("template"),t.find(".ItemURL").attr("href",n.PassItemURL).text(fitStringToWidthSafeText(n.PassName,100)),t.find(".TotalSales").text(n.TotalSales),t.find("[data-item-purchase-enabled=False]").css("display","block"),i=t.find(".PurchaseButton"),n.PriceInTickets>0&&(i.attr("data-expected-currency",2).attr("data-expected-price",n.PriceInTickets),t.find(".Price.tickets").text(n.PriceInTickets).show()),n.PriceInRobux>0&&(i.attr("data-expected-currency",1).attr("data-expected-price",n.PriceInRobux),t.find(".Price.robux").text(n.PriceInRobux).show()),n.PriceInRobux==0&&n.PriceInTickets==0&&(i.attr("data-expected-currency",1).attr("data-expected-price",0),t.find(".Price.robux-text").text("FREE").show()),n.PriceInTickets>0&&n.PriceInRobux>0&&t.find("input").attr("name","currency_"+n.PassID).show(),i.attr("data-expected-price",r).attr("data-item-name",n.PassName),n.UserOwns===!0&&(t.find(".PurchaseButton").hide(),t.find("input").attr("name","currency_"+n.PassID).hide(),t.find(".UserOwns").show()),t.find("[data-item-id]").attr("data-item-id",n.PassID),t.find("[data-product-id]").attr("data-product-id",n.ProductID),t}function t(n,t){placeId=Roblox.GamePassJSData.PlaceID;var i=Math.floor(Math.random()*9001);$.ajax({type:"GET",url:"/PlaceItem/GetGamePassesPaged?placeId="+placeId+"&startIndex="+n+"&maxRows="+t+"&cachebuster="+i,contentType:"application/json; charset=utf-8",success:function(n){Roblox.GamePassesPager.update(n)},error:function(){$("#GamePassesItemContainer").addClass("empty").text(anErrorOccurred)}})}function n(n){var i=$(".GamePasses.PlacePagePagersItem .roblox-item-image[data-item-id="+n.PassID+"]"),t;Roblox.require("Widgets.ItemImage",function(n){n.load(i)}),t=$(".GamePasses.PlacePagePagersItem .PurchaseButton[data-item-id="+n.PassID+"]"),t.click(function(){return Roblox.GamePassItemPurchase.openPurchaseVerificationView(t[0]),!1}),$(".GamePasses.PlacePagePagersItem input:radio").change(function(n){var i=$(n.target),t=i.parents(".InfoContainer");i.hasClass("robux")?t.find(".PurchaseButton").attr("data-expected-currency",1).attr("data-expected-price",t.find(".Price.robux").text()):t.find(".PurchaseButton").attr("data-expected-currency",2).attr("data-expected-price",t.find(".Price.tickets").text())})}return{getGamePasses:t,formatGamePassHTML:i,FormatGamePassCallback:n}}();

;// VotingPanel.js
var Roblox=Roblox||{};Roblox.Voting=function(){var i=function(n){return n.__RequestVerificationToken=$("input[name=__RequestVerificationToken]").val(),n},u=function(n,t,r){$(".voting-panel .loading").show(),$.ajax({type:"POST",url:"/place-item/vote?assetId="+n+"&vote="+t,data:i({}),success:function(n){$(".voting").html(n),r()},error:function(n){$(".voting").html(n),r()}})},f=function(n,t){$(".voting-panel .loading").show(),$.ajax({type:"POST",url:"/place-item/unvote?assetId="+n,data:i({}),success:function(n){$(".voting").html(n),t()},error:function(n){$(".voting").html(n),t()}})},t=function(t,i){var u=$(".voting-panel").attr("data-vote-modal"),r;if(u!=undefined&&u.length>0)switch(u){case"EmailIsVerified":Roblox.GenericConfirmation.open({titleText:Roblox.Voting.Resources.emailVerifiedTitle,bodyContent:Roblox.Voting.Resources.emailVerifiedMessage,onAccept:function(){window.location.href="/My/Account.aspx?confirmemail=1"},acceptColor:Roblox.GenericConfirmation.blue,acceptText:Roblox.Voting.Resources.verify,declineText:Roblox.Voting.Resources.cancel,allowHtmlContentInBody:!0});return;case"PlayGame":Roblox.GenericModal.open(Roblox.Voting.Resources.playGameTitle,null,Roblox.Voting.Resources.playGameMessage);return}else r=$(".voting-panel").attr("asset-id"),t.hasClass("selected")?Roblox.Voting.Unvote(r,n):Roblox.Voting.Vote(r,i,n)},n=function(){$(".users-vote .upvote").unbind().click(function(){t($(this),!0)}),$(".users-vote .downvote").unbind().click(function(){t($(this),!1)});var i=parseInt($(".voting-panel").attr("total-up-votes")),r=parseInt($(".voting-panel").attr("total-down-votes")),n;isNaN(i)||isNaN(r)||(n=i===0?0:r===0?100:Math.floor(i/(i+r)*100),n>100&&(n=100),$(".voting-panel .visual-container .percent").css("width",n+"%")),$("#VisitButtonContainer .btn-primary").click(function(){setTimeout(Roblox.Voting.CanVote,1e4)})},r=function(){var n=$(".voting-panel").attr("asset-id");$.ajax({type:"GET",url:"/place-item/canvote?assetId="+n,success:function(n){n.success?$(".voting-panel").removeAttr("data-vote-modal"):n.message==="PlayGame"&&setTimeout(Roblox.Voting.CanVote,1e4)},error:function(){setTimeout(Roblox.Voting.CanVote,1e4)}})};return{Vote:u,Unvote:f,Initialize:n,CanVote:r}}();

;// jquery.dotdotdot-1.5.7-packed.js
(function(n){function l(n,i,r){var e=n.children(),s=!1,u,o,f;for(n.empty(),u=0,o=e.length;o>u;u++){if(f=e.eq(u),n.append(f),r&&n.append(r),t(n,i)){f.remove(),s=!0;break}r&&r.remove()}return s}function e(i,r,u,f,o){var v=i.contents(),s=!1,h,l;i.empty();for(var y="table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, select, optgroup, option, textarea, script, style",a=0,p=v.length;p>a&&!s;a++)h=v[a],l=n(h),void 0!==h&&(i.append(l),o&&i[i.is(y)?"after":"append"](o),3==h.nodeType?t(u,f)&&(s=c(l,r,u,f,o)):s=e(l,r,u,f,o),s||o&&o.remove());return s}function c(n,i,u,f,e){var y=!1,o=n[0],k,a,b,tt,p;if(o===void 0)return!1;for(var d="letter"==f.wrap?"":" ",v=s(o).split(d),w=-1,l=-1,g=0,nt=v.length-1;nt>=g;){if(k=Math.floor((g+nt)/2),k==l)break;l=k,r(o,v.slice(0,l+1).join(d)+f.ellipsis),t(u,f)?nt=l:(w=l,g=l)}return-1==w||1==v.length&&0==v[0].length?(a=n.parent(),n.remove(),b=e?e.length:0,a.contents().size()>b?(tt=a.contents().eq(-1-b),y=c(tt,i,u,f,e)):(o=a.prev().contents().eq(-1)[0],o!==void 0&&(p=h(s(o),f),r(o,p),a.remove(),y=!0))):(p=h(v.slice(0,w+1).join(d),f),y=!0,r(o,p)),y}function t(n,t){return n.innerHeight()>t.maxHeight}function h(t,i){for(;n.inArray(t.slice(-1),i.lastCharacter.remove)>-1;)t=t.slice(0,-1);return 0>n.inArray(t.slice(-1),i.lastCharacter.noEllipsis)&&(t+=i.ellipsis),t}function i(n){return{width:n.innerWidth(),height:n.innerHeight()}}function r(n,t){n.innerText?n.innerText=t:n.nodeValue?n.nodeValue=t:n.textContent&&(n.textContent=t)}function s(n){return n.innerText?n.innerText:n.nodeValue?n.nodeValue:n.textContent?n.textContent:""}function a(t,i){return t===void 0?!1:t?"string"==typeof t?(t=n(t,i),t.length?t:!1):"object"==typeof t?t.jquery===void 0?!1:t:!1:!1}function v(n){for(var t,u=n.innerHeight(),r=["paddingTop","paddingBottom"],i=0,f=r.length;f>i;i++)t=parseInt(n.css(r[i]),10),isNaN(t)&&(t=0),u-=t;return u}function y(n,t){return n?(t="string"==typeof t?"dotdotdot: "+t:["dotdotdot:",t],window.console!==void 0&&window.console.log!==void 0&&window.console.log(t),!1):!1}var o,f,u;n.fn.dotdotdot||(n.fn.dotdotdot=function(r){var u;if(0==this.length)return r&&r.debug===!1||y(!0,'No element found for "'+this.selector+'".'),this;if(this.length>1)return this.each(function(){n(this).dotdotdot(r)});u=this,u.data("dotdotdot")&&u.trigger("destroy.dot"),u.bind_events=function(){return u.bind("update.dot",function(i,r){i.preventDefault(),i.stopPropagation(),f.maxHeight="number"==typeof f.height?f.height:v(u),f.maxHeight+=f.tolerance,r!==void 0&&(("string"==typeof r||r instanceof HTMLElement)&&(r=n("<div />").append(r).contents()),r instanceof n&&(p=r)),h=u.wrapInner('<div class="dotdotdot" />').children(),h.empty().append(p.clone(!0)).css({height:"auto",width:"auto",border:"none",padding:0,margin:0});var c=!1,o=!1;return s.afterElement&&(c=s.afterElement.clone(!0),s.afterElement.remove()),t(h,f)&&(o="children"==f.wrap?l(h,f,c):e(h,u,h,f,c)),h.replaceWith(h.contents()),h=null,n.isFunction(f.callback)&&f.callback.call(u[0],o,p),s.isTruncated=o,o}).bind("isTruncated.dot",function(n,t){return n.preventDefault(),n.stopPropagation(),"function"==typeof t&&t.call(u[0],s.isTruncated),s.isTruncated}).bind("originalContent.dot",function(n,t){return n.preventDefault(),n.stopPropagation(),"function"==typeof t&&t.call(u[0],p),p}).bind("destroy.dot",function(n){n.preventDefault(),n.stopPropagation(),u.unwatch().unbind_events().empty().append(p).data("dotdotdot",!1)}),u},u.unbind_events=function(){return u.unbind(".dot"),u},u.watch=function(){if(u.unwatch(),"window"==f.watch){var t=n(window),e=t.width(),r=t.height();t.bind("resize.dot"+s.dotId,function(){e==t.width()&&r==t.height()&&f.windowResizeFix||(e=t.width(),r=t.height(),c&&clearInterval(c),c=setTimeout(function(){u.trigger("update.dot")},10))})}else w=i(u),c=setInterval(function(){var n=i(u);(w.width!=n.width||w.height!=n.height)&&(u.trigger("update.dot"),w=i(u))},100);return u},u.unwatch=function(){return n(window).unbind("resize.dot"+s.dotId),c&&clearInterval(c),u};var p=u.contents(),f=n.extend(!0,{},n.fn.dotdotdot.defaults,r),s={},w={},c=null,h=null;return s.afterElement=a(f.after,u),s.isTruncated=!1,s.dotId=o++,u.data("dotdotdot",!0).bind_events().trigger("update.dot"),f.watch&&u.watch(),u},n.fn.dotdotdot.defaults={ellipsis:"... ",wrap:"word",lastCharacter:{remove:[" ",",",";",".","!","?"],noEllipsis:[]},tolerance:0,callback:null,after:null,height:null,watch:!1,windowResizeFix:!0,debug:!1},o=1,f=n.fn.html,n.fn.html=function(n){return n!==void 0?this.data("dotdotdot")&&"function"!=typeof n?this.trigger("update",[n]):f.call(this,n):f.call(this)},u=n.fn.text,n.fn.text=function(t){if(t!==void 0){if(this.data("dotdotdot")){var i=n("<div />");return i.text(t),t=i.html(),i.remove(),this.trigger("update",[t])}return u.call(this,t)}return u.call(this)})})(jQuery);

;// NewGamePage.js
$(document).ready(function(){$(".PurchaseButton").each(function(n,t){$(t).unbind().click(function(){return Roblox.PlaceItemPurchase.openPurchaseVerificationView(t),!1})}),Roblox.PlaceItemPurchase=new Roblox.ItemPurchase(function(n){$(".PurchaseButton[data-item-id="+n.AssetID+"]").each(function(){$("#PurchaseContainer").hide(),$("#VisitButtonContainer").show()})})});

;/*/ fileUploadUnsupported.js
$(function(){$("input[type='file']:disabled'").after("<div style='color:red;font-size:11px'>"+Roblox.FileUploadUnsupported.Resources.notSupported+"</div>")});
*/ //For whatever reason this kills all functions that run after the page had finished loading.
;// GenericModal.js
typeof Roblox.GenericModal=="undefined"&&(Roblox.GenericModal=function(){function i(t,i,u,f,e){n=f;var o=$("div.GenericModal").filter(":first");o.find("div.Title").text(t),i===null?o.addClass("noImage"):(o.find("img.GenericModalImage").attr("src",i),o.removeClass("noImage")),o.find("div.Message").html(u),e&&(o.removeClass("smallModal"),o.addClass("largeModal")),o.modal(r)}function t(){$.modal.close(),typeof n=="function"&&n()}var r={overlayClose:!0,escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"}},n;return $(function(){$(document).on("click",".GenericModal .roblox-ok",function(){t()})}),{open:i}}());

; // ItemPurchase.js
/*var Roblox = Roblox || {};
Roblox.ItemPurchase = function(n) {
    function r(n) {
        n += "", x = n.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "";
        for (var t = /(\d+)(\d{3})/; t.test(x1);) x1 = x1.replace(t, "$1,$2");
        return x1 + x2
    }

    function y(n) {
        return n < 1 ? n + "" : n < 1e4 ? r(n) : n >= 1e6 ? Math.floor(n / 1e6) + "M+" : Math.floor(n / 1e3) + "K+"
    }

    function e() {
        window.location.href = "/login/Default.aspx?ReturnUrl=" + encodeURIComponent(location.pathname + location.search)
    }

    function f(n) {
        var t = {
            overlayClose: !0,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            }
        };
        typeof n != "undefined" && n !== "" && $.modal.close("." + n), $("#ProcessingView").modal(t)
    }

    function u(n, t) {
        var r;
        if (f(t), r = $(n), !r.hasClass("btn-disabled-primary")) {
            var l = r.attr("data-product-id"),
                h = parseInt(r.attr("data-expected-price")),
                c = r.attr("data-expected-currency"),
                u = r.attr("data-placeproductpromotion-id"),
                s = r.attr("data-expected-seller-id"),
                e = r.attr("data-userasset-id");
            $.ajax({
                type: "POST",
                url: "/API/Item.ashx?rqtype=purchase&productID=" + l + "&expectedCurrency=" + c + "&expectedPrice=" + h + (u === undefined ? "" : "&expectedPromoID=" + u) + "&expectedSellerID=" + s + (e === undefined ? "" : "&userAssetID=" + e),
                contentType: "application/json; charset=utf-8",
                success: function(n) {
                    n.statusCode == 500 ? ($.modal.close(".ProcessingView"), i(n)) : ($.modal.close(".ProcessingView"), o(n))
                },
                error: function(n) {
                    $.modal.close(".ProcessingView");
                    var t = $.parseJSON(n.responseText);
                    i(t)
                }
            })
        }
    }

    function i(n) {
        var t, r;
        if (n.showDivID === "TransactionFailureView") Roblox.GenericConfirmation.open({
            titleText: n.title,
            bodyContent: n.errorMsg,
            imageUrl: s,
            acceptText: Roblox.ItemPurchase.strings.okText,
            declineColor: Roblox.GenericConfirmation.none,
            dismissable: !0
        });
        else if (n.showDivID === "InsufficientFundsView") {
            var i = "",
                f = "",
                e = !1;
            i = n.currentCurrency == 1 ? Roblox.ItemPurchase.strings.buyText + " Robux" : Roblox.ItemPurchase.strings.tradeCurrencyText, n.currentCurrency == 1 && (e = !0, f = Roblox.ItemPurchase.strings.orText + " <a href='/My/Money.aspx?tab=TradeCurrency' style='font-weight:bold'>" + Roblox.ItemPurchase.strings.tradeCurrencyText + "</a>"), Roblox.GenericConfirmation.open({
                titleText: Roblox.ItemPurchase.strings.insufficientFundsTitle,
                bodyContent: String.format(Roblox.ItemPurchase.strings.insufficientFundsText, "<span class='currency-color CurrencyColor" + n.currentCurrency + "'>" + n.shortfallPrice + "</span>"),
                acceptText: i,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: function() {
                    window.location = "/Upgrades/Robux.aspx"
                },
                declineText: Roblox.ItemPurchase.strings.cancelText,
                imageUrl: s,
                footerText: f,
                allowHtmlContentInBody: !0,
                allowHtmlContentInFooter: e,
                dismissable: !0
            })
        } else n.showDivID === "PriceChangedView" && (t = $(".PurchaseButton[data-item-id=" + n.AssetID + "][data-expected-currency=" + n.expectedCurrency + "][data-expected-price=" + n.expectedPrice + "]"), r = function() {
            t.attr("data-expected-price", n.currentPrice), t.attr("data-expected-currency", n.currentCurrency), u(t, "PurchaseVerificationView")
        }, Roblox.GenericConfirmation.open({
            titleText: Roblox.ItemPurchase.strings.priceChangeTitle,
            bodyContent: String.format(Roblox.ItemPurchase.strings.priceChangeText, "<span class='currency-color CurrencyColor" + n.expectedCurrency + "'>" + n.expectedPrice + "</span>", "<span class='currency-color CurrencyColor" + n.currentCurrency + "'>" + n.currentPrice + "</span>"),
            acceptText: Roblox.ItemPurchase.strings.buyNowText,
            acceptColor: Roblox.GenericConfirmation.green,
            onAccept: r,
            declineText: Roblox.ItemPurchase.strings.cancelText,
            footerText: String.format(Roblox.ItemPurchase.strings.balanceText, (n.currentCurrency == 1 ? "R$" : "Tx") + n.balanceAfterSale),
            allowHtmlContentInBody: !0,
            dismissable: !0
        }))
    }

    function c(n) {
        var f = $(n),
            nt, w, b, c, s, g, d, p, o, it;
        if (!f.hasClass("btn-disabled-primary")) {
            if (nt = f.attr("data-bc-requirement"), nt > a) {
                showBCOnlyModal("BCOnlyModal");
                return
            }
            var ft = f.attr("data-item-name"),
                k = parseInt(f.attr("data-expected-price")),
                y = f.attr("data-expected-currency"),
                ut = f.attr("data-seller-name"),
                tt = f.attr("data-asset-type"),
                rt = f.attr("data-item-id");
            if (t = tt == "Place", h === "True") {
                e();
                return
            }
            if (w = !1, f.hasClass("rentable") && (w = !0), b = y == "1" ? parseInt(v) : parseInt(l), c = b - k, s = "", s = w ? Roblox.ItemPurchase.strings.rentText : Roblox.ItemPurchase.strings.buyTextLower, c < 0) {
                g = {
                    shortfallPrice: 0 - c,
                    currentCurrency: y,
                    showDivID: "InsufficientFundsView"
                }, i(g);
                return
            }
            d = $("#ItemPurchaseAjaxData").attr("data-imageurl"), p = "", p = k == 0 ? "<span class='currency CurrencyColorFree'>" + Roblox.ItemPurchase.strings.freeText + "</span>" : "<span class='currency CurrencyColor" + y + "'>" + k + "</span>", o = "", o = y == "1" ? "R$" : "Tx", o += r(c), it = function() {
                u(n, "PurchaseVerificationView")
            }, Roblox.GenericConfirmation.open({
                titleText: Roblox.ItemPurchase.strings.buyItemTitle,
                bodyContent: String.format(Roblox.ItemPurchase.strings.buyItemText, s, ft, tt, ut, p, t ? Roblox.ItemPurchase.strings.accessText : ""),
                imageUrl: d,
                acceptText: t ? Roblox.ItemPurchase.strings.buyAccessText : Roblox.ItemPurchase.strings.buyNowText,
                acceptColor: Roblox.GenericConfirmation.green,
                onAccept: it,
                declineText: Roblox.ItemPurchase.strings.cancelText,
                footerText: String.format(Roblox.ItemPurchase.strings.balanceText, o),
                allowHtmlContentInBody: !0,
                dismissable: !0,
                onOpenCallback: function() {
                    $(".ConfirmationModal .roblox-item-image").html("").attr("data-item-id", rt), Roblox.require("Widgets.ItemImage", function(n) {
                        n.load($(".ConfirmationModal .roblox-item-image"))
                    })
                }
            })
        }
    }

    function o(i) {
        var r;
        r = i.Price == 0 ? "<span class='currency CurrencyColorFree'>" + Roblox.ItemPurchase.strings.freeText + "</span>" : "<span class='currency CurrencyColor" + i.Currency + "'>" + i.Price + "</span>";
        var e = $("#ItemPurchaseAjaxData").attr("data-imageurl"),
            o = function() {
                var n = $("#ItemPurchaseAjaxData").attr("data-continueshopping-url");
                n != undefined && n != "" && (document.location.href = n)
            },
            u = !1,
            f = "";
        i.AssetIsWearable && (f = "<a class='CustomizeCharacterLink' href='/My/Character.aspx'>" + Roblox.ItemPurchase.strings.customizeCharacterText + "</a>", u = !0), Roblox.GenericConfirmation.open({
            titleText: Roblox.ItemPurchase.strings.purchaseCompleteTitle,
            bodyContent: String.format(Roblox.ItemPurchase.strings.purchaseCompleteText, i.TransactionVerb, i.AssetName, i.AssetType, i.SellerName, r, t ? Roblox.ItemPurchase.strings.accessText : ""),
            imageUrl: e,
            acceptText: Roblox.ItemPurchase.strings.continueShoppingText,
            xToCancel: !0,
            onAccept: o,
            onCancel: function() {
                i.IsMultiPrivateSale && window.location.reload()
            },
            declineColor: Roblox.GenericConfirmation.none,
            footerText: f,
            allowHtmlContentInBody: !0,
            allowHtmlContentInFooter: u,
            dismissable: !0,
            onOpenCallback: function() {
                $(".ConfirmationModal .roblox-item-image").html("").attr("data-item-id", i.AssetID), Roblox.require("Widgets.ItemImage", function(n) {
                    n.load($(".ConfirmationModal .roblox-item-image"))
                })
            }
        }), n(i)
    }
    if (!(this instanceof Roblox.ItemPurchase)) return new Roblox.ItemPurchase(n);
    var h = $("#ItemPurchaseAjaxData").attr("data-authenticateduser-isnull"),
        v = $("#ItemPurchaseAjaxData").attr("data-user-balance-robux"),
        l = $("#ItemPurchaseAjaxData").attr("data-user-balance-tickets"),
        a = $("#ItemPurchaseAjaxData").attr("data-user-bc"),
        s = $("#ItemPurchaseAjaxData").attr("data-alerturl"),
        p = $("#ItemPurchaseAjaxData").attr("data-builderscluburl"),
        t = !1;
    return {
        showProcessingModal: f,
        purchaseItem: u,
        openPurchaseVerificationView: c,
        openPurchaseConfirmationView: o,
        redirectToLogin: e,
        purchaseConfirmationCallback: n,
        openErrorView: i,
        addCommasToMoney: r,
        formatMoney: y
    }
}, Roblox.ItemPurchase.ModalClose = function(n) {
    $.modal.close("." + n)
};*/

;// CommentsPane.js
var Roblox=Roblox||{};Roblox.CommentsPane=function(){var o=function(n){$.ajax({type:"POST",url:"/API/Comments.ashx?rqtype=deleteComment&commentID="+n,contentType:"application/json; charset=utf-8",success:function(){$(".Comments [data-comment-id="+n+"]").parents(".Comment")},error:function(){}})},e=function(n){n=="01"?Roblox.GenericConfirmation.open({titleText:Roblox.CommentsPane.Resources.emailVerifiedABTitle,bodyContent:Roblox.CommentsPane.Resources.emailVerifiedABMessage,onAccept:function(){window.location.href="/My/Account.aspx?confirmemail=1"},acceptColor:Roblox.GenericConfirmation.blue,acceptText:Roblox.CommentsPane.Resources.accept,declineText:Roblox.CommentsPane.Resources.decline,allowHtmlContentInBody:!0}):($(".AjaxCommentsContainer textarea").addClass("hint-text").val(n),$("#CharsRemaining").html(""))},s=function(){$.ajax({type:"POST",url:"/API/Comments.ashx?rqtype=makeComment&assetID="+$(".Comments").attr("data-asset-id"),data:$(".CommentText textarea").val(),contentType:"application/json; charset=utf-8",success:function(n){typeof n.ID!="undefined"?(parseInt($("#AjaxCommentsPaneData").attr("data-comments-floodcheck"),10)>0?$(".AjaxCommentsContainer textarea").addClass("hint-text").val(Roblox.CommentsPane.Resources.floodCheckString+$("#AjaxCommentsPaneData").attr("data-comments-floodcheck")+Roblox.CommentsPane.Resources.seconds):$(".AjaxCommentsContainer textarea").addClass("hint-text").val(Roblox.CommentsPane.Resources.defaultMessage),$(".Comments").prepend(t(n,!1)),Roblox.Widgets.AvatarImage.load($(".Comments [data-comment-id="+n.ID+"] .roblox-avatar-image"))):typeof n.errormsg!="undefined"?e(n.errormsg):$(".AjaxCommentsContainer textarea").addClass("hint-text").val(n),$("#CharsRemaining").html("")}})},t=function(n,t){if(Roblox.CommentsPane.FilterIsEnabled&&Roblox.CommentsPane.FilterCleanExistingComments&&i(n.Content))return"";var r=$(".CommentsItemTemplate").clone();return t||r.find(".Actions").remove(),r.find(".Comment").attr("data-comment-id",n.ID),r.find(".ByLine a").text(n.Author).attr("href","/User.aspx?id="+n.AuthorID),r.find(".Avatar").addClass("roblox-avatar-image").attr("data-user-id",n.AuthorID).html(""),r.find(".Actions [data-comment-id]").attr("data-comment-id",n.ID),n.AuthorOwnsAsset!=null&&n.AuthorOwnsAsset==!0&&r.find(".UserOwnsAsset").css("display","inline-block"),r.find(),r=r.html(),r=r.replace("%CommentID",n.ID),r=r.replace("%CommentContent",n.Content),r=r.replace("%CommentCreated",n.Date),r=r.replace("%PageURL",encodeURIComponent(window.location.href))},c=function(n){var u,i,r;n=n==undefined?0:n,u=$(".Comments").attr("data-asset-id"),i=$(".Comments"),i.find(".empty,.more").remove(),i.append($('<div class="loading"></div>')),r=Math.floor(Math.random()*9001),$.ajax({type:"GET",url:"/API/Comments.ashx?rqtype=getComments&assetID="+u+"&startIndex="+n+"&cachebuster="+r,contentType:"application/json; charset=utf-8",success:function(n){var f=n.data,e,r,u;i.find(".loading,.empty,.more").remove();for(e in f)i.append(t(f[e],n.isMod));f.length==0&&i.append($('<div class="empty"'+Roblox.CommentsPane.Resources.noCommentsFound+"</div>")),r=$(".Comments .Comment").length,r<n.totalCount&&(u=$('<div class="more"><span class="btn-control btn-control-small">'+Roblox.CommentsPane.Resources.moreComments+"</span></div>"),u.find("span").click(function(){Roblox.CommentsPane.getComments(r)}),i.append(u)),Roblox.require("Widgets.AvatarImage",function(n){n.populate()}),$(".Comments .Actions a").each(function(n,t){t=$(t),t.click(function(){Roblox.CommentsPane.deleteComment(t.attr("data-comment-id")),t.parents(".Comment").remove()})})},error:function(){$(".Comments").find(".loading,.empty,.more").remove().append($('<div class="empty">'+Roblox.CommentsPane.Resources.sorrySomethingWentWrong+"</div>"))}})},h=function(n,t,i){if(i=typeof i=="undefined"?"":i,i!==""){var r=n.split(i).length-1;return r<=t}return n.length<=t},r=function(n,t,i){if(i=typeof i=="undefined"?"":i,i!==""){var f=n.split(i),e=f.length,u="",r;if(e>t)for(r=0;r<e;++r)u+=f[r],r<t&&(u+=i);n=u}else n=n.substr(0,t);return n},n=function(n,t,i,r){r=typeof r=="undefined"?!1:r,i=typeof i=="undefined"?!0:i,r&&n.empty(),n.append(t+" "),i?n.hide():n.show()},f=function(n,t){$("#CharsRemaining").html(Math.max(0,Math.min(t,t-n.length))+Roblox.CommentsPane.Resources.charactersRemaining)},i=function(n){return new RegExp(Roblox.CommentsPane.FilterRegex).test(n.replace(/(\r\n|\n|\r|<br\/>)/gm,""))?!0:!1},u=function(){n($("#commentPaneErrorMessage"),"",!0,!0);$(".AjaxCommentsContainer textarea").on("input propertychange",function(){var u=$(".AjaxCommentsContainer textarea")[0],e=$("#commentPaneErrorMessage"),i=Roblox.CommentsPane.Limits,t;for(n(e,"",!0,!0),t=0;t<i.length;++t)h(u.value,i[t].limit,i[t].character)||(u.value=r(u.value,i[t].limit,i[t].character),n(e,i[t].message,!1)),typeof i[t].character=="undefined"&&f(u.value,i[t].limit)});$(".AjaxCommentsContainer .roblox-comment-button").click(function(){var t=$(".AjaxCommentsContainer textarea").val();if(t!=""&&t!=" "&&t!="Write a comment!"&&t!=Roblox.CommentsPane.Resources.floodCheckString+$("#AjaxCommentsPaneData").attr("data-comments-floodcheck")+Roblox.CommentsPane.Resources.seconds){if(Roblox.CommentsPane.FilterIsEnabled&&i(t)){Roblox.GenericModal.open(Roblox.CommentsPane.Resources.linksNotAllowedTitle,"/images/Icons/img-alert.png",Roblox.CommentsPane.Resources.linksNotAllowedMessage);return}Roblox.CommentsPane.makeComment(),n($("#commentPaneErrorMessage"),"",!0,!0)}}),$(".AjaxCommentsContainer textarea").focus(function(){var n=$(this);n.hasClass("hint-text")&&(this.value="",n.removeClass("hint-text"))}),$(".AjaxCommentsContainer .Buttons").click(function(){var n=$(".AjaxCommentsContainer textarea");n.hasClass("hint-text")&&(n.val(""),n.removeClass("hint-text"),n.focus())})};return{initialize:u,deleteComment:o,getComments:c,makeComment:s}}();

;// GenericConfirmation.js
typeof Roblox=="undefined"&&(Roblox={}),typeof Roblox.GenericConfirmation=="undefined"&&(Roblox.GenericConfirmation=function(){function s(n){var c={titleText:"",bodyContent:"",footerText:"",acceptText:Roblox.GenericConfirmation.Resources.yes,declineText:Roblox.GenericConfirmation.Resources.No,acceptColor:u,declineColor:r,xToCancel:!1,onAccept:function(){return!1},onDecline:function(){return!1},onCancel:function(){return!1},imageUrl:null,allowHtmlContentInBody:!1,allowHtmlContentInFooter:!1,dismissable:!0,fieldValidationRequired:!1,onOpenCallback:function(){}},o,e,h,s;n=$.extend({},c,n),i.overlayClose=n.dismissable,i.escClose=n.dismissable,o=$("[roblox-confirm-btn]"),o.html(n.acceptText+"<span class='btn-text'>"+n.acceptText+"</span>"),o.attr("class","btn-large "+n.acceptColor),o.unbind(),o.bind("click",function(){return n.fieldValidationRequired?f(n.onAccept):t(n.onAccept),!1}),e=$("[roblox-decline-btn]"),e.html(n.declineText+"<span class='btn-text'>"+n.declineText+"</span>"),e.attr("class","btn-large "+n.declineColor),e.unbind(),e.bind("click",function(){return t(n.onDecline),!1}),$('[data-modal-handle="confirmation"] div.Title').text(n.titleText),h=$("[data-modal-handle='confirmation']"),n.imageUrl==null?h.addClass("noImage"):(h.find("img.GenericModalImage").attr("src",n.imageUrl),h.removeClass("noImage")),n.allowHtmlContentInBody?$("[data-modal-handle='confirmation'] div.Message").html(n.bodyContent):$("[data-modal-handle='confirmation'] div.Message").text(n.bodyContent),$.trim(n.footerText)==""?$('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').hide():$('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').show(),n.allowHtmlContentInFooter?$('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').html(n.footerText):$('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').text(n.footerText),$("[data-modal-handle='confirmation']").modal(i),s=$("a.genericmodal-close"),s.unbind(),s.bind("click",function(){return t(n.onCancel),!1}),n.xToCancel||s.hide(),n.onOpenCallback()}function n(n){typeof n!="undefined"?$.modal.close(n):$.modal.close()}function t(t){n(),typeof t=="function"&&t()}function f(t){if(typeof t=="function"){var i=t();if(i!=="undefined"&&i==!1)return!1}n()}var o="btn-primary",u="btn-neutral",r="btn-negative",e="btn-none",i={overlayClose:!0,escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"}};return{open:s,close:n,green:o,blue:u,gray:r,none:e}}());

;// Item.js
var Roblox=Roblox||{};$(document).ready(function(){function i(n){var i=$(n+" .SetListDropDownList"),r=$(n+" .SetListDropDownList .menu"),t=$(n+" .btn-dropdown,"+n+" .btn-dropdown-active");i.toggleClass("invisible"),r.toggleClass("invisible"),t.toggleClass("btn-dropdown"),t.toggleClass("btn-dropdown-active")}function r(){var t=$(".ItemOptions").data("isdropdownhidden")=="True",i=$(".ItemOptions").data("isitemlimited")=="True",n=$(".ItemOptions").data("isitemresellable")=="True";t&&(!i||n)&&$(".ItemOptions, .ItemOptions .menu .invisible").removeClass("invisible"),n||$(".ItemOptions .delete-item-btn").removeClass("invisible")}var n=$(".DescriptionPanel .Description.Full").text(),t;n.length>150&&(n=n.substring(0,147)+"... <a onclick=\"Roblox.Item.toggleDesc('more');\">More</a>"),$(".DescriptionPanel .Description.body").html(n),$(".PutItemUpForSaleBtn").click(function(n){n.preventDefault();var t={escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"},appendTo:"form"};$("#SellItemModalContainer").modal(t)}),$("#SellItemModalContainer input").keyup(function(){Roblox.Item.validateResellInput()}),$("#TakeOffSale").click(function(n){n.preventDefault();var t={escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"},appendTo:"form"};$("#TakeOffSaleModalContainer").modal(t)}),$(".SetAddButton").click(function(n){n.preventDefault();var t=$(this),u=t.attr("assetid"),r=t.attr("setid"),i="waiting"+r+"_"+u;t.append("<img src='/images/spinners/spinner16x16.gif' id='"+i+"'"),$.ajax({type:"POST",async:!0,cache:!1,timeout:5e4,url:"/Sets/SetHandler.ashx?rqtype=addtoset&assetId="+u+"&setId="+r,success:function(n){n!==null&&(t.removeClass("SetAddButton"),t.addClass("SetAddButtonAlreadyContainsItem"),t.unbind("click"),$("#"+i).remove())},failure:function(n){n!==null}})}),$("#MasterContainer").click(function(){var i=$(".SetListDropDownList,.SetListDropDownList .menu"),t=$(".btn-dropdown,.btn-dropdown-active");i.each(function(n,t){$(t).hasClass("invisible")||$(t).toggleClass("invisible")}),t.each(function(n,t){$(t).hasClass("btn-dropdown-active")&&($(t).toggleClass("btn-dropdown-active"),$(t).toggleClass("btn-dropdown"))})});$(document).on("click",function(){$(".SetListDropDownList").addClass("invisible"),$(".SetListDropDownList .menu").addClass("invisible"),$(".btn-dropdown-active").attr("class","btn-dropdown")});$(".SetOptions .btn-dropdown").click(function(){return i(".SetOptions"),!1}),$(".ItemOptions .btn-dropdown").click(function(){return i(".ItemOptions"),!1}),$(".SetListDropDownList .UpdateSet").click(function(n){Roblox.Item.UpdateSets(Roblox.AddToSets.setItemId,!1,n)}),$(".SetListDropDownList .UpdateAllSets").click(function(n){Roblox.Item.UpdateSets(Roblox.AddToSets.setItemId,!0,n)}),$(".CreateSetButton").click(function(){$("#CreateSetPopupContainerDiv").modal({appendTo:"form",escClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"},position:[120,0]})}),$(".PurchaseButton").each(function(n,t){$(t).unbind().click(function(){return Roblox.CatalogItemPurchase.openPurchaseVerificationView(t),!1})}),$(".fadeInAndOut").fadeIn(1e3,"swing",function(){$(this).delay(6e3).fadeOut(3e3)}),Roblox.CatalogItemPurchase=new Roblox.ItemPurchase(function(n){if(n.IsMultiPrivateSale)$(".ConfirmationModal").on("remove",function(){window.location.reload()});else{var t="You already own this item.";$(".PurchaseButton").addClass("btn-disabled-primary").attr("original-title",t).tipsy()}r()}),Roblox.Item.ShowAssetGrantedModal&&(t=null,Roblox.Item.ForwardToUrl&&(t=window.open(Roblox.Item.ForwardToUrl,"_blank")),Roblox.GenericModal.open(Roblox.Resources.AssetGrantedResources.assetGrantedModalTitle,null,Roblox.Resources.AssetGrantedResources.assetGrantedModalMessage,null),Roblox.Item.ForwardToUrl&&!t&&($.event.special.destroyed={remove:function(n){n.handler&&n.handler()}},$("#simplemodal-container").bind("destroyed",function(){document.location.href=Roblox.Item.ForwardToUrl})))}),Roblox.Item=function(){function u(t){n=t}function f(){var t=$("#SellItemModalContainer input").val(),u;if(isNaN(parseInt(t))||t!=parseInt(t)+""||t<=0){u="Price must be a positive integer.",$("#SellItemModalContainer .error-message").text(u).show();return}$("#SellItemModalContainer .error-message").hide();var f=Math.round(t*n),i=f>1?f:1,r=t-i;$("#SellItemModalContainer .lblCommision").text(i>0?i:""),$("#SellItemModalContainer .lblLeftover").text(r>=0?r:"")}function r(n){var r=$(".DescriptionPanel .Description.body"),u=$(".DescriptionPanel .Description.Full"),t,i;n=="more"?(t="Less",r.html(u.text()+"   <a onclick=\"Roblox.Item.toggleDesc('less');\">"+t+"</a>")):n=="less"&&(i="More",r.html(u.text().substring(0,147)+"... <a onclick=\"Roblox.Item.toggleDesc('more');\">"+i+"</a>"))}function t(n){var t={overlayClose:!0,opacity:80,overlayCss:{backgroundColor:"#000"}};typeof n!="undefined"&&n!==""&&$.modal.close("."+n),$("#ProcessingView").modal(t)}function i(n,t,i){var r=$(i.target).attr("setid");$.post("/Sets/SetHandler.ashx?rqtype=getnewestversion&assetSetItemId="+n+(t?"&allsets=true":""),function(){$(".UpdateInSetsContainerDiv").remove(),$("a[setid="+r+"]").removeClass("SetAddButton").addClass("SetAddButtonAlreadyContainsItem")})}var n=.3;return{showProcessingModal:t,updateSets:i,toggleDesc:r,validateResellInput:f,setMarketPlaceFee:u}}();
