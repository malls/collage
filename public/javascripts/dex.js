Ω().ready(function() {
  'use strict';

  var socket = io.connect(document.location.host);
  
  (function loadIndex () {
    var roomlist = document.getElementById('roomlist');
    socket.emit('ask');
    socket.on('getrooms', function (data) {
      for (var i = 0; i < data.length; i++) {
        var listitem = document.createElement('li');
        var linkitem = document.createElement('a');
        linkitem.href = '/' + data[i];
        listitem.id = data[i];
        data[i] = garden.prettyString(data[i]);
        var text = document.createTextNode(data[i]);
        linkitem.appendChild(text);
        listitem.appendChild(linkitem);
        roomlist.appendChild(listitem);
      }
    });
  })();

  function makeGarden () {
    window.location = document.location.origin + '/' + document.getElementsByTagName('input')[0].value;
  }

  button().click(function (e) {
    e.preventDefault();
    makeGarden();
    return false;
  });

});