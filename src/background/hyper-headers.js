/**
 * Module dependencies
 */

var store = require('../../lib/host-storage');

/**
 * Response filter
 */

var filter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'sub_frame', 'xmlhttprequest']
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
  var isXHR = details.type === 'xmlhttprequest';

  if (!headers) return;
  if (isXHR && !isHyperChrome(details)) return;

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

/**
 * Check if it's a hyper chrome request
 */

function isHyperChrome(details) {
  var headers = details.requestHeaders;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === 'x-hyper-client' && headers[i].value === 'hyper.chrome') return true;
  }
  return false;
}
