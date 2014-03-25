var socket = io.connect(document.location.host);

$(document).ready(function(){
	var position;
	var id;
	var url;

	socket.emit('setme', document.location.host);
	// here the location is sent for later room logic

	socket.on('set', function(data){
		$.each(data, function(k,v){
			document.getElementById(k).style.cssText = v;
		});		
	});

  	socket.on('move', function (data) {
    	document.getElementById(data.id).style.cssText = data.position;
    });

	$("img").draggable({
		drag: function (event, position){
			position = this.style.cssText;
			id = this.id;
			url = this.src;
			socket.emit('send', {position: position, id: id, url: url});
		}
	});

	$("img").on('dragstop', function(event, position){
		socket.emit('stopdrag', {position: this.style.cssText, id: this.id, url: this.src, room: document.location.host});
	});

});