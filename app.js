var express = require('express.io');
var redis = require('redis');
var index = require('./controllers/index');
var room = require('./controllers/room');
var http = require('http');
var path = require('path');
var knox = require('knox');
var crypto = require('crypto');
var url = require('url');
var app = express();
var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port));

//development
// var dotenv = require('dotenv');
// dotenv.load();
// var db = redis.createClient(6379);
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

//production
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
db.auth(redisURL.auth.split(":")[1]);

var s3 = knox.createClient({
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
app.use(express.multipart({ defer: true }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

db.select(0);
db.set("testkey", "redis connected", function(){
  db.get("testkey", function(err, response){
    console.log(response);
  });  db.del("testkey");
});
db.on("error", function(err){
	console.log("Error: " + err);
});

app.get('/', index.show);
app.get('/stylesheets/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.get('/javascripts/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.get('/images/*', function(req,res){
	res.sendfile("public" + req.url);
});
app.use(express.multipart({ defer: true }));
app.get('/:room', room.load);
  app.post('/file-upload', function (req, res) {
    var headers = {
      'x-amz-acl': 'public-read'
    };
    req.form.on('part', function (part) {
      headers['Content-Length'] = part.byteCount;
      s3.putStream(part, part.filename, headers, function (err, s3res) {
        if (err) {
          return res.send(500, err);
        }
        var imgid = crypto.randomBytes(5).toString('hex');
        asocket.emit('newimage', {url: s3res.client._httpMessage.url, id: imgid});
      });
    });
  });

var asocket;

io.sockets.on('connection', function (socket) {

  asocket = socket;

  socket.on('ask', function(){
    db.keys('*', function(err, reply){
      socket.emit('getrooms', reply);
    });
  });

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
