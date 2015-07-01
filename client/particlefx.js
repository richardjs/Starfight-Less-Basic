'use strict';

var FX_PLAYER_EXPLOSION = {
	width: 30,
	height: 30,
	image: function(){
		return function(){
			var r = Math.random();
			if(r < .90){
				return document.getElementById('redParticleImage');
			}else if(r < .90 + .5){
				return document.getElementById('yellowParticleImage');
			}else{
				return document.getElementById('whiteParticleImage');
			}
		}
	},
	ttl: 0,
	emitCount: 500,
	particleTTL: 5000,
	particleVelocity: function(){
		var angle = Math.PI*2*Math.random();
		var speed = 175*Math.random();
		return function(t){
			return {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed
			}
		}
	},
	opacity: function(){
		var x = 4000*Math.random() + 1000;
		return function(t){
			return (Math.max(x-t, 0))/5000
		}
	}
}

var FX_PLAYER_THRUST= {
	width: 0,
	height: 0,
	image: function(){
		return function(){
			var r = Math.random();
			if(r < .90){
				return document.getElementById('redParticleImage');
			}else if(r < .90 + .5){
				return document.getElementById('yellowParticleImage');
			}else{
				return document.getElementById('whiteParticleImage');
			}
		}
	},
	ttl: 0,
	particleTTL: 1000,
	opacity: function(){
		return function(t){
			return (Math.max(1000-t, 0))/1000
		}
	}
}

var FX_BULLET_HIT = {
	width: 0,
	height: 0,
	image: function(){
		return function(){
			var r = Math.random();
			if(r < .50){
				return document.getElementById('yellowParticleImage');
			}else{
				return document.getElementById('whiteParticleImage');
			}
		}
	},
	ttl: 0,
	emitCount: 100,
	particleTTL: 750,
	particleVelocity: function(){
		var angle = Math.PI*2*Math.random();
		var speed = 300*Math.random();
		return function(t){
			return {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed
			}
		}
	},
	opacity: function(){
		return function(t){
			return (Math.max(750-t, 0))/750
		}
	}
}

