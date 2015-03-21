//DIFFERENT DISPLAYS (game status)
//gameover: game is lost or game has not been started
//wait: game is in session and is waiting for player input
//correct: correct note
//incorect: incorrect note
//finish: melody completed
//playmelody: user clicked play melody. will last until the melody is finished playing

//OTHER
//level: current level. resets to 1 at the start of a game
//difficulty: how many seconds you get per melody

//Different game modes?
//standard: normal gameplay, easy, med, or hard timed with score
//freemode: player can manually choose speed, numnotes, and range of melody. player can manually set time for that melody

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
	
	//streak counter, how many melodies player got perfect in a row, will reset to 0 if streak is lost
	streakCounter: 0,
	
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
		bonus_Speed: true,
		//if there is at least 1 flat
		bonus_flats: false
		//there is also a bonus for getting a streak (getting more than 1 melody correct in a row)
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
		score_flats: 0,
		score_streak: 0
	},
	
	//change speed (between .1 and 2) (.1 is very fast, 2 is very slow)
	changeSpeed: function(newspeed) {
		this.speed = newspeed;
	},
	
	//change number of notes (between 1 and a large number)
	changeNumNotes: function(newnumnotes) {
		this.numNotes = newnumnotes;
	},
	
	//change range (between 0 and gameinfo.scale.length - 1)
	changeRange: function(newrange) {
		this.range = newrange;
	},
	
	//calculates and updates score
	calculateScore: function() {
		//get the current level
		var currentLevel = parseInt(sessionStorage.getItem("difficulty"));
		
		//base points
		this.score.score_base = (this.numNotes * 25) + (this.actualrange * 10);
		this.score.score_final += this.score.score_base;
		
		//bonus for getting a melody correct without making a mistake
		if (this.bonus.bonus_NoError) {
			this.score.score_noerror = 15 * this.numNotes + 15 * this.actualrange;
			this.score.score_final += this.score.score_noerror;
			//add to streak
			this.streakCounter++;
		}
		else {
			//reset streak
			this.streakCounter = 0;
			//reset score
			this.score.score_streak = 0;
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
		
		//bonus for how many flats in answer, 15 points per flat
		for (var i = 0; i < this.anskey.length; i++) {
			if (GAMEINFO.scale[this.anskey[i]].search('b') != -1) this.score.score_flats += 15; this.bonus.bonus_flats = true;
		}
		this.score.score_final += this.score.score_flats;
		
		//if streak is greater than 1 (melody perfect twice in a row), give 25, 50, 75... for every consecutive melody correct
		if (this.streakCounter > 1) {
			this.score.score_streak = (this.streakCounter - 1) * 25;
		}
		this.score.score_final += this.score.score_streak;
		
		//apply multiplier. round to nearest int
		this.score.score_final = Math.round(this.score.score_final * GAMEINFO.multi);
		
		//final score for the melody
		//console.log("Basepoints: " +  this.score.score_base);
		//console.log("BonusNoError: " +  this.score.score_noerror);
		//console.log("BonusPlayOnce: " +  this.score.score_playonce);
		//console.log("BonusSpeed: " +  this.score.score_speed);
		//console.log("BonusFlats: " +  this.score.score_flats);
		//console.log("BonusStreak: " +  this.score.score_streak);
		//console.log("Score: " +  this.score.score_final);
        
        update_score(GAMEINFO, this.score);
		//add to game score
		GAMEINFO.gamescore += this.score.score_final;
		//window.alert("Game Score: " +  GAMEINFO.gamescore);
	},
	
	//check difficulty every time a correct melody is entered
	//if difficulty is high enough, increase number of notes or range in the next generated melody
	//this only runs after every correct melody
	checkDifficulty: function() {
		//get next level (lastlevel + 1)
		var newLevel = parseInt(sessionStorage.getItem("level")) + 1;
		console.log("Level: " + newLevel);
		//every multiple of 5 levels, increase RANGE. Unless new range will be greater than size of scale
		if (newLevel % 5 == 0 && GAMEINFO.scale.length >= this.range + 1) {
			if (this.range != GAMEINFO.scale.length)
			{
				this.range++;
				//window.alert("increase range");
			}
		}
		//every multiple of 10 levels, increase numnotes
		if (newLevel % 10 == 0) {
			this.numNotes++;
		}
		//increase speed by a factor of 0.1, as long as the speed isint already 0.1
		if (newLevel % 10 == 0 && this.speed > 0.1) {
				this.speed -= 0.1;
		}
		
		//set new level
		sessionStorage.setItem("level", newLevel);
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
		//reset times melody was played for one melody
		this.melodiesPlayed = 0;
		
		//reset all bonuses
		var x;
		for (x in this.bonus) {
			this.bonus[x] = true;
		}
		//only flat bonus default is false
		this.bonus.bonus_flats = false;
		
		//reset score except streak score
		for (x in this.score) {
			this.score[x] = 0;
		}
	}
	
};

//information about the entire game so far
//most of this data will not change in a single game
var GAMEINFO = {
	//current gamemode 
	gameMode: "standard",
	//whether the game is over or not
	gameover: 1,
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
	},
	
	//set starting difficulty, which is just based on time and numNotes. easy starts with 2, med 3, hard 4
	//also reset level back to 1
	resetDifficulty: function() {
		TIMEMANAGER.maxTime.Dec = 0;
		switch (parseInt(sessionStorage.getItem("difficulty"))) {
			case 0:
				TIMEMANAGER.maxTime.Sec = 60;
				GAMEINFO.multi = 1.0;
				MELODYINFO.numNotes = 2;
				break;
			case 10:
				TIMEMANAGER.maxTime.Sec = 40;
				GAMEINFO.multi = 1.3;
				MELODYINFO.numNotes = 3;
				break;
			case 20:
				TIMEMANAGER.maxTime.Sec = 20;
				GAMEINFO.multi = 1.6;
				MELODYINFO.numNotes = 4;
				break;
				window.alert("Game start error: time not set");
		}
		//reset level
		sessionStorage.setItem("level", 1);
	},
};

//manages time
var TIMEMANAGER = {
	//whether the timer should pause or not
	timeStop: 0,
	//starting time
	maxTime: {Sec: 60, Dec: 0},
	//current time
	currentTime: {Sec: 60, Dec: 0},
	//decrease currenttime by 1 deca second. if deca hits 0, decrease sec
	updateTime: function() {
		//only tick time if time is not stopped
		if(!TIMEMANAGER.timeStop)
		{
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
		}
		//store time
		sessionStorage.setItem("time", JSON.stringify(TIMEMANAGER.currentTime));
        var dec_time = (TIMEMANAGER.currentTime.Dec < 10) ? "0" + TIMEMANAGER.currentTime.Dec : TIMEMANAGER.currentTime.Dec;
		document.getElementById("time").innerHTML = TIMEMANAGER.currentTime.Sec
                                                    + ":" + dec_time;
	},
	
	//start the timer
    startTime: function() {
        //Nothing to do, already started
        if(TIMEMANAGER.timeStop == 0) return;
        
        //Set flag
        TIMEMANAGER.timeStop = 0;
        //Restart background animation
        var elm = document.getElementById("main");
        elm.classList.remove("play");
        elm.classList.remove("start");
        elm.offsetWidth = elm.offsetWidth;
        elm.classList.add("play");
    },
    
	//reset timer back to maxTime
	resetTime: function() {
		TIMEMANAGER.currentTime.Sec = TIMEMANAGER.maxTime.Sec;
		TIMEMANAGER.currentTime.Dec = TIMEMANAGER.maxTime.Dec;
        
        //Reset background color
        var elm = document.getElementById("main");
        elm.classList.remove("play");
        elm.offsetWidth = elm.offsetWidth;
	},

	//choose a new max time (pass in seconds)
	changeMaxTime: function(newseconds) {
		TIMEMANAGER.maxTime.Sec = newseconds;
		TIMEMANAGER.maxTime.Dec = 0;
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
		//1nd octave
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
		//2rd octave
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
		//3th octave
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
		
		{src: "48_C6.ogg", id: "C6"}
	];
	createjs.Sound.alternateExtensions = ["mp3"];
	
	//loop through sounds array
	for (var i = 0; i < sounds.length; i++) {
		createjs.Sound.registerSound(audioPath + sounds[i].src, sounds[i].id, 50);
	}
}

//choose a specific scale
function chooseScale() {
	var key = sessionStorage.getItem("current_key");
	var scale = sessionStorage.getItem("current_scale");
	
	//clear scale array
	GAMEINFO.scale.length = 0;
	
	//The notes in a major scale
	var major = [
		0, 2, 4, 5, 7, 9, 11, 12, 
		14, 16, 17, 19, 21, 23,  24,
		26, 28, 29, 31, 33, 35, 36
		];
	
	//notes in a minor scale (Not being used now)
	var minor = [
		0, 2, 3, 5, 7, 8, 10, 12,
		14, 15, 17, 19, 20, 22, 24,
		26, 27, 29, 31, 32, 34, 36
	];
	
	//notes in a chromatic scale
	var chromatic = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
		13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
		25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
	];
	
	//default scale is major
	var blueprintScale = [];
	blueprintScale = major;
	//default start is 0
	var start = 0;
	
	//if chromatic, override key
	if (scale == "chrom")
	{
		blueprintScale = chromatic;
	}
	else
	{
		//choose starting pos based on scale
		switch (key + scale) {
			case "Cmaj":
			case "Amin":
				start = 0;
				break;
			case "C#maj":
			case "Dbmaj":
			case "Bbmin":
				start = 1;
				break;
			case "Dmaj":
			case "Bmin":
				start = 2;
				break;
			case "Ebmaj":
			case "Cmin":
				start = 3;
				break;
			case "Emaj":
			case "Dbmin":
				start = 4;
				break;
			case "Fmaj":
			case "Dmin":
				start = 5;
				break;
			case "F#maj":
			case "Gbmaj":
			case "Ebmin":
				start = 6;
				break;
			case "Gmaj":
			case "Emin":
				start = 7;
				break;
			case "Abmaj":
			case "Fmin":
				start = 8;
				break;
			case "Amaj":
			case "Gbmin":
				start = 9;
				break;
			case "Bbmaj":
			case "Gmin":
				start = 10;
				break;
			case "Bmaj":
			case "Cbmaj":
			case "Abmin":
				start = 11;
				break;
		}
	}

	//store the second half of the scale
	var second_half = [];
	//store the first half of the scale
	var first_half = [];
	
	//create scale
	for(var i = 0; i < blueprintScale.length; i++) {
		var note = start + blueprintScale[i];
		if(note >= CHROMATIC.length) {
			var newNote = CHROMATIC[(note % CHROMATIC.length) + 1];
			//if we are looping to low C, start pushing to the first_half array
			//only push if this note is not the same as the first note pushed in second_half
			if (newNote != second_half[0]) {
				first_half.push(newNote);
			}
		} 
		else {
			second_half.push(CHROMATIC[note]);
			//if we just pushed the high C, and we arent on the last iteration, also include the low C
			if (CHROMATIC[note] == 'C6' && (i != blueprintScale.length - 1)) {
				first_half.push('C3');
			}
		}
	}
	
	//merge the arrays to create the full scale
	GAMEINFO.scale = first_half.concat(second_half);
	
    //For testing
    console.log(GAMEINFO.scale);
}

//do not let player press play melody key if melody is already playing
var stopKey = true;

//play melody using answerkey array
//melody can only play, if it is not already playing
function playMelody() {
	console.log("In Play Melody");
	if (stopKey) {
		console.log("Start Playing");
		stopKey = false;
		sessionStorage.setItem("display", "playmelody");
		document.getElementById("settings_but").disabled = true;
		MELODYINFO.melodiesPlayed++;
		//if this is the second time playing the melody, play once bonus off
		if (MELODYINFO.melodiesPlayed == 2) MELODYINFO.bonus.bonus_PlayOnce = false;
		var melodyLength = MELODYINFO.anskey.length;
		for (var i = 0; i < melodyLength; i++) {
			//delay * (speed * 1000) will give a delay that is consistent
			createjs.Sound.play(GAMEINFO.scale[MELODYINFO.anskey[i]], "none", i * (MELODYINFO.speed * 1000), 0, 0, get_vol());
			//if the sound was just played, disable the button for the duration of the melody
			if (i + 1 == melodyLength) {
				//disable buttons
				document.getElementById("playmelodybtn").disabled = true;
				document.getElementById("restartbtn").disabled = true;
				//after the melody is done playing, enable the play button again, change display, and start the timer again
				setTimeout(function() {
					sessionStorage.setItem("display", "wait");
					//renable buttons
					document.getElementById("playmelodybtn").disabled = false;
					document.getElementById("restartbtn").disabled = false;
					//start time again 
					TIMEMANAGER.startTime();
					//enable alt key again
					stopKey = true;
					}, (i + 1) * (MELODYINFO.speed * 1000));
			}
		}
		console.log("Done Playing");
	}
	console.log("Exiting Play Melody");
}

//creates a random melody by filling answerkey array
function generateMelody() {
	//pause time, it will start when the player clicks playmelody
	TIMEMANAGER.timeStop = 1;
    document.getElementById("settings_but").disabled = false;
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
	
	//check this var in order to get lowest note
	var low = GAMEINFO.scale.length - 1;
	//check this var in order to get highest note
	var high = 0;
	
	//holds random number between 0 and range
	var randNum;
	//get starting position of melody which is between 0 and the length of scale - the possible range
	var starting = Math.floor(Math.random() * ((GAMEINFO.scale.length - 1) - (MELODYINFO.range)));
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
	console.log("Full Melody: " + MELODYINFO.anskey);
	
	//highlight first note (not done)
	var firstNote = GAMEINFO.scale[MELODYINFO.anskey[0]];
	highlight_note(document.getElementById(firstNote));
	console.log(firstNote);
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

	if (cur_scale[cur_anskey[cur_anspos]] == note) { //if correct
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

//displays current messege and level
/*function displayMessage() {
    document.getElementById("display").innerHTML = DISPLAY + "<br>" + "Level: " + localStorage.getItem("difficulty") + "\t(" + level_to_name() + ")";
}*/

//run these functions every key press
function onButtonClick(note) {
	//save key element
	var key_button = document.getElementById(note);
	playSound(note);
	//console.log(key_button);
	//only check melody if game is not over, also start the timer if it did not start yet
	if (!GAMEINFO.gameover) {
		 sessionStorage.setItem("display", "wait");
		//enable time if it has not been enabled yet
		TIMEMANAGER.startTime()
		checkMelody(note, key_button);
	}
}

//pointer to time function
var updateTimeRef;
//init game data, when game is restarted
function initStart() {
    //display score as 0
    reset_score(GAMEINFO.gamescore);
    
	//set new display
	sessionStorage.setItem("display", "wait");
	
	//enable game again
	GAMEINFO.resetGameInfo();
	
	//reset melody
	MELODYINFO.resetMelodyInfo();
	
	//reset speed, numb notes, range back to default
	MELODYINFO.speed = 1.0;
	MELODYINFO.numNotes = 2;
	MELODYINFO.range= 3;
	
	//make sure melody can be played
	document.getElementById("playmelodybtn").disabled = false;
	
	//set difficulty back to default
	GAMEINFO.resetDifficulty();
	
	//set scale
	chooseScale();
	
	//set time
	TIMEMANAGER.resetTime();
	//start timer again
	clearInterval(updateTimeRef);
	updateTimeRef = window.setInterval(TIMEMANAGER.updateTime, 10);
	window.setInterval(function(){ if (GAMEINFO.gameover) clearInterval(updateTimeRef)}, 10);
	
	generateMelody();
}



//run only once when web page is loaded
function initOnce() {
	//set display
	sessionStorage.setItem("display", "gameover");

	//set level
    sessionStorage.setItem("difficulty", 0);
	
	//make sure playmelody is disabled
	document.getElementById("playmelodybtn").disabled = true;
	
	//default sounds and scale
	loadSounds('piano');
	//chooseScale('Cmaj');
	
	//display score as 0
	//document.getElementById("score").innerHTML = GAMEINFO.gamescore;
	
	//register keyboard input
	document.addEventListener('keydown', function(event) {
	var keyboardKey = 'NA';
	//get keyboard key
	console.log(event.keyCode);
	switch(event.keyCode) {
		//Computer Keyboard Key - Musical Keyboard Key
		case 81: keyboardKey = 'C3'; //Q - C3 
			break;
		case 50: keyboardKey = 'Db3'; //2 - Db3
			break;
		case 87: keyboardKey = 'D3'; //W - D3
			break;
		case 51: keyboardKey = 'Eb3'; //3 - Eb3
			break;
		case 69: keyboardKey = 'E3'; //E - E3
			break;
		case 82: keyboardKey = 'F3'; //R - F3
			break;
		case 53: keyboardKey = 'Gb3'; //5 - Gb3
			break;
		case 84: keyboardKey = 'G3'; //T - G3
			break;
		case 54: keyboardKey = 'Ab3'; //6 - Ab3
			break;
		case 89: keyboardKey = 'A3'; //Y - A3
			break;
		case 55: keyboardKey = 'Bb3'; //7 - Bb3
			break;
		case 85: keyboardKey = 'B3'; //U - B3
			break;
		case 73: keyboardKey = 'C4'; //I - C4
			break;
		case 57: keyboardKey = 'Db4'; //9 - Db4
			break;
		case 79: keyboardKey = 'D4'; //O - D4
			break;
		case 48: keyboardKey = 'Eb4'; //0 - Eb4
			break;
		case 80: keyboardKey = 'E4'; //P - E4
			break;
		case 219: keyboardKey = 'F4'; //[ - F4
			break;
		case 187: keyboardKey = 'Gb4'; //= - Gb4
			break;
		case 221: keyboardKey = 'G4'; //] - G4
			break;
			
		case 8: // Backspace - Ab4
		case 65: // A - Ab4
						keyboardKey = 'Ab4'; 
			break;
		case 90: keyboardKey = 'A4'; //Z - A4
			break;
		case 83: keyboardKey = 'Bb4'; //S - Bb4
			break;
		case 88: keyboardKey = 'B4'; //X - B4
			break;
		case 67: keyboardKey = 'C5'; //C - C4
			break;
		case 70: keyboardKey = 'Db5'; //F - Db5
			break;
		case 86: keyboardKey = 'D5'; //V - D5
			break;
		case 71: keyboardKey = 'Eb5'; //G - Eb5
			break;
		case 66: keyboardKey = 'E5'; //B - E5
			break;
		case 78: keyboardKey = 'F5'; //N - F5
			break;
		case 74: keyboardKey = 'Gb5'; //J - Gb5
			break;
		case 77: keyboardKey = 'G5'; //M - G5
			break;
		case 75: keyboardKey = 'Ab5'; //K - Ab5
			break;
		case 188: keyboardKey = 'A5'; //, - A5
			break;
		case 76: keyboardKey = 'Bb5'; //L - Bb5
			break;
		case 190: keyboardKey = 'B5'; //. - B5
			break;
		case 191: keyboardKey = 'C6'; // / - C6
			break;
			
		case 49: keyboardKey =  'playmelody'; // 1 - Play Melody
			break;
		case 27: keyboardKey = 'restart'; //Esc - Restart
			break;
	}
	
	//depending on keyboard key, do something
	switch(keyboardKey) {
		case 'NA':
			break;
		case 'playmelody': if (stopKey) playMelody();
			break;
		case 'restart': initStart();
			break;
		default: onButtonClick(keyboardKey);
			break;
	}
	console.log(keyboardKey); 
});
	
	GAMEINFO.resetDifficulty();
}

