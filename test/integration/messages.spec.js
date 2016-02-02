/*globals describe it*/
'use strict';

var should = require('should');

var LayerAPI = require('../../lib');
var layerAPI = new LayerAPI({token: process.env.LAYER_TOKEN, appId: process.env.LAYER_APP_ID});

describe('Messages operations', function() {

  var participants = ['test123'],
      conversationId = null,
      messageId = null;

  var message = {
    sender: {
      name: 'Integration test'
    },
    parts: [
      {
        body: 'Hello, World!',
        mime_type: 'text/plain'
      }
    ]
  };

  describe('Creating a conversation with participants', function() {
    it('should return a conversation object', function(done) {
      layerAPI.conversations.create({participants: participants}, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.participants.should.match(participants);

        conversationId = res.body.id;
        done(err);
      });
    });
  });

  describe('Sending a message to a conversation', function() {
    it('should return a message object', function(done) {
      layerAPI.messages.send(conversationId, message, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.body.sender.should.match(message.sender);
        res.body.parts.should.match(message.parts);

        done(err);
      });
    });
  });

  describe('Sending a message to a conversation by passing invalid ID', function() {
    it('should return an error', function(done) {
      layerAPI.messages.send('24f43c32-4d95-11e4-b3a2-0fd00000020d', message, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.status.should.be.eql(404);
        err.body.should.have.properties({
          id: 'not_found',
          code: 102
        });

        done();
      });
    });
  });

  describe('Sending a message to a conversation by passing invalid body', function() {
    it('should return an error', function(done) {
      layerAPI.messages.send(conversationId, {}, function(err, res) {
        should.exist(err);
        should.not.exist(res);

        err.status.should.be.eql(422);
        err.body.should.have.properties({
          code: 104,
          id: 'missing_property'
        });

        done();
      });
    });
  });

  describe('Sending a message to a conversation using sendTextFromName', function() {
    it('should return a message object', function(done) {
      layerAPI.messages.sendTextFromName(conversationId, message.sender.name, 'hello world', function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(['conversation', 'id', 'parts', 'sender']);
        messageId = res.body.id;

        done();
      });
    });
  });

  describe('Sending a message to a conversation using sendTextFromUser', function() {
    it('should return a message object', function(done) {
      layerAPI.messages.sendTextFromUser(conversationId, participants[0], 'hello world2', function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);
        res.body.should.have.properties(['conversation', 'id', 'parts', 'sender']);

        done();
      });
    });
  });

  describe('Retrieving messages in a conversation', function() {
    it('should return array of messages', function(done) {
      layerAPI.messages.getAll(conversationId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.length.should.be.eql(3);

        done();
      });
    });
  });

  describe('Retrieving all messages in a conversation from a user', function() {
    it('should return array of messages', function(done) {
      layerAPI.messages.getAllFromUser(participants[0], conversationId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.length.should.be.eql(3);

        done();
      });
    });
  });

  describe('Retrieving a messages in a conversation from a user', function() {
    it('should return array of messages', function(done) {
      layerAPI.messages.getFromUser(participants[0], messageId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.id.should.be.eql(messageId);

        done();
      });
    });
  });
});
