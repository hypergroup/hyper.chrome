/**
 * Module dependencies
 */

var dom = require('react').createElement;

module.exports = function(id, hasResult) {
  function onChange(evt) {
    var val = evt.target.value;
    if (val && val.charAt(0) !== '/') val = '/' + val;
    if (val === '/') val = '';
    if (val) val = '#' + val;
    window.location.hash = val;
  }

  var found = id ? (hasResult ? ' found' : ' missing') : '';

  return (
    dom('div', {className: 'search' + found},
      dom('input', {ref: 'search-field', type: 'text', value: id, onChange: onChange})
    )
  );
};
