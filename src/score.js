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
	var finalScore = melodyinfo.multi * (basePoints + bonusNoError + bonusTime + bonusVeryTime);
	sessionStorage.setItem("score", finalScore);
	window.alert(finalScore);
}