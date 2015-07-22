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
