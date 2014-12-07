/**
 * Module dependencies
 */

var store = require('../../lib/host-storage');

/**
 * Response filter
 */

var filter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'sub_frame']
};

/**
 * Listen for responses
 */

chrome.webRequest.onBeforeSendHeaders.addListener(handle, filter, ['blocking', 'requestHeaders']);

/**
 * Handle a response
 */

function handle(details) {
  var headers = store.getHeaders(details.url);

  if (!headers) return;

  var reqHeaders = details.requestHeaders;
  var sent = {};
  reqHeaders.forEach(function(header) {
    var name = header.name.toLowerCase();
    var value = headers[name];
    if (!value) return;
    header.value = '' + value;
    sent[name] = true;
  });

  Object.keys(headers).forEach(function(name) {
    if (sent[name]) return;
    reqHeaders.push({
      name: name,
      value: '' + headers[name]
    });
  });

  return {
    requestHeaders: reqHeaders
  };
}
