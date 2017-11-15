global.browser = global.browser || global.chrome;

/**
 * Wait for the body to load and try to parse it
 */

window.addEventListener('load', function() {
  const obj = content();
  if (!obj) return;
  document.body.innerHTML = '<main></main>';
  require('./render')(obj, document.body.children[0]);
}, false);

/**
 * Try to parse a hyper+json response
 */

function content() {
  if (!document.body) return;
  const el = document.body.children[0];
  if (!el || el.tagName !== 'PRE') return;
  try {
    const body = JSON.parse(el.textContent || inlineJson());
    if (body && typeof body === 'object') return body;
  } catch (err) {}
}

function inlineJson() {
  if (window.location.protocol !== 'chrome-extension:') return;
  decodeURIComponent(window.location.search.slice(1));
}
