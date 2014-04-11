var redis = require('redis');
var db = redis.createClient();

exports.index = function(req, res){
  res.render('index', { title: 'Collage Garden' });
};