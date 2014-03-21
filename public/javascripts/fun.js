$(document).ready(function(){

	var socket = io.connect(document.location.host);

	socket.emit('setme');//make this work

	socket.on('set', function(data){
		console.log(data);

		for(x in data){
			document.getElementById(x.id).style.cssText = x.position;
			console.log(x);
		}
	});//make this work

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