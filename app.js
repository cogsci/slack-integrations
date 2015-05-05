var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var _ = require('lodash');

// Middleware
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Loads random ASCII faces at app URL
app.get('/', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  for (i=0; i < times; i++)
      result += cool();
  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// Router
var router = require('./router')(app);

// Error Handling
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
