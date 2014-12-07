/**
 * Request body filter
 */

var filter = {
  urls: ['<all_urls>'],
  types: ['xmlhttprequest']
};

/**
 * Keep track of pending submissions
 */

var pending = {};

/**
 * Listen for requests
 */

chrome.webRequest.onBeforeSendHeaders.addListener(handleBefore, filter, ['blocking', 'requestHeaders']);

/**
 * Handle a request
 */

function handleBefore(details) {
  var sent = {};
  var headers = details.requestHeaders.filter(function(header) {
    var name = header.name.toLowerCase();
    if (name !== 'x-hyper-client' || header.value !== 'hyper.chrome') return true;
    pending[details.requestId] = true;
    return false;
  });

  return {
    requestHeaders: headers
  };
}

/**
 * Listen for redirects
 */

chrome.webRequest.onBeforeRedirect.addListener(handleRedirect, filter, ['responseHeaders']);

/**
 * Handle a redirect
 */

function handleRedirect(details) {
  var id = details.requestId;
  if (!pending[id]) return;
  delete pending[id];

  chrome.tabs.update(details.tabId, {url: details.redirectUrl});
}

/**
 * Listen for completions
 */

chrome.webRequest.onCompleted.addListener(handleComplete, filter);

/**
 * Handle a complete
 */

function handleComplete(details) {
  delete pending[details.requestId];
}
