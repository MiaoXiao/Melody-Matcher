//choose a specific scale
function chooseScale(){

}

//load all sounds that will be used
function loadSounds() {

	//register plugins
	//createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
	
	//audio path
	var audioPath = "./sounds/piano/";
	
	//library of sounds
	var sounds = [
		{src: "0_C4.mp3", id: "C4"},
		{src: "1_Db4.mp3", id: "Db4"},
		{src: "2_D4.mp3", id: "D4"},
		{src: "3_Eb4.mp3", id: "Eb4"},
		{src: "4_E4.mp3", id: "E4"},
		{src: "5_F4.mp3", id: "F4"},
		{src: "6_Gb4.mp3", id: "Gb4"},
		{src: "7_G4.mp3", id: "G4"},
		{src: "8_Ab4.mp3", id: "Ab4"},
		{src: "9_A4.mp3", id: "A4"},
		{src: "10_Bb4.mp3", id: "Bb4"},
		{src: "11_B4.mp3", id: "B4"},
		{src: "12_C5.mp3", id: "C5"}
	];
	
	//loop through sounds array
	for (var i = 0; i < sounds.length; i++) {
		createjs.Sound.registerSound(audioPath + sounds[i].src, sounds[i].id, 50);
	}
}

//play a sound given an id (ex C4, G4, Bb4)
function playSound(soundID) {
	createjs.Sound.play(soundID);
}