'use strict';

function Game(){
	this.entities = [];
	this.mapEntities = [];
	this.localPlayer = null;
	this.message = '';
}

Game.prototype.update = function(){
	for(var i = 0; i < this.entities.length; i++){
		this.entities[i].update();
	}
}

if(typeof(module) !== 'undefined'){
	module.exports = Game;
}
