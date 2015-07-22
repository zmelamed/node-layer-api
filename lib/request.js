'use strict';

var https = require('https');

var utils = require('./utils');

var ResponseError = require('./errors').ResponseError;
var APIError = require('./errors').APIError;

var API = {
  host: 'api.layer.com',
  prefix: '/apps/',
  port: 443,
  methods: ['get', 'post', 'patch']
};
var TIMEOUT = 10 * 1000;

/**
 * Request constructor
 *
 * @param  {Object} options Options
 *   @property {String} appId Application ID
 *   @property {String} token Platform API token
 */
var Request = module.exports = function(options) {
  this.appId = options.appId;
  this.token = options.token;
};

/**
 * Expose supported HTTP methods
 */
API.methods.forEach(function(method) {
  Request.prototype[method] = function(params, callback) {
    request(this, method, params, callback);
  };
});

function request(options, method, params, callback) {

  var headers = {
    Accept: 'application/vnd.layer+json; version=1.0',
    Authorization: 'Bearer ' + options.token
  };

  if (method === 'patch') headers['Content-Type'] = 'application/vnd.layer-patch+json';
  else headers['Content-Type'] = 'application/json';

  var req = https.request({
    host: API.host,
    port: API.port,
    path: API.prefix + options.appId + params.path,
    method: method.toUpperCase(),
    headers: headers
  });

  req.setTimeout(TIMEOUT, timeout.bind(null, req, callback));
  req.on('error', error.bind(null, req, callback));
  req.on('response', response.bind(null, callback));

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

      if (res.statusCode >= 300) callback(new ResponseError(res.statusCode, payload));
      else callback(null, {status: res.statusCode, body: payload});
    } catch(e) {
      callback(new APIError('Error parsing JSON payload', e, payload));
    }
  });
}

function error(req, callback, err) {
  if (req._isAborted) return;
  utils.debug('Request error: ' + err);

  callback(err);
}

function timeout(req, callback) {
  utils.debug('Request timeout error after ' + TIMEOUT / 1000 + 'seconds');

  req._isAborted = true;
  req.abort();
  callback(new APIError('Request timeout after ' + TIMEOUT / 1000 + 'seconds.'));
}
