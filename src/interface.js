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
    document.getElementById("main").classList.add("wait");
    
    var key = document.getElementById("key_type");
    var key_val = key.options[key.selectedIndex].value;
    
    var scale = document.getElementById("scale_type");
    var scale_val = scale.options[scale.selectedIndex].value;
    
    chooseScale(key_val, scale_val);
    
    //Throw players straight into a game
    initStart();
}

//change the volume
function change_vol(vol_amount) {
    localStorage.setItem("volume", vol_amount);
}

//get thd current volums
function get_vol() {
    return parseFloat(localStorage.getItem("volume"))/100.0;
}

function scale_selected(scale) {
    if(scale == "chrom") {
        document.getElementById("key_type").disabled = true;
    } else {
        document.getElementById("key_type").disabled = false;
    }
}

function highlight_note(key, correct) {
    key.classList.remove("correct");
    key.classList.remove("incorrect");
    key.offsetWidth = key.offsetWidth;
    if(correct) {
        key.classList.add("correct");
    } else {
        key.classList.add("incorrect");
    }
}

//handler
function animate_numbers(elm, from, to, time, steps) {
    animate_numbers_(elm, from, to, time, steps, from);
}

//Actual recursive func
function animate_numbers_(elm, from, to, time, steps, curr) {
    //Ints only
    elm.innerHTML = parseInt(curr);
    if(Math.abs(curr - to) < 1) {
        elm.innerHTML = to;
        return;
    }
    
    setTimeout(function(){
               animate_numbers_(elm, from, to, time, steps, curr + (to-from)/steps);
               }, time / steps);
}

function reset_score(current_score) {
    animate_numbers(document.getElementById("score"), current_score, 0, 500, 100);
}

function update_score(gameinfo, scoreinfo) {
    var score_spot = document.getElementById("score");
    var current_score = gameinfo.gamescore;
    var final_score = current_score + scoreinfo.score_final;
    animate_numbers(score_spot, current_score, final_score, 1000, 100);
    
    var update_spot = document.getElementById("update");
    update_spot.innerHTML = "+ " + Math.round(gameinfo.multi) + " * (" +
                            scoreinfo.score_base + " + " +
                            scoreinfo.score_noerror + " + " +
                            scoreinfo.score_playonce + " + " +
                            scoreinfo.score_speed + " + " +
                            scoreinfo.score_flats + " + " +
                            scoreinfo.score_streak + ")";
    update_spot.classList.remove("animate");
    update_spot.offsetWidth = update_spot.offsetWidth;
    update_spot.classList.add("animate");
    setTimeout(function() { update_spot.innerHTML = ""; }, 3000);
}

