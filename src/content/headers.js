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
  var host = '' + window.location;

  var headers = store.getHeaders(host) || {};

  function addHeader(evt) {
    evt.preventDefault();
    var target = evt.target;
    var name = target.elements[0].value;
    store.setHeader(host, name, '');
    target.reset();
  }

  return (
    dom('div', {className: 'headers'},
      Object.keys(headers).map(function(name) {
        function onSubmit(evt) {
          evt.preventDefault();
          window.location.reload();
        }

        function update(evt) {
          var value = evt.target.value;
          store.setHeader(host, name, value);
        }

        function remove() {
          store.removeHeader(host, name);
        }

        var value = headers[name];
        return (
          dom('form', {className: 'header', key: name, onSubmit: onSubmit},
            dom('span', null, name + ': '),
            dom('input', {type: 'text', value: value, onChange: update}),
            dom('a', {href: 'javascript:;', onClick: remove}, '×')
          )
        );
      }),
      dom('form', {className: 'add-header', onSubmit: addHeader},
        dom('input', {placeholder: 'Add header', name: 'value', type: 'text'})
      )
    )
  );
}
