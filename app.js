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
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.favicon(__dirname + '/public/images/fav.ico'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', user.list);
// app.get('/:room', routes.room); //use this tho
// app.get('/file-upload', UPLAOD LOGIC HERE);

var rooms = {};
var positions = {};

function sendData(sender, sockets, data) {
	for (var i in sockets) {
		if (sockets[i] !== sender)
			sockets[i].emit('move', data);
	}
};

io.sockets.on('connection', function (socket) {
	var route = socket.route; // get url route
	if (typeof rooms[route] === 'undefined') {
		rooms[route] = [];
	}
	rooms[route].push(socket);
	socket.room = route;
	socket.on('setme', function(){
		socket.emit('set', positions);
		console.log("setme");
	});

    socket.on('send', function (data) {
    	sendData(socket, rooms[socket.room], data);
    	positions[data.id] = data;
    	console.log(positions);
    });
});
