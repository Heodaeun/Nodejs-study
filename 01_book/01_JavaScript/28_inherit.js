function Man() {
	this.name = "Anonymous";
	this.gender = "Man";
	this.Run = function () {
		return this.name + " is running!";
	}
	this.Sleep = function () {
		return this.name + " is sleeping!";
} }

function SoccerPlayer () { 
	this.base = new Man();
	this.name = "Anonymous Soccer Player"; 
	this.Run = function () {
		return this.base.Run();
	}
	this.Pass = function () {
		return this.name + "is passing to other player!";
} }

SoccerPlayer.prototype = new Man();
var player = new SoccerPlayer ();

console.log(player.name);
// "Anonymous Soccer Player"

console.log(player. gender);
// "Man"

console.log(player.Run());
// "Anonymous is running!"

console.log(player.Pass());
// "Anonymous Soccer Player is passing to other player!"

console.log(player.Sleep());
// "Anonymous Soccer Player is sleeping!"