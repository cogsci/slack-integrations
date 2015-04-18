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
  var text = request.body.text;
  var token = request.body.token;

  if (!token || token !== PEW_SLASH_TOKEN) {
    response.status(403).send('Unauthorized');
    return;
  }

  if (!text || text.length === 0) {
    slack.send({
      icon_emoji: ':bomb:',
      username: "PEW ALERT via " + name,
      text: "<!group>: PEW now"
    });
  } else {
    slack.send({
      icon_emoji: ':bomb:',
      username: "PEW ALERT via " + name,
      text: "<!group>: PEW in " + text + " minutes"
    });
  };
});

module.exports = router;
