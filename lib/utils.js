'use strict';

var util = require('util');

var UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

exports.isArray = util.isArray;

/**
 * Return a value only if UUID format
 *
 * @param  {String} val Input string
 */
exports.toUUID = function(val) {
  if (!val || typeof val !== 'string') return null;

  val = val.substr(val.lastIndexOf('/') + 1); // omit the prefix
  if (val.match(UUID)) return val;
  else return null;
};

exports.debug = function(val) {
  if (process.env.LAYER_API_DEBUG !== 'true') return;
  console.log('[LayerAPI] ' + val);
};

exports.nop = function() {};

/**
 * Error messages
 */
exports.i18n = {
  layerapi: {
    token: 'You need to pass a valid `token` to constructor',
    appId: 'You need to pass a valid `appId` to constructor'
  },
  conversations: {
    body: 'Conversation body is required',
    id: 'Conversation ID is required',
    operations: 'Conversation operations should be array'
  },
  messages: {
    cid: 'Conversation ID is required',
    body: 'Message body is required'
  },
  participants: {
    cid: 'Conversation ID is required',
    value: 'Participants value is required'
  },
  metadata: {
    cid: 'Conversation ID is required',
    property: 'Medatata property is required',
    value: 'Metadata value is required'
  },
  announcements: {
    body: 'Announcements body is required'
  },
  dedupe: 'De-duplicating UUID value is required'
};
