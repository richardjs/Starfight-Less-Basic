'use strict';

function Bullet(player){
	this.x = player.x;
	this.y = player.y;
	this.dx = player.dx;
	this.dy = player.dy;
}

if(typeof(module) !== 'undefined'){
	module.exports = Bullet;
}
