// this is a wrapper of npm redis

var redis = require('redis');
// createClient will create a new instance, but we only need one instance
var client = redis.createClient();

function set(key, value, callback) {
  client.set(key, value, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    callback(res);
  });
}

function get(key, callback) {
  client.get(key, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    callback(res);
  });
}

// set TTL of a key
function expire(key, timeInSeconds) {
  client.expire(key, timeInSeconds);
}

function quit() {
  client.quit();
}

module.exports = {
  get: get,
  set: set,
  expire: expire,
  quit: quit,
  redisPrint: redis.print
}
