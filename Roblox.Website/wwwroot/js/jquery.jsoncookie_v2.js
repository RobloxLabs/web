/** 
* JSON Cookie - jquery.jsoncookie.js
*
* Sets and retreives native JavaScript objects as cookies.
* Depends on the object serialization framework provided by JSON2.
*
* Dependencies: jQuery, jQuery Cookie, JSON2
* 
* @project JSON Cookie
* @author Randall Morey
* @version 0.9
*/

(function ($) {
    var isObject = function (x) {
        return (typeof x === 'object') && !(x instanceof Array) && (x !== null);
    };

    $.extend({
        getJSONCookie: function (cookieName, jsonFormat) {
            var cookieData = $.cookie(cookieName);
            if (jsonFormat)
                return cookieData;
            else
                return cookieData ? JSON.parse(cookieData) : {};
        },
        setJSONCookie: function (cookieName, data, options) {
            var cookieData = '';

            options = $.extend({
                expires: 90,
                path: '/'
            }, options);

            if (!isObject(data)) {	// data must be a true object to be serialized
                // Must be in JSON already...
                cookieData = data;
            }
            else {
                cookieData = JSON.stringify(data);
            }

            return $.cookie(cookieName, cookieData, options);
        },
        removeJSONCookie: function (cookieName) {
            return $.cookie(cookieName, null);
        },
        JSONCookie: function (cookieName, data, options) {
            if (data) {
                $.setJSONCookie(cookieName, data, options);
            }
            return $.getJSONCookie(cookieName);
        }
    });
})(jQuery);
