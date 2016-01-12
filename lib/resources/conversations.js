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
     * Create conversation
     *
     * @param  {Object}   body      Conversation body
     * @param  {Function} callback  Callback function
     */
    create: create.bind(null, null),

    /**
     * Create conversation with de-duplicating UUID
     *
     * @param  {String}   dedupe    UUID
     * @param  {Object}   body      Conversation body
     * @param  {Function} callback  Callback function
     */
    createDedupe: create,

    /**
     * Retrieve a conversation
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {Function} callback        Callback function
     */
    get: function(conversationId, callback) {
      conversationId = utils.toUUID(conversationId);
      if (!conversationId) return callback(new Error(utils.i18n.conversations.id));
      utils.debug('Conversation get: ' + conversationId);

      request.get({
        path: '/conversations/' + conversationId
      }, callback);
    },

    /**
     * Retrieve a conversation from user
     *
     * @param  {String}   userId          User ID
     * @param  {String}   conversationId  Conversation ID
     * @param  {Function} callback        Callback function
     */
    getFromUser: function(userId, conversationId, callback) {
      if (!userId) return callback(new Error(utils.i18n.conversations.userId));
      var conversationUUID = null;
      if (typeof conversationId === 'function') callback = conversationId;
      else conversationUUID = utils.toUUID(conversationId);
      utils.debug('Conversation getFromUser: ' + userId);

      request.get({
        path: '/users/' + querystring.escape(userId) + '/conversations' + (conversationUUID ? '/' + conversationUUID : '')
      }, callback);
    },

    /**
     * Edit a conversation
     *
     * @param  {String}   conversationId Conversation UUID
     * @param  {Array}    operations      Array of operations
     * @param  {Function} callback        Callback function
     */
    edit: function(conversationId, operations, callback) {
      conversationId = utils.toUUID(conversationId);
      if (!conversationId) return callback(new Error(utils.i18n.conversations.id));
      if (!utils.isArray(operations)) return callback(new Error(utils.i18n.conversations.operations));
      utils.debug('Conversation edit: ' + conversationId);

      request.patch({
        path: '/conversations/' + conversationId,
        body: operations
      }, callback || utils.nop);
    },

    /**
     * Delete a conversation
     *
     * @param  {String}   conversationId Conversation UUID
     * @param  {Function} callback        Callback function
     */
    delete: function(conversationId, callback) {
      conversationId = utils.toUUID(conversationId);
      if (!conversationId) return callback(new Error(utils.i18n.conversations.id));
      utils.debug('Conversation delete: ' + conversationId);

      request.delete({
        path: '/conversations/' + conversationId
      }, callback || utils.nop);
    }
  };

  function create(dedupe, body, callback) {
    if (dedupe !== null && !utils.toUUID(dedupe)) return callback(new Error(utils.i18n.dedupe));
    if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.conversations.body));
    utils.debug('Conversation create');

    request.post({
      path: '/conversations',
      body: body,
      dedupe: dedupe
    }, callback || utils.nop);
  }
};
