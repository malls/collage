'use strict';

var db = require('../app/rediser'),
  aws = require('aws-sdk'),
  garden = require('../lib/garden'),
  dotenv = require('dotenv');

dotenv.load();

function load(req, res) {
  var roomKey = garden.uglyString(req.params.room);
  db.hgetall(roomKey, function(err, reply) {
    var background;
    if (reply) {
      if (reply.background) {
        background = reply.background;
        delete reply.background;
      }
      for (var item in reply) {
        reply[item] = JSON.parse(reply[item]);
      }
    }
    res.render('room', {
      title: req.params.room,
      data: reply,
      background: background
    });
  });
}

function sign(req, res) {
  aws.config.update({
    accessKeyId: process.env.AS3_ACCESS_KEY,
    secretAccessKey: process.env.AS3_SECRET_ACCESS_KEY
  });

  var s3 = new aws.S3();
  var options = {
    Bucket: process.env.AS3_BUCKET,
    Key: req.query.file_name,
    Expires: 60,
    ContentType: req.query.file_type,
    ACL: 'public-read'
  };
  console.log(options)
  s3.getSignedUrl('putObject', options, function(err, data) {
    if (err) return res.send('Error with S3');
    res.json({
      signed_request: data,
      url: 'https://s3.amazonaws.com/' + process.env.AS3_BUCKET + '/' + req.query.file_name
    });
  });
}

module.exports = {
  load: load,
  sign: sign
};