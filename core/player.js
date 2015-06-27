'use strict';

if(typeof(require) !== 'undefined'){
	var Entity = require('./entity.js');
	var Bullet = require('./bullet');
}

var GAME_FPS = 60;

var PLAYER_ACCELERATION = 10 * 1000/GAME_FPS/1000;
var PLAYER_TURN_SPEED = Math.PI*2 * 1000/GAME_FPS/1000;

var PLAYER_STARTING_ENERGY= 1000;
var PLAYER_ENERGY_REGEN = 100 * 1000/GAME_FPS/1000;
var PLAYER_THRUSTER_COST = 25 * 1000/GAME_FPS/1000;

var PLAYER_AFTERBURNER_ACCELERATION = 40 * 1000/GAME_FPS/1000;
var PLAYER_AFTERBURNER_COST = 500 * 1000/GAME_FPS/1000;

var PLAYER_BRAKE_DECELERATION = 20 * 1000/GAME_FPS/1000;
var PLAYER_BRAKE_COST = 175 * 1000/GAME_FPS/1000;

var PLAYER_BULLET_COST = 50;
var PLAYER_BULLET_DELAY = 150;

var PLAYER_COLLISION_SIZE = 20;

function Player(game, id, x, y){
	this.type = 'player';
	this.game = game;
	this.id = id;
	this.score = 0;
	this.keysDown = {};
	this.reset(x, y);
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.reset = function(x, y){
	this.x = x;	
	this.y = y;	
	this.lastX = x;
	this.lastY = y;
	this.dx = 0;
	this.dy = 0;
	this.angle = Math.random() * Math.PI*2;
	this.collisionSize = PLAYER_COLLISION_SIZE;
	this.energy = PLAYER_STARTING_ENERGY;
	this.bulletTimer = 0;
	this.dead = false;
}

var turnCount = 0;
Player.prototype.update = function(){
	if(this.dead){
		return;
	}
	
	// Rotate
	if(this.keysDown[37]){
		this.angle -= PLAYER_TURN_SPEED;
	}
	if(this.keysDown[39]){
		this.angle += PLAYER_TURN_SPEED;
	}

	// Acceleration
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

	// Brake
	if(this.keysDown[83] && this.energy > PLAYER_BRAKE_COST
			&& Math.abs(this.dx) > 0 && Math.abs(this.dy) > 0){
		var speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
		var angle = Math.atan2(this.dy, this.dx);
		speed -= PLAYER_BRAKE_DECELERATION;
		if(speed < 0){
			speed = 0;
		}
		this.dx = Math.cos(angle) * speed;
		this.dy = Math.sin(angle) * speed;
		this.energy -= PLAYER_BRAKE_COST;
	}

	// Bullets
	if(this.bulletTimer > 0){
		this.bulletTimer -= 1000/GAME_FPS;
	}
	if(this.keysDown[90] && this.energy > PLAYER_BULLET_COST && this.bulletTimer <= 0){
		this.energy -= PLAYER_BULLET_COST;
		this.game.entities.push(new Bullet(this.game, this));
		this.bulletTimer = PLAYER_BULLET_DELAY;
	}

	this.keysDown = {};

	Entity.prototype.update.call(this);

	this.energy += PLAYER_ENERGY_REGEN;
	if(this.energy > PLAYER_STARTING_ENERGY){
		this.energy = PLAYER_STARTING_ENERGY;
	}
}

Player.prototype.damage = function(amount, source){
	if(this.dead){
		return;
	}
	this.energy -= amount;
	if(this.energy <= 0){
		this.energy = 0;
		this.dead = true;
		this.respawning = false;

		if(source){
			this.killerID = source.playerID;
		}
	}
}

if(typeof(module) !== 'undefined'){
	module.exports = Player;
}
