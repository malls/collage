Ω().ready(function() {
  'use strict';

  function makeGarden () {
    window.location = document.location.origin + '/' + document.getElementsByTagName('input')[0].value;
  }

  button().click(function (e) {
    e.preventDefault();
    makeGarden();
    return false;
  });

});