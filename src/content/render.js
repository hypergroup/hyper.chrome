
/**
 * Module dependencies
 */

const React = require('react');
const ReactDOM = require('react-dom');
const createClass = require('create-react-class');
const render = require('hyper-browser');
const superagent = require('superagent');
const dom = React.createElement;
const renderHeaders = require('./headers');
const renderSearch = require('./search');
require('./style.css');

function getHash() {
  return window.location.hash.substr(1);
}

/**
 * Create the HyperBrowser class
 */

const Root = createClass({
  displayName: 'HyperBrowser',
  getInitialState: function() {
    const hash = getHash();
    return {
      value: this.props.value,
      activeId: hash
    };
  },

  handleHashUpdate: function() {
    const hash = getHash();
    const el = document.getElementById(hash);
    this.setState({
      activeId: hash,
      hasActiveId: !!el
    });
    this.refs['search-field'].getDOMNode().focus();
    el && el.scrollIntoViewIfNeeded();
  },

  handleSubmit: function(evt, data, action, method) {
    const self = this;
    const target = evt.target;
    if (method.toLowerCase() === 'get') return;
    evt.preventDefault();

    superagent(method, action)
      .set({'x-hyper-client': 'hyper.browser'})
      .send(data)
      .end(function(err, res) {
        if (err) return self.setState({error: err});
        const href = res.headers['content-location'] || res.headers['location'];
        if (href && href !== window.location.href) return window.location = href;
        const body = res.body;
        if (body) {
          if (body.href && body.href !== window.location.href) return window.location = body.href;
          return self.setState({value: res.body});
        }
        window.location.reload();
      });
  },


  componentWillMount: function() {
    const self = this;
    window.addEventListener('hashchange', self.handleHashUpdate, false);
    browser.storage.onChanged.addListener(function() {
      self.forceUpdate();
    });
  },

  componentDidMount: function() {
    const self = this;
    setTimeout(function() {
      const el = document.getElementById(self.state.activeId);
      el && el.scrollIntoViewIfNeeded();
      self.setState({hasActiveId: !!el});
    });
  },

  componentWillReceiveProps: function(next) {
    this.setState(next);
  },

  render: function() {
    const self = this;

    const opts = {
      activeId: self.state.activeId,
      // hiddenField: {name: '___HYPER_BROWSER___', value: '1'},
      onChange: onChange,
      onSubmit: self.handleSubmit,
      onUpdateHash: onUpdateHash,
      getValue: getValue
    };

    function onUpdateHash(evt) {
      evt.preventDefault();
      const hash = evt.target.href.split('#')[1];
      history.replaceState('', document.title, '#' + hash);
      window.dispatchEvent(new Event('hashchange'));
    }

    function onChange(evt, path, obj) {
      const update = {};
      update[path] = evt.target.value;
      self.setState(update);
    }

    function getValue(path, obj) {
      return self.state[path];
    }

    return (
      dom('div', null,
        renderHeaders(),
        renderSearch(self.state.activeId, self.state.hasActiveId),
        dom('pre', null,
          render(self.state.value, dom, opts)
        )
      )
    );
  }
});

/**
 * Initialize a HyperBrowser instance for a given node
 *
 * @param {Object} val
 * @param {Node} el
 * @param {Object?} opts
 */

module.exports = function(val, el) {
  const out = dom(Root, {value: val});
  return ReactDOM.render(out, el);
};
