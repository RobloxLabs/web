function onNameChange(ele)
{
    ismaxlength(ele);
    updateRegularNameDisplay(ele);
}

function onSuperSafeNameChange(ele, maxAllowed)
{
    chkSelect(ele, maxAllowed);
    updateSuperSafeNameDisplay();
}

function chkSelect(ele, maxAllowed)
{
    var aSelected = new Array();
    for (var i = 0; i < ele.options.length; i++)
    {
        if (ele.options[i].selected)
            aSelected.push(ele.options[i].value);
    }
    if (aSelected.length > maxAllowed)
    {
        alert(Roblox.CreateSetPanel.Resources.youMaySelect + maxAllowed + Roblox.CreateSetPanel.Resources.elementsInList);
        for (var m = 0; m < ele.length; m++)
        {
            var found = false;
            // Why doesn't index of work?
            for (var k = 0; k < prevSelected.length; k++)
            {
                if (prevSelected[k] == ele[m].value)
                {
                    ele.options[m].selected = true;
                    found = true;
                    break;
                }
            }
            if (!found)
            {
                ele.options[m].selected = false;
            }
        }
    }
    else
    {
        prevSelected = aSelected;
    }
}
function updateSuperSafeNameDisplay()
{
    // Iterate through selections and generate name
    var nameString = "";
    var isFirst = true;

    var adjectiveList = document.getElementById(superSafeAdjectiveListClientId); //$('#' + superSafeAdjectiveListClientId);
    for (var i = 0; i < adjectiveList.options.length; i++)
    {
        if (adjectiveList.options[i].selected)
        {
            if (!isFirst)
            {
                nameString += " ";
            }
            isFirst = false;
            nameString += adjectiveList.options[i].value;
        }
    }
    var categoryList = document.getElementById(superSafeCategoryListClientId);
    for (var i = 0; i < categoryList.options.length; i++)
    {
        if (categoryList.options[i].selected)
        {
            if (!isFirst)
            {
                nameString += " ";
            }
            isFirst = false;
            nameString += categoryList.options[i].value;
        }
    }
    var nameList = document.getElementById(superSafeNameListClientId);
    for (var i = 0; i < nameList.options.length; i++)
    {
        if (nameList.options[i].selected)
        {
            if (!isFirst)
            {
                nameString += " ";
                isFirst = false;
            }
            isFirst = false;
            nameString += nameList.options[i].value;
        }
    }
    $('#NameDisplay').html(userName + "'s " + nameString);
}
function updateRegularNameDisplay(ele)
{
    if (ele.value.length > 0)
        $('#NameDisplay').html(userName + "'s " + ele.value.escapeHTML());
    else
        $('#NameDisplay').empty();
}

function ismaxlength(obj)
{
    var mlength = obj.getAttribute ? parseInt(obj.getAttribute("maxlength")) : "";
    if (obj.getAttribute && obj.value.length > mlength)
        obj.value = obj.value.substring(0, mlength);
}