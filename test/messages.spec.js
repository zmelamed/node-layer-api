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
      .times(3)
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

    it('with dedupe should return a message object', function(done) {
      var body = {
        sender: fixtures.messages.success.sender,
        parts: fixtures.messages.success.parts
      };
      layerAPI.messages.sendDedupe(fixtures.conversations.uuid, fixtures.conversations.uuid, body, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.messages.success);

        done(err);
      });
    });

    it('with invalid dedupe should return an error', function(done) {
      var body = {
        sender: fixtures.messages.success.sender,
        parts: fixtures.messages.success.parts
      };
      layerAPI.messages.sendDedupe(123, fixtures.conversations.uuid, body, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.message.should.be.eql(utils.i18n.dedupe);

        done();
      });
    });
  });

  describe('Sending a message to a conversation using sendTextFromUser', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(201, fixtures.messages.success);

    it('should return a message object', function(done) {
      var userId = 'abcd';
      var text = 'testing 123';
      layerAPI.messages.sendTextFromUser(fixtures.conversations.uuid, userId, text, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(fixtures.messages.success);

        done(err);
      });
    });
  });

  describe('Sending a message to a conversation using sendTextFromName', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(201, fixtures.messages.success);

    it('should return a message object', function(done) {
      var name = 'The System';
      var text = 'testing 123';
      layerAPI.messages.sendTextFromName(fixtures.conversations.uuid, name, text, function(err, res) {
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

  describe('Retrieving all messages in a conversation from a user', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/12345/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(200, [fixtures.messages.success]);

    it('should return array of messages', function(done) {
      layerAPI.messages.getAllFromUser(12345, fixtures.conversations.uuid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.length.should.be.eql(1);

        done();
      });
    });
  });

  describe('Retrieving all messages in a conversation from a user with query parameters', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/12345/conversations/' + fixtures.conversations.uuid + '/messages')
      .query({
        page_size: 50,
        from_id: fixtures.conversations.uuid,
        sort_by: 'last_message'
      })
      .reply(200, [fixtures.messages.success]);

    it('should return array of messages', function(done) {
      var params = {
        page_size: 50,
        from_id: fixtures.conversations.uuid,
        sort_by: 'last_message'
      };
      layerAPI.messages.getAllFromUser(12345, fixtures.conversations.uuid, params, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.length.should.be.eql(1);

        done();
      });
    });
  });

  describe('Retrieving messages in a conversation', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .reply(200, [fixtures.messages.success]);

    it('should return array of messages', function(done) {
      layerAPI.messages.getAll(fixtures.conversations.uuid, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.length.should.be.eql(1);

        done();
      });
    });
  });

  describe('Retrieving messages in a conversation with query parameters', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/conversations/' + fixtures.conversations.uuid + '/messages')
      .query({
        page_size: 50,
        from_id: fixtures.conversations.uuid,
        sort_by: 'last_message'
      })
      .reply(200, [fixtures.messages.success]);

    it('should return array of messages', function(done) {
      var params = {
        page_size: 50,
        from_id: fixtures.conversations.uuid,
        sort_by: 'last_message'
      };
      layerAPI.messages.getAll(fixtures.conversations.uuid, params, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.length.should.be.eql(1);

        done();
      });
    });
  });

  describe('Retrieving a messages in a conversation from a user', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/12345/messages/' + fixtures.messages.uuid)
      .reply(200, fixtures.messages.success);

    it('should return array of messages', function(done) {
      layerAPI.messages.getFromUser(12345, fixtures.messages.id, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.id.should.be.eql(fixtures.messages.id);

        done();
      });
    });
  });
});
