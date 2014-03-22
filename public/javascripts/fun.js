$(document).ready(function(){

	var socket = io.connect(document.location.host);

	socket.emit('setme');//make this work

	socket.on('set', function(data){
		console.log(data);

		$.each(data, function(k,v){
			document.getElementById(v.id).style.cssText = v.position;
		});
		
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