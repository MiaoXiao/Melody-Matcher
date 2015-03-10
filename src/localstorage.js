var SESSION = {
	date: new Date(), 
	
	most_melodyplay: 0,
	most_secondstaken: 0,
	
	average_melodyplay: 0,
	accuracy: 1.0,
	
	streak_NoError: 0, 
	streak_PlayOnce: 0,
	streak_Speed: 0,
	streak_VerySpeed: 0,
	
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
	streak_VerySpeed: 0,
	
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

//Calling getItem() with a non-existent key will return null rather than throw an exception.
// -http://diveintohtml5.info/storage.html

//return true if localStorage storedstats has data
function checkNull(){
	if(localStorage.getItem("storedstats") != null){
		return true;
	}
	else {
		return false;
	}
}

/* http://www.java2s.com/Code/JavaScript/Development/howmanydaysBetweentwodates.htm
     Example File From "JavaScript and DHTML Cookbook"
     Published by O'Reilly & Associates
     Copyright 2003 Danny Goodman
*/
function daysBetween(date1, date2) {
    var DSTAdjust = 0;
    // constants used for our calculations below
    oneMinute = 1000 * 60;
    var oneDay = oneMinute * 60 * 24;
    // equalize times in case date objects have them
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    // take care of spans across Daylight Saving Time changes
    if (date2 > date1) {
        DSTAdjust = 
            (date2.getTimezoneOffset() - date1.getTimezoneOffset()) * oneMinute;
    } else {
        DSTAdjust = 
            (date1.getTimezoneOffset() - date2.getTimezoneOffset()) * oneMinute;    
    }
    var diff = Math.abs(date2.getTime() - date1.getTime()) - DSTAdjust;
    return Math.ceil(diff/oneDay);
}

//total number of successful melodies in one session
function S_Total_SuccessfulMelodies() {
	SESSION.total_successfulmelodies = finalGameInfo.allMelodies.length;
}

//total number of successful melodies overall//
function O_Total_SuccessfulMelodies(){
	if(checkNull()){
		OVERALL.total_successfulmelodies = storage.total_successfulmelodies + SESSION.total_successfulmelodies;
	}
	else{
		OVERALL.total_successfulmelodies = SESSION.total_successfulmelodies;
	}
}

//most number of successful melodies
functions O_Most_SuccessfulMelodies(){
	if(checkNull()){
		if(storage.OVERALL.most_successfulmelodies < SESSION.total_successfulmelodies){
			OVERALL.most_successfulmelodies = SESSION.total_successfulmelodies;
		}
		else{
			OVERALL.most_successfulmelodies = storage.OVERALL.most_successfulmelodies;
		}
	}
	else{
		OVERALL.most_successfulmelodies = SESSION.total_successfulMelodies;
	}
}

//best score ever
function O_Best_Score(){
	if(checkNull()){
		if(storage.best_score < finalGameInfo.gamescore)
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
	if(checkNull()){
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

//longest streak of NoError melodies overall
function O_Streak_NoError(){
	if(checkNull()){
		if(SESSION.streak_NoError > storage.streak_NoError){
			OVERALL.streak_NoError = SESSION.streak_NoError;
		}
		else {
			OVERALL.streak_NoError = storage.streak_NoError;
		}
	}
	else{
		OVERALL.streak_NoError = SESSION.streak_NoError;
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

//longest streak of Speed melodies overall
function O_Streak_Speed(){
	if(checkNull()){
		if(SESSION.streak_Speed > storage.streak_Speed){
			OVERALL.streak_Speed = SESSION.streak_Speed;
		}
		else{
			OVERALL.streak_Speed = storage.streak_Speed;
		}
	}
	else{
		OVERALL.streak_Speed = SESSION.streak_Speed;
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

//longest streak of VerySpeed melodies overall
function O_Streak_VerySpeed(){
	if(checkNull()){
		if(SESSION.streak_VerySpeed > storage.streak_VerySpeed){
			OVERALL.streak_VerySpeed = SESSION.streak_VerySpeed;
		}
		else{
			OVERALL.streak_VerySpeed = storage.streak_VerySpeed;
		}
	}
	else{
		OVERALL.streak_VerySpeed = SESSION.streak_VerySpeed;
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

//longest streak of PlayOnce melodies overall
function O_Streak_PlayOnce(){
	if(checkNull()){
		if(SESSION.streak_PlayOnce > storage.streak_PlayOnce){
			OVERALL.streak_PlayOnce = SESSION.streak_PlayOnce;
		}
		else{
			OVERALL.streak_PlayOnce = storage.streak_PlayOnce;
		}
	}
	else{
		OVERALL.streak_PlayOnce = SESSION.streak_PlayOnce;
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
	if(checkNull()){
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
		if(SESSION.most_secondstaken < finalGameInfo.allMelodies[i].timetaken.Sec)
		SESSION.most_secondstaken = finalGameInfo.allMelodies[i].timetaken.Sec;
	}
}

//longest streak of days played
function O_Streak_Days(){
	if(checkNull()){
		if(daysBetween(storage.allSessions[allSessions.length - 1], SESSION.date) == 1){
			OVERALL.curr_streak_days = storage.curr_streak_days + 1;
		}
		else{
			OVERALL.curr_streak_days = 1;
		}
		
		if(OVERALL.curr_streak_days > storage.streak_days){
			OVERALL.streak_days = OVERALL.curr_streak_days;
		}
		else{
			OVERALL.streak_days = storage.streak_days;
		}
	}
	
	else{
		OVERALL.curr_streak_days = 1;
		OVERALL.streak_days = curr_streak_days;
	}
	
	
}

//returns accuracy in one session
function S_Accuracy(){
	var sz = finalGameInfo.allMelodies.length;
	for(i = 0; i < sz; i++){
		SESSION.accuracy += finalGameInfo.allMelodies[i].numNotes / (finalGameInfo.allMelodies[i].numNotes + finalGameInfo.allMelodies[i].wrongNotes)
	}
	SESSION.accuracy = SESSION.accuracy / sz;
	
}

function callAll(){
	S_Total_SuccessfulMelodies();
	S_Streak_NoError();
	S_Streak_PlayOnce();
	S_Streak_Speed();
	S_Streak_VerySpeed();
	S_Average_MelodyPlay();
	S_Most_MelodyPlay();
	S_Most_SecondsTaken();
	S_Accuracy();
	
	O_Total_SuccessfulMelodies();
	O_Streak_NoError();
	O_Streak_PlayOnce();
	O_Streak_Speed();
	O_Streak_VerySpeed();
	O_Most_MelodyPlay();
	O_Most_SuccessfulMelodies();
	O_Best_Score();
	O_Average_Score();
	O_Streak_Days();
	
	
}
function init() {
	//localStorage.clear();
	document.getElementById("test").innerHTML = 12 / 5;
	
	
/*	
	should there be a save button to save progress and open a new  page to call this
//check browser for localStorage and sessionStorage support
if(typeof(Storage) !== "undefined") {
    document.getElementById("test").innerHTML = "localStorage and sessionStorage support available";
} else {
    document.getElementById("test").innerHTML = "no web storage support";
}
*/
//localStorage.clear();
	//calls all function to store in local storage; possibly go in the if function
//OVERALL.updateSessions();
	//var finalGameInfo = JSON.parse(localStorage.getItem("stats"));
	//if(checkNull == true){
		//var storage = JSON.parse(localStorage.getItem("storedstats"));
	//}
	//localStorage.setItem("storedstats", JSON.stringify(OVERALL));
	//printDate();
	//successfulMelodies();
	//document.getElementById("test").innerHTML = "numb of successes: " + SESSION.successfulmelodies;
}

