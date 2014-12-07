var KEY = '___HYPER_BROWSER___';

/**
 * Request body filter
 */

var filter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'sub_frame']
};

/**
 * Listen for responses
 */

chrome.webRequest.onBeforeRequest.addListener(handle, filter, ['blocking', 'requestBody']);

/**
 * Handle a response
 */

function handle(details) {
  var body = details.requestBody;
  if (!body) return;
  var formData = body.formData;
  if (!formData || !formData[KEY]) return;

}
