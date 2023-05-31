if (typeof jQuery !== 'undefined' && jQuery.fn.jquery != '1.7.2')
    var conflict = true;

Roblox.define('jQuery', '/js/jquery/jquery-1.7.2.min.js', function () {
    if (conflict)
        return jQuery.noConflict(true);
    else
        return jQuery;
});