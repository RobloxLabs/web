window.onload = function () {
    if (publishOnPageLoad)
        publish();
}

function publish() {
    if (redirectLoginUrl !== "") {
        window.location = redirectLoginUrl;
        return;
    }

    document.getElementById("Uploading").style.display = 'block';
    var result = window.external.Save();
    if (result) {
        document.getElementById("DialogResult").value = '1';
        window.close();
    }
    else { // try again... 
        result = window.external.Save();
        if (result) {
            document.getElementById("DialogResult").value = '1';
            window.close();
        }
        else {
            document.getElementById('ErrorLabel').style.display = '';
            document.getElementById("NormalSaveButton").style.display = 'none';
            document.getElementById("NormalSaveText").style.display = 'none';

            document.getElementById("LocalSaveButton").style.display = 'block';
            document.getElementById("LocalSaveText").style.display = 'block';
        }
    }
    document.getElementById("Uploading").style.display = 'none';
}