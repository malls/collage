'use strict';

var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();

mongoose.connect(process.env.MONGO);

module.exports = {
  save: function() {

  },
  get: function(id) {
    console.log(id);
  },
  delete: function() {

  }

};