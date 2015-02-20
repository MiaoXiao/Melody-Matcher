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
	//clear scale array
	SCALE.length = 0;
	//choose scale
	switch (scale) {
		case "Cmaj":
			SCALE[0] = "C4";
			SCALE[1] = "D4";
			SCALE[2] = "E4";
			SCALE[3] = "F4";
			SCALE[4] = "G4";
			SCALE[5] = "A4";
			SCALE[6] = "B4";
			SCALE[7] = "C5";
			break;
		case "C#maj":
		case "Dbmaj":
			break;
		case "Dmaj":
			break;
		case "Ebmaj":
			break;
		case "Emaj":
			break;
		case "Fmaj":
			break;
		case "F#maj":
		case "Gbmaj":
			break;
		case "Gmaj":
			break;
		case "Abmaj":
			break;
		case "Amaj":
			break;
		case "Bbmaj":
			break;
		case "Bmaj":
		case "Cbmaj":
			break;
	}
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
