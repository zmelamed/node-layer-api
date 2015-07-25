'use strict';

var https = require('https');

var utils = require('./utils');

var ResponseError = require('./errors').ResponseError;
var APIError = require('./errors').APIError;

var API = {
  host: 'api.layer.com',
  prefix: '/apps/',
  port: 443,
  methods: ['get', 'post', 'delete', 'patch']
};

/**
 * Request constructor
 *
 * @param  {Object} config Configuration values
 *   @property {String} appId Application ID
 *   @property {String} token Platform API token
 */
module.exports = function(config) {
  this.token = config.token;
  this.appId = config.appId;

  // defaults for optional values
  this.version = config.version || '1.0';
  this.timeout = config.timeout || 10000;

  // expose request methods
  API.methods.forEach(function(method) {
    this[method] = request.bind(this, method);
  }, this);
};

/**
 * Request implementation
 *
 * @param  {String}   method   HTTP method type
 * @param  {Object}   params   Parameters passed in from the resource
 * @param  {Function} callback Callback function
 */
function request(method, params, callback) {

  var headers = {
    Accept: 'application/vnd.layer+json; version=' + this.version,
    Authorization: 'Bearer ' + this.token
  };

  if (method === 'patch') headers['Content-Type'] = 'application/vnd.layer-patch+json';
  else headers['Content-Type'] = 'application/json';

  if (params.dedupe) headers['If-None-Match'] = params.dedupe;

  var req = https.request({
    host: API.host,
    port: API.port,
    path: API.prefix + this.appId + params.path,
    method: method.toUpperCase(),
    headers: headers
  });

  req.setTimeout(this.timeout, timeout.bind(this, req, callback));
  req.on('error', error.bind(this, req, callback));
  req.on('response', response.bind(this, callback));

  req.on('socket', function(socket) {
    socket.on(('secureConnect'), function() {
      if (params.body) req.write(JSON.stringify(params.body));
      req.end();
    });
  });
}

function response(callback, res) {
  utils.debug('Response HTTP ' + res.statusCode);

  var payload = '';

  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    payload += chunk;
  });

  res.on('end', function() {
    try {
      payload = payload ? JSON.parse(payload) : null;
    } catch(e) {
      return callback(new APIError('Error parsing JSON payload', e, payload));
    }

    if (res.statusCode >= 300) callback(new ResponseError(res.statusCode, payload));
    else callback(null, {status: res.statusCode, body: payload});
  });
}

function error(req, callback, err) {
  if (req._isAborted) return;
  utils.debug('Request error: ' + err);

  callback(err);
}

function timeout(req, callback) {
  utils.debug('Request timeout error after ' + this.timeout / 1000 + 'seconds');

  req._isAborted = true;
  req.abort();
  callback(new APIError('Request timeout after ' + this.timeout / 1000 + 'seconds.'));
}
