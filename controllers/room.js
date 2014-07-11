var db = require('../lib/redisConnect');

module.exports = {
	load: function(req, res) {
		db.hgetall(req.params.room, function(err, reply) {
      console.log(reply);
			res.render('room', {title: req.params.room});
		});
  }
};