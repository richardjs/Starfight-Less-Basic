'use strict';

var INPUT_FPS = 60;

var keysDown = {};
var inputs = [];

document.body.addEventListener('keydown', function(event){
	keysDown[event.which] = true;
});
document.body.addEventListener('keyup', function(event){
	keysDown[event.which] = false;
});

setInterval(function(){
	inputs.push({
		keysDown: keysDown,
		time: game.time
	});
	if(typeof(player) !== 'undefined'){
		player.keysDown = keysDown;
	}
	socket.emit('input update', keysDown);
}, 1000/INPUT_FPS);
