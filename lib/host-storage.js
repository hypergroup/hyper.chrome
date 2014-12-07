/**
 * Module dependencies
 */

var parse = require('url').parse;
var storage = require('./storage');

exports.getHeaders = function(url) {
  return storage.get(getKey(url));
};

exports.setHeaders = function(url, headers) {
  storage.set(getKey(url), headers);
  return exports;
};

function getKey(url) {
  return 'headers::' + parse(url).host;
}
