function RobloxJSONCookie(name) {
    this._cookiename = name;
}

RobloxJSONCookie.prototype =
{
    Delete: function () {
        return ($.removeJSONCookie(this._cookiename));
    },
    SetObj: function (obj, options) {
        if (!options)
            options = { path: '/' }
        return $.JSONCookie(this._cookiename, obj, options);
    },
    Set: function (name, value, options) {
        var properties = this.GetObj();
        properties[name] = value;
        $.JSONCookie(this._cookiename, properties, options);

        return this;
    },
    GetObj: function () {
        var obj = $.getJSONCookie(this._cookiename, false);
        if (obj == null)
            return new Object();
        else
            return obj;
    },
    Get: function (name) {
        var properties = this.GetObj();
        return properties[name];
    }
}