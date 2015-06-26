'use strict';

var INPUT_FPS = 60;

function initInput(){
	window.inputs = [];

	var keysDown = {};

	document.body.addEventListener('keydown', function(event){
		keysDown[event.which] = true;
	});
	document.body.addEventListener('keyup', function(event){
		keysDown[event.which] = false;
	});

	var nextSequenceNumber = 0;
	setTimer(function(){
		var input = {
			keysDown: {},
			sequenceNumber: nextSequenceNumber++,
			time: Date.now()
		}
		var keys = Object.keys(keysDown);
		for(var i = 0; i < keys.length; i++){
			input.keysDown[keys[i]] = keysDown[keys[i]];
		}
		inputs.push(input);

		socket.emit('input update', input);

		if(game.localPlayer){
			game.localPlayer.keysDown = keysDown;
		}
		game.update();
	}, 1000/(INPUT_FPS));
}
