// Common behavior

module.exports = {
  ensureToken: function(request, path) {
    describe('validate token', function() {
      it('should return 403 if mismatched token', function(done) {
        request.post(path)
          .send({
            token: 'invalid_token',
          })
          .expect(403, 'Unauthorized', done);
      });
    });
  }
}
