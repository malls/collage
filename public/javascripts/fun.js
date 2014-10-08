Ω().ready(function () {
  
  'use strict';

  var socket = io.connect(document.location.host);
  var room = window.location.pathname.substr(1);
 
  function everyImageNeedsThese(element) {
    Ω(element)
      .on('click', function (e) {
        Ω(e).zup();
        if (e.shiftKey) {
          socket.emit('destroy', {id: e.currentTarget.id, room: room});
          Ω(e).destroy();
        } else {
          socket.emit('savePosition', {position: this.style.cssText, id: this.id, url: this.src, room: room});
        }
      })
      .draggable()
      .on('dragend', function () {
        socket.emit('savePosition', {position: this.style.cssText, id: this.id, url: this.src, room: room});
      })
      .drag(function (e) {
        var position = e.currentTarget.style.cssText;
        var id = e.currentTarget.id;
        socket.emit('send', {position: position, id: id});
    });
  }

  everyImageNeedsThese('img');

  var siofu = new SocketIOFileUpload(socket);
    siofu.listenOnDrop(document.body);
    siofu.addEventListener('complete', function (event) {
        console.log(event.success);
  });

  socket.on('move', function (data) {
    if (!document.getElementById(data.id)) {
      var newImg = document.createElement('img');
      newImg.src = data.url;
      newImg.id = data.id;
      document.getElementById('zone').appendChild(newImg);
    }
    document.getElementById(data.id).style.cssText = data.position;
  });

  socket.on('newimage', function (data) {
    var newImg = document.createElement('img');
    newImg.src = data.url;
    newImg.id = data.id;
    console.log(newImg);
    document.getElementById('zone').appendChild(newImg);
    everyImageNeedsThese('#' + newImg.id);
  });

  socket.on('set', function(data){
    document.style.background = data.background;
  });

  socket.on('remove', function (data) {
    Ω('#' + data.id).destroy();
  });

  Ω('#imgbutton').click(function (e) {
    e.preventDefault();
    var imgValue = document.getElementById('imgInput').value;
    document.getElementById('imgInput').value = '';
    socket.emit('getId', {room: room, url: imgValue});
  });

  Ω('#bgbutton').click(function (e) {
    e.preventDefault();
    var bgValue = document.getElementById('bgInput').value;
    document.getElementById('bgInput').value = '';
    body().setBackground('white', bgValue, 'center center');
    var bgText = document.body.style.background;
    socket.emit('bg', {room: room, background: bgText});
  });

});