var db = require('../app/rediser');

module.exports = {
	load: function (req, res) {
		db.hgetall(req.params.room, function (err, reply) {
      var background = reply.background;
      delete reply.background;
      for (item in reply) {
        reply[item] = JSON.parse(reply[item]);
      }
			res.render('room', {title: req.params.room, data: reply, background: background});
		});
  }
};