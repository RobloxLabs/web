;// bundle: Widgets___ItemImage___21f324adbeaba25554172f72d949fb6f_m
;// files: modules/Widgets/ItemImage.js

;// modules/Widgets/ItemImage.js
Roblox.define("Widgets.ItemImage", ["/js/jquery/jquery-1.7.2.min.js", "/js/json2.min.js"], function() {
	//$.getJSON("/AssetInfo?id=100",function(data,status,xhr) {console.log(data);});
	//$.getJSON(t.endpoint, {params: JSON.stringify(o)}, jsonResult(data,status,xhr))
	
    function r(n) { //creates parameters for json request
        var t = $(n);
        return {
            imageSize: t.attr("data-image-size") || "large",
            noClick: typeof t.attr("data-no-click") != "undefined",
            noOverlays: typeof t.attr("data-no-overlays") != "undefined",
            assetId: t.attr("data-item-id") || 0
        }
    }
    function u(n, t) {
        var o, i, e, f, u, r;
        t.bcOverlayUrl != null && (o = $("<img>").attr("src", t.bcOverlayUrl).attr("alt", "Builders Club").css("position", "absolute").css("left", "0").css("bottom", "0").attr("border", 0),
        n.after(o)),
        t.limitedOverlayUrl != null && (i = $("<img>").attr("alt", t.limitedAltText).css("position", "absolute").css("left", "0").css("bottom", "0").attr("border", 0),
        t.bcOverlayUrl != null && (t.imageSize == "small" ? i.load(function() {
            i.css("left", 34)
        }) : i.load(function() {
            i.css("left", 46)
        })),
        i.attr("src", t.limitedOverlayUrl),
        n.after(i)),
        t.deadlineOverlayUrl != null && (e = $("<img>").attr("alt", "Deadline").attr("border", 0),
        e.attr("src", t.deadlineOverlayUrl),
        n.after(e)),
        t.iosOverlayUrl != null ? (f = $("<img>").attr("alt", "iOS Only").attr("border", 0),
        f.attr("src", t.iosOverlayUrl),
        n.after(f)) : t.saleOverlayUrl != null ? (u = $("<img>").attr("alt", "Sale").attr("border", 0),
        u.attr("src", t.saleOverlayUrl),
        n.after(u)) : t.newOverlayUrl != null && (r = $("<img>").attr("alt", "New").attr("border", 0),
        r.attr("src", t.newOverlayUrl),
        n.after(r))
    }
    function n(i, f) {
        for ($.type(i) !== "array" && (i = [i]); i.length > 0; ) {
            for (var s = i.splice(0, 10), o = [], e = 0; e < s.length; e++)
                o.push(r(s[e]));
			//console.log(o);
			//httpGet request with php parameters
			//$.getJSON("/thumbs/itemimage.ashx?jsoncallback=?", {params:""}, function(t, i) {}(s, o))
			//$.getJSON(t.endpoint, {params: JSON.stringify(o)}, function(t, i) {}(s, o))
			(function(t,o,e) { // protects t, o and e in an immediately called function
			//I actually laughed at the fact that this spelled toe.
            $.getJSON(t.endpoint, {
                params: JSON.stringify(o)
            }, function(t, i) { //just run >:( This breaks everything. If it could just run on its own, t and i would be properly set and everything would be fixed.
				// It seems these variables are incorrectly set. t is supposed to be the returned data and i is supposed to be the httpGet status.
				// I'll have to test this in Internet Explorer 9 or Google Chrome 31.0.1650
				console.log("t: ");
				console.log(t); //image element declared in function r
				console.log("i: ");
				console.log(i); //json request declared somewhere at the start of function n
				//r is supposed to be the httpGet response
                return function(r) {
					console.log("h moment"); //why isn't this run???
                    for (var v = [], e, c, h, o = 0; o < r.length; o++)
                        if (e = r[o],
                        e != null) {
                            var l = t[o]
                              , s = $(l)
                              , a = $("<div>").css("position", "relative").css("overflow", "hidden");
                            s.html(a),
                            s = a,
                            i[o].noClick || (c = $("<a>").attr("href", e.url),
                            s.append(c),
                            s = c),
                            h = $("<img>").attr("title", e.name).attr("alt", e.name).attr("border", 0).addClass("original-image"),
                            h.load(function(n, t, i, r) {
                                return function() {
                                    n.width(t.width),
                                    n.height(t.height),
                                    u(i, r)
                                }
                            }(a, l, h, e)),
                            s.append(h),
                            h.attr("src", e.thumbnailUrl),
                            e.thumbnailFinal || v.push(l)
                        }
                    f = f || 1,
                    f < 4 && window.setTimeout(function() {
                        n(v, f + 1)
                    }, f * 2e3)
                }
            }(s, o))
			})(t,o,e)
        }
    }
    function i() {
        n($(t.selector + ":empty").toArray())
    }
    var t = {
        selector: ".roblox-item-image",
        endpoint: "/thumbs/itemimage.ashx?jsoncallback=?"
    };
    return {
        config: t,
        load: n,
        populate: i
    }
});
