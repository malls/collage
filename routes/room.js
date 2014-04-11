var redis = require('redis');
var db = redis.createClient();

module.exports = {
	load : function(req, res) {
    console.log(req.url);
		db.hgetall(req.url, function(err, reply) {
			// console.log("this is our data:", reply);
			res.render('room', {
				imgs : reply
			});
		});
	}
};