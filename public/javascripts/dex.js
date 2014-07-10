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
        data[i] = prettyString(data[i]);
        var text = document.createTextNode(data[i]);
        linkitem.appendChild(text);
        listitem.appendChild(linkitem);
        roomlist.appendChild(listitem);
      }
    });
  })();

  function prettyString (str) {
    if (str.indexOf('%20') >= 0) {
      str = str.replace('%20', ' ');
      return prettyString(str);
    } else {
      return str;
    }
  }

  function garden () {
    window.location = document.location.origin + '/' + document.getElementsByTagName('input')[0].value;
  }

  button().click(function (e) {
    e.preventDefault();
    garden();
    return false;
  });

});