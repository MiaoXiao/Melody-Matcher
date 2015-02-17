//global variables
//defaut volume
var VOLUME = 0.5;
//default speed
var SPEED = 1;
//key for melody
var ANSWERKEY = [];
//current scale
var SCALE = [];

//change speed. between .1 and 2
function changeSpeed(speed) {
	SPEED = speed;
}

//change volume. between 0 and 1
function changeVolume(volume) {
	VOLUME = volume;
}

//choose a specific scale
function chooseScale(scale) {
	//clear scale array
	SCALE.length = 0;
	if (scale == "Fmaj") //F major
	{
		SCALE[0] = "C4";
		SCALE[1] = "D4";
		SCALE[2] = "E4";
		SCALE[3] = "F4";
		SCALE[4] = "G4";
		SCALE[5] = "A4";
		SCALE[6] = "Bb4";
		SCALE[7] = "C5";		
	}
	else //assume C major
	{
		SCALE[0] = "C4";
		SCALE[1] = "D4";
		SCALE[2] = "E4";
		SCALE[3] = "F4";
		SCALE[4] = "G4";
		SCALE[5] = "A4";
		SCALE[6] = "B4";
		SCALE[7] = "C5";
	}
}

//creates a random melody by filling answerkey array
function generateMelody(numNotes, range) {
	//clear array
	ANSWERKEY.length = 0;
	//fills answer key with random iterators between range and 0
	for (var i = 0; i < numNotes; i++) {
		ANSWERKEY[i] = Math.floor((Math.random() * range) + 0);
		//window.alert(ANSWERKEY[i]);
	}
}



//check to see if melody is correct so far
function checkMelody(note) {

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

//play melody using answerkey array
function playMelody() {
	for (var i = 0; i < ANSWERKEY.length; i++) {
		//i * (speed * 1000) will give a delay that is consistent
		createjs.Sound.play(SCALE[ANSWERKEY[i]], "none", i * (SPEED * 1000), 0, 0, VOLUME);
	}
}

//play a sound given an id (ex C4, G4, Bb4)
function playSound(soundID) {
	createjs.Sound.play(soundID, "none", 0, 0, 0, VOLUME);
}