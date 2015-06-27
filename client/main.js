'use strict';

while(!localStorage.getItem('name')){
	localStorage.setItem('name', prompt('Please enter a callsign:'));
}

window.addEventListener('load', function(){
	window.game = new Game();

	initNetwork();
	initInput();
	initDisplay();
});
