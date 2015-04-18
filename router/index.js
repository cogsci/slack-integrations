module.exports = function(app) {
  // For the #xdesix Slack integration
  app.use('/pew', require('./routes/pew'));
};
