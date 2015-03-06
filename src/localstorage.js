/*
//check browser for localStorage and sessionStorage support
if(typeof(Storage) !== "undefined") {
    document.getElementById("test").innerHTML = "localStorage and sessionStorage support available";
} else {
    document.getElementById("test").innerHTML = "no web storage support";
}
*/
//calls all function to store in local storage; possibly go in the if function


var finalGameInfo = JSON.parse(localStorage.getItem("stats"));
var storage = JSON.parse(localStorage.getItem("storedstats"));
//successfulMelodies();
//document.getElementById("test1").innerHTML = "successful melodies: " + x;//SESSION.successfulmelodies;
//var x = successfulMelodies();
//OVERALL.updateSessions();
//localStorage.setItem("storedstats", JSON.stringify(OVERALL));


//-------------------------- TO DO LATER--------------------------------------------------
//figure out a faster way of testing everything
//-----------------------------------------------------------------------------------------


var SESSION = {
	//date: Date(), 
	successfulmelodies: 0,
};
/*
var OVERALL = {
	//best: 0,
	allSessions: [],
	updateSessions: function() {
		//push completed session information to array
		this.allSessions.push(SESSION);
	}
	
};
*/
//returns the number of successful melodies for one session
function successfulMelodies() {
	SESSION.successfulmelodies = finalGameInfo.allMelodies.length;
}


//returns the number of successful melodies total
function TSM(){
	return storage.successfulmelodies + successfulmelodies;
}

/*
//returns longest streak of days played

//returns longest streak of melodies with no errors

//returns longest streak of melodies with melody played once

//returns longest streak of melodies solved under 10 seconds

//returns longest streak of melodies solved under 5 seconds

//returns the longest session played (minutes and date)

//return best score ever

//returns average score overall

//returns accuracy in one session

//average number of times a melody is played per melody

//the most times a melody was played

*/

function init() {
	successfulMelodies();
	document.getElementById("test").innerHTML = "numb of successes: " + SESSION.successfulmelodies;
}
