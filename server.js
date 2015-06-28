'use strict';

var express = require('express');
var http = require('http');
var UUID = require('uuid');

var Game = require('./core/game.js');
var Player = require('./core/player.js');
var Wall = require('./core/wall.js');
var setTimer = require('./core/timer.js');

var PORT = process.env.PORT || 4000;
var GAME_FPS = 60;
var NETWORK_FPS = 60;
var ARENA_SIZE = 3000;
var RESPAWN_TIME = 1000 * 5;
var GAME_WIN_SCORE = 200;
var GAME_END_TIME = 1000 * 10;

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use('/client', express.static('client'));
app.use('/core', express.static('core'));
app.use(express.static('static'));

// Game initialization
var game = new Game();
setTimer(function(){
	game.update();

	// Check for dead players
	for(var i = 0; i < game.entities.length; i++){
		var entity = game.entities[i];
		if(entity.dead){
			if(!entity.respawning){
				if(entity.lastHitID){
					var killer;
					for(var j = 0; j < game.entities.length; j++){
						if(game.entities[j].id === entity.lastHitID){
							killer = game.entities[j];
						}
					}
					killer.score += 10 + Math.floor(entity.score*.1);
					entity.score = Math.floor(entity.score*.9);

					// Check for winner
					if(killer.score >= GAME_WIN_SCORE){
						game.message = killer.name + ' wins!';
						setTimeout(function(){
							for(var k = 0; k < game.entities.length; k++){
								var entity = game.entities[k];
								entity.reset(
									Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2),
									Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2)
								);
								entity.score = 0;
							}
							game.message = '';
						}, GAME_END_TIME);
					}
				}

				(function(entity){
					setTimeout(function(){
						entity.reset(
							Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2),
							Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2)
						);
					}, RESPAWN_TIME);
				})(entity);
			}
			entity.respawning = true;
		}
	}
}, 1000/GAME_FPS); // TODO hook back in PHYSICS_FPS

game.mapEntities.push(new Wall(-ARENA_SIZE/2, 0, 10, ARENA_SIZE));
game.mapEntities.push(new Wall(ARENA_SIZE/2, 0, 10, ARENA_SIZE));
game.mapEntities.push(new Wall(0, -ARENA_SIZE/2, ARENA_SIZE, 10));
game.mapEntities.push(new Wall(0, ARENA_SIZE/2, ARENA_SIZE, 10));

var sockets = [];
io.on('connection', function(socket){
	sockets.push(socket);

	socket.id = UUID.v4();
	console.log('socket connection (id: '+socket.id+')');
	socket.emit('set id', socket.id);

	var player = new Player(
		game,
		socket.id,
		Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2),
		Math.random() * ARENA_SIZE*.9 - (ARENA_SIZE*.9/2)
	);
	game.entities.push(player);
	socket.player = player;

	socket.on('set name', function(name){
		player.name = name;
	});

	socket.on('disconnect', function(){
		sockets.splice(sockets.indexOf(socket), 1);
		game.entities.splice(game.entities.indexOf(player), 1);
	});

	socket.lastSequenceNumber = -1;
	socket.on('input update', function(state){
		player.keysDown = state.keysDown;
		socket.lastSequenceNumber = state.sequenceNumber;
	});

	socket.on('ping', function(time){
		socket.volatile.emit('ping', time);
	});

});

setTimer(function(){
	// We need to strip off the game attribute on entities
	// It causes recusive serialization problems
	for(var i = 0; i < game.entities.length; i++){
		delete game.entities[i].game;
	}

	for(var i = 0; i < sockets.length; i++){
		game.lastSequenceNumber = sockets[i].lastSequenceNumber;
		sockets[i].emit('world update', game);
	}

	for(var i = 0; i < game.entities.length; i++){
		game.entities[i].game = game;
	}
}, 1000/NETWORK_FPS);

server.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('listening at http://%s:%s', host, port);
});
