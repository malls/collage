var redis = require('redis');
var db = redis.createClient();

module.exports = {
	load : function(req, res) {
		db.hgetall(req.url.substr(1), function(err, reply) {
			// console.log("this is our data:", reply);
			res.render('room', {
				imgs : reply
			});
		});
	}
};