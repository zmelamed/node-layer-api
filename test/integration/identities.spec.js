/*globals describe it*/
'use strict';

var should = require('should');

var LayerAPI = require('../../lib');
var layerAPI = new LayerAPI({token: process.env.LAYER_TOKEN, appId: process.env.LAYER_APP_ID});

describe('Conversation operations', function() {

  var userId = 'johndoe' + Math.round(Math.random()*1000);
  var properties1 = {
    display_name: 'John Doe',
    avatar_url: 'https://gravtar.com/avatar.png',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '415-555-0202',
    email_address: 'user@domain.com',
    public_key: '<RSA Key>',
    metadata: {
      key: 'value'
    }
  };
  var properties2 = {
    display_name: 'John Doe 2',
    first_name: 'Johnny',
    last_name: 'Doey'
  };

  describe('Creating an identity', function() {
    it('should return 201', function(done) {
      layerAPI.identities.create(userId, properties1, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(201);

        done(err);
      });
    });

    it('should return an error without display_name', function(done) {
      layerAPI.identities.create(userId, properties1, function(err, res) {
        should.exist(err);

        err.status.should.be.eql(409);

        done();
      });
    });
  });

  describe('Fetch an identity providing userId', function() {
    it('should return identity object', function(done) {
      layerAPI.identities.get(userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.have.properties(properties1);

        done(err);
      });
    });

    it('should return an error', function(done) {
      layerAPI.identities.get('this_user_should_not_exist', function(err, res) {
        should.exist(err);

        err.status.should.be.eql(404);

        done();
      });
    });
  });

  describe('Editing an identity', function() {
    it('should return 204', function(done) {
      layerAPI.identities.edit(userId, { email_address: 'john@doe.com' }, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);
        console.log(res);

        done(err);
      });
    });

    it('should return updated identity object on fetch', function(done) {
      layerAPI.identities.get(userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.email_address.should.be.eql('john@doe.com');

        done(err);
      });
    });
  });

  describe('Replacing an identity', function() {
    it('should return 204', function(done) {
      layerAPI.identities.replace(userId, properties2, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });

    it('should return updated identity object on fetch', function(done) {
      layerAPI.identities.get(userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(200);
        res.body.should.have.properties(properties2);

        done(err);
      });
    });
  });

  describe('Deleting an identity', function() {
    it('should return 201', function(done) {
      layerAPI.identities.delete(userId, function(err, res) {
        should.not.exist(err);
        should.exist(res);

        res.status.should.be.eql(204);

        done(err);
      });
    });
  });
});
