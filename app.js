var express = require('express.io');
var redis = require('redis');
var db = redis.createClient();
var routes = require('./routes');
var room = require('./routes/room');
var http = require('http');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000
var io = require('socket.io').listen(app.listen(port));

var dotenv = require('dotenv');
dotenv.load();

var AWS = require('aws-sdk');

var AWS_ACCESS_KEY_ID = process.env.AS3_ACCESS_KEY;
var AWS_SECRET_ACCESS_KEY = process.env.AS3_SECRET_ACCESS_KEY;



// s3.getBucketAcl(params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   else     console.log(data);
// });


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
