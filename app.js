var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
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

// if ('production'){
// 	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
// 	var db = require("redis").createClient(rtg.port, rtg.hostname);
// 	db.auth(rtg.auth.split(":")[1]);
// } else {
	var redis = require('redis');
	var db = redis.createClient();
// }

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
			// console.log(reply);
			socket.emit('set', reply);
		});
	});

    socket.on('send', function (data) {
    	socket.broadcast.emit('move', data)
    });

    socket.on('stopdrag', function(data){
    	db.hset(data.room, data.id, data.position);
    	console.log(data);
    });

    socket.on('disconnect', function(){
    	db.bgsave();
    });

});
