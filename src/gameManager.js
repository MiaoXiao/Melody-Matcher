//DIFFERENT DISPLAYS (game status)
//gameover: game is lost or game has not been started
//wait: game is in session and is waiting for player input
//correct: correct note
//incorect: incorrect note
//finish: melody completed
//playmelody: user clicked play melody. will last until the melody is finished playing

//stores information about current melody
var MELODYINFO = {
	//melody speed
	speed: 1.0,
	//number of notes in melody
	numNotes: 2,
	//range of possible notes
	range: 3,
	//actual distance between the lowest and highest note in a generated melody
	actualrange: 0,
	
	//key for melody
	anskey: [],
	//current position in answerkey
	anspos: 0,
	
	//number of wrong notes before getting the melody correct
	wrongNotes: 0,
	//time it took to solve the melody
	timeTaken: {Sec: 0, Dec: 0},
	//number of times melody was played for this level
	melodiesPlayed: 0,
	
	//status of whether the player has earned bonus points for this melody or not
	bonus: {
		//solved melody with no mistakes
		bonus_NoError: true,
		//solved melody while only playing the melody once or less
		bonus_PlayOnce: true,
		//solved melody under 5 seconds
		bonus_Speed: true
	},
	
	//information on score for melody
	score: {
		//final score
		score_final: 0,
		//base points
		score_base: 0,
		
		//possible bonus points
		score_noerror: 0,
		score_playonce: 0,
		score_speed: 0,
	},

	//calculates and updates score
	calculateScore: function() {
		//get the current level
		var currentLevel = parseInt(sessionStorage.getItem("difficulty"));
		
		//base points
		this.score.score_base = (this.numNotes * 50) + (this.actualrange * 25);
		this.score.score_final += this.score.score_base;
		
		//bonus for getting a melody correct without making a mistake
		if (this.bonus.bonus_NoError) {
			this.score.score_noerror = 20 * this.numNotes + 20 * this.actualrange;
			this.score.score_final += this.score.score_noerror;
		}
		
		//bonus for getting a melody correct in under 10 seconds
		if (this.bonus.bonus_Speed) {
			this.score.score_speed = 10 * this.numNotes;
			this.score.score_final += this.score.score_speed;
		}	

		//bonus for only playing the melody once or less
		if (this.bonus.bonus_PlayOnce) {
			this.score.score_playonce = 10 * this.numNotes;
			this.score.score_final += this.score.score_playonce;
		}
		
		//apply multiplier. round to nearest int
		this.score.score_final = Math.round(this.score.score_final * GAMEINFO.multi);
		
		//final score for the melody
		//window.alert("Basepoints: " +  this.score.score_base);
		//window.alert("BonusNoError: " +  this.score.score_noerror);
		//window.alert("PlayOnce: " +  this.score.score_playonce);
		//window.alert("Speed: " +  this.score.score_speed);
		//window.alert("Score: " +  this.score.score_final);
		
		//add to game score
		GAMEINFO.gamescore += this.score.score_final;
		document.getElementById("score").innerHTML = GAMEINFO.gamescore;
		//window.alert("Game Score: " +  GAMEINFO.gamescore);
	},
	
	//check difficulty every time a correct melody is entered
	//if difficulty is high enough, increase number of notes or range in the next generated melody
	//this only runs after every correct melody
	checkDifficulty: function() {
		//get next difficulty (lastdifficulty + 1)
		var newDifficulty = parseInt(sessionStorage.getItem("difficulty")) + 1;
		console.log("Level: " + newDifficulty);
		//every multiple of 5 levels, increase RANGE.
		if (newDifficulty % 5 == 0) {
			if (this.range != GAMEINFO.scale.length)
			{
				this.range++;
				//window.alert("increase range");
			}
		}
		//every multiple of 10 levels, increase numnotes
		if (newDifficulty % 10 == 0) {
			this.numNotes++;
		}
		//increase speed by a factor of 0.05, as long as the speed isint already 0.05
		if (newDifficulty % 10 == 0) {
			if (this.speed > 0.1) {
				this.speed -= 0.1;
			}
		}
		
		//set new difficulty
		sessionStorage.setItem("difficulty", newDifficulty);
	},

	//set starting difficulty, which is just based on time
	resetDifficulty: function() {
		TIMEMANAGER.maxTime.Dec = 99;
		switch (parseInt(sessionStorage.getItem("difficulty"))) {
			case 0:
				TIMEMANAGER.maxTime.Sec = 59;
				GAMEINFO.multi += .2;
				break;
			case 10:
				TIMEMANAGER.maxTime.Sec = 39;
				GAMEINFO.multi += .4;
				break;
			case 20:
				TIMEMANAGER.maxTime.Sec = 19;
				GAMEINFO.multi += .6;
				break;
				window.alert("Game start error: melody not initialized correctly");
		}
	},
	
	//resets all relevant melody info
	resetMelodyInfo: function() {
		//reset current position in answerkey
		this.anspos = 0;
		//reset number of wrong notes before getting the melody correct
		this.wrongNotes = 0;
		//reset time it took to solve the melody
		this.timeTaken.Sec = 0;
		this.timeTaken.Dec = 0;
		//reset times melody was played for one meldy
		this.melodiesPlayed = 0;
		//reset bonuses
		var x;
		for (x in this.bonus) {
			this.bonus[x] = true;
		}
		//reset score
		for (x in this.score) {
			this.score[x] = 0;
		}
		//Restart background animation
        var elm = document.getElementById("main");
        elm.classList.remove("play");
        elm.offsetWidth = elm.offsetWidth;
        elm.classList.add("play");
		
	}
	
};

//information about the entire game so far
//most of this data will not change in a single game
var GAMEINFO = {
	//current gamemode
	gameMode: "standard",
	//whether the game is over or not
	gameover: 0,
	//array of all melodies so far
	allMelodies: [],
	//entire game score
	gamescore: 0,
	//score multiplier for the game
	multi: 1.0,
	//current scale for this game
	scale: [],
	
	//push completed melody information to array
	updateGameInfo: function() {
		this.allMelodies.push(MELODYINFO);
	},
	//reset all game info (when restarting)
	resetGameInfo: function() {
		this.gameover = 0;
		this.allMelodies = [];
		this.gamescore = 0;
	},
	//do all this when game is over (time reaches 0)
	gameOver: function() {
		//window.alert("gg");
		this.gameover = 1;
		//disable play melody
		document.getElementById("playmelodybtn").disabled = true;
		//save information ( this last melody is NOT successful)
		localStorage.setItem("stats", JSON.stringify(GAMEINFO));
		//sessionStorage.setItem("difficulty", 1)
		sessionStorage.setItem("display", "gameover");
		
	}
};

//manages time
var TIMEMANAGER = {
	//starting time
	maxTime: {Sec: 59, Dec: 99},
	//current time
	currentTime: {Sec: 59, Dec: 99},
	//decrease currenttime by 1 deca second. if deca hits 0, decrease sec
	updateTime: function() {
		if (TIMEMANAGER.currentTime.Dec != 0) 
		{
			TIMEMANAGER.currentTime.Dec--;
			MELODYINFO.timeTaken.Dec++;
			//console.log(TIMEMANAGER.currentTimeDec);
		}
		else {
			if (TIMEMANAGER.currentTime.Sec != 0)
			{
				TIMEMANAGER.currentTime.Dec = 99;
				TIMEMANAGER.currentTime.Sec--;
				//update melody info
				MELODYINFO.timeTaken.Dec = 0;
				MELODYINFO.timeTaken.Sec++;
				//console.log(TIMEMANAGER.currentTime.Sec);
			}
			else
			{
				//game over!
				GAMEINFO.gameOver();
			}
		}
		//check if bonus time ends
		if (TIMEMANAGER.currentTime.Sec == TIMEMANAGER.maxTime.Sec - 10) MELODYINFO.bonus.bonus_Speed = false;
		//store time
		sessionStorage.setItem("time", JSON.stringify(TIMEMANAGER.currentTime));
		document.getElementById("time").innerHTML = TIMEMANAGER.currentTime.Sec + ":" + TIMEMANAGER.currentTime.Dec;
	},
	
	resetTime: function() {
		TIMEMANAGER.currentTime.Sec = TIMEMANAGER.maxTime.Sec;
		TIMEMANAGER.currentTime.Dec = TIMEMANAGER.maxTime.Dec;
	}
};

//Hold the full chromatic
var CHROMATIC = [
	"C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", 
	"C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", 
	"C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5",
	"C6"
];

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
//		//1st octave 
//		{src: "0_C2.ogg", id: "C2"},
//		{src: "1_Db2.ogg", id: "Db2"},
//		{src: "2_D2.ogg", id: "D2"},
//		{src: "3_Eb2.ogg", id: "Eb2"},
//		{src: "4_E2.ogg", id: "E2"},
//		{src: "5_F2.ogg", id: "F2"},
//		{src: "6_Gb2.ogg", id: "Gb2"},
//		{src: "7_G2.ogg", id: "G2"},
//		{src: "8_Ab2.ogg", id: "Ab2"},
//		{src: "9_A2.ogg", id: "A2"},
//		{src: "10_Bb2.ogg", id: "Bb2"},
//		{src: "11_B2.ogg", id: "B2"},
		//2nd octave
		{src: "12_C3.ogg", id: "C3"},
		{src: "13_Db3.ogg", id: "Db3"},
		{src: "14_D3.ogg", id: "D3"},
		{src: "15_Eb3.ogg", id: "Eb3"},
		{src: "16_E3.ogg", id: "E3"},
		{src: "17_F3.ogg", id: "F3"},
		{src: "18_Gb3.ogg", id: "Gb3"},
		{src: "19_G3.ogg", id: "G3"},
		{src: "20_Ab3.ogg", id: "Ab3"},
		{src: "21_A3.ogg", id: "A3"},
		{src: "22_Bb3.ogg", id: "Bb3"},
		{src: "23_B3.ogg", id: "B3"},
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
		{src: "36_C5.ogg", id: "C5"},
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
		{src: "48_C6.ogg", id: "C6"},
//		{src: "49_Db6.ogg", id: "Db6"},
//		{src: "50_D6.ogg", id: "D6"},
//		{src: "51_Eb6.ogg", id: "Eb6"},
//		{src: "52_E6.ogg", id: "E6"},
//		{src: "53_F6.ogg", id: "F6"},
//		{src: "54_Gb6.ogg", id: "Gb6"},
//		{src: "55_G6.ogg", id: "G6"},
//		{src: "56_Ab6.ogg", id: "Ab6"},
//		{src: "57_A6.ogg", id: "A6"},
//		{src: "58_Bb6.ogg", id: "Bb6"},
//		{src: "59_B6.ogg", id: "B6"},
//		
//		{src: "60_C7.ogg", id: "C7"},
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

	//choose starting pos based on scale
	//every extra flat is +.5 for multi
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
			//GAMEINFO.scale.push('Db2');
			break;
		case "Ebmaj":
			start = 3;
			//GAMEINFO.scale.push('C2');
			//GAMEINFO.scale.push('D2');
			break;
		case "Emaj":
			start = 4;
			//GAMEINFO.scale.push('Db2');
			//GAMEINFO.scale.push('Eb2');
			break;
		case "Fmaj":
			start = 5;
			//GAMEINFO.scale.push('C2');
			//GAMEINFO.scale.push('D2');
			//GAMEINFO.scale.push('E2');
			break;
		case "F#maj":
		case "Gbmaj":
			start = 6;
			//GAMEINFO.scale.push('Db2');
			//GAMEINFO.scale.push('Eb2');
			//GAMEINFO.scale.push('F2');
			break;
		case "Gmaj":
			start = 7;
			//GAMEINFO.scale.push('D2');
			//GAMEINFO.scale.push('E2');
			//GAMEINFO.scale.push('Gb2');
			break;
		case "Abmaj":
			start = 8;
			//GAMEINFO.scale.push('C2');
			//GAMEINFO.scale.push('Db2');
			//GAMEINFO.scale.push('Eb2');
			//GAMEINFO.scale.push('F2');
			//GAMEINFO.scale.push('G2');
			break;
		case "Amaj":
			start = 9;
			//GAMEINFO.scale.push('Db2');
			//GAMEINFO.scale.push('D2');
			//GAMEINFO.scale.push('E2');
			//GAMEINFO.scale.push('Gb2');
			//GAMEINFO.scale.push('Ab2');
			break;
		case "Bbmaj":
			start = 10;
			/*
			GAMEINFO.scale.push('C2');
			GAMEINFO.scale.push('D2');
			GAMEINFO.scale.push('Eb2');
			GAMEINFO.scale.push('F2');
			GAMEINFO.scale.push('G2');
			GAMEINFO.scale.push('A2');*/
			break;
		case "Bmaj":
		case "Cbmaj":
			start = 11;
			/*
			GAMEINFO.scale.push('B2');
			GAMEINFO.scale.push('Db2');
			GAMEINFO.scale.push('Eb2');
			GAMEINFO.scale.push('E2');
			GAMEINFO.scale.push('Gb2');
			GAMEINFO.scale.push('Bb2');*/
			break;
	}
	
	//The notes in a major scale
	var major = [
		0, 2, 4, 5, 7, 9, 11, 
		12, 14, 16, 17, 19, 21, 23, 
		24, 26, 28, 29, 31, 33, 35,
		36
		];
	
	//create scale
	for (var i = 0; i < major.length; i++) {
			var note = start + major[i];
			if (note > 36) i = major.length;
			else GAMEINFO.scale.push(CHROMATIC[note]);
	}
    
	//increase multi, depending on how many flats in the scale
	for (var i = 0; i < GAMEINFO.scale.length; i++) {
		if (GAMEINFO.scale[i].search('b') != -1) GAMEINFO.multi += .05;
	}
	
    //For testing
    console.log(GAMEINFO.scale);
}

//play melody using answerkey array
//melody can only play, if it is not already playing
function playMelody() {
	sessionStorage.setItem("display", "playmelody");
	MELODYINFO.melodiesPlayed++;
	//if this is the second time playing the melody, play once bonus off
	if (MELODYINFO.melodiesPlayed == 2) MELODYINFO.bonus.bonus_PlayOnce = false;
	for (var i = 0; i < MELODYINFO.anskey.length; i++) {
		//delay * (speed * 1000) will give a delay that is consistent
        createjs.Sound.play(GAMEINFO.scale[MELODYINFO.anskey[i]], "none", i * (MELODYINFO.speed * 1000), 0, 0, get_vol());
		//if the sound was just played, disable the button for the duration of the melody
		if (i + 1 == MELODYINFO.anskey.length) {
			document.getElementById("playmelodybtn").disabled = true;
			setTimeout(function() {document.getElementById("playmelodybtn").disabled = false; sessionStorage.setItem("display", "wait");}, (i +  1) * (MELODYINFO.speed * 1000));
		}
	}
}

//creates a random melody by filling answerkey array
function generateMelody() {
	//check that range is within bounds
	if (MELODYINFO.range < 1 || MELODYINFO.range > GAMEINFO.scale.length) {
		window.alert("ERROR: RANGE not between 1 and length of scale");
	}
	//check that numNotes is within bounds
	if (MELODYINFO.numNotes < 1) {
		window.alert("ERROR: NUM NOTES below 0");
	}
	//window.alert("Range: " + MELODYINFO.range);
	//window.alert("Numnotes: " + MELODYINFO.numNotes);
	
	//clear array
	MELODYINFO.anskey.length = 0;
	
	//lcheck this var in order to get lowest note
	var low = GAMEINFO.scale.length - 1;
	//check this var in order to get highest note
	var high = 0;
	
	//holds random number between 0 and range
	var randNum;
	//starting position of notes
	var starting = Math.floor(Math.random() * (GAMEINFO.scale.length - 1));
	//fills answer key with random iterators between range and 0
	for (var i = 0; i < MELODYINFO.numNotes; i++) {
		randNum = Math.floor((Math.random() * MELODYINFO.range) + starting);
		if (randNum >= GAMEINFO.scale.length) randNum = GAMEINFO.scale.length - 1;
		//if the random number is the same as the last one, dec or inc by 1
		if (i != 0 && randNum == MELODYINFO.anskey[i - 1]) {
			if (randNum < 0) {
				randNum = 0;
			}
			else if (randNum >= GAMEINFO.scale.length) {
				randNum = GAMEINFO.scale.length - 1;
			}
			else if (Math.floor((Math.random() * 1) + 0)) {
				randNum += 1;
			}
			else {
				randNum -= 1;
			}
		}
		MELODYINFO.anskey[i] = randNum;
		//check to see if highest or lowest note
		if (randNum > high) high = randNum;
		if (randNum < low) low = randNum;
	}
	//get actual range of melody
	MELODYINFO.actualrange = high - low;
	//window.alert("Actual Range: " + MELODYINFO.actualrange);
	//window.alert("Full Melody: " + MELODYINFO.anskey);
}

//play a sound given an id (ex C4, G4, Bb4)
function playSound(note) {
	createjs.Sound.play(note, "none", 0, 0, 0, get_vol());
}

//run all these functions after every correct melody
function getnextMelody() {
	//refill time
	TIMEMANAGER.resetTime();
	
	//calculate score for melody
	MELODYINFO.calculateScore();
	
	//update gameinfo
	GAMEINFO.updateGameInfo();
	
	//save updated game info
	localStorage.setItem("stats", JSON.stringify(GAMEINFO));
	//USE: TO GET LATEST GAME INFORMATION
	//var finalGameInfo = JSON.parse(localStorage.getItem("stats"));
	
	//update difficulty
	MELODYINFO.checkDifficulty();
	
	//reset melody info
	MELODYINFO.resetMelodyInfo();
	
	//generate a new melody
	generateMelody();
}

//check to see if melody is correct so far
//note is a string (ex. C4)
//updates current messege
function checkMelody(note, key_button) {
	//shortcut variables from melodyinfo
	var cur_scale = GAMEINFO.scale;
	var cur_anskey = MELODYINFO.anskey;
	var cur_anspos = MELODYINFO.anspos;
	
	//if first note, it is technically correct, but reset anspos to 1 (not done yet)
	if (note == cur_anskey[0]) {
		MELODYINFO.anspos = 1;
		sessionStorage.setItem("display", "correct");
	}
	else if (cur_scale[cur_anskey[cur_anspos]] == note) { //if correct and game is active
        cur_anspos++;
        highlight_note(key_button, true);
		//check if melody has been completed
		if (cur_anspos >= cur_anskey.length) {
			//window.alert("Getting next melody");
			sessionStorage.setItem("display", "finish");
			getnextMelody();
		}
		else { //correct note otherwise
			sessionStorage.setItem("display", "correct");
			MELODYINFO.anspos++;
		}
	}
	else { //wrong note
        sessionStorage.setItem("display", "incorrect");
        highlight_note(key_button, false);
		MELODYINFO.wrongNotes++;
		MELODYINFO.anspos = 0;
		//no error bonus lost
		MELODYINFO.bonus.bonus_NoError = false;
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

//run these functions every key press
function onButtonClick(note, key_button) {
	playSound(note);
	//only check melody if game is not over
	if (!GAMEINFO.gameover) checkMelody(note, key_button); sessionStorage.setItem("display", "wait");
}

//pointer to time function
var updateTimeRef;
//init game data, when game is restarted
function initStart() {
	sessionStorage.setItem("display", "wait");
	clearInterval(updateTimeRef);
	
	//enable game again
	GAMEINFO.resetGameInfo();
	
	//display score as 0
	document.getElementById("score").innerHTML = GAMEINFO.gamescore;
	
	//reset melody
	MELODYINFO.resetMelodyInfo();
	
	//make sure melody can be played
	document.getElementById("playmelodybtn").disabled = false;
	
	//set difficutly back to default
	MELODYINFO.resetDifficulty();
	
	//set time
	TIMEMANAGER.resetTime();
	//start timer
	updateTimeRef = window.setInterval(TIMEMANAGER.updateTime, 10);
	window.setInterval(function(){ if (GAMEINFO.gameover) clearInterval(updateTimeRef)}, 10);
	
	generateMelody();
}

//run only once when web page is loaded
function initOnce() {
	//set display
	sessionStorage.setItem("display", "gameover");

	//set level
	sessionStorage.setItem("difficulty", 1);
	
	//make sure playmelody is disabled
	document.getElementById("playmelodybtn").disabled = true;
	
	//default sounds and scale
	loadSounds('piano');
	chooseScale('Cmaj');
	
	//display score as 0
	document.getElementById("score").innerHTML = GAMEINFO.gamescore;
	
	MELODYINFO.resetDifficulty();
}