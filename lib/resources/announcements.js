'use strict';

var utils = require('../utils');

module.exports = function(request) {
  return {
    /**
     * Send an announcement
     *
     * @param  {Object}   body     Announcement body
     * @param  {Function} callback Callback function
     */
    send: function(body, callback) {
      if (!body || typeof body !== 'object') return callback(new Error(utils.i18n.announcements.body));
      utils.debug('Announcement send');

      request.post({
        path: '/announcements',
        body: body
      }, callback || utils.nop);
    }
  };
};
