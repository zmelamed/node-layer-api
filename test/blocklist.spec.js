/*globals describe it*/
'use strict';

var should = require('should');
var nock = require('nock');

var qs = require('querystring');

var fixtures = require('./fixtures.json');
var utils = require('../lib/utils');

var LayerAPI = require('../lib');
var layerAPI = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

describe('Blocklist operations', function() {

  describe('Retrieving a block list for a user', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/' + fixtures.blocklist.ownerid + '/blocks')
      .reply(200, fixtures.blocklist.success);

    it('should return a block list object', function(done) {
      layerAPI.blocklist.get(fixtures.blocklist.ownerid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.match(fixtures.blocklist.success);

        done(err);
      });
    });

    it('with invalid ID should return an error', function(done) {
      layerAPI.blocklist.get(null, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.blocklist.ownerId);

        done();
      });
    });
  });

  describe('Retrieving a block list for unsafe URL', function() {
    var ownerId = 'testing/bla*foo';

    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/' + qs.escape(ownerId) + '/blocks')
      .reply(200, fixtures.blocklist.success);

    it('should return a block list object', function(done) {
      layerAPI.blocklist.get(ownerId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.match(fixtures.blocklist.success);

        done(err);
      });
    });
  });

  describe('Blocking a user', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/users/' + fixtures.blocklist.ownerid + '/blocks')
      .reply(204);

    it('should return no content', function(done) {
      layerAPI.blocklist.block(fixtures.blocklist.ownerid, fixtures.blocklist.userid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });

    it('with invalid ID should return an error', function(done) {
      layerAPI.blocklist.block(null, fixtures.blocklist.userid, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.blocklist.ownerId);

        done();
      });
    });

    it('with invalid IDs should return an error', function(done) {
      layerAPI.blocklist.block(null, null, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.blocklist.ownerId);

        done();
      });
    });
  });

  describe('Blocking a user for unsafe URL', function() {
    var ownerId = '!$#/b-?la*foo&';

    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/users/' + qs.escape(ownerId) + '/blocks')
      .reply(204);

    it('should return no content', function(done) {
      layerAPI.blocklist.block(ownerId, fixtures.blocklist.userid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });

  describe('Unblocking a user', function() {
    nock('https://api.layer.com')
      .delete('/apps/' + fixtures.appId + '/users/' + fixtures.blocklist.ownerid + '/blocks/' + fixtures.blocklist.userid)
      .reply(204);

    it('should return no content', function(done) {
      layerAPI.blocklist.unblock(fixtures.blocklist.ownerid, fixtures.blocklist.userid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });

    it('with invalid ID should return an error', function(done) {
      layerAPI.blocklist.unblock(null, null, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.blocklist.ownerId);

        done();
      });
    });
  });

  describe('Unblocking a user for unsafe URL', function() {
    var ownerId = '!$#/b-?la*foo&';
    var userId = '#^&L<';

    nock('https://api.layer.com')
      .delete('/apps/' + fixtures.appId + '/users/' + qs.escape(ownerId) + '/blocks/' + qs.escape(userId))
      .reply(204);

    it('should return no content', function(done) {
      layerAPI.blocklist.unblock(ownerId, userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });
});
