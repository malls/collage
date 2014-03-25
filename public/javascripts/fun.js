var socket = io.connect(document.location.host);

$(document).ready(function(){

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
			var position = this.style.cssText;
			var id = this.id;
			var url = this.src;
			socket.emit('send', {position: position, id: id, url: url, room: document.location.host});
			//image url here for later functionality
		}
	});

});