var url = require('url'),
    redis = require('redis'),
    db;

if (process.env.MODE !== 'production') {
  db = redis.createClient(6379);
} else {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  db.auth(redisURL.auth.split(":")[1]);
}

module.exports = db;