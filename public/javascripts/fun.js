var socket = io.connect(document.location.host);


$(function(){
	
	document.title = socket.socket.options.document.location.pathname.substr(1);

	socket.emit('setme', window.location.pathname.substr(1));

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
				document.getElementById('zone').appendChild(x);		
			});
		};

		$("img").draggable({
			drag: function (event, position){
				var position = this.style.cssText;
				var id = this.id;
				socket.emit('send', {position: position, id: id});
			}
		}).css("position", "absolute");

  	socket.on('move', function (data) {
    	document.getElementById(data.id).style.cssText = data.position;
    });

  	socket.on('newimage', function(data){
  		console.log(data,"got anything");
  		var newImg = document.createElement('img');
  		newImg.src = data.url;
  		newImg.id = data.id;
  		document.getElementById('zone').appendChild(newImg);

	  	$("img").draggable({
				drag: function (event, position){
					var position = this.style.cssText;
					var id = this.id;
					socket.emit('send', {position: position, id: id});
				}
			}).css("position", "absolute");

			$("img").on('dragstop', function(event){
				socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: window.location.pathname.substr(1)});
			});


  	});

		$("img").on('dragstop', function(event){
			socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: window.location.pathname.substr(1)});
		});


	});
});