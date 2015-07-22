/*globals describe it*/
'use strict';

var should = require('should');

var LayerAPI = require('../../lib');
var layerAPI = new LayerAPI({token: process.env.LAYER_TOKEN, appId: process.env.LAYER_APP_ID});

describe('Announcements operations', function() {

  var participants = ['test123', '12345'];

  var payload = {
    recipients: ['test123', '12345'],
    sender: {
      name: 'The System'
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

        done(err);
      });
    });
  });

  describe('Sending an announcement', function() {
    it('should return a announcement object', function(done) {
      layerAPI.announcements.send(payload, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(202);
        res.body.should.have.properties(['url', 'recipients', 'id', 'sender', 'parts']);

        done(err);
      });
    });
  });
});
