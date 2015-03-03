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
	//number of times melody was played for this level
	melodiesPlayed: 0,
	
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
	},
	
	//check difficulty every time a correct melody is entered
	//if difficulty is high enough, increase number of notes or range in the next generated melody
	//this only runs after every correct melody
	checkDifficulty: function() {
		//get next difficulty (lastdifficulty + 1)
		var newDifficulty = parseInt(sessionStorage.getItem("difficulty")) + 1;
		
		//every multiple of 2 levels, increase RANGE.
		if (newDifficulty % 2 == 0) {
			this.range++;
		}
		//every multiple of 5 levels, increase numnotes
		if (newDifficulty % 5 == 0) {
			this.numNotes++;
		}
		//every 10 levels, reset range back to 3
		//also increase speed by a factor of 0.05, as long as the speed isint already 0.05
		if (newDifficulty % 10 == 0) {
			if (speed > 0.05) {
				speed -= 0.05;
			}
			this.range = 3;
		}
		
		//set new difficulty
		sessionStorage.setItem("difficulty", newDifficulty);
	},

	//resets all relevant melody info
	resetMelodyInfo: function() {
		//possibly increase difficulty, by checking speed, range, and numNotes
		this.checkDifficulty();
		//reset current position in answerkey
		this.anspos = 0;
		//reset number of wrong notes before getting the melody correct
		this.wrongNotes = 0;
		//reset seconds it took to solve the melody
		this.secondsTaken = 0;
		//reset melodies playe
		this.melodiesPlayed = 0;
		//reset all bonuses
		var x;
		for (x in this.bonus) {
			this.bonus[x] = true;
		}
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
	scale: [],
	
	updateGameInfo: function() {
		//add one more correct melody
		this.melodiesCorrect++;
		//push completed melody information to array
		this.allMelodies.push(MELODYINFO);
	}
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
		//1st octave 
		/*
		{src: "0_C2.ogg", id: "C2"},
		{src: "1_Db2.ogg", id: "Db2"},
		{src: "2_D2.ogg", id: "D2"},
		{src: "3_Eb2.ogg", id: "Eb2"},
		{src: "4_E2.ogg", id: "E2"},
		{src: "5_F2.ogg", id: "F2"},
		{src: "6_Gb2.ogg", id: "Gb2"},
		{src: "7_G2.ogg", id: "G2"},
		{src: "8_Ab2.ogg", id: "Ab2"},
		{src: "9_A2.ogg", id: "A2"},
		{src: "10_Bb2.ogg", id: "Bb2"},
		{src: "11_B2.ogg", id: "B2"},
		//2nd octave
		{src: "12_C3.ogg", id: "C3"},
		{src: "13_Db3.ogg", id: "Db3"},
		{src: "14_D43ogg", id: "D3"},
		{src: "15_Eb3.ogg", id: "Eb3"},
		{src: "16_E3.ogg", id: "E3"},
		{src: "17_F3.ogg", id: "F3"},
		{src: "18_Gb3.ogg", id: "Gb3"},
		{src: "19_G3.ogg", id: "G3"},
		{src: "20_Ab3.ogg", id: "Ab3"},
		{src: "21_A3ogg", id: "A3"},
		{src: "22_Bb3.ogg", id: "Bb3"},
		{src: "23_B3.ogg", id: "B3"},
		*/
		//3rd octave 
		{src: "24_C4.ogg", id: "C4"},
		{src: "25_Db4.ogg", id: "Db4"},
		{src: "26_D4.ogg", id: "D4"},
		{src: "27_Eb4.ogg", id: "Eb4"},
		{src: "28_E4.ogg", id: "E4"},
		{src: "29_F4.ogg", id: "F4"},
		{src: "30_Gb4.ogg", id: "Gb4"},
		{src: "31_G4.ogg", id: "G4"},
		{src: "32_Ab4.ogg", id: "Ab4"},
		{src: "33_A4.ogg", id: "A4"},
		{src: "34_Bb4.ogg", id: "Bb4"},
		{src: "35_B4.ogg", id: "B4"},
		
		//4th octave
		{src: "36_C5.ogg", id: "C5"}
		/*
		{src: "37_Db5.ogg", id: "Db5"},
		{src: "38_D5.ogg", id: "D5"},
		{src: "39_Eb5.ogg", id: "Eb5"},
		{src: "40_E5.ogg", id: "E5"},
		{src: "41_F5.ogg", id: "F5"},
		{src: "42_Gb5.ogg", id: "Gb5"},
		{src: "43_G5.ogg", id: "G5"},
		{src: "44_Ab5.ogg", id: "Ab5"},
		{src: "45_A5.ogg", id: "A5"},
		{src: "46_Bb5.ogg", id: "Bb5"},
		{src: "47_B5.ogg", id: "B5"},
		//5th octave
		{src: "48_C6.ogg", id: "C6"}
		{src: "49_Db6.ogg", id: "Db6"},
		{src: "50_D6.ogg", id: "D6"},
		{src: "51_Eb6.ogg", id: "Eb6"},
		{src: "52_E6.ogg", id: "E6"},
		{src: "53_F6.ogg", id: "F6"},
		{src: "54_Gb6.ogg", id: "Gb6"},
		{src: "55_G6.ogg", id: "G6"},
		{src: "56_Ab6.ogg", id: "Ab6"},
		{src: "57_A6.ogg", id: "A6"},
		{src: "58_Bb6.ogg", id: "Bb6"},
		{src: "59_B6.ogg", id: "B6"},
		//6th octave
		{src: "60_C7.ogg", id: "C7"}
		{src: "61_D7.ogg", id: "Db7"},
		{src: "62_D7.ogg", id: "D7"},
		{src: "63_Eb7.ogg", id: "Eb7"},
		{src: "64_E7.ogg", id: "E7"},
		{src: "65_F7.ogg", id: "F7"},
		{src: "66_Gb7.ogg", id: "Gb7"},
		{src: "67_G7.ogg", id: "G7"},
		{src: "68_Ab7.ogg", id: "Ab7"},
		{src: "69_A7.ogg", id: "A7"},
		{src: "70_Bb7.ogg", id: "Bb7"},
		{src: "71_B7.ogg", id: "B7"},
		//7th octave
		{src: "72_C8.ogg", id: "C8"}
		{src: "73_Db8.ogg", id: "Db8"},
		{src: "74_D8.ogg", id: "D8"},
		{src: "75_Eb8.ogg", id: "Eb8"},
		{src: "76_E8.ogg", id: "E8"},
		{src: "77_F8.ogg", id: "F8"},
		{src: "78_Gb8.ogg", id: "Gb8"},
		{src: "79_G8.ogg", id: "G8"},
		{src: "80_Ab8.ogg", id: "Ab8"},
		{src: "81_A8.ogg", id: "A8"},
		{src: "82_Bb8.ogg", id: "Bb8"},
		{src: "83_B8.ogg", id: "B8"},
		*/
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
	for (var i = 0; i < major.length; i++) {
		var note = start + major[i];
		if ((note == (CHROMATIC.length - 1)) || note == 0) {
			//Cover edge case for the C's
			//SCALE.push(CHROMATIC[CHROMATIC.length - 1]);
			GAMEINFO.scale.push(CHROMATIC[0]);
		} 
		else if (note >= CHROMATIC.length) {
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
	MELODYINFO.melodiesPlayed++;
	//if this is the second time playing the melody, play once bonus off
	if (MELODYINFO.melodiesPlayed >= 2) MELODYINFO.bonus.bonusPlayOnce = false;
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

//based off number of notes and the range, calculates a score for correct melody
//bonus booleons are passed to determine whether the player is awarded bonus points
function calculateScore(melodyinfo, multi) {
	//final score for this melody
	var finalScore = 0;
	//get the current level
	var currentLevel = parseInt(sessionStorage.getItem("difficulty"));
	
	//base points
	var basePoints = (melodyinfo.numNotes * 50) + (melodyinfo.range * 25);
	finalScore += basePoints;
	
	//bonus for getting a melody correct without making a mistake
	var bonusNoError = 0;
	if (melodyinfo.bonus.bonusNoError) {
		//window.alert("no error!");
		bonusNoError = 15 * melodyinfo.numNotes;
		finalScore += bonusNoError;
	}
	
	//bonus for getting a melody correct in under 10 seconds, or under 5 seconds
	bonusTime = 0;
	bonusVeryTime = 0;
	if(melodyinfo.bonus.bonusTime) {
		//bonusTime = 10 * melodyinfo.currentLevel;
	}	
	else if (melodyinfo.bonusVeryTime) {
		//bonusVeryTime = 20 * melodyinfo.currentLevel;
	}
	
	//bonus for only playing the melody once or less
	var bonusPlayOnce = 0;
	if (melodyinfo.bonus.bonusPlayOnce) {
		//window.alert("play once!");
		bonusPlayOnce = 10 * melodyinfo.numNotes;
		finalScore += bonusPlayOnce;
	}
	
	//apply multiplier
	finalScore *= multi;
	
	//final score for the melody
	sessionStorage.setItem("score", finalScore);
	window.alert("Basepoints: " +  basePoints);
	window.alert("BonusNoError: " +  bonusNoError);
	window.alert("PlayOnce: " +  bonusPlayOnce);
	window.alert("Score: " +  finalScore);
}

//run all these functions after every correct melody
function getnextMelody() {
	//window.alert("Getting next melody");
	sessionStorage.setItem("display", "finish");
	
	//calculate score for melody
	calculateScore(MELODYINFO, GAMEINFO.multi);
	
	//update gameinfo
	GAMEINFO.updateGameInfo();

	//reset melody info
	MELODYINFO.resetMelodyInfo();
	
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
		//no error bonus lost
		MELODYINFO.bonus.bonusNoError = false;
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
