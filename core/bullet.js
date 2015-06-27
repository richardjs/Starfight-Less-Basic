'use strict';

if(typeof(require) !== 'undefined'){
	var Entity = require('./entity.js');
}

var GAME_FPS = 60;

var BULLET_SPEED = 500 * 1000/GAME_FPS/1000;
var BULLET_DAMAGE = 200;
var BULLET_COLLISION_SIZE = 5;

function Bullet(game, player){
	this.type = 'bullet';
	this.game = game;
	if(player){
		this.playerID = player.id;
		this.x = player.x;
		this.y = player.y;
		this.dx = player.dx;
		this.dy = player.dy;
		this.dx += Math.cos(player.angle) * BULLET_SPEED;
		this.dy += Math.sin(player.angle) * BULLET_SPEED;
	}
	this.ttl = 1000;
	this.collisionSize = BULLET_COLLISION_SIZE;
}

Bullet.prototype = Object.create(Entity.prototype);

Bullet.prototype.update = function(){
	this.ttl -= 1000/60;
	if(this.ttl <= 0){
		this.game.entities.splice(this.game.entities.indexOf(this), 1);
	}
	for(var i = 0; i < this.game.entities.length; i++){
		var entity = this.game.entities[i];
		if(entity.type !== 'player'){
			continue;
		}
		if(Math.abs(entity.x - this.x) < (entity.collisionSize + this.collisionSize)/2
				&& Math.abs(entity.y - this.y) < (entity.collisionSize + this.collisionSize)/2
				&& entity.id !== this.playerID
				&& !entity.dead){
			this.game.entities.splice(this.game.entities.indexOf(this), 1);
			entity.damage(BULLET_DAMAGE, this);
		}
			
	}
	Entity.prototype.update.call(this);
}

if(typeof(module) !== 'undefined'){
	module.exports = Bullet;
}
