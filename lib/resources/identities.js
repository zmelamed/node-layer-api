'use strict';
/**
 * Conversations resource
 * @module resources/conversations
 */

var querystring = require('querystring');

var utils = require('../utils');

module.exports = function(request) {
  return {

    /**
     * Create a new Identity. NOTE: The display_name property is required.
     *
     * @param  {String}   userId          User ID
     * @param  {Object}   properties      Hash of properties to update
     * @param  {Function} callback        Callback function
     */
    create: function(userId, properties, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      if (!properties.display_name) return callback(new Error(utils.i18n.identities.displayName));
      utils.debug('Identity create: ' + userId);

      request.post({
        path: '/users/' + userId + '/identity',
        body: properties
      }, callback || utils.nop);
    },

    /**
     * Retrieve an Identity
     *
     * @param  {String}   userId  User ID
     * @param  {Function} callback        Callback function
     */
    get: function(userId, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      utils.debug('Identities get: ' + userId);

      request.get({
        path: '/users/' + userId + '/identity'
      }, callback);
    },

    /**
     * Edit Identity properties.
     *
     * @param  {String}   userId          User ID
     * @param  {Object}   properties      Hash of properties to update
     * @param  {Function} callback        Callback function
     */
    edit: function(userId, properties, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      utils.debug('Identity edit: ' + userId);

      request.patch({
        path: '/users/' + userId + '/identity',
        body: Object.keys(properties).map(function(propertyName) {
          return {
            operation: 'set',
            property: propertyName,
            value: properties[propertyName]
          };
        })
      }, callback || utils.nop);
    },

    /**
     * Replace all Identity properties. NOTE: The display_name property is required.
     *
     * @param  {String}   userId          User ID
     * @param  {Object}   properties      Hash of properties to update
     * @param  {Function} callback        Callback function
     */
    replace: function(userId, properties, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      if (!properties.display_name) return callback(new Error(utils.i18n.identities.displayName));
      utils.debug('Identity replace: ' + userId);

      request.put({
        path: '/users/' + userId + '/identity',
        body: properties
      }, callback || utils.nop);
    },

    /**
     * Delete an Identity
     *
     * @param  {String}   userId          User ID
     * @param  {Function} callback        Callback function
     */
    delete: function(userId, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      utils.debug('Identity delete: ' + userId);

      request.delete({
        path: '/users/' + userId + '/identity'
      }, callback || utils.nop);
    }
  };
};
