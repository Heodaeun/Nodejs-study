player.constructor;
// Function: SoccerPlayer

function SoccerPlayer(name, position) { 
  this.name = name;
  this.position = position; 
  this.whatIsYourName = function () {
    return 'My name is ' + this.name;
  };
  this.wahtIsYourPosition = function () { 
	return 'My position is ' + this.position;
  }; 
}

var player2 = new player.constructor("Koo Ja Cheol");
player2.name;
// "Koo Ja Cheol"