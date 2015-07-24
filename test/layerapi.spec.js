/*globals describe it*/
'use strict';

var should = require('should');

var fixtures = require('./fixtures.json');

var utils = require('../lib/utils');
var LayerAPI = require('../lib');

describe('Layer API constructor', function() {

  describe('Passing config with token and appId', function() {
    it('should expose API operations', function() {
      var layerApi = new LayerAPI({token: fixtures.token, appId: fixtures.appId});
      should.exist(layerApi);

      should(typeof layerApi.conversations.create).be.eql('function');
      should(typeof layerApi.conversations.get).be.eql('function');
      should(typeof layerApi.conversations.edit).be.eql('function');

      should(typeof layerApi.messages.send).be.eql('function');
      should(typeof layerApi.messages.sendTexFromUser).be.eql('function');
      should(typeof layerApi.messages.sendTexFromUser).be.eql('function');

      should(typeof layerApi.announcements.send).be.eql('function');
    });
  });

  describe('Passing config with token and full appId', function() {
    it('should not throw an error', function() {
      var layerApi = new LayerAPI({token: fixtures.token, appId: fixtures.appIdFull});
      should.exist(layerApi);
    });
  });

  describe('Passing no config', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI();
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.token);
      }
    });
  });

  describe('Passing config with token only', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI({token: fixtures.token});
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.appId);
      }
    });
  });

  describe('Passing config with invalid appId', function() {
    it('should throw an error', function() {
      try {
        new LayerAPI({token: fixtures.token, appId: '12345'});
      }
      catch (err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.layerapi.appId);
      }
    });
  });
});
