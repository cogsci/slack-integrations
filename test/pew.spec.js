process.env.PEW_SLACK_WEBHOOK_URL = 'http://fakeurl.com';
const TOKEN = (process.env.PEW_SLASH_TOKEN = 'faketoken');
const VALID_PARAMETERS = {
  token: TOKEN,
  user_name: 'bob',
  text: ''
};

const _ = require('lodash');
const bodyParser = require('body-parser');
const assert = require('chai').assert;
const sinon = require('sinon');
const pew = require('../router/routes/pew');
const app = require('express')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(pew);

const request = require('supertest')(app);
const common = require('./common');

const sendRequest = function(params, cb) {
  params = params || {};
  cb = cb || function() {};

  return request
    .post('/')
    .type('form')
    .send(_.defaults(params, VALID_PARAMETERS))
    .end(cb);
};

describe('PEW', function() {
  beforeEach(function() {
    this.send = sinon.stub(pew.slack, 'send');
  });

  afterEach(function() {
    this.send.restore();
  });

  common.ensureToken(request, '/');

  describe('valid request', function() {
    it("should have user's name in username", function(done) {
      sendRequest({
        user_name: 'kelly'
      });

      setTimeout(
        function() {
          assert.ok(this.send.calledOnce);

          var arg = this.send.args[0][0];

          assert.property(arg, 'username');
          assert.include(arg.username, 'kelly');
          done();
        }.bind(this),
        10
      );
    });
  });

  describe('no parameters', function() {
    it('should send message "PEW now"', function(done) {
      sendRequest();

      setTimeout(
        function() {
          assert.ok(this.send.calledOnce);

          var arg = this.send.args[0][0];

          assert.strictEqual(arg.text, '<!group>: PEW now');
          done();
        }.bind(this),
        10
      );
    });
  });

  describe('with minutes', function() {
    it('should send message "PEW in [X] minutes"', function(done) {
      sendRequest({
        text: '30'
      });

      setTimeout(
        function() {
          assert.ok(this.send.calledOnce);

          var arg = this.send.args[0][0];

          assert.strictEqual(arg.text, '<!group>: PEW in 30 minutes');
          done();
        }.bind(this),
        10
      );
    });
  });

  describe('with minutes and game', function() {
    it('should send message "PEW [game] in [X] minutes"', function(done) {
      sendRequest({
        text: '30 WT'
      });

      setTimeout(
        function() {
          assert.ok(this.send.calledOnce);

          var arg = this.send.args[0][0];

          assert.strictEqual(arg.text, '<!group>: PEW WT in 30 minutes');
          done();
        }.bind(this),
        10
      );
    });
  });
});
