/** 
 *  Extensions for JavaScript's built-in String class.
**/
$.extend(String.prototype, (function () {

    /**
     *  Escapes potentially dangerous characters into their HTML encoded equivalents.
     *
     *  #### Examples ####
     *
     *      '<div class="Place">This is a place.</div>'.escapeHTML()
     *          => '&lt;div class=&quot;Place&quot;&gt;This is a place.&lt;/div&gt;'
     *
    **/
    function escapeHTML() {
        var retval = this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
      
        return retval;
    }

    return {
        escapeHTML:     escapeHTML
    };

})());