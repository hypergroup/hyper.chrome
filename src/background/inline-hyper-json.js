/**
 * Inspired by https://github.com/andreineculau/chrome-inline-media-type
 */

const RE = /hyper\+json *;? *(.*)/;

/**
 * Response filter
 */

const filter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'sub_frame']
};

/**
 * Listen for responses
 */

browser.webRequest.onHeadersReceived.addListener(handle, filter, ['blocking', 'responseHeaders']);

/**
 * Handle a response
 */

function handle(details) {
  let isHyper = false;
  details.responseHeaders.forEach(function(header) {
    if (header.name.toLowerCase() === 'content-type' && RE.test(header.value)) isHyper = true;
  });

  if (!isHyper) return;

  details.responseHeaders.forEach(function(header) {
    if (header.name.toLowerCase() === 'content-disposition') header.value = 'inline';
  });

  return {
    responseHeaders: details.responseHeaders
  };
}
