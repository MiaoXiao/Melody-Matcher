//global variables
//default volume
var VOLUME = 0.5;
//default speed
var SPEED = 1;
//key for melody
var ANSWERKEY = [];
//current scale
var SCALE = [];
//current position in answerkey
var ANSPOS = 0;
//current messege
var DISPLAY = "";
//Hold the full chromatic
var CHROMATIC = ["C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5"];


//change speed. between .1 and 2
function changeSpeed(speed) {
	//check that speed is within bounds
	if (speed < 0.1 || speed > 2) {
		window.alert("ERROR: SPEED NOT BETWEEN 0.1 and 2");
	}
	SPEED = speed;
}

//change volume. between 0 and 1
function changeVolume(volume) {
	//check that volume is within bounds
	if (volume < 0 || volume > 1) {
		window.alert("ERROR: VOLUME NOT BETWEEN 0 and 1");
	}
	VOLUME = volume;
}

//load all sounds that will be used
//pass in what instrument to use, violin or piano
function loadSounds(instrument) {
	
	//check to see if you can play sounds
	if (!createjs.Sound.initializeDefaultPlugins()) { return; }
	
	//audio path
	var audioPath = "./sounds/" + instrument + "/";
	
	//library of sounds
	var sounds = [
		{src: "0_C4.ogg", id: "C4"},
		{src: "1_Db4.ogg", id: "Db4"},
		{src: "2_D4.ogg", id: "D4"},
		{src: "3_Eb4.ogg", id: "Eb4"},
		{src: "4_E4.ogg", id: "E4"},
		{src: "5_F4.ogg", id: "F4"},
		{src: "6_Gb4.ogg", id: "Gb4"},
		{src: "7_G4.ogg", id: "G4"},
		{src: "8_Ab4.ogg", id: "Ab4"},
		{src: "9_A4.ogg", id: "A4"},
		{src: "10_Bb4.ogg", id: "Bb4"},
		{src: "11_B4.ogg", id: "B4"},
		{src: "12_C5.ogg", id: "C5"}
	];
	createjs.Sound.alternateExtensions = ["mp3"];
	
	//loop through sounds array
	for (var i = 0; i < sounds.length; i++) {
		createjs.Sound.registerSound(audioPath + sounds[i].src, sounds[i].id, 25);
	}
}

//choose a specific scale
function chooseScale(scale) {
	//The notes in a major scale
	var major = [0, 2, 4, 5, 7, 9, 11];
	//clear scale array
	SCALE.length = 0;
	
	var start = 0;

	switch (scale) {
		case "Cmaj":
			start = 0;
			break;
		case "C#maj":
		case "Dbmaj":
			start = 1;
			break;
		case "Dmaj":
			start = 2;
			break;
		case "Ebmaj":
			start = 3;
			break;
		case "Emaj":
			start = 4;
			break;
		case "Fmaj":
			start = 5;
			break;
		case "F#maj":
		case "Gbmaj":
			start = 6;
			break;
		case "Gmaj":
			start = 7;
			break;
		case "Abmaj":
			start = 8;
			break;
		case "Amaj":
			start = 9;
			break;
		case "Bbmaj":
			start = 10;
			break;
		case "Bmaj":
		case "Cbmaj":
			start = 11;
			break;
	}
	
	for(var x = 0; x < major.length; x++) {
		var note = start + major[x];
		if((note == (CHROMATIC.length - 1)) || note == 0) {
			//Cover edge case for the C's
			SCALE.push(CHROMATIC[CHROMATIC.length-1]);
			SCALE.push(CHROMATIC[0]);
		} else if(note >= CHROMATIC.length) {
			//If we loop around to low C
			SCALE.push(CHROMATIC[(note%CHROMATIC.length) + 1]);
		} else {
			SCALE.push(CHROMATIC[note]);
		}
		
    }
    //For testing
    //window.alert(SCALE)
}

//play melody using answerkey array
function playMelody() {
	for (var i = 0; i < ANSWERKEY.length; i++) {
		//i * (speed * 1000) will give a delay that is consistent
		createjs.Sound.play(SCALE[ANSWERKEY[i]], "none", i * (SPEED * 1000), 0, 0, VOLUME);
	}
}

//creates a random melody by filling answerkey array
function generateMelody(numNotes, range) {
	//check that range is within bounds
	if (range < 1 || range > 7) {
		window.alert("ERROR: RANGE NOT BETWEEN 1 and 7");
	}
	//check that numNotes is within bounds
	if (numNotes < 1) {
		window.alert("ERROR: NUM NOTES BELOW 0");
	}
	//clear array
	ANSWERKEY.length = 0;
	//holds random number between 0 and range
	var randNum;
	//fills answer key with random iterators between range and 0
	for (var i = 0; i < numNotes; i++) {
		randNum = Math.floor((Math.random() * range) + 0);
		//if the random number is the same as the last one, dec or inc by 1
		if (i != 0 && randNum == ANSWERKEY[i - 1]) {
			if (randNum == 0) {
				randNum += 1;
			}
			else if (randNum == 7) {
				randNum -= 1;
			}
			else if (Math.floor((Math.random() * 1) + 0)) {
				randNum += 1;
			}
			else {
				randNum -= 1;
			}
		}
		ANSWERKEY[i] = randNum;
		//window.alert(ANSWERKEY[i]);
	}
	playMelody();
}

//play a sound given an id (ex C4, G4, Bb4)
function playSound(note) {
	createjs.Sound.play(note, "none", 0, 0, 0, VOLUME);
}

//check to see if melody is correct so far
//note is a string (ex. C4)
//updates current messsege
function checkMelody(note) {
	//if correct
	if (SCALE[ANSWERKEY[ANSPOS]] == note) {
		ANSPOS++;
		//check if melody has been completed
		if (ANSPOS >= ANSWERKEY.length) {
			//increase time
			//calculate score for melody
			//possibly increase difficulty
			//generate a new melody
			ANSPOS = 0;
			DISPLAY = "Melody correct!";
		}
		else { //correct note otherwise
			DISPLAY = "Nice!";
		}
	}
	else {
		ANSPOS = 0;
		DISPLAY = "Incorrect!";
	}
}

//displays messege
function displayMessege() {
	document.getElementById("display").innerHTML = DISPLAY;
}

//run 3 functions every key press
function onButtonClick(note) {
	playSound(note);
	checkMelody(note);
	displayMessege();
}
