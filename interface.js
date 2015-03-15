//select difficulty based on radial button
function dif_selected(difficulty) {
    //Grab the radio form and loop through it looking for the selected btn
    sessionStorage.setItem("difficulty", parseInt(difficulty));
}

//start the game by switching html pages (should be removed)
function letsgo() {
    document.getElementById("notes").classList.add('in');
    document.getElementById("display").classList.add('in');
    document.getElementById("start_screen").classList.add('out');
    document.getElementById("main").classList.add('start');
    
    var key = document.getElementById("key_type");
    var key_val = key.options[key.selectedIndex].value;
    
    var scale = document.getElementById("scale_type");
    var scale_val = scale.options[scale.selectedIndex].value;
    
    chooseScale(key_val+scale_val);
}

//change the volume
function change_vol(vol_amount) {
    localStorage.setItem("volume", vol_amount);
}

//get thd current volums
function get_vol() {
    return parseFloat(localStorage.getItem("volume"))/100.0;
}

function highlight_note(key, correct) {
    if(correct) {
        key.classList.remove("correct");
        key.offsetWidth = key.offsetWidth;
        key.classList.add("correct");
    } else {
        key.classList.remove("incorrect");
        key.offsetWidth = key.offsetWidth;
        key.classList.add("incorrect");
    }
}