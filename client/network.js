'use strict';

var PING_FPS = 20;

function initNetwork(){
	window.socket = io();
	window.id = null;

	socket.on('set id', function(id){
		window.id = id;
	});

	socket.on('world update', function(state){
		game.entities = [];
		for(var i = 0; i < state.entities.length; i++){
			var entityState = state.entities[i];
			var player = new Player();
			player.id = entityState.id
			player.x = entityState.x;
			player.y = entityState.y;
			player.dx = entityState.dx;
			player.dy = entityState.dy;
			player.angle = entityState.angle;
			player.energy = entityState.energy;

			game.entities.push(player);

			if(player.id === id){
				game.localPlayer = player;
			}
		}
		
		while(inputs.length && inputs[0].sequenceNumber <= state.lastSequenceNumber){
			inputs.shift();
		}
		if(game.localPlayer){
			for(var i = 0; i < inputs.length; i++){
				game.localPlayer.keysDown = inputs[i].keysDown;
				game.localPlayer.update();
			}
		}
	});

	window.latency = undefined;
	setInterval(function(){
		socket.emit('ping', Date.now());
	}, 1000/PING_FPS);
	socket.on('ping', function(time){
		latency = (Date.now() - time) / 2;
	});
}
