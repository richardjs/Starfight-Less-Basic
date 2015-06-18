'use strict';

window.addEventListener('load', function(){
	window.game = new Game();

	initNetwork();
	initInput();
	initDisplay();
	//game.start();
});
