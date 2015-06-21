'use strict';

function Wall(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

if(typeof(module) !== 'undefined'){
	module.exports = Wall;
}
