'use strict';

var utils = require('../utils');

module.exports = function(request) {
  return {
    /**
     * Create conversation
     *
     * @param  {Object}   body  Conversation body
     * @param  {Function} callback Callback function
     */
    create: function(body, callback) {
      if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.conversations.body));
      utils.debug('Conversation create');

      request.post({
        path: '/conversations',
        body: body
      }, callback || utils.nop);
    },

    /**
     * Retrieve a conversation
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {Function} callback        Callback function
     */
    get: function(conversationId, callback) {
      if (!utils.toUUID(conversationId)) return callback(new Error(utils.i18n.conversations.id));
      utils.debug('Conversation get: ' + conversationId);

      request.get({
        path: '/conversations/' + conversationId
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
      if (!utils.toUUID(conversationId)) return callback(new Error(utils.i18n.conversations.id));
      if (!utils.isArray(operations)) return callback(new Error(utils.i18n.conversations.operations));
      utils.debug('Conversation edit: ' + conversationId);

      request.patch({
        path: '/conversations/' + conversationId,
        body: operations
      }, callback || utils.nop);
    }
  };
};
