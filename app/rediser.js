var url = require('url'),
    redis = require('redis'),
    dotenv = require('dotenv'),
    db;

dotenv.load();

//check if it's development, then use redis db if not
if (process.env.MODE === 'development') {
  db = redis.createClient(6379);
} else {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  db = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  db.auth(redisURL.auth.split(":")[1]);
}

db.select(process.env.REDISDB || 0);

//test db connection, output something in terminal
db.set("tyler's garden", "redis connected", function () {
  db.get("tyler's garden", function (err, response) {
    console.log(response);
  });
  db.del("tyler's garden");
});
db.on("error", function (err) {
  console.log("Error: " + err);
});

module.exports = db;