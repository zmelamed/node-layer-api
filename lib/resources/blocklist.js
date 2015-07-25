'use strict';
/**
 * Block list resource
 * @module resources/blocklists
 */

var querystring = require('querystring');

var utils = require('../utils');

module.exports = function(request) {
  return {

    /**
     * Retrieve the block list for a user that owns the block list
     *
     * @param  {Strng}    ownerId  Owner ID of the block list
     * @param  {Function} callback Callback function
     */
    get: function(ownerId, callback) {
      if (!ownerId) return callback(new Error(utils.i18n.blocklist.ownerId));
      utils.debug('Blocklist get: ' + ownerId);

      request.get({
        path: '/users/' + querystring.escape(ownerId) + '/blocks'
      }, callback);
    },

    /**
     * Block a single user
     *
     * @param  {String}   ownerId  Owner ID of the block list
     * @param  {String}   userId   User being blocked
     * @param  {Function} callback Callback function
     */
    block: function(ownerId, userId, callback) {
      if (!ownerId) return callback(new Error(utils.i18n.blocklist.ownerId));
      if (!userId) return callback(new Error(utils.i18n.blocklist.userId));
      utils.debug('Blocklist block: ' + ownerId + ' userId: ' + userId);

      request.post({
        path: '/users/' + querystring.escape(ownerId) + '/blocks',
        body: {
          user_id: userId
        }
      }, callback || utils.nop);
    },

    /**
     * Unblock a single user
     *
     * @param  {String}   ownerId  Owner ID of the block list
     * @param  {String}   userId   User being blocked
     * @param  {Function} callback Callback function
     */
    unblock: function(ownerId, userId, callback) {
      if (!ownerId) return callback(new Error(utils.i18n.blocklist.ownerId));
      if (!userId) return callback(new Error(utils.i18n.blocklist.userId));
      utils.debug('Blocklist unblock: ' + ownerId + ' userId: ' + userId);

      request.delete({
        path: '/users/' + querystring.escape(ownerId) + '/blocks/' + querystring.escape(userId)
      }, callback || utils.nop);
    }
  };
};
