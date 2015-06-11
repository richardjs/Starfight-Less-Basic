'use strict';

window.canvas = document.createElement('canvas');
window.ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function render(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var playerImage = document.getElementById('playerImage');
	for(var i = 0; i < game.entities.length; i++){
		var entity = game.entities[i];
		ctx.save();
		ctx.translate(entity.x, entity.y );
		ctx.rotate(entity.angle);
		ctx.drawImage(playerImage, -playerImage.width/2, -playerImage.height/2);
		ctx.restore();
	}

	ctx.fillStyle = '#fff';
	ctx.fillText('Ping: ' + latency*2, 10, 10);
	ctx.fillText('Buffered input: ' + inputs.length, 10, 20);

	requestAnimationFrame(render);
}

window.addEventListener('load', function(){
	render();
});
