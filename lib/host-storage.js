/**
 * Module dependencies
 */

var parse = require('url').parse;
var storage = require('./storage');

exports.getHeaders = function(url) {
  return storage.get(getKey(url));
};

exports.setHeader = function(url, name, value) {
  var headers = exports.getHeaders(url);
  headers[name] = value;
  return exports.setHeaders(url, headers);
};

exports.removeHeader = function(url, name) {
  var headers = exports.getHeaders(url);
  delete headers[name];
  return exports.setHeaders(url, headers);
};

exports.setHeaders = function(url, headers) {
  storage.set(getKey(url), headers);
  return exports;
};

function getKey(url) {
  return 'headers::' + parse(url).host;
}
