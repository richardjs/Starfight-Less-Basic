'use strict';

var LOW_ENERGY = .33 * PLAYER_STARTING_ENERGY;
var MED_ENERGY = .66 * PLAYER_STARTING_ENERGY;

function initDisplay(){
	window.canvas = document.createElement('canvas');
	window.ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);

	function render(){
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if(!game.localPlayer){
			requestAnimationFrame(render);
			return;
		}

		for(var i = 0; i < stars.length; i++){
			stars[i].render(game.localPlayer.x, game.localPlayer.y);
		}

		ctx.save();
		ctx.translate(
			canvas.width/2 - game.localPlayer.x,
			canvas.height/2 - game.localPlayer.y
		);
		var playerImage = document.getElementById('playerImage');
		for(var i = 0; i < game.mapEntities.length; i++){
			var entity = game.mapEntities[i];
			ctx.save();
			ctx.translate(entity.x, entity.y);
			ctx.fillStyle = '#fff';
			ctx.fillRect(-entity.width/2, -entity.height/2, entity.width, entity.height);
			ctx.restore();
		}
		for(var i = 0; i < game.entities.length; i++){
			var entity = game.entities[i];
			ctx.save();
			ctx.translate(entity.x, entity.y );
			switch(entity.type){
				case 'player':
					if(entity.dead){
						break;
					}
					if(entity.name && entity){
						if(entity.energy > MED_ENERGY){
							ctx.fillStyle = '#050';
						}else if(entity.energy > LOW_ENERGY){
							ctx.fillStyle = '#550';
						}else{
							ctx.fillStyle = '#500';
						}
						ctx.font = '12pt courier';
						ctx.textAlign = 'center';
						ctx.fillText(entity.name, 0, -30);

						ctx.strokeStyle = '#333';
						ctx.beginPath();
						ctx.moveTo(0, 0);
						ctx.lineTo(game.localPlayer.x - entity.x, game.localPlayer.y - entity.y);
						ctx.stroke();
					}

					/*
					ctx.fillStyle = '#050';
					ctx.font = '12pt courier';
					ctx.textAlign = 'center';
					ctx.fillText(Math.floor(entity.energy), 0, 40);
					*/

					ctx.rotate(entity.angle);
					ctx.drawImage(playerImage, -playerImage.width/2, -playerImage.height/2);
					break;
				case 'bullet':
					ctx.fillStyle = '#a07';
					ctx.beginPath();
					ctx.arc(-1.5, -1.5, 3, 0, Math.PI*2);
					ctx.fill();
					break;
			}
			ctx.restore();
		}
		ctx.restore();

		if(game.localPlayer.energy > MED_ENERGY){
			ctx.fillStyle = '#0f0';
		}else if(game.localPlayer.energy > LOW_ENERGY){
			ctx.fillStyle = '#ff0';
		}else{
			ctx.fillStyle = '#f00';
		}
		ctx.textAlign = 'left';
		ctx.font = '18pt courier';
		ctx.fillText('Energy: ' + Math.floor(game.localPlayer.energy), 10, canvas.height - 20);

		ctx.font = '10px sans serif';
		ctx.fillStyle = '#fff';
		ctx.fillText('Ping: ' + ping, 10, 10);
		ctx.fillText('Buffered input: ' + inputs.length, 10, 20);

		requestAnimationFrame(render);
	}

	render();
}
