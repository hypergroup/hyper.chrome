/**
 * Module dependencies
 */

const dom = require('react').createElement;
const store = require('../../lib/host-storage');

module.exports = renderHeaders;

/**
 * Render headers
 */

function renderHeaders() {
  const host = '' + window.location;
  const headers = store.getHeaders(host) || {};

  function addHeader(evt) {
    evt.preventDefault();
    const target = evt.target;
    const name = target.elements[0].value;
    store.setHeader(host, name, '');
    target.reset();
  }

  if (window.location.protocol === 'chrome-extension:') return null;

  return (
    dom('div', {className: 'headers'},
      Object.keys(headers).map(name => {
        let value = headers[name];

        function onSubmit(evt) {
          evt.preventDefault();
          store.setHeader(host, name, value);
          window.location.reload();
        }

        function update(evt) {
          value = evt.target.value;
        }

        function remove() {
          store.removeHeader(host, name);
        }

        return (
          dom('form', {className: 'header', key: name, onSubmit: onSubmit},
            dom('span', null, name + ': '),
            dom('input', {type: 'text', defaultValue: value, onChange: update}),
            dom('a', {className: 'close', href: 'javascript:;', onClick: remove}, '×')
          )
        );
      }),
      dom('form', {className: 'add-header', onSubmit: addHeader},
        dom('input', {placeholder: 'Add header', name: 'value', type: 'text'})
      )
    )
  );
}
