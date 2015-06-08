'use strict';

var PING_FPS = 20;

var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

var socket = io();

var game = new Game();
game.start();

var id;
socket.on('setid', function(id){
	this.id = id;
	console.log(this.id);
});

socket.on('stateupdate', function(state){
	game.entities = [];
	for(var i = 0; i < state.entities.length; i++){
		var entityState = state.entities[i];
		var player = new Player(entityState.id);
		player.x = entityState.x;
		player.y = entityState.y;
		player.angle = entityState.angle;
		game.entities.push(player);
	}
});

var latency;
setInterval(function(){
	socket.emit('ping', Date.now());
}, 1000/PING_FPS);
socket.on('ping', function(time){
	latency = (Date.now() - time) / 2;
});

function render(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var playerImage = document.getElementById('playerImage');
	for(var i = 0; i < game.entities.length; i++){
		var entity = game.entities[i];
		ctx.save();
		ctx.translate(entity.x, entity.y );
		ctx.rotate(entity.angle);
		ctx.drawImage(playerImage, -playerImage.width/2, -playerImage.height/2);
		ctx.restore();
	}

	requestAnimationFrame(render);
}

window.addEventListener('load', function(){
	render();
});
