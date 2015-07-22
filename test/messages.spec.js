/*globals describe it*/
'use strict';

var should = require('should');
var nock = require('nock');

var fixtures = require('./fixtures.json');
var utils = require('../lib/utils');

var LayerAPI = require('../lib');
var layerAPI = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

describe('Messages operations', function() {

  describe('Sending a message to a conversation', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(201, fixtures.messages.success);

    it('should return a message object', function(done) {
      var body = {
        sender: fixtures.messages.success.sender,
        parts: fixtures.messages.success.parts
      };
      layerAPI.messages.send(fixtures.conversations.uuid, body, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.messages.success);

        done(err);
      });
    });
  });

  describe('Sending a message to a conversation using sendTexFromUser', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(201, fixtures.messages.success);

    it('should return a message object', function(done) {
      var userId = 'abcd';
      var text = 'testing 123';
      layerAPI.messages.sendTexFromUser(fixtures.conversations.uuid, userId, text, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.messages.success);

        done(err);
      });
    });
  });

  describe('Sending a message to a conversation using sendTexFromName', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(201, fixtures.messages.success);

    it('should return a message object', function(done) {
      var name = 'The System';
      var text = 'testing 123';
      layerAPI.messages.sendTexFromName(fixtures.conversations.uuid, name, text, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.messages.success);

        done(err);
      });
    });
  });

  describe('Sending a message to a conversation by passing invalid ID', function() {
    it('should return an error', function(done) {
      var body = {
        sender: fixtures.messages.success.sender,
        parts: fixtures.messages.success.parts
      };
      layerAPI.messages.send('bla-bla', body, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.messages.cid);
        should.not.exist(res);

        done();
      });
    });
  });

  describe('Sending a message to a conversation by passing invalid body', function() {
    it('should return an error', function(done) {
      layerAPI.messages.send(fixtures.conversations.uuid, 12345, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.messages.body);
        should.not.exist(res);

        done();
      });
    });
  });
});
