module.exports = function(app) {
  // For the #xdesix Slack integration
  app.use('/pew', require('./routes/pew'));

  // For the /pomodoro Slack integration
  app.use('/pomodoro', require('./routes/pomodoro'));
};
