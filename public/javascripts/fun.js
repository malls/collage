var socket = io.connect(document.location.host);

$(function(){
	document.title = socket.socket.options.document.location.pathname;

	socket.emit('setme', window.location.pathname.substr(1));
	// console.log(window.location.pathname.substr(1));

	socket.on('set', function(data){
				
		$.each(data, function(k,v){
			var values = JSON.parse(v);
			console.log(values);
			var x = document.createElement("img");
			x.id = k;
			x.src = values.url;
			x.style.cssText = values.position;
			document.getElementById('zone').appendChild(x);		
		});
		
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


		$("img").on('dragstop', function(event, position){
			socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: window.location.pathname.substr(1)});
		});

	});
});
