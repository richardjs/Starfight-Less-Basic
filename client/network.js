'use strict';

var PING_FPS = 20;

window.socket = io();
window.id = null;

socket.on('set id', function(id){
	this.id = id;
});

socket.on('world update', function(state){
	game.entities = [];
	for(var i = 0; i < state.entities.length; i++){
		var entityState = state.entities[i];
		var p = new Player(entityState.id);
		p.x = entityState.x;
		p.y = entityState.y;
		p.dx = entityState.dx;
		p.dy = entityState.dy;
		p.angle = entityState.angle;
		game.entities.push(p);

		if(p.id === socket.id){
			window.player = p;
		}
	}
	game.time = state.time - latency;
	while(inputs[0].time < game.time){
		inputs.shift();	
	}
	var time = game.time;
	for(var i = 0; i < inputs.length; i++){
		var input = inputs[i];
		var delta = input.time - time;
		time = input.time;
		player.keysDown = input.keysDown;
	}
});

var latency;
setInterval(function(){
	socket.emit('ping', Date.now());
}, 1000/PING_FPS);
socket.on('ping', function(time){
	latency = (Date.now() - time) / 2;
});

