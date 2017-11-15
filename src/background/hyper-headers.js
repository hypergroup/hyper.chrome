/**
 * Module dependencies
 */

const store = require('../../lib/host-storage');

/**
 * Response filter
 */

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'sub_frame', 'xmlhttprequest']
};

/**
 * Listen for responses
 */

browser.webRequest.onBeforeSendHeaders.addListener(handle, filter, ['blocking', 'requestHeaders']);

/**
 * Handle a response
 */

function handle(details) {
  let headers = store.getHeaders(details.url);
  let isXHR = details.type === 'xmlhttprequest';

  if (!headers) return;
  if (isXHR && !isHyperBrowser(details)) return;

  let reqHeaders = details.requestHeaders;
  let sent = {};
  reqHeaders.forEach(function(header) {
    let name = header.name.toLowerCase();
    let value = headers[name];
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

function isHyperBrowser(details) {
  let headers = details.requestHeaders;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === 'x-hyper-client' && headers[i].value === 'hyper.browser') return true;
  }
  return false;
}
