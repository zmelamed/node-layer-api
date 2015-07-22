'use strict';

var utils = require('../utils');

var MIME_TEXT = 'text/plain';

module.exports = function(request) {
  return {

    /**
     * Send a message
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {Object}   body            Message body
     * @param  {Function} callback        Callback function
     */
    send: send,

    /**
     * Send a plain text message from `userId`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   userId         User ID
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTexFromUser: function(conversationId, userId, text, callback) {
      send(conversationId, textBody('user_id', userId, text), callback);
    },

    /**
     * Send a plain text message from `name`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   name           Sender name
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTexFromName: function(conversationId, name, text, callback) {
      send(conversationId, textBody('name', name, text), callback);
    }
  };

  function send(conversationId, body, callback) {
    conversationId = utils.toUUID(conversationId);
    if (!conversationId) return callback(new Error(utils.i18n.messages.cid));
    if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.messages.body));
    utils.debug('Message send: ' + conversationId);

    request.post({
      path: '/conversations/' + conversationId + '/messages',
      body: body
    }, callback || utils.nop);
  }
};

/**
 * Plain text message body
 *
 * @param  {String} type   Sender type
 * @param  {String} sender Sender value
 * @param  {String} text   Message text
 */
function textBody(type, sender, text) {
  var body = {
    sender: {},
    parts: [
      {
        body: text,
        mime_type: MIME_TEXT
      }
    ]
  };
  body.sender[type] = sender;
  return body;
}
