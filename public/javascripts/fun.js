var socket = io.connect(document.location.host);

$(document).ready(function(){

	document.title = socket.socket.options.document.location.pathname;

	socket.emit('setme', document.location.host);
	// here the location is sent for additional room logic to be used later

	socket.on('set', function(data, pagetitle){
		$.each(data, function(k,v){
			document.getElementById(k).style.cssText = v;
		});

	});

  	socket.on('move', function (data) {
    	document.getElementById(data.id).style.cssText = data.position;
    });

	$("img").draggable({
		drag: function (event, position){
			var position = this.style.cssText;
			var id = this.id;
			socket.emit('send', {position: position, id: id});
		}
	});

	$("img").on('dragstop', function(event, position){
		socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: document.location.host});
	});

});