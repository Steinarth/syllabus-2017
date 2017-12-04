const express = require('express');
const redis = require('redis');
const database = require('./database');

var app = express();
var client = redis.createClient(6379, 'my_redis_container', {
  retry_strategy: options => {
    return;
  },
});

app.get('/', (req, res) => {
  if (client.connected) {
    client.incr('page_load_count', (error, reply) => {
      var msg = 'Connected to redis, you are awesome :D' + 'Page loaded ' + reply + ' times!';
      res.statusCode = 200;
      res.send(msg);
      return;
    });
  } else {
    var msg = "Failed to connect to redis :'(";
    res.statusCode = 500;
    res.send(msg);
  }
});

//api call to /items which returns a list of the the 10 newest item names.
app.get('/items', (req, res) => {
    database.get(function (items){
        var names = items.map(x => x.name);
        res.statusCode = 200;
        res.send(names);
    });
});

//api call to /items/name which inserts an item to database.
app.post('/items/:name', (req, res) => {
    var name = req.params.name;
    database.insert(name, new Date(), function(items) {
        var msg = 'item inserted successfully';
        res.statusCode = 201;
        res.send(msg);
    });
})

app.listen(3000);