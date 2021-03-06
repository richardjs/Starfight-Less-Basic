'use strict';

var STARFIELD_WIDTH = 2048;
var STARFIELD_HEIGHT = 1080;
var STAR_COUNT = 150;
var STAR_MIN_SPEED = .05;
var STAR_MAX_SPEED = .55;

function Star(){
	this.x = Math.random() * STARFIELD_WIDTH;
	this.y = Math.random() * STARFIELD_HEIGHT;
	this.speed = Math.random()*(STAR_MAX_SPEED - STAR_MIN_SPEED) + STAR_MIN_SPEED;
	this.color = 'rgb('+
		Math.floor(Math.random()*155 + 100) + ',' +
		Math.floor(Math.random()*155 + 100) + ',' +
		Math.floor(Math.random()*155 + 100) +
	')';
	this.size = Math.floor(Math.random()*2) + 1;
}

Star.prototype.render = function(cameraX, cameraY){
	//var playerPos = particles[bindex].pos;
	var x = (this.x - this.speed * cameraX) % STARFIELD_WIDTH;
	var y = (this.y - this.speed * cameraY) % STARFIELD_HEIGHT;
	while(x < 0){
		x += STARFIELD_WIDTH;
	}
	while(y < 0){
		y += STARFIELD_HEIGHT;
	}

	ctx.fillStyle = this.color;
	ctx.fillRect(x, y, this.size, this.size);
}

// Create stars
window.stars = [];
for(var i = 0; i < STAR_COUNT; i++){
	stars.push(new Star());
}
