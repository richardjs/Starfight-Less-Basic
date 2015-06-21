'use strict';

var PLAYER_ACCELERATION = 10 * 1000/60 / 1000;
var PLAYER_TURN_SPEED = Math.PI*2 * 1000/60 / 1000;

var PLAYER_STARTING_ENERGY= 1000;
var PLAYER_ENERGY_REGEN = 100 * 1000/60/1000;
var PLAYER_THRUSTER_COST = 25 * 1000/60/1000;

var PLAYER_AFTERBURNER_ACCELERATION = 40 * 1000/60 / 1000;
var PLAYER_AFTERBURNER_COST = 500 * 1000/60/1000;

var PLAYER_COLLISION_SIZE = 10;

var PLAYER_WALL_COLLISION_DAMAGE = 10;

function Player(game, id, x, y){
	this.game = game;
	this.type = 'player';
	this.id = id;
	this.x = x;	
	this.y = y;	
	this.lastX = x;
	this.lastY = y;
	this.dx = 0;
	this.dy = 0;
	this.angle = Math.random() * Math.PI*2;
	this.keysDown = {};
	this.keysDownBuffer = [];

	this.energy = PLAYER_STARTING_ENERGY;
}

var turnCount = 0;
Player.prototype.update = function(){
	if(this.keysDownBuffer.length){
		this.keysDown = this.keysDownBuffer.shift().keysDown;
	}
	if(this.keysDown[37]){
		this.angle -= PLAYER_TURN_SPEED;
	}
	if(this.keysDown[39]){
		this.angle += PLAYER_TURN_SPEED;
	}

	var acceleration = PLAYER_ACCELERATION;
	var cost = PLAYER_THRUSTER_COST;
	if(this.keysDown[65] && this.energy > cost + PLAYER_AFTERBURNER_COST){
		acceleration += PLAYER_AFTERBURNER_ACCELERATION;
		cost += PLAYER_AFTERBURNER_COST;
	}
	if(this.keysDown[38] && this.energy > cost){
		this.dx += Math.cos(this.angle) * acceleration;
		this.dy += Math.sin(this.angle) * acceleration;
		this.energy -= cost;
	}
	if(this.keysDown[40] && this.energy > cost){
		this.dx -= Math.cos(this.angle) * acceleration;
		this.dy -= Math.sin(this.angle) * acceleration;
		this.energy -= cost;
	}
	this.keysDown = {};

	// Move player, breaking movement down into small steps if neccesary, to avoid jumping walls
	var stepX = this.dx;
	var stepY = this.dy;
	var steps = 1;
	while(Math.abs(stepX) > 5 || Math.abs(stepY) > 5){
		steps++;
		stepX = this.dx/steps;
		stepY = this.dy/steps;
	}
	if(typeof(window) !== 'undefined'){
		window.steps = steps;
	}

	for(var i = 0; i < steps; i++){
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += stepX;
		this.y += stepY;

		for(var j = 0; j < this.game.mapEntities.length; j++){
			var wall = this.game.mapEntities[j];
			if(Math.abs(wall.x - this.x) < (wall.width + PLAYER_COLLISION_SIZE) / 2
					&& Math.abs(wall.y - this.y) < (wall.height + PLAYER_COLLISION_SIZE) / 2){
				this.x = this.lastX;
				this.y = this.lastY;

				if(Math.abs(wall.x - this.x) < (wall.width + PLAYER_COLLISION_SIZE) / 2){
					this.dy *= -1;
					stepY *= -1;
					this.damage(PLAYER_WALL_COLLISION_DAMAGE * Math.abs(this.dy));
				}else{
					this.dx *= -1;
					stepX *= -1;
					this.damage(PLAYER_WALL_COLLISION_DAMAGE * Math.abs(this.dx));
				}
			}
		}
	}

	this.energy += PLAYER_ENERGY_REGEN;
	if(this.energy > PLAYER_STARTING_ENERGY){
		this.energy = PLAYER_STARTING_ENERGY;
	}
}

Player.prototype.damage = function(amount){
	this.energy -= amount;
	// TODO 
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
