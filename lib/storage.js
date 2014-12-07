/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var storage = chrome.storage.local;
var store = {};

/**
 * Initialize the local store
 */

storage.get('hyper', function(value) {
  store = JSON.parse(value['hyper'] || '{}');
});

/**
 * Subscribe to any updates
 */

chrome.storage.onChanged.addListener(function(changes) {
  for (var key in changes) {
    store[key] = changes[key];
  }
  exports.emit('change');
});

/**
 * Get a value
 */

exports.get = function(key) {
  return store[key];
};

/**
 * Set a value
 */

exports.set = function(key, value) {
  store[key] = value;
  storage.set({'hyper': JSON.stringify(store)});
};

/**
 * Mixin Emitter
 */

Emitter(exports);
