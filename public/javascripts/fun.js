$(document).ready(function(){

	var socket = io.connect('http://localhost:3000');
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

});