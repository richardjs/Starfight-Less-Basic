'use strict';

var GAME_FPS = 60;

function initInput(){
	window.inputs = [];

	var keysDown = {};

	document.body.addEventListener('keydown', function(event){
		keysDown[event.which] = true;
	});
	document.body.addEventListener('keyup', function(event){
		delete keysDown[event.which];
	});

	var nextSequenceNumber = 0;
	setTimer(function(){
		if(!game.localPlayer){
			return;
		}

		var input = {
			keysDown: {},
			sequenceNumber: nextSequenceNumber++
		}
		var keys = Object.keys(keysDown);
		for(var i = 0; i < keys.length; i++){
			input.keysDown[keys[i]] = keysDown[keys[i]];
		}
		inputs.push(input);

		socket.emit('input update', input);

		game.localPlayer.keysDown = keysDown;
		game.update();
	}, 1000/GAME_FPS);
}
