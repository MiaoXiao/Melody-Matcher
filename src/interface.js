//Store the current difficulty for the session for in between pages
localStorage.setItem("difficulty", 0);
localStorage.setItem("volume", 90);

function dif_selected() {
    //Enable the start button if it wasn't already
    document.getElementById("btn01").disabled = false;
    //Grab the radio form and loop through it looking for the selected btn
    var rdio = document.getElementById("dif_radio");
    for (var i = 0; i < rdio.length ;i++) {
        //Set difficulty accordingly
        if(rdio.elements[i].checked) localStorage.setItem("difficulty", i*10);
    }
}

function letsgo() {
    localStorage.setItem("volume", document.getElementById("volume").value);
    //window.alert(localStorage.getItem("volume"));
    document.location.href = "testsoundManager.html";
}

function change_vol(vol_amount) {
    localStorage.setItem("volume", vol_amount);
}

function get_vol() {
    return parseFloat(localStorage.getItem("volume"))/100.0;
}