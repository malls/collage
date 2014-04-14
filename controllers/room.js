// var redis = require('redis');
// // var db = redis.createClient();


// var redisURL = url.parse(process.env.REDISCLOUD_URL);
// var db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
// db.auth(redisURL.auth.split(":")[1]);

module.exports = {
	load : function(req, res) {
		// db.hgetall(req.params.room, function(err, reply) {
			res.render('room');
		};
	
};