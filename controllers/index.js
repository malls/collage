var db = require('../app/rediser'),
    garden = require('../lib/garden');

function show(req, res) {
      db.keys('*', function (err, reply) {
      var data = [];
      for (var i = 0; i < reply.length; i++) {
        data[i] = garden.prettyString(reply[i]);
      };
      res.render('index', { title: 'Garden Party Club', data: data });
    });
} 

module.exports = {
  show: show
};