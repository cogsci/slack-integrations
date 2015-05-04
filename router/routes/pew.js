// For the #xdesix Slack integration

var express = require('express');
var router = express.Router();

// From slack-notify incoming webhook url
var PEW_SLACK_WEBHOOK_URL = process.env['PEW_SLACK_WEBHOOK_URL'];
var PEW_SLASH_TOKEN = process.env['PEW_SLASH_TOKEN'];
var slack = require('slack-notify')(PEW_SLACK_WEBHOOK_URL);

// POST /pew
router.post('/', function(request, response) {
  var name = request.body.user_name;
  var input = request.body.text;
  var token = request.body.token;
  var message = ["<!group>: PEW"];
  var parse = [];
  var minutes = "";
  var game = "";

  if (!token || token !== PEW_SLASH_TOKEN) {
    response.status(403).send('Unauthorized');
    return;
  }

  if (!input || input.length === 0) {
    message.push("now");
  } else {
    parse = input.split(' ');
    minutes = parse[0];
    game = parse[1];
    message.push(game, "in", minutes, "minutes");
    _.compact(message);
  }

  slack.send({
    icon_emoji: ':bomb:',
    username: "PEW ALERT via " + name,
    text: message.join(' ')
  });
});

module.exports = router;
