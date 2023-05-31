function createXMLHttp() {
    var xmlhttp = false;
    /*@cc_on@*/
    /*@if (@_jscript_version >= 5)
    // JScript gives us Conditional compilation, we can cope with old IE versions.
    // and security blocked creation of the objects.
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    @end@*/
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        try {
            xmlhttp = new XMLHttpRequest();
        } catch (e) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && window.createRequest) {
        try {
            xmlhttp = window.createRequest();
        } catch (e) {
            xmlhttp = false;
        }
    }
    return xmlhttp;
}
function genericAjax(url) {
    var ajaxObj = createXMLHttp();
    //Use this function when no response is needed
    ajaxObj.open("GET", url + '&rand=' + Math.random(), true);
    ajaxObj.open("GET", url, true);
    ajaxObj.send(null);
}

//Pass the web service a reference to the function to call when it returns
//Callback must be a function accepting a single argument, which will be the response text
function MakeAjaxCall(url, callback) {
    var ajaxObj = createXMLHttp();
    ajaxObj.open("GET", url + '&rand=' + Math.random(), true);
    ajaxObj.onreadystatechange = function() {
        if (ajaxObj.readyState == 4) {
            callback(ajaxObj.responseText);
        }
    }
    ajaxObj.send(null);
}

//Pass the web service a reference to the function to call when it returns
//Callback must be a function accepting a single argument, which will be the response text
function MakeAjaxPost(url, postData, callback) {
    var ajaxObj = createXMLHttp();
    ajaxObj.open("POST", url + '&rand=' + Math.random(), true);
    ajaxObj.onreadystatechange = function() {
        if (ajaxObj.readyState == 4) {
            callback(ajaxObj.responseText);
        }
    }
    ajaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    ajaxObj.send(postData);
}

//Calls a web service that returns HTML, placing it into the specified element
function FillDivWithAjax(url, target) {
    MakeAjaxCall(url, function(returnHTML) {
        target.innerHTML = returnHTML;
    });
}