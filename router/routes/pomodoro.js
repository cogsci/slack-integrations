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
  var message = ["You should"];
  var times = [];
  var workTimeInMinutes = 0.0;
  var breakTimeInMinutes = 0.0;
  var workTimeInMilliseconds = 0.0;
  var breakTimeInMilliseconds = 0.0;

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
    breakTimeInMilliseconds = breakTimeInMinutes * 60000;

    // Forms acknowledgement message.
    message.push("get to work. Break starts in", workTimeInMinutes, "minutes.")

    // Sends immediate response.
    slack.send({
      username: "Pomodoro Ping",
      text: message.join(' ')
    });
    resetMessage();

    setTimeout(function() {
      message.push("take a break. Work starts in", breakTimeInMinutes, "minutes.")
      slack.send({
        username: "Pomodoro Ping",
        text: message.join(' ')
      });
      resetMessage();
    }, workTimeInMilliseconds)
  }
});

module.exports = router;
