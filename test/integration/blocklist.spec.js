/*globals describe it*/
'use strict';

var should = require('should');

var LayerAPI = require('../../lib');
var layerAPI = new LayerAPI({token: process.env.LAYER_TOKEN, appId: process.env.LAYER_APP_ID});

describe('Blocklist operations', function() {
  var ownerId = 'layerapi-testuser';
  var userId = 'layerapi-testuser';

  describe('Blocking a user', function() {
    it('should return no content', function(done) {
      layerAPI.blocklist.block(ownerId, userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });

  describe('Retrieving a block list for a user', function() {
    it('should return a block list object', function(done) {
      layerAPI.blocklist.get(ownerId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.match([{user_id: userId}]);

        done(err);
      });
    });
  });

  describe('Unblocking a user', function() {
    it('should return no content', function(done) {
      layerAPI.blocklist.unblock(ownerId, userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });

  describe('Retrieving a block list for a user', function() {
    it('should return a block list object', function(done) {
      layerAPI.blocklist.get(ownerId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.match([]);

        done(err);
      });
    });
  });
});
