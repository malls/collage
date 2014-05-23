var socket = io.connect(document.location.host);


// to do: decide if background changes are too annoying

// var changeBg = function (){
//   socket.emit('setme', this.id);
//   socket.on('set', function(data){
//     document.body.style.background = data.background;
//   });
// };

// var clearBg = function(){
//   document.body.style.background = "";
// };  

var loadIndex = function(){
  var roomlist = document.getElementById('roomlist');
  socket.emit('ask');
  socket.on('getrooms', function(data){
    for(var i = 0; i < data.length; i++){
      var listitem = document.createElement('li');
      var linkitem = document.createElement('a');
      linkitem.href = "/" + data[i];
      listitem.id = data[i];
      var text = document.createTextNode(data[i]);
      linkitem.appendChild(text);
      listitem.appendChild(linkitem);
      roomlist.appendChild(listitem);
      // listitem.onmouseover = changeBg;
      // listitem.onmouseleave = clearBg;
    }
  });
};

var garden = function(e){
  e.preventDefault();
  window.location = document.location.origin + "/" + document.getElementsByTagName('input')[0].value;
  return false;
};