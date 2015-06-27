'use strict';

var WALL_COLLISION_DAMAGE = 5;

function Entity(){}

Entity.prototype.update = function(){
	// Break movement down into small steps to avoid jumping over walls
	var stepX = this.dx;
	var stepY = this.dy;
	var steps = 1;
	while(Math.abs(stepX) > 5 || Math.abs(stepY) > 5){
		steps++;
		stepX = this.dx/steps;
		stepY = this.dy/steps;
	}

	// Take the steps
	for(var i = 0; i < steps; i++){
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += stepX;
		this.y += stepY;

		// Check for collisions with map
		for(var j = 0; j < this.game.mapEntities.length; j++){
			var wall = this.game.mapEntities[j];
			if(Math.abs(wall.x - this.x) < (wall.width + this.collisionSize) / 2
					&& Math.abs(wall.y - this.y) < (wall.height + this.collisionSize) / 2){
				this.x = this.lastX;
				this.y = this.lastY;

				if(Math.abs(wall.x - this.x) < (wall.width + this.collisionSize) / 2){
					this.dy *= -.8;
					stepY *= -.8;
					this.damage(WALL_COLLISION_DAMAGE * Math.abs(this.dy));
				}else{
					this.dx *= -.8;
					stepX *= -.8;
					this.damage(WALL_COLLISION_DAMAGE * Math.abs(this.dx));
				}
			}
		}
	}
}

Entity.prototype.damage = function(amount, source){}

if(typeof(module) !== 'undefined'){
	module.exports = Entity;
}
