//select difficulty based on radial button
function dif_selected() {
    //Enable the start button if it wasn't already
    document.getElementById("btn01").disabled = false;
    //Grab the radio form and loop through it looking for the selected btn
    var rdio = document.getElementById("dif_radio");
    for (var i = 0; i < rdio.length ;i++) {
        //Set difficulty accordingly
        if(rdio.elements[i].checked) sessionStorage.setItem("difficulty", i*10);
    }
}

//start the game by switching html pages (should be removed)
function letsgo() {
    document.location.href = "testgameManager.html";
}

//change the volume
function change_vol(vol_amount) {
    localStorage.setItem("volume", vol_amount);
}

//get thd current volums
function get_vol() {
    return parseFloat(localStorage.getItem("volume"))/100.0;
}

function test() {
    document.getElementById("notes").classList.add('test');
    //boxOne.classList.add('horizTranslate');
}