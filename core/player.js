'use strict';

var PLAYER_ACCELERATION = 10 * 1000/60 / 1000;
var PLAYER_TURN_SPEED = Math.PI*2 * 1000/60 / 1000;

var PLAYER_STARTING_ENERGY= 1000;
var PLAYER_ENERGY_REGEN = 100 * 1000/60/1000;
var PLAYER_THRUSTER_COST = 25 * 1000/60/1000;

var PLAYER_AFTERBURNER_ACCELERATION = 40 * 1000/60 / 1000;
var PLAYER_AFTERBURNER_COST = 500 * 1000/60/1000;


function Player(id, x, y){
	this.type = 'player';
	this.id = id;
	this.x = x;	
	this.y = y;	
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

	this.x += this.dx;
	this.y += this.dy;

	this.energy += PLAYER_ENERGY_REGEN;
	if(this.energy > PLAYER_STARTING_ENERGY){
		this.energy = PLAYER_STARTING_ENERGY;
	}
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
