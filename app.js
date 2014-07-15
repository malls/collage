var SocketIOFileUploadServer = require('socketio-file-upload'),
  port = process.env.PORT || 3000,
  db = require('./app/rediser'),
  garden = require('./lib/garden'),
  express = require('express'),
  dotenv = require('dotenv'),
  path = require('path'),
  knox = require('knox'),
  app = express(),
  index = require('./controllers/index'),
  room = require('./controllers/room'),
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
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
        var imgid = garden.id('A');
        asocket.emit('newimage', {url: s3res.client._httpMessage.url, id: imgid});
      });
  });
});

var asocket;

io.sockets.on('connection', function (socket) {
  'use strict';
  // upload stuff

  asocket = socket;

  var uploader = new SocketIOFileUploadServer();
  uploader.listen(socket);

  uploader.dir = './public/images';

  uploader.on('saved', function (event) {
    var imgid = garden.id('U');
    socket.emit('newimage', {url: event.file.pathName.substr(6), id: imgid});
  });

  uploader.on('error', function (event) {
    console.log('Error from uploader', event);
  });

  //rooms
  socket.on('send', function (data) {
    socket.broadcast.emit('move', data);
  });

  socket.on('stopdrag', function (data) {
    db.hset(data.room, data.id, JSON.stringify(data));
  });

  socket.on('getId', function (data) {
    var imgid = garden.id('L');
    socket.broadcast.emit('newimage', {url: data.url, id: imgid});
    socket.emit('newimage', {url: data.url, id: imgid});
  });

  socket.on('bg', function (data) {
    socket.broadcast.emit('set', {background: data.background});
    db.hset(data.room, 'background', data.background);
  });

  socket.on('destroy', function (data) {
    db.hdel(data.room, data.id);
    socket.broadcast.emit('remove', {id: data.id});
  });

  // socket.on('disconnect', function () {
  //   db.bgsave();
  //   console.log('A user disconnected. Database saved');
  // });

});