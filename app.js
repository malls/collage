'use strict';

require('dotenv').config();

const port = process.env.PORT || 3000,
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
    .set('view engine', 'pug')
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
    .get('/data', index.getRedisData)
    .get('/:room', room.load)
    .get('/robots.txt', function(req, res) {
        res.type('text/plain');
        res.send('User-agent: *\nAllow: /');
    })

io.sockets.on('connection', function(socket) {

    socket.on('joinRoom', function(data) {
        socket.join(data.room);
    });

    socket.on('send', function(data) {
        socket.broadcast.to(data.room).emit('move', data);
    });

    socket.on('savePosition', function(data) {
        db.hSet(data.room, data.id, JSON.stringify(data));
    });

    socket.on('getId', function(data) {
        var imgid = garden.id('L');
        io.sockets.in(data.room).emit('newimage', {
            url: data.url,
            id: imgid
        });
    });

    socket.on('bg', function(data) {
        socket.broadcast.to(data.room).emit('setBackground', {
            background: data.background
        });
        db.hSet(data.room, 'background', data.background);
    });

    socket.on('destroy', function(data) {
        socket.broadcast.to(data.room).emit('remove', {
            id: data.id
        });
        db.hDel(data.room, data.id);
    });

});

console.log('now listening on port', port);
