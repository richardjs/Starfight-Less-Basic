'use strict';

var PLAYER_ACCELERATION = 10;

function Player(id){
	this.id = id;
	this.x = Math.random()*500;	
	this.y = Math.random()*500;	
	this.dx = 0;
	this.dy = 0;
	this.angle = Math.random() * Math.PI*2;
	this.keysDown = {};
}

Player.prototype.update = function(delta){
	if(this.keysDown[37]){
		this.angle -= Math.PI*delta / 1000;
	}
	if(this.keysDown[39]){
		this.angle += Math.PI*delta / 1000;
	}
	if(this.keysDown[38]){
		this.dx += Math.cos(this.angle) * PLAYER_ACCELERATION * delta / 1000;
		this.dy += Math.sin(this.angle) * PLAYER_ACCELERATION * delta / 1000;
	}

	this.x += this.dx;
	this.y += this.dy;
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
