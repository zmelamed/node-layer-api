'use strict';
/**
 * Messages resource
 * @module resources/messages
 */

var utils = require('../utils');

module.exports = function(request) {
  return {

    /**
     * Send a message
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {Object}   body            Message body
     * @param  {Function} callback        Callback function
     */
    send: send.bind(null, null),

    /**
     * Send a message with de-duplicating UUID
     *
     * @param  {String}   dedupe          UUID
     * @param  {String}   conversationId  Conversation ID
     * @param  {Object}   body            Message body
     * @param  {Function} callback        Callback function
     */
    sendDedupe: send,

    /**
     * Send a plain text message from `userId`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   userId         User ID
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTextFromUser: function(conversationId, userId, text, callback) {
      send(null, conversationId, utils.messageText('user_id', userId, text), callback);
    },

    /**
     * Send a plain text message from `name`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   name           Sender name
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTextFromName: function(conversationId, name, text, callback) {
      send(null, conversationId, utils.messageText('name', name, text), callback);
    }
  };

  function send(dedupe, conversationId, body, callback) {
    if (dedupe !== null && !utils.toUUID(dedupe)) return callback(new Error(utils.i18n.dedupe));
    conversationId = utils.toUUID(conversationId);
    if (!conversationId) return callback(new Error(utils.i18n.messages.cid));
    if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.messages.body));
    utils.debug('Message send: ' + conversationId);

    request.post({
      path: '/conversations/' + conversationId + '/messages',
      body: body,
      dedupe: dedupe
    }, callback || utils.nop);
  }
};
