const KEY = '___HYPER_BROWSER___';

/**
 * Request body filter
 */

const filter = {
  urls: [
    '<all_urls>'
  ],
  types: [
    'main_frame',
    'sub_frame'
  ]
};

/**
 * Listen for responses
 */

browser.webRequest.onBeforeRequest.addListener(handle, filter, ['blocking', 'requestBody']);

/**
 * Handle a response
 */

function handle(details) {
  let body = details.requestBody;
  if (!body) return;
  let formData = body.formData;
  if (!formData || !formData[KEY]) return;

}
