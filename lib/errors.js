'use strict';

var util = require('util');

/**
 * ResponseError object
 *
 * @param {Number} status   HTTP error status
 * @param {String} message  HTTP response message
 * @param {Object} body     Error body
 */
function ResponseError(status, body) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;

  this.status = status;
  this.body = body;
}
util.inherits(ResponseError, Error);

/**
 * API Error object
 *
 * @param {String}  message   Error message
 * @param {Object}  error     Error object
 * @param {Any}     response  Response data
 */
function APIError(message, error, response) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;

  this.message = message;
  this.error = error;
  this.response = response;
}
util.inherits(APIError, Error);

exports.ResponseError = ResponseError;
exports.APIError = APIError;
