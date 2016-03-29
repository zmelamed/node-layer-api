/*globals describe it*/
'use strict';

var should = require('should');
var nock = require('nock');

var fixtures = require('./fixtures.json');
var utils = require('../lib/utils');

var LayerAPI = require('../lib');
var layerAPI = new LayerAPI({token: fixtures.token, appId: fixtures.appId});

describe('Identity operations', function() {

  describe('Creating an Identity', function() {
    nock('https://api.layer.com')
      .post('/apps/' + fixtures.appId + '/users/' + fixtures.identities.id + '/identity')
      .times(3)
      .reply(204);

    it('should return nothing', function(done) {
      layerAPI.identities.create(fixtures.identities.id, fixtures.identities.success, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);
        res.body.should.be.eql('');

        done(err);
      });
    });


    it('should return an error if no userId', function(done) {
      layerAPI.identities.create('', fixtures.identities.success, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.id);
        done();
      });
    });


    it('should return an error if no display_name', function(done) {
      layerAPI.identities.create(fixtures.identities.id, {first_name: 'fred'}, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.displayName);
        done();
      });
    });
  });


  describe('Retrieving an Identity by User ID', function() {
    nock('https://api.layer.com')
      .get('/apps/' + fixtures.appId + '/users/' + fixtures.identities.id + '/identity')
      .times(3)
      .reply(200, fixtures.identities.success);

    it('should return an Identity object', function(done) {
      layerAPI.identities.get(fixtures.identities.id, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.have.properties(fixtures.identities.success);

        done(err);
      });
    });

    it('should return an an error if no userId', function(done) {
      layerAPI.identities.get(null, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.id);
        done();
      });
    });
  });

  describe('Replacing an Identity by User ID', function() {
    nock('https://api.layer.com')
      .put('/apps/' + fixtures.appId + '/users/' + fixtures.identities.id + '/identity')
      .times(3)
      .reply(204);

    it('should return a 204', function(done) {
      layerAPI.identities.replace(fixtures.identities.id, {display_name: 'samwise', last_name: 'gamgee'}, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });

    it('should return an error if no userId', function(done) {
      layerAPI.identities.replace('', {display_name: 'samwise', last_name: 'gamgee'}, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.id);

        done();
      });
    });

    it('should return an error if no display_name', function(done) {
      layerAPI.identities.replace(fixtures.identities.id, {display_name2: 'samwise', last_name: 'gamgee'}, function(err, res) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.displayName);

        done();
      });
    });
  });

  describe('Editing an Identity by User ID', function() {
    nock('https://api.layer.com')
      .patch('/apps/' + fixtures.appId + '/users/' + fixtures.identities.id + '/identity')
      .reply(204);

    it('should return a 204', function(done) {
      layerAPI.identities.edit(fixtures.identities.id, {display_name: 'samwise', last_name: 'gamgee'}, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });

  describe('Delete an Identity by User ID', function() {
    nock('https://api.layer.com')
      .delete('/apps/' + fixtures.appId + '/users/' + fixtures.identities.id + '/identity')
      .times(3)
      .reply(204);

    it('should return a 204', function(done) {
      layerAPI.identities.delete(fixtures.identities.id, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });

    it('Should return an error if no userId', function(done) {
      layerAPI.identities.delete('', function(err) {
        should.exist(err);
        err.message.should.be.eql(utils.i18n.identities.id);

        done();
      });
    });
  });
});
