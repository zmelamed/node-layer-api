/*globals describe it*/
'use strict';

var should = require('should');
var nock = require('nock');

var fixtures = require('./fixtures.json');
var utils = require('../lib/utils');

var LayerAPI = require('../lib');
var layerAPI = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

describe('Announcements operations', function() {

  describe('Sending an announcement', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/announcements')
      .times(3)
      .reply(202, fixtures.announcements.success);

    it('should return a message object', function(done) {
      var body = {
        recipients: fixtures.announcements.success.recipients,
        sender: fixtures.announcements.success.sender,
        parts: fixtures.announcements.success.parts
      };
      layerAPI.announcements.send(body, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(202);
        res.body.should.have.properties(fixtures.announcements.success);

        done(err);
      });
    });

    it('with dedupe should return a message object', function(done) {
      var body = {
        recipients: fixtures.announcements.success.recipients,
        sender: fixtures.announcements.success.sender,
        parts: fixtures.announcements.success.parts
      };
      layerAPI.announcements.sendDedupe(fixtures.appId, body, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(202);
        res.body.should.have.properties(fixtures.announcements.success);

        done(err);
      });
    });

    it('with invalid dedupe should return a message object', function(done) {
      var body = {
        recipients: fixtures.announcements.success.recipients,
        sender: fixtures.announcements.success.sender,
        parts: fixtures.announcements.success.parts
      };
      layerAPI.announcements.sendDedupe(undefined, body, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.dedupe);

        done();
      });
    });
  });

  describe('Sending an announcement by passing invalid body', function() {
    it('should return an error', function(done) {
      layerAPI.announcements.send(123, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.announcements.body);
        should.not.exist(res);

        done();
      });
    });
  });
});
