var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
var redis = require('redis');
var db = redis.createClient();
var app = express();
var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port));

dotenv.load();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.favicon('fav.ico'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

db.on("error", function(err){
	console.log("Error: " + err);
});

app.get('/', routes.index);
app.get('/flowers', function(req,res){res.render('room', { title: 'Flower Garden' })}); 

// app.get('/file-upload', UPLOAD LOGIC HERE);

var rooms = {};

io.sockets.on('connection', function (socket) {
	// var route = socket.socket.options.host; 
	// if (typeof rooms[route] === 'undefined') {
	// 	rooms[route] = [];
	// }
	// rooms[route].push(socket);
	// socket.room = route;
	// console.log(route);

	socket.on('setme', function(data){
		db.hgetall(data, function(err, reply){
			socket.emit('set', reply);
		});
		
	});

	function sendData(sender, sockets, data) {
		for (var i in sockets) {
			if (sockets[i] !== sender)
				sockets[i].emit('move', data);
		}
	};

    socket.on('send', function (data) {
    	sendData(socket, rooms[socket.room], data);
  		db.hset(data.room, data.id, data.position);
    });

    socket.on('disconnect', function(){
    	db.bgsave();
    });

});
