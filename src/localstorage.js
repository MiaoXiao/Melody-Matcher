var SESSION = {
	date: Date(), 
	
	most_melodyplay: 0,
	most_secondstaken: 0,
	
	average_melodyplay: 0,
	accuracy, 1.0,
	
	streak_NoError: 0, 
	streak_PlayOnce: 0,
	streak_Speed: 0,
	streak_VerySpeed: 0
	
	total_score: 0,
	total_NoError: 0, 
	total_PlayOnce: 0,
	total_Speed: 0,
	total_VerySpeed: 0,
	total_successfulmelodies: 0,
	total_melodyplay: 0,
};

var OVERALL = {
	most_melodyplay: 0,
	most_secondstaken: 0,
	most_successfulmelodies: 0, 
	
	best_score: 0, 
	
	average_score: 0,
	
	streak_days: 0,
	curr_streak_days: 0,
	streak_NoError: 0, 
	streak_PlayOnce: 0,
	streak_Speed: 0,
	streak_VerySpeed: 0
	
	total_score: 0,
	total_NoError: 0, 
	total_PlayOnce: 0,
	total_Speed: 0,
	total_VerySpeed: 0,
	total_successfulmelodies: 0,
	total_sessionsplayed: 0,
	
	allSessions: [],
	updateSessions: function() {
		//push completed session information to array
		this.allSessions.push(SESSION);
	}
	
};

//what about if null cases????------------------------

//total number of successful melodies in one session
function S_Total_SuccessfulMelodies() {
	SESSION.total_successfulmelodies = f
	inalGameInfo.allMelodies.length;
}

//total number of successful melodies overall
function O_Total_SuccessfulMelodies(){
	OVERALL.total_successfulmelodies = storage.total_successfulmelodies + SESSION.total_successfulmelodies;
}

//most number of successful melodies
functions O_Most_SuccessfulMelodies(){
	if(storage.most_successfulmelodies != null){
		if(storage.most_successfulmelodies < SESSION.total_successfulmelodies){
			OVERALL.most_successfulmelodies = SESSION.total_successfulMelodies;
		}
		else{
			OVERALL.most_successfulmelodies = storage.most_successfulmelodies;
		}
	}
	else{
		OVERALL.most_successfulmelodies = SESSION.total_successfulMelodies;
	}
}

//best score ever
function O_Best_Score(){
	if(storage.best_score != null){
		if(storage.best_score < finalGameInfo.GAMEINFO.gamescore)
			OVERALL.best_score = finalGameInfo.gamescore;
		else
			OVERALL.best_score = storage.best_score;
	}
	else{
		OVERALL.best_score = finalGameInfo.gamescore;
	}
	
}

//average score overall
function O_Average_Score(){
	if(storage.average_score != null){
		OVERALL.average_score = (finalGameInfo.gamescore + storage.average_score)/2;
	}
	else {
		OVERALL.average_score = finalGameInfo.gamescore;
	}	
}

//longest streak of NoError melodies in one session
function S_Streak_NoError(){
	var sz = finalGameInfo.allMelodies.length;
	var count = 0;
	for(i = 0; i < sz; i++){
		if(finalGameInfo.allMelodies[i].bonus.bonus_NoError == true){
			count++;
			if(count > SESSION.streak_NoError)
				SESSION.streak_NoError = count;
		}
		else
			count = 0;
	}
}

//longest streak of Speed melodies (finished under 10 seconds) in one session
function S_Streak_Speed(){
	var sz = finalGameInfo.allMelodies.length;
	var count = 0;
	for(i = 0; i < sz; i++){
		if(finalGameInfo.allMelodies[i].bonus.bonus_Speed == true){
			count++;
			if(count > SESSION.streak_Speed)
				SESSION.streak_Speed = count;
		}
		else
			count = 0;
	}
}

//longest streak of veryspeed melodies (finished under 5 seconds) in one session
function S_Streak_VerySpeed(){
	var sz = finalGameInfo.allMelodies.length;
	var count = 0;
	for(i = 0; i < sz; i++){
		if(finalGameInfo.allMelodies[i].bonus.bonus_VerySpeed == true){
			count++;
			if(count > SESSION.streak_VerySpeed)
				SESSION.streak_VerySpeed = count;
		}
		else
			count = 0;
	}
}

//longest streak of playonce melodies in one session
function S_Streak_PlayOnce(){
	var sz = finalGameInfo.allMelodies.length;
	var count = 0;
	for(i = 0; i < sz; i++){
		if(finalGameInfo.allMelodies[i].bonus.bonus_PlayOnce == true){
			count++;
			if(count > SESSION.streak_PlayOnce)
				SESSION.streak_PlayOnce = count;
		}
		else
			count = 0;
	}
}

//average number of times a melody is played per melody in one session
function S_Average_MelodyPlay(){
	var sz = finalGameInfo.allMelodies.length;
	for(i = 0; i < sz; i++){
		average_melodyplay  += finalGameInfo.allMelodies[i].melodiesPlayed;
	}
	average_melodyplay = average_melodyplay / sz;
}

//the most times a melody was played per melody in one session 
function S_Most_MelodyPlay(){
	var sz = finalGameInfo.allMelodies.length;
	for(i = 0; i < sz; i++){
		if(SESSION.most_melodyplay < finalGameInfo.allMelodies[i].melodiesPlayed){
			SESSION.most_melodyplay = finalGameInfo.allMelodies[i].melodiesPlayed;
		}
	}
}

//the most times a melody was played overall
function O_Most_MelodyPlay(){
	if(storage.most_melodyplay != null){
		if(storage.most_melodyplay < SESSION.most_melodyplay){
			OVERALL.most_melodyplay = SESSION.most_melodyplay;
		}
		else{
			OVERALL.most_melodyplay = storage.most_melodyplay;
		}
	}
	else{
		OVERALL.most_melodyplay = SESSION.most_melodyplay;
	}
}

//most seconds taken to solve a melody in one session
function S_Most_SecondsTaken(){
	var sz = finalGameInfo.allMelodies.length;
	for(i = 0; i < sz; i++){
		
	}
}
//longest streak of days played

//returns accuracy in one session
//for date. convert twice to even out, temporarily
/*<!DOCTYPE html>
<html>
<body>


<p id="demo1"></p>
<p id="demo2"></p>
<p id="demo3"></p>
<p id="demo4"></p>

<script>
var today = new Date();
var d1 = new Date('December 17, 1995 03:24:00');
var d2 = new Date('1995-12-17T03:24:00');
var d3 = new Date(1995, 11, 17);
var d4 = new Date(1995, 11, 17, 3, 24, 0);

document.getElementById("demo1").innerHTML = d1;
document.getElementById("demo2").innerHTML = d2;
document.getElementById("demo3").innerHTML = d3;
document.getElementById("").innerHTML = d4;
</script>

</body>
</html>
*/


function init() {
	/*
	should there be a save button to save progress and open a new  page to call this
//check browser for localStorage and sessionStorage support
if(typeof(Storage) !== "undefined") {
    document.getElementById("test").innerHTML = "localStorage and sessionStorage support available";
} else {
    document.getElementById("test").innerHTML = "no web storage support";
}
*/
	//calls all function to store in local storage; possibly go in the if function
//OVERALL.updateSessions();
	var finalGameInfo = JSON.parse(localStorage.getItem("stats"));
	var storage = JSON.parse(localStorage.getItem("storedstats"));
	//localStorage.setItem("storedstats", JSON.stringify(OVERALL));
	
	successfulMelodies();
	document.getElementById("test").innerHTML = "numb of successes: " + SESSION.successfulmelodies;
}

