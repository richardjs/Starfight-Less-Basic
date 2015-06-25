'use strict';

if(typeof(require) !== 'undefined'){
	var Entity = require('./entity.js');
}

var BULLET_SPEED = 250 * 1000/60/1000;

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
}

Bullet.prototype = Object.create(Entity.prototype);

Bullet.prototype.update = function(){
	this.ttl -= 1000/60;
	if(this.ttl <= 0){
		this.game.entities.splice(this.game.entities.indexOf(this), 1);
	}
	Entity.prototype.update.call(this);
}

if(typeof(module) !== 'undefined'){
	module.exports = Bullet;
}
