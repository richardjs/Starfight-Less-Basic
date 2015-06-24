'use strict';

if(typeof(require) !== 'undefined'){
	var Entity = require('./entity.js');
}

var BULLET_SPEED = 50 * 1000/60/1000;

function Bullet(game, player){
	this.type = 'bullet';
	this.game = game;
	if(player){
		console.log('new bullet');
		console.log(Date.now());
		this.playerID = player.id;
		this.x = player.x;
		this.y = player.y;
		this.dx = player.dx;
		this.dy = player.dy;
		this.dx += Math.cos(player.angle) * BULLET_SPEED;
		this.dy += Math.sin(player.angle) * BULLET_SPEED;
		console.log(this.dx);
		console.log(this.dy);
	}
}

Bullet.prototype = Object.create(Entity.prototype);

if(typeof(module) !== 'undefined'){
	module.exports = Bullet;
}
