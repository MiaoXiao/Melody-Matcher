//global variables

//next 3 vars determine difficulty of melody
//default speed
var SPEED;
//number of notes in a melody
var NUMNOTES;
// range of notes
var RANGE;

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

//load all sounds that will be used
//pass in what instrument to use, violin or piano
function loadSounds(instrument) {
	//check to see if you can play sounds
	if (!createjs.Sound.initializeDefaultPlugins()) {
		window.alert("ERROR: PROBLEM LOADING SOUNDS");
		return; 
	}
	
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
	
	//The notes in a major scale
	var major = [0, 2, 4, 5, 7, 9, 11, 12];
	
	//create scale
	for(var i = 0; i < major.length; i++) {
		var note = start + major[i];
		if((note == (CHROMATIC.length - 1)) || note == 0) {
			//Cover edge case for the C's
			//SCALE.push(CHROMATIC[CHROMATIC.length - 1]);
			SCALE.push(CHROMATIC[0]);
		} 
		else if(note >= CHROMATIC.length) {
			//If we loop around to low C
			SCALE.push(CHROMATIC[(note%CHROMATIC.length) + 1]);
		} 
		else {
			SCALE.push(CHROMATIC[note]);
		}
    }
    //For testing
    //window.alert(SCALE)
}

//play melody using answerkey array
//if nodelay is true, that means the melody plays without any delay at the start of the melody
function playMelody() {
	//play the melody
	for (var i = 0; i < ANSWERKEY.length; i++) {
		//delay * (speed * 1000) will give a delay that is consistent
        createjs.Sound.play(SCALE[ANSWERKEY[i]], "none", i * (SPEED * 1000), 0, 0, get_vol());
	}
}

//creates a random melody by filling answerkey array
function generateMelody() {
	//check that range is within bounds
	if (RANGE < 1 || RANGE > 8) {
		window.alert("ERROR: RANGE NOT BETWEEN 1 and 8");
	}
	//check that numNotes is within bounds
	if (NUMNOTES < 1) {
		window.alert("ERROR: NUM NOTES BELOW 0");
	}
	//window.alert("Range: " + RANGE);
	//window.alert("Numnotes: " + NUMNOTES);
	//clear array
	ANSWERKEY.length = 0;
	//holds random number between 0 and range
	var randNum;
	//fills answer key with random iterators between range and 0
	for (var i = 0; i < NUMNOTES; i++) {
		randNum = Math.floor((Math.random() * RANGE) + 0);
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
	//window.alert(ANSWERKEY);
}

//play a sound given an id (ex C4, G4, Bb4)
function playSound(note) {
	createjs.Sound.play(note, "none", 0, 0, 0, get_vol());
}

//check difficulty every time a correct melody is entered
//if difficulty is high enough, increase number of notes or range in the next generated melody
//this only runs after every correct melody
function checkDifficulty() {
	//get next difficulty (lastdifficulty + 1)
	var newDifficulty = parseInt(localStorage.getItem("difficulty")) + 1;
	
	//every multiple of 2 levels, increase RANGE.
	if (newDifficulty % 2 == 0) {
		RANGE++;
	}
	//every multiple of 5 levels, increase numnotes
	if (newDifficulty % 5 == 0) {
		NUMNOTES++;
	}
	//every 10 levels, reset range back to 3
	//also increase speed by a factor of 0.05, as long as the speed isint already 0.05
	if (newDifficulty % 10 == 0) {
		if (SPEED > 0.05) {
			SPEED -= 0.05;
		}
		RANGE = 3;
	}
	
	//set new difficulty
	localStorage.setItem("difficulty", newDifficulty);
}

//check to see if melody is correct so far
//note is a string (ex. C4)
//updates current messege
function checkMelody(note) {
	//if correct
	if (SCALE[ANSWERKEY[ANSPOS]] == note) {
		ANSPOS++;
		//check if melody has been completed
		if (ANSPOS >= ANSWERKEY.length) {
			//increase time (STILL NEED TO WORK ON)
			
			//calculate score for melody (STILL NEED TO WORK ON)
			
			//possibly increase difficulty
			checkDifficulty();
			//generate a new melody
			generateMelody();
			ANSPOS = 0;
			DISPLAY = "Melody correct! New melody generated...";
		}
		else { //correct note otherwise
			DISPLAY = "Nice!";
		}
	}
	else { //wrong note
		DISPLAY = "Incorrect!";
		ANSPOS = 0
	}
}

//displays current messege and level
function displayMessage() {
	document.getElementById("display").innerHTML = DISPLAY + "<br>" + "Level: " + parseInt(localStorage.getItem("difficulty"));
}

//run 3 functions every key press
function onButtonClick(note) {
	playSound(note);
	checkMelody(note);
	displayMessage();
}

//at the start of every game, run all these functions once.
function initStart() {
	loadSounds('piano');
	chooseScale('Cmaj');
	//set starting difficulty 
	switch (parseInt(localStorage.getItem("difficulty"))) {
		case 0:
			SPEED = 1.0;
			NUMNOTES = 2;
			RANGE = 3;
			break;
		case 10:
			SPEED = 0.95;
			NUMNOTES = 4;
			RANGE = 3;
			break;
		case 20:
			SPEED = 0.90;
			NUMNOTES = 6;
			RANGE = 3;
			break;
	}
	generateMelody();
	displayMessage();
}
