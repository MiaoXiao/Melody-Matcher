//based off number of notes and the range, calculates a score for correct melody
//bonus booleons are passed to determine whether the player is awarded bonus points
function calculateScore(numNotes, range, bonus_NoError, bonus_Speed, bonus_VerySpeed) {
	//get the current level
	var currentLevel = parseInt(sessionStorage.getItem("difficulty"));
	
	//base points
	var basePoints = (numNotes * 50) + (range * 25);
	sessionStorage.setItem("basepoints", basepoints);
	
	//no time bonus yet
	
	//bonus for getting a melody correct without making a mistake
	var bonusNoError = 0;
	if (bonus_NoError) {
		bonusPoints = 25 * currentLevel;
	}
	sessionStorage.setItem("bonusNoError", bonusNoError);
	
	//bonus for getting a melody correct in under 10 seconds, or under 5 seconds
	bonusSpeed = 0;
	bonusVerySpeed = 0;
	if(bonus_Speed) {
		bonusSpeed = 10 * currentLevel;
		
	}	
	else if (bonus_VerySpeed) {
		bonusVerySpeed = 20 * currentLevel;
	}
	sessionStorage.setItem("bonusSpeed", bonusSpeed);
	sessionStorage.setItem("bonusVerySpeed", bonusVerySpeed);
	
	sessionStorage.setItem("score", basePoints + bonusNoError + bonusSpeed);
	
}