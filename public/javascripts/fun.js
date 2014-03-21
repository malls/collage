$(document).ready(function(){

	var socket = io.connect(document.location.host);
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

	var filedrop = function(){

	};

	// make this work
	// $("body").on("drop", function(e){
	// 	e.preventDefault();
	// 	var files = e.target.files || e.dataTransfer.files;
	// 	console.log(files);
	// })





});