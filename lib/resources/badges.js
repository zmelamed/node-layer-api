'use strict';
/**
 * Conversations resource
 * @module resources/badges
 */

var querystring = require('querystring');

var utils = require('../utils');

module.exports = function(request) {
  return {

    /**
     * Retrieve a users Badge count
     *
     * @param  {String}   userId  User ID
     * @param  {Function} callback        Callback function
     */
    get: function(userId, callback) {
      if (!userId) return callback(new Error(utils.i18n.identities.id));
      utils.debug('Badge get: ' + userId);

      request.get({
        path: '/users/' + userId + '/badge'
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
      utils.debug('Badge edit: ' + userId);

      request.patch({
        path: '/users/' + userId + '/badge',
        body: Object.keys(properties).map(function(propertyName) {
          return {
            operation: 'set',
            property: propertyName,
            value: properties[propertyName]
          };
        })
      }, callback || utils.nop);
    },

  };
};
