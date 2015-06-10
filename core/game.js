'use strict';

var PHYSICS_FPS = 60;

function Game(){
	this.entities = [];
	this.localPlayer = null;
}

Game.prototype.start = function(){
	setInterval(function(){
		this.update();
	}.bind(this), 1000/PHYSICS_FPS);
}

Game.prototype.update = function(){
	for(var i = 0; i < this.entities.length; i++){
		this.entities[i].update();
	}
}

if(typeof(module) !== 'undefined'){
	module.exports = Game;
}
