

$(document).ready(function(){

	var socket = io.connect('http://localhost:3000');
  	socket.on('move', function (data) {
    	document.getElementById(data.id).style.cssText = data.position;
    	// console.log(data);
    	
    	
    });


	$("img").draggable({
		drag: function (event, position){
			var position = this.style.cssText;
			var id = this.id;
			socket.emit('send', {position: position, id: id});

			// console.log(this.src);
			// console.log(this.style.cssText);
		}
		// delay: 100,
		// refreshPositions: true
	});
	

});