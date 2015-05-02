// For the /pomodoro Slack integration

var express = require('express');
var router = express.Router();

// From slack-notify incoming webhook url
var POMODORO_SLACK_WEBHOOK_URL = process.env['POMODORO_SLACK_WEBHOOK_URL'];
var POMODORO_SLASH_TOKEN = process.env['POMODORO_SLASH_TOKEN'];
var slack = require('slack-notify')(POMODORO_SLACK_WEBHOOK_URL);

if (!POMODORO_SLASH_TOKEN || !POMODORO_SLACK_WEBHOOK_URL) {
  throw new Error('Must define POMODORO_SLASH_TOKEN and POMODORO_SLACK_WEBHOOK_URL');
}

// POST /pomodoro
router.post('/', function(request, response) {
  var name = request.body.user_name;
  var input = request.body.text;
  var token = request.body.token;
  var times = [];
  var workTimeInMinutes = 0.0;
  var breakTimeInMinutes = 0.0;
  var workTimeInMilliseconds = 0.0;

  if (!token || token !== POMODORO_SLASH_TOKEN) {
    response.status(403).send('Unauthorized');
    return;
  }

  if (!input || input.length === 0) {
    slack.send({
      username: "Pomodoro Ping",
      text: "Please input minutes to work then minutes to rest. Eg, '/pomodoro 25 5'"
    });
  } else {
    // Resets message to original starting point.
    function resetMessage() {
      message.length = 1;
    };
    // Puts work and break time inputs into array.
    times = input.split(' ');
    // Stores work and break time as ints
    workTimeInMinutes = parseFloat(times[0]);
    breakTimeInMinutes = parseFloat(times[1]);
    workTimeInMilliseconds = workTimeInMinutes * 60000;

    // Sends immediate response.
    slack.send({
      username: "Pomodoro Ping",
      text: "*Get to work.* Break starts in " + workTimeInMinutes + " minutes."
    });
    resetMessage();

    setTimeout(function() {
      slack.send({
        username: "Pomodoro Ping",
        text: "*Take a break.* Work starts in " + breakTimeInMinutes + " minutes."
      });
      resetMessage();
    }, workTimeInMilliseconds)
  }
});

module.exports = router;
