'use strict';

var pkg = require('../package.json');
var utils = require('./utils');

var Request = require('./request');

var RESOURCES = ['conversations', 'messages', 'announcements', 'blocklist'];

/**
 * Layer API constructor
 *
 * @param  {Object} config  Configuration values
 *   @property {String} token Layer Platform API token
 *   @property {String} appId Layer Application ID
 */
module.exports = function(config) {
  config = config || {};
  if (!config.token) throw new Error(utils.i18n.layerapi.token);
  config.appId = utils.toUUID(config.appId);
  if (!config.appId) throw new Error(utils.i18n.layerapi.appId);

  var request = new Request(config);

  RESOURCES.forEach(function(type) {
    this[type] = require('./resources/' + type)(request);
  }, this);

  process.env.LAYER_API_DEBUG = config.debug || false;
  utils.debug('Initialized v' + pkg.version + ' with appId: ' + config.appId);
};
