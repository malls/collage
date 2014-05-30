Ω().ready(function(){
  "use strict";
  
  var socket = io.connect(document.location.host);
  var room = window.location.pathname.substr(1);
  var everyImageNeedsThese = function(){
    img()
      .on('click', function(e){
        Ω(e).zup();
        if(e.shiftKey){
          socket.emit('destroy', {id: this.id, room: room});
          Ω(e).destroy();
        }
      })
      .draggable()
      .on('dragend', function(){
        socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: room});
      })
      .drag(function(e){
        // console.log(e.currentTarget.style.cssText,"css");
        var position = e.currentTarget.style.cssText;
        var id = e.currentTarget.id;
        socket.emit('send', {position: position, id: id});
    });
  };

  var siofu = new SocketIOFileUpload(socket);

  siofu.listenOnDrop(document.body);

  siofu.addEventListener("complete", function(event){
      console.log(event.success);
  });

  socket.emit('setme', room);

  socket.on('set', function(data){
    if (data){
      if(data.background){
        document.body.style.background = data.background;
        delete data.background;
      }
      Object.keys(data).forEach(function(key){
        var values = JSON.parse(data[key]);
        var img = document.createElement("img");
        img.id = key;
        img.src = values.url;
        img.style.cssText = values.position;
        Ω('#zone').append(img);  
      });
      if(document.images.length){
        everyImageNeedsThese();
      }
    }
  });

  socket.on('move', function (data) {
    var newImg = document.createElement('img');
    newImg.src = data.url;
    newImg.id = data.id;
    if(!document.getElementById(data.id)){
      document.getElementById('zone').appendChild(newImg);
    }
    document.getElementById(data.id).style.cssText = data.position;
  });

  socket.on('newimage', function(data){
    var newImg = document.createElement('img');
    newImg.src = data.url;
    newImg.id = data.id;
    document.getElementById('zone').appendChild(newImg);
    everyImageNeedsThese();
  });

  socket.on('remove', function(data){
    Ω("#" + data.id).destroy();
  });

  Ω('#imgbutton').click(function(e){
    e.preventDefault();
    var imgValue = document.getElementById('imgInput').value;
    document.getElementById('imgInput').value = "";
    socket.emit('getId', {room: room, url: imgValue});
  });

  Ω('#bgbutton').click(function(e){
    e.preventDefault();
    var bgValue = document.getElementById('bgInput').value;
    document.getElementById('bgInput').value = "";
    body().setBackground('white', bgValue, "center center");
    var bgText = document.body.style.background;
    socket.emit('bg', {room: room, background: bgText});
  });

});