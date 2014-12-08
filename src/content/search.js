/**
 * Module dependencies
 */

var dom = require('react').createElement;

module.exports = function(id, hasResult) {
  function onChange(evt) {
    var val = evt.target.value;
    if (val && val.charAt(0) !== '/') val = '/' + val;
    if (val === '/') val = '';

    if (val) history.replaceState('', document.title, '#' + val);
    else history.replaceState('', document.title, document.location.href.split('#')[0]);

    window.dispatchEvent(new Event('hashchange'));
  }

  var found = id ? (hasResult ? ' found' : ' missing') : '';

  if (!id) id = '/';

  return (
    dom('div', {className: 'search' + found},
      dom('input', {ref: 'search-field', type: 'text', value: id, onChange: onChange})
    )
  );
};
