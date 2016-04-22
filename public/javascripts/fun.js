Ω().ready(function() {

  'use strict';

  var socket = io(document.location.host);
  var room = window.location.pathname.substr(1);

  Ω('#upload').on('change',upload);

  function upload() {
    var file = Ω('#upload').obj.files[0];
    if (!file) {
      console.error('No file uploaded!');
    } else {
      Uploader.sign_request(file, function(response) {
        Uploader.upload(file, response.signed_request, response.url, function() {
          socket.emit('getId', {
            room: room,
            url: 'https://frails.s3.amazonaws.com/' + file.name
          });
        });
      });
    }
  }

  var Uploader = {};

  Uploader.upload = function(file, signed_request, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read')
    xhr.onload = function() {
      if (xhr.status === 200) {
        done();
      }
    }
    xhr.send(file);
  };

  Uploader.sign_request = function(file, done) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sign?file_name=' + file.name + '&file_type=' + file.type);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        done(response);
      }
    }
    xhr.send();
  };

  function everyImageNeedsThese(element) {
    if (!Ω('img').obj) return;
    Ω(element)
      .on('click', function(e) {
        Ω(e).zup();
        if (e.shiftKey) {
          socket.emit('destroy', {
            id: e.currentTarget.id,
            room: room
          });
          Ω(e).destroy();
        } else {
          socket.emit('savePosition', {
            position: this.style.cssText,
            id: this.id,
            url: this.src,
            room: room
          });
        }
      })
      .draggable()
      .on('dragend', function() {
        socket.emit('savePosition', {
          position: this.style.cssText,
          id: this.id,
          url: this.src,
          room: room
        });
      })
      .drag(function(e) {
        var position = e.currentTarget.style.cssText;
        var id = e.currentTarget.id;
        socket.emit('send', {
          position: position,
          id: id
        });
      });
  }

  everyImageNeedsThese('img');

  socket.on('move', function(data) {
    if (!document.getElementById(data.id)) {
      var newImg = document.createElement('img');
      newImg.src = data.url;
      newImg.id = data.id;
      document.getElementById('zone').appendChild(newImg);
    }
    document.getElementById(data.id).style.cssText = data.position;
  });

  socket.on('newimage', function(data) {
    var newImg = document.createElement('img');
    newImg.src = data.url;
    newImg.id = data.id;
    console.log(newImg);
    Ω('#zone').obj.appendChild(newImg);
    everyImageNeedsThese('#' + newImg.id);
  });

  socket.on('set', function(data) {
    document.style.background = data.background;
  });

  socket.on('remove', function(data) {
    Ω('#' + data.id).destroy();
  });

  Ω('#imgbutton').click(function(e) {
    e.preventDefault();
    var imgValue = document.getElementById('imgInput').value;
    document.getElementById('imgInput').value = '';
    socket.emit('getId', {
      room: room,
      url: imgValue
    });
  });

  Ω('#bgbutton').click(function(e) {
    e.preventDefault();
    var bgValue = document.getElementById('bgInput').value;
    document.getElementById('bgInput').value = '';
    body().setBackground('white', bgValue, 'center center');
    var bgText = document.body.style.background;
    socket.emit('bg', {
      room: room,
      background: bgText
    });
  });

});