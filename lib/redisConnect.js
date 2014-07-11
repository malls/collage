var url = require('url'),
    redis = require('redis'),
    dotenv = require('dotenv'),
    db;

dotenv.load();

if (process.env.MODE === 'development') {
  db = redis.createClient(6379);
} else {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  db.auth(redisURL.auth.split(":")[1]);
}

module.exports = db;