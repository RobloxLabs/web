// defines a new jquery selector - for example: $("input:focus").doStuff();
// see http: //stackoverflow.com/questions/2683742/is-there-a-has-focus-in-javascript-or-jquery

jQuery.extend(jQuery.expr[':'], {
    focus: function(element)
    {
        return element == document.activeElement;
    }
});