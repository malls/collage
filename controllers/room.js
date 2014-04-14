var redis = require('redis');
var db = redis.createClient();

module.exports = {
	load : function(req, res) {
		db.hgetall(req.params.room, function(err, reply) {
			res.render('room', {
				imgs : reply
			});
		});
	}
};