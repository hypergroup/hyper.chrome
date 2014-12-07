/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var storage = chrome.storage.local;
var store = {};

/**
 * Initialize the local store
 */

load();

/**
 * Subscribe to any updates
 */

chrome.storage.onChanged.addListener(function(changes) {
  load();
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

/**
 * Load the config
 */

function load() {
  storage.get('hyper', function(value) {
    store = JSON.parse(value['hyper'] || '{}');
    exports.emit('change');
  });
}
