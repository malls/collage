var express = require('express.io');
var redis = require('redis');
var db = redis.createClient(6379);
var routes = require('./routes');
var room = require('./routes/room');
var http = require('http');
var path = require('path');
var knox = require('knox');
var app = express();
var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port));

var dotenv = require('dotenv');
dotenv.load();

var client = knox.createClient({
    key: process.env.AS3_ACCESS_KEY
  , secret: process.env.AS3_SECRET_ACCESS_KEY
  , bucket: process.env.AS3_BUCKET
});

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

//uncomment below for heroku deployment
// if (process.env.REDISTOGO_URL){
// 	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
// 	var db = require("redis").createClient(rtg.port, rtg.hostname);
// 	db.auth(rtg.auth.split(":")[1]);
// } else {
// }

db.select(0);
db.keys("*", function(x,y){console.log("none:",y)});
db.set("testkey", "redis connection works", function(){
  db.get("testkey", function(err, response){
    console.log(response);
  });
  db.del("testkey");
});

db.on("error", function(err){
	console.log("Error: " + err);
});

app.get('/', routes.index);
app.get('/stylesheets/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.get('/javascripts/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.get('/images/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.get('/*', room.load);

// app.get('/file-upload', UPLOAD LOGIC HERE);

io.sockets.on('connection', function (socket) {

  socket.on('ask', function(){
    db.keys('*', function(err, reply){
      socket.emit('getrooms', reply);
    });
  });

	// var route = socket.socket.options.host; 
	// if (typeof rooms[route] === 'undefined') {
	// 	rooms[route] = [];
	// }
	// rooms[route].push(socket);
	// socket.room = route;

	socket.on('setme', function(data){
		db.hgetall(data, function(err, reply){
			socket.emit('set', reply);
		});
	});

  socket.on('send', function (data) {
  	socket.broadcast.emit('move', data)
  });

  socket.on('stopdrag', function(data){
  	db.hset(data.room, data.id, JSON.stringify(data));
  });

  socket.on('disconnect', function(){
  	db.bgsave();
  });

});
