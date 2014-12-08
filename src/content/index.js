/**
 * Wait for the body to load and try to parse it
 */

window.addEventListener('load', function() {
  var obj = content();
  if (!obj) return;
  require('./browser')(obj, document.body);
}, false);

/**
 * Try to parse a hyper+json response
 */

function content() {
  if (!document.body) return;
  var el = document.body.children[0];
  if (!el || el.tagName !== 'PRE') return;
  try {
    var body = JSON.parse(el.innerHTML || inlineJson());
    if (body && typeof body === 'object') return body;
  } catch (err) {}
}

function inlineJson() {
  if (window.location.protocol !== 'chrome-extension:') return;
  return decodeURIComponent(window.location.search.slice(1));
}
