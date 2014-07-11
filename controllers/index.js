var db = require('../lib/redisConnect'),
    garden = require('../lib/garden');

module.exports = {
  show: function (req, res) {
    db.keys('*', function (err, reply) {
      var data = [];
      for (var i = 0; i < reply.length; i++) {
        data[i] = garden.prettyString(reply[i]);
      };
      res.render('index', { title: 'Garden Party Club', data: data });
    });
  }
};