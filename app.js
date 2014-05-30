var SocketIOFileUploadServer = require("socketio-file-upload"),
  index = require('./controllers/index'),
  room = require('./controllers/room'),
  express = require('express'),
  crypto = require('crypto'),
  dotenv = require('dotenv'),
  redis = require('redis'),
  http = require('http'),
  path = require('path'),
  knox = require('knox'),
  url = require('url'),
  app = express(),
  port = process.env.PORT || 3000,
  io = require('socket.io').listen(app.listen(port));

dotenv.load();

// all environments
app
  .set('port', process.env.PORT || 3000)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'jade')
  .use(express.logger('dev'))
  .use(express.json())
  .use(express.urlencoded())
  .use(express.methodOverride())
  .use(express.multipart({ defer: true }))
  .use(app.router)
  .use(SocketIOFileUploadServer.router)
  .use(express.static(path.join(__dirname, 'public')))
  .all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

if (process.env.MODE === 'development') {
  var db = redis.createClient(6379);
} else {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  var db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  db.auth(redisURL.auth.split(":")[1]);
}

db.select(0);
db.set("sdf", "redis connected", function () {
  db.get("sdf", function (err, response) {
    console.log(response);
  });
  db.del("sdf");
});
db.on("error", function (err) {
  console.log("Error: " + err);
});

var s3 = knox.createClient({
    key: process.env.AS3_ACCESS_KEY,
    secret: process.env.AS3_SECRET_ACCESS_KEY,
    bucket: process.env.AS3_BUCKET,
});

//routes - move elsewhere
app
  .get('/', index.show)
  .get('/:room', room.load)
  .post('/file-upload', function (req, res) {
    var headers = {
      'x-amz-acl': 'public-read',
      'Access-Control-Allow-Origin': '*'
    };
    req.form.on('part', function (part) {
      headers['Content-Length'] = part.byteCount;
      s3.putStream(part, part.filename, headers, function (err, s3res) {
        if (err) {
          return res.send(500, err);
        }
        var imgid = "A" + crypto.randomBytes(5).toString('hex');
        asocket.emit('newimage', {url: s3res.client._httpMessage.url, id: imgid});
      });
  });
});

//for post requests
var asocket;

//socket stuff
io.sockets.on('connection', function (socket) {

  asocket = socket;

  // upload stuff
  var uploader = new SocketIOFileUploadServer();
  uploader.listen(socket);

  uploader.dir = "./public/images";

  uploader.on('saved', function (event) {
    var imgid = "U" + crypto.randomBytes(5).toString('hex');
    socket.emit('newimage', {url: event.file.pathName.substr(6), id: imgid});
  });

  uploader.on('error', function (event) {
    console.log("Error from uploader", event);
  });

  //index
  socket.on('ask', function () {
    db.keys('*', function (err, reply) {
      socket.emit('getrooms', reply);
    });
  });

  //rooms
	socket.on('setme', function (data) {
		db.hgetall(data, function (err, reply) {
			socket.emit('set', reply);
		});
	});

  socket.on('send', function (data) {
    socket.broadcast.emit('move', data);
  });

  socket.on('stopdrag', function (data) {
    db.hset(data.room, data.id, JSON.stringify(data));
  });

  socket.on('disconnect', function () {
    console.log('a user disconnected. database saved');
    db.bgsave();
  });

  socket.on('getId', function (data) {
    var imgid = "L" + crypto.randomBytes(5).toString('hex');
    dataString = JSON.stringify(data);
    socket.broadcast.emit('newimage', {url: data.url, id: imgid});
    socket.emit('newimage', {url: data.url, id: imgid});
  });

  socket.on('bg', function (data) {
    console.log(data);
    socket.broadcast.emit('set', {background: data.background});
    db.hset(data.room, 'background', data.background);
  });

  socket.on('destroy', function (data) {
    db.hdel(data.room, data.id);
    socket.broadcast.emit('remove', {id: data.id});
  });

});