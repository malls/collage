var db = require('../app/rediser');

module.exports = {
	load: function (req, res) {
		db.hgetall(req.params.room, function (err, reply) {
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
      res.render('room', {title: req.params.room, data: reply, background: background});
		});
  }
};