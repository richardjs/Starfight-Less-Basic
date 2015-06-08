'use strict';

function Player(id){
	this.id = id;
	this.x = Math.random()*500;	
	this.y = Math.random()*500;	
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
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
