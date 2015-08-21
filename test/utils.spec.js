/*globals describe it*/
'use strict';

var should = require('should');

var fixtures = require('./fixtures.json');

var utils = require('../lib/utils');

describe('Layer API utils', function() {

  describe('Passing UUID to toUUID function', function() {
    it('should return UUID', function() {
      utils.toUUID(fixtures.uuid.normal).should.be.eql(fixtures.uuid.normal);
    });
  });

  describe('Passing Layer prefixed UUID to toUUID function', function() {
    it('should return UUID', function() {
      utils.toUUID(fixtures.uuid.prefixed).should.be.eql(fixtures.uuid.normal);
    });
  });

  describe('Message text payload function type user_id', function() {
    it('should return payload data', function() {
      var from = 'abcd';
      var text = 'Hello, World!';
      utils.messageText('user_id', from, text).should.be.eql({
        sender: {
          user_id: from
        },
        parts: [
          {
            body: text,
            mime_type: utils.MIME_TEXT
          }
        ]
      });
    });
  });

  describe('Message text payload function type name', function() {
    it('should return payload data', function() {
      var from = 'abcd';
      var text = 'Hello, World!';
      utils.messageText('name', from, text).should.be.eql({
        sender: {
          name: from
        },
        parts: [
          {
            body: text,
            mime_type: utils.MIME_TEXT
          }
        ]
      });
    });
  });

  describe('Passing invalid value to toUUID function', function() {
    it('should return null', function() {
      should(utils.toUUID(fixtures.uuid.invalid1)).be.eql(null);
    });
    it('should return null', function() {
      should(utils.toUUID(fixtures.uuid.invalid2)).be.eql(null);
    });
    it('should return null', function() {
      should(utils.toUUID(fixtures.uuid.invalid3)).be.eql(null);
    });
  });
});
