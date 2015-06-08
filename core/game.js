'use strict';

var PHYSICS_FPS = 60;

function Game(){
	this.entities = [];
}

Game.prototype.start = function(){
	var lastUpdateTime = Date.now();
	setInterval(function(){
		var time = Date.now()
		var delta = time - lastUpdateTime;
		lastUpdateTime = time;
		this.update(delta);
	}.bind(this), 1000/PHYSICS_FPS);
}

Game.prototype.update = function(delta){
	for(var i = 0; i < this.entities.length; i++){
		this.entities[i].update(delta);
	}
}

if(typeof(module) !== 'undefined'){
	module.exports = Game;
}
