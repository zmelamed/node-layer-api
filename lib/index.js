'use strict';

var pkg = require('../package.json');
var utils = require('./utils');

var Request = require('./request');

var RESOURCES = ['conversations', 'messages', 'announcements'];

/**
 * Layer API constructor
 *
 * @param  {Object} options  Options parameters
 *   @property {String} token Layer Platform API token
 *   @property {String} appId Layer Application ID
 */
var LayerAPI = module.exports = function(options) {
  options = options || {};
  if (!options.token) throw new Error(utils.i18n.layerapi.token);
  options.appId = utils.toUUID(options.appId);
  if (!options.appId) throw new Error(utils.i18n.layerapi.appId);

  var request = new Request(options);
  RESOURCES.forEach(function(type) {
    LayerAPI.prototype[type] = require('./resources/' + type)(request);
  });

  process.env.LAYER_API_DEBUG = options.debug || false;
  utils.debug('Initialized v' + pkg.version + ' with appId: ' + options.appId);
};
