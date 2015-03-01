//stores information about current melody
var MELODYINFO = {
	//melody speed
	speed: 1.0,
	//number of notes in melody
	numNotes: 2,
	//range of notes
	range: 3,
	
	//key for melody
	anskey: [],
	//current position in answerkey
	anspos: 0,
	
	//number of wrong notes before getting the melody correct
	wrongNotes: 0,
	//seconds it took to solve the melody
	secondsTaken: 0,
	
	//status of whether the player has earned bonus points for this melody or not
	bonus: {
		//solved melody with no mistakes
		bonusNoError: true,
		//solved melody under 10 seconds
		bonusSpeed: true,
		//solved melody under 5 seconds
		bonusVerySpeed: true,
		//solved melody while only playing the melody once or less
		bonusPlayOnce: true
	}
};

//information about the entire game so far
var GAMEINFO = {
	//array of all melodyinfos
	allMelodies: [],
	//how many melodies correct so far
	melodiesCorrect: 0,
	//score multiplier for the game
	multi: 1.0,
	//current scale for this game
	scale: []
};

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
	GAMEINFO.scale.length = 0;
	
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
			GAMEINFO.scale.push(CHROMATIC[0]);
		} 
		else if(note >= CHROMATIC.length) {
			//If we loop around to low C
			GAMEINFO.scale.push(CHROMATIC[(note%CHROMATIC.length) + 1]);
		} 
		else {
			GAMEINFO.scale.push(CHROMATIC[note]);
		}
    }
    //For testing
    //window.alert(SCALE)
}

//play melody using answerkey array
//melody can only play, if it is not already playing
function playMelody() {
	for (var i = 0; i < MELODYINFO.anskey.length; i++) {
		//delay * (speed * 1000) will give a delay that is consistent
        createjs.Sound.play(GAMEINFO.scale[MELODYINFO.anskey[i]], "none", i * (MELODYINFO.speed * 1000), 0, 0, get_vol());
		//if the sound was just played, disable the button for the duration of the melody
		if (i + 1 == MELODYINFO.anskey.length) {
			document.getElementById("playmelodybtn").disabled = true;
			setTimeout(function() {document.getElementById("playmelodybtn").disabled = false}, (i +  1) * (MELODYINFO.speed * 1000));
		}
	}
}

//creates a random melody by filling answerkey array
function generateMelody() {
	//check that range is within bounds
	if (MELODYINFO.range < 1 || MELODYINFO.range > 8) {
		window.alert("ERROR: RANGE NOT BETWEEN 1 and 8");
	}
	//check that numNotes is within bounds
	if (MELODYINFO.numNotes < 1) {
		window.alert("ERROR: NUM NOTES BELOW 0");
	}
	//window.alert("Range: " + MELODYINFO.range);
	//window.alert("Numnotes: " + MELODYINFO.numNotes);
	//clear array
	MELODYINFO.anskey.length = 0;
	//holds random number between 0 and range
	var randNum;
	//fills answer key with random iterators between range and 0
	for (var i = 0; i < MELODYINFO.numNotes; i++) {
		randNum = Math.floor((Math.random() * MELODYINFO.range) + 0);
		//if the random number is the same as the last one, dec or inc by 1
		if (i != 0 && randNum == MELODYINFO.anskey[i - 1]) {
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
		MELODYINFO.anskey[i] = randNum;
	}
	//window.alert("Full Melody: " + MELODYINFO.anskey);
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
	var newDifficulty = parseInt(sessionStorage.getItem("difficulty")) + 1;
	
	//every multiple of 2 levels, increase RANGE.
	if (newDifficulty % 2 == 0) {
		MELODYINFO.range++;
	}
	//every multiple of 5 levels, increase numnotes
	if (newDifficulty % 5 == 0) {
		MELODYINFO.numNotes++;
	}
	//every 10 levels, reset range back to 3
	//also increase speed by a factor of 0.05, as long as the speed isint already 0.05
	if (newDifficulty % 10 == 0) {
		if (MELODYINFO.speed > 0.05) {
			MELODYINFO.speed -= 0.05;
		}
		MELODYINFO.range = 3;
	}
	
	//set new difficulty
	sessionStorage.setItem("difficulty", newDifficulty);
}

//based off number of notes and the range, calculates a score for correct melody
//bonus booleons are passed to determine whether the player is awarded bonus points
function calculateScore(melodyinfo) {
	//get the current level
	var currentLevel = parseInt(sessionStorage.getItem("difficulty"));
	
	//base points
	var basePoints = (melodyinfo.numNotes * 50) + (melodyinfo.range * 25);
	
	//bonus for getting a melody correct without making a mistake
	var bonusNoError = 0;
	if (melodyinfo.bonusNoError) {
		bonusNoError = 25 * currentLevel;
	}
	
	//bonus for getting a melody correct in under 10 seconds, or under 5 seconds
	bonusTime = 0;
	bonusVeryTime = 0;
	if(melodyinfo.bonusTime) {
		bonusTime = 10 * currentLevel;
		
	}	
	else if (melodyinfo.bonusVeryTime) {
		bonusVeryTime = 20 * currentLevel;
	}
	
	//bonus for only playing the melody once or less
	var bonusPlayOnce = 0;
	if (melodyinfo.bonusPlayOnce) {
		bonusPlayOnce = 15 * currentLevel;
	}
	
	//final score for the melody
	var finalScore = GAMEINFO.multi * (basePoints + bonusNoError + bonusTime + bonusVeryTime);
	sessionStorage.setItem("score", finalScore);
	window.alert("Score for melody: " + finalScore);
}

//update display
//update GAMEINFO
//regenerate MELODYINFO
//calculate score
//reset time to TIMESTART
function getnextMelody() {
	//window.alert("Getting next melody");
	sessionStorage.setItem("display", "finish");
	
	//calculate score for melody
	calculateScore(MELODYINFO);
	
	//add one more correct melody
	GAMEINFO.melodiesCorrect++;
	//push completed melody information to array
	GAMEINFO.allMelodies.push(MELODYINFO);

	//possibly increase difficulty, by checking speed, range, and numNotes
	checkDifficulty();
	
	//RESET CURRENT MELODY
	//reset current position in answerkey
	MELODYINFO.anspos = 0;
	//reset number of wrong notes before getting the melody correct
	MELODYINFO.wrongNotes = 0;
	//reset seconds it took to solve the melody
	MELODYINFO.secondsTaken = 0;
	//reset all bonuses
	/*
	var x;
	for (x in MELODYINFO.bonus) {
		MELODYINFO.bonus[x] = true;
	}*/
	
	//generate a new melody
	generateMelody();
}

//check to see if melody is correct so far
//note is a string (ex. C4)
//updates current messege
function checkMelody(note) {
	//shortcut variables from melodyinfo
	var cur_scale = GAMEINFO.scale;
	var cur_anskey = MELODYINFO.anskey;
	var cur_anspos = MELODYINFO.anspos;
	
	//if correct
	if (cur_scale[cur_anskey[cur_anspos]] == note) {
		cur_anspos++;
		//check if melody has been completed
		if (cur_anspos >= cur_anskey.length) {
			getnextMelody();
		}
		else { //correct note otherwise
			sessionStorage.setItem("display", "correct");
			MELODYINFO.anspos++;
		}
	}
	else { //wrong note
		sessionStorage.setItem("display", "incorrect");
		MELODYINFO.wrongNotes++;
		MELODYINFO.anspos = 0;
	}
}

/*//given current level, displays level name
function level_to_name(level) {
    var level = parseInt(localStorage.getItem("difficulty"));
    return (level < 10) ? "Easy" :
           (level < 20) ? "Medium" :
           (level < 30) ? "Hard" :
           (level < 40) ? "Very Hard" :
                          "EXPERT";
}*/

//displays current messege and level
/*function displayMessage() {
    document.getElementById("display").innerHTML = DISPLAY + "<br>" + "Level: " + localStorage.getItem("difficulty") + "\t(" + level_to_name() + ")";
}*/

//run 3 functions every key press
function onButtonClick(note) {
	playSound(note);
	checkMelody(note);
}

//at the start of every game, run all these functions once.
function initStart() {
	sessionStorage.setItem("display", "start");
	
	loadSounds('piano');
	chooseScale('Cmaj');
	//set starting difficulty 
	switch (parseInt(sessionStorage.getItem("difficulty"))) {
		case 0:
			MELODYINFO.speed = 1.0;
			MELODYINFO.numNotes = 2;
			MELODYINFO.range = 3;
			break;
		case 10:
			MELODYINFO.speed = 0.95;
			MELODYINFO.numNotes = 4;
			MELODYINFO.range = 3;
			break;
		case 20:
			MELODYINFO.speed = 0.90;
			MELODYINFO.numNotes = 6;
			MELODYINFO.range = 3;
			break;
			window.alert("Game start error: melody not initialized correctly");
	}
	generateMelody();
}
