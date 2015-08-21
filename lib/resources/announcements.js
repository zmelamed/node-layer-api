'use strict';
/**
 * Announcements resource
 * @module resources/announcements
 */

var utils = require('../utils');

module.exports = function(request) {
  return {

    /**
     * Send an announcement
     *
     * @param  {Object}   body     Announcement body
     * @param  {Function} callback Callback function
     */
    send: send.bind(null, null),

    /**
     * Send an announcement
     *
     * @param  {String}   dedupe    UUID
     * @param  {Object}   body      Announcement body
     * @param  {Function} callback  Callback function
     */
    sendDedupe: send
  };

  function send(dedupe, body, callback) {
    if (dedupe !== null && !utils.toUUID(dedupe)) return callback(new Error(utils.i18n.dedupe));
    if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.announcements.body));
    utils.debug('Announcement send');

    request.post({
      path: '/announcements',
      body: body,
      dedupe: dedupe
    }, callback || utils.nop);
  }
};
