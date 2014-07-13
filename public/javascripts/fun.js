Ω().ready(function () {
  
  var socket = io.connect(document.location.host);
  var room = window.location.pathname.substr(1);
  var images = document.getElementsByTagName('img')
  
  function everyImageNeedsThese() {
    Ω('img')
      .on('click', function (e) {
        Ω(e).zup();
        if (e.shiftKey) {
          socket.emit('destroy', {id: e.currentTarget.id, room: room});
          Ω(e).destroy();
        }
      })
      .draggable()
      .on('dragend', function () {
        socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: room});
      })
      .drag(function (e) {
        var position = e.currentTarget.style.cssText;
        var id = e.currentTarget.id;
        socket.emit('send', {position: position, id: id});
    });
  }

  everyImageNeedsThese()

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
    document.getElementById('zone').appendChild(newImg);
    everyImageNeedsThese('#' + newImg.id);
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