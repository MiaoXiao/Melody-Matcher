//Call on page load
window.onload = letsgo;

//select difficulty based on radial button
function dif_selected(difficulty) {
    //Grab the radio form and loop through it looking for the selected btn
    sessionStorage.setItem("difficulty", parseInt(difficulty));
}

/*
//update keyboard tooltip checkbox
function update_keyboard_tooltips() {
    var tooltip = document.getElementById("keyboard_tooltip");
	if(tooltip.checked) { //if box is checked
		document.getElementById("C3").innerHTML = '\0000';
	}
	else { //if box is not checked
		console.log("notchecked!");
		document.getElementById("C3").innerHTML = 'Q';
	}
}*/

//start the game by switching html pages (should be removed)
function letsgo() {
    document.getElementById("display").classList.add('in');
    //Add minor delay so animation will show
    setTimeout(function(){ document.getElementById("notes").classList.add('in'); }, 20);
    
	//set default key and scale
	sessionStorage.setItem("current_key", "C");
	sessionStorage.setItem("current_scale", "maj");
    chooseScale();
    
	/*
	document.getElementById("keyboard_tooltip").checked = true;
	//show keyboard toolstips
	update_keyboard_tooltips();*/
	
    //Throw players straight into a game (after short delay)
    setTimeout(function(){ initStart(); }, 50);
}

//change the volume
function change_vol(vol_amount) {
    localStorage.setItem("volume", vol_amount);
}

//get the current volume
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

var last_high = null;

function hint(elm) {
    if(last_high !== null) last_high.classList.remove("hint");
    elm.classList.add("hint");
    last_high = elm;
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
    console.log(document.getElementById("notes").offsetWidth);
    animate_numbers(document.getElementById("score"), current_score, 0, 500, 100);
}

function update_score(gameinfo, scoreinfo) {
    var score_spot = document.getElementById("score");
    var current_score = gameinfo.gamescore;
    var final_score = current_score + scoreinfo.score_final;
    animate_numbers(score_spot, current_score, final_score, 1000, 100);
    
    var update_spot = document.getElementById("update");
    update_spot.innerHTML = "+ " + Math.round(gameinfo.multi * 10) / 10 + " * (" +
                            scoreinfo.score_base + " + " +
                            scoreinfo.score_noerror + " + " +
                            scoreinfo.score_playonce + " + " +
                            scoreinfo.score_speed + " + " +
                            scoreinfo.score_flats + " + " +
                            scoreinfo.score_streak + ")";
    update_spot.classList.remove("animate");
    update_spot.offsetWidth = update_spot.offsetWidth;
    update_spot.classList.add("animate");
    setTimeout(function() { update_spot.innerHTML = ""; }, 5000);
}

function settings_in() {
    document.getElementById("settings_but").disabled = true;
    
    document.getElementById("settings").classList.remove('in');
    document.getElementById("settings").classList.remove('out');
    document.getElementById("film").classList.remove('in');
    document.getElementById("film").classList.remove('out');
    
    document.getElementById("film").offsetWidth = document.getElementById("film").offsetWidth;
    document.getElementById("settings").offsetWidth = document.getElementById("settings").offsetWidth;
    
    document.getElementById("settings").classList.add('in');
    document.getElementById("film").classList.add('in');
}

function settings_out() {
    document.getElementById("settings_but").disabled = false;
    
    document.getElementById("settings").classList.remove('out');
    
    document.getElementById("film").offsetWidth = document.getElementById("film").offsetWidth;
    document.getElementById("settings").offsetWidth = document.getElementById("settings").offsetWidth;
    
    document.getElementById("settings").classList.add('out');
    document.getElementById("film").classList.add('out');
    
    //Wait until after end finishes to move the z-index back
    setTimeout(function() { document.getElementById("film").classList.remove('in'); }, 1000);
    
    var key = document.getElementById("key_type");
    //var key_val = key.options[key.selectedIndex].value;
    sessionStorage.setItem("current_key", key.options[key.selectedIndex].value);
	
    var scale = document.getElementById("scale_type");
    //var scale_val = scale.options[scale.selectedIndex].value;
	sessionStorage.setItem("current_scale", scale.options[scale.selectedIndex].value);
}
