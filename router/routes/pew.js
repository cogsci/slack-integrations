// For the #xdesix Slack integration
'use strict';

var express = require('express');
var router = express.Router();
var debug = require('debug')('pew');
var _ = require('lodash');

// From slack-notify incoming webhook url
var PEW_SLACK_WEBHOOK_URL = process.env.PEW_SLACK_WEBHOOK_URL;
var PEW_SLASH_TOKEN = process.env.PEW_SLASH_TOKEN;
var slack = router.slack = require('slack-notify')(PEW_SLACK_WEBHOOK_URL);

// POST /pew
router.post('/', function(request, response) {
  var name = request.body.user_name;
  var input = request.body.text;
  var token = request.body.token;
  var message = ["<!group>: PEW"];
  var parsed = [];
  var minutes = "";
  var game = "";

  debug('body', request.body);

  if (!token || token !== PEW_SLASH_TOKEN) {
    response.status(403).send('Unauthorized');
    return;
  }

  if (!input || input.length === 0) {
    message.push("now");
  } else {
    parsed = input.split(' ');
    minutes = parsed[0];
    game = parsed[1];
    message.push(game, "in", minutes, "minutes");
    message = _.compact(message);
  }

  debug('sending', message.join(' '));

  slack.send({
    icon_emoji: ':bomb:',
    username: "PEW ALERT via " + name,
    text: message.join(' ')
  });
});

module.exports = router;
