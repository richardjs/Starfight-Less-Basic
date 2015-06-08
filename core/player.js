'use strict';

function Player(id){
	this.id = id;
	this.x = Math.random()*500;	
	this.y = Math.random()*500;	
	this.angle = Math.random() * Math.PI*2;
}

Player.prototype.update = function(delta){
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
