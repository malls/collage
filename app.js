'use strict';

const dotenv = require('dotenv').config();

var port = process.env.PORT || 3000,
    db = require('./app/rediser'),
    garden = require('./lib/garden'),
    express = require('express'),
    path = require('path'),
    app = express(),
    index = require('./controllers/index'),
    room = require('./controllers/room'),
    io = require('socket.io').listen(app.listen(port));

// all environments
app
    .set('port', port)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')
    .use(express.logger('dev'))
    .use(express.json())
    .use(express.urlencoded())
    .use(express.methodOverride())
    .use(express.multipart({
        defer: true
    }))
    .use(app.router)
    .use(express.static(path.join(__dirname, 'public'), {
        maxAge: 42069
    }))
    .all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
    });

//routes - move elsewhere
app
    .get('/', index.show)
    .get('/sign', room.sign)
    .get('/:room', room.load)
    .get('/robots.txt', function(req, res) {
        res.type('text/plain');
        res.send("User-agent: *\nAllow: /");
    })

io.sockets.on('connection', function(socket) {
    //rooms
    socket.on('send', function(data) {
        socket.broadcast.emit('move', data);
    });

    socket.on('savePosition', function(data) {
        db.hset(data.room, data.id, JSON.stringify(data));
    });

    socket.on('getId', function(data) {
        var imgid = garden.id('L');
        socket.broadcast.emit('newimage', {
            url: data.url,
            id: imgid
        });
        socket.emit('newimage', {
            url: data.url,
            id: imgid
        });
    });

    socket.on('bg', function(data) {
        socket.broadcast.emit('set', {
            background: data.background
        });
        db.hset(data.room, 'background', data.background);
    });

    socket.on('destroy', function(data) {
        db.hdel(data.room, data.id);
        socket.broadcast.emit('remove', {
            id: data.id
        });
    });

});

console.log('now listening on port', port);