//Create a span element that will be used to get the width
var isInitialized = false;
var fitStringSpan = null;

function InitStringTruncator()
{
    if (isInitialized)
        return;

    fitStringSpan = document.createElement("span");
    fitStringSpan.style.display = 'inline-block';
    fitStringSpan.style.visibility = 'hidden';
    fitStringSpan.style.height = '0px';
    fitStringSpan.style.padding = '0px';
    document.body.appendChild(fitStringSpan);

    isInitialized = true;
}

function fitStringToWidth(str, width, className) {
    
    if (!isInitialized)
        InitStringTruncator();
    
    // str    A string where html-entities are allowed but no tags.
    // width  The maximum allowed width in pixels
    // className  A CSS class name with the desired font-name and font-size. (optional)
    // ----
    // _escTag is a helper to escape 'less than' and 'greater than'
    function _escTag(s) { return s.replace("<", "&lt;").replace(">", "&gt;"); }

    

   //Allow a classname to be set to get the right font-size.
    if (className)
        fitStringSpan.className = className;
    

    var result = _escTag(str); // default to the whole string
    fitStringSpan.innerHTML = result;
    // Check if the string will fit in the allowed width. NOTE: if the width
    // can't be determinated (offsetWidth==0) the whole string will be returned.
    if (fitStringSpan.offsetWidth > width)
    {
        var posStart = 0, posMid, posEnd = str.length, posLength;
        // Calculate (posEnd - posStart) integer division by 2 and
        // assign it to posLength. Repeat until posLength is zero.
        while (posLength = (posEnd - posStart) >> 1)
        {
            posMid = posStart + posLength;
            //Get the string from the begining up to posMid;
            fitStringSpan.innerHTML = _escTag(str.substring(0, posMid)) + '&hellip;';

            // Check if the current width is too wide (set new end)
            // or too narrow (set new start)
            if (fitStringSpan.offsetWidth > width) posEnd = posMid; else posStart = posMid;
        }

        result = str.substring(0, posStart) + '&hellip;';
//        result = _escTag(str.substring(0, posStart)) + '&hellip;';
    }
    
    return result;
}

function fitStringToWidthSafe(str, width, className) {
    var safeName = fitStringToWidth(str, width, className);
    if (safeName.indexOf("&hellip;") != -1) {
        var posEnd = safeName.lastIndexOf(" ");
        if (posEnd != -1 && posEnd + 10 <= safeName.length) {
            safeName = safeName.substring(0, posEnd + 2) + "&hellip;";
        }
    }
    return safeName;
}
function fitStringToWidthSafeText(str, width, className) {
    var safeName = fitStringToWidthSafe(str, width, className).replace("&hellip;", "...");
    return safeName;
}
