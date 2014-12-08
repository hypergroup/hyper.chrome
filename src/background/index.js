/**
 * Module dependencies
 */

require('./inline-hyper-json');
require('./hyper-headers');
require('./hyper-intercept-redirect');

// We'll need to wait until chrome can modify the requestBody or
// json form submission is ready
// require('./hyper-form-submit');

/**
 * Listen for omnibox input
 */

chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
  var url = chrome.extension.getURL('inline.html?' + encodeURIComponent(text));
  chrome.tabs.update({url: url});
});
