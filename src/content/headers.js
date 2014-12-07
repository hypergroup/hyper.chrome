/**
 * Module dependencies
 */

var dom = require('react').createElement;
var store = require('../../lib/host-storage');

module.exports = renderHeaders;

/**
 * Render headers
 */

function renderHeaders() {
  var headers = store.getHeaders('' + window.location) || {};

  function addHeader() {

  }

  return (
    dom('div', {className: 'headers'},
      Object.keys(headers).map(function(name) {
        function update() {

        }

        function remove() {

        }

        var value = headers[name];
        return (
          dom('div', {className: 'header', key: name},
            dom('span', null, name + ': '),
            dom('input', {type: 'text', value: value, onChange: update}),
            dom('a', {href: 'javascript:;', onClick: remove}, 'remove')
          )
        );
      })
    ),
    dom('form', {className: 'add-header', onSubmit: addHeader},
      dom('input', {placeholder: 'Add header', name: 'value', type: 'text'})
    )
  );
}
