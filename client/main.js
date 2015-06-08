'use strict';

var INPUT_FPS = 60;
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
		player.dx = entityState.dx;
		player.dy = entityState.dy;
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

var keysDown = {};
document.body.addEventListener('keydown', function(event){
	keysDown[event.which] = true;
});
document.body.addEventListener('keyup', function(event){
	keysDown[event.which] = false;
});
setInterval(function(){
	socket.emit('inputupdate', keysDown);
}, 1000/INPUT_FPS);

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

	ctx.fillStyle = '#fff';
	ctx.fillText('Ping: ' + latency*2, 10, 10);

	requestAnimationFrame(render);
}

window.addEventListener('load', function(){
	render();
});
