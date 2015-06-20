'use strict';

var PLAYER_ACCELERATION = 10 * 1000/60 / 1000;
var PLAYER_TURN_SPEED = Math.PI*2 * 1000/60 / 1000;

var PLAYER_STARTING_ENERGY= 1000;
var PLAYER_ENERGY_REGEN = 100 * 1000/60/1000;

var PLAYER_AFTERBURNER_ACCELERATION = 40 * 1000/60 / 1000;
var PLAYER_AFTERBURNER_COST = 500 * 1000/60/1000;


function Player(id){
	this.id = id;
	this.x = Math.random()*500;	
	this.y = Math.random()*500;	
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
	if(this.keysDown[65] && this.energy > PLAYER_AFTERBURNER_COST){
		acceleration += PLAYER_AFTERBURNER_ACCELERATION;
		this.energy -= PLAYER_AFTERBURNER_COST;
	}
	if(this.keysDown[38]){
		this.dx += Math.cos(this.angle) * acceleration;
		this.dy += Math.sin(this.angle) * acceleration;
	}
	if(this.keysDown[40]){
		this.dx -= Math.cos(this.angle) * acceleration;
		this.dy -= Math.sin(this.angle) * acceleration;
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
