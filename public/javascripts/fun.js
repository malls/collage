Ω().ready(function(){

  var socket = io.connect(document.location.host);
  var room = window.location.pathname.substr(1);

  var everyImageNeedsThese = function(){
    Ω('img')
      .on('click', function(e){
        Ω(e).zup();
      })
      .on('dragstop', function(){
        socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: room});
      })
      .on('dblclick', function(e){
        socket.emit('destroy', {id: this.id, room: room});
        Ω(e).destroy();
      })
      .draggable()
      .drag(function(e){
        var position = e.toElement.style.cssText;
        var id = e.toElement.id;
        socket.emit('send', {position: position, id: id});
    });
  };

  socket.emit('setme', room);
  socket.on('set', function(data){

    if (data){
      if(data.background){
        document.body.style.background = data.background;
        delete data.background;
      }

      $.each(data, function(k,v){
        var values = JSON.parse(v);
        var x = document.createElement("img");
        x.id = k;
        x.src = values.url;
        x.style.cssText = values.position;
        document.getElementById('zone').appendChild(x);   
      });

      if(document.images.length > 0){
        everyImageNeedsThese();
      }
    }

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

  });

  Ω('#imgbutton').click(function(e){
    e.preventDefault();
    var imgValue = document.getElementById('imgInput').value;
    document.getElementById('imgInput').value = "";
    socket.emit('getId', {url: imgValue});
  });

  Ω('#bgbutton').click(function(e){
    e.preventDefault();
    var bgValue = document.getElementById('bgInput').value;
    document.getElementById('bgInput').value = "";
    Ω('body').setBackground('white', bgValue, "center center");
    var bgText = document.body.style.background;
    socket.emit('bg', {room: room, background: bgText});
  });

});