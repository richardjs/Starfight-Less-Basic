'use strict';

var PORT = process.env.PORT || 4000;
var NETWORK_FPS = 20;

var express = require('express');
var http = require('http');
var UUID = require('uuid');

var Game = require('./core/game.js');
var Player = require('./core/player.js');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use('/client', express.static('client'));
app.use('/core', express.static('core'));
app.use(express.static('static'));

var game = new Game();
game.start();

var sockets = [];
io.on('connection', function(socket){
	sockets.push(socket);

	socket.id = UUID.v4();
	console.log('socket connection (id: '+socket.id+')');
	socket.emit('setid', socket.id);

	var player = new Player(socket.id);
	game.entities.push(player);

	socket.on('disconnect', function(){
		sockets.splice(sockets.indexOf(socket), 1);
		game.entities.splice(game.entities.indexOf(player), 1);
	});

	socket.on('ping', function(time){
		socket.emit('ping', time);
	});

	socket.on('inputupdate', function(keysDown){
		player.keysDown = keysDown;
	});
});

setInterval(function(){
	for(var i = 0; i < sockets.length; i++){
		sockets[i].emit('stateupdate', game);
	}
}, 1000/NETWORK_FPS);

server.listen(PORT, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('listening at http://%s:%s', host, port);
});
