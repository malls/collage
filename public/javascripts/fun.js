var socket = io.connect(document.location.host);

$(function(){
	
	document.title = socket.socket.options.document.location.pathname.substr(1);

  var room = window.location.pathname.substr(1);

	socket.emit('setme', room);

	socket.on('set', function(data){

		if (data){
			if(data.background){
				document.getElementsByTagName('body')[0].style.background = data.background;
				delete data.background;
			}

			$.each(data, function(k,v){
				var values = JSON.parse(v);
				var x = document.createElement("img");
				x.id = k;
				x.src = values.url;
				x.style.cssText = values.position;
        x.crossOrigin = "Anonymous";
				document.getElementById('zone').appendChild(x);		
			});
		}

		$("img").draggable({
			drag: function (event){
				var position = this.style.cssText;
				var id = this.id;
				socket.emit('send', {position: position, id: id});
			}
		}).css("position", "absolute");

    socket.on('move', function (data) {
      console.log(data);
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

      $("img").draggable({
				drag: function (event){
					var position = this.style.cssText;
					var id = this.id;
					var url = this.src;
					socket.emit('send', {position: position, id: id, url: url});
				}
			}).css("position", "absolute");
    });

		$(document).on('dragstop', 'img', function(event){
			socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: room});
		});

    $(document).on('dblclick', 'img', function(event){
      socket.emit('destroy', {id: this.id, room: room});
    });

    socket.on('remove', function(data){
      Ω("#" + data.id).destroy();
    });

    $('#bgbutton').click(function(e){
      e.preventDefault();
      var bgValue = document.getElementById('bgInput').value;
      document.getElementById('bgInput').value = "";
      Ω('body').setBackground(bgValue, "center center");
      var bgText = document.getElementsByTagName('body')[0].style.background;
      socket.emit('bg', {room: room, background: bgText});
    });

    $('#imgbutton').click(function(e){
      e.preventDefault();
      var imgValue = document.getElementById('imgInput').value;
      document.getElementById('imgInput').value = "";
      socket.emit('getId', {url: imgValue});
    });

	});

  var upload = function(){
    console.log($(this));
    $.ajax({
      type: 'POST',
      url: '/file-upload',
      data: 'xxx'
    });
  }


});