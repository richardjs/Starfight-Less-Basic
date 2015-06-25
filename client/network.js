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
			switch(entityState.type){
				case 'player':
					var player = new Player();
					player.game = game;
					player.id = entityState.id
					player.x = entityState.x;
					player.y = entityState.y;
					player.dx = entityState.dx;
					player.dy = entityState.dy;
					player.angle = entityState.angle;
					player.energy = entityState.energy;
					player.bulletTimer = entityState.bulletTimer;

					if(player.id === id){
						game.localPlayer = player;
					}

					game.entities.push(player);
					break;

				case 'bullet':
					var bullet = new Bullet();
					bullet.game = game;
					bullet.playerID = entityState.playerID;
					bullet.x = entityState.x;
					bullet.y = entityState.y;
					bullet.dx = entityState.dx;
					bullet.dy = entityState.dy;

					game.entities.push(bullet);
					break;
			}
		}

		game.mapEntities = [];
		for(var i = 0; i < state.mapEntities.length; i++){
			var entityState = state.mapEntities[i];
			game.mapEntities.push(new Wall(entityState.x, entityState.y, entityState.width, entityState.height));
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
