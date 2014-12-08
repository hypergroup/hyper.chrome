/**
 * Module dependencies
 */

var React = require('react');
var render = require('hyper-browser');
var superagent = require('superagent');
var dom = React.createElement;
var merge = require('utils-merge');
var renderHeaders = require('./headers');
var renderSearch = require('./search');
var storage = require('../../lib/storage');
require('./style.styl');

/**
 * Get the hash for the current page
 */

function getHash() {
  return window.location.hash.substr(1);
}

/**
 * Create the HyperChrome class
 */

var Root = React.createClass({
  displayName: 'HyperChrome',
  getInitialState: function() {
    var hash = getHash();
    return {
      value: this.props.value,
      activeId: hash
    };
  },

  handleHashUpdate: function() {
    var hash = getHash();
    var el = document.getElementById(hash);
    this.setState({
      activeId: hash,
      hasActiveId: !!el
    });
    this.refs['search-field'].getDOMNode().focus();
    el && el.scrollIntoViewIfNeeded();
  },

  handleSubmit: function(evt, data) {
    var self = this;
    var target = evt.target;
    var method = target.method;
    if (method.toLowerCase() === 'get') return;
    evt.preventDefault();

    superagent(method, target.action)
      .set({'x-hyper-client': 'hyper.chrome'})
      .send(data)
      .end(function(err, res) {
        if (err) return self.setState({error: err});
        var href = res.headers['content-location'] || res.headers['location'];
        if (href && href !== window.location.href) return window.location = href;
        var body = res.body;
        if (body) {
          if (body.href && body.href !== window.location.href) return window.location = body.href;
          return self.setState({value: res.body});
        }
        // TODO what do we do if we get here?
      });
  },

  componentWillMount: function() {
    var self = this;
    window.addEventListener("hashchange", this.handleHashUpdate, false);
    storage.on('change', function() {
      self.forceUpdate();
    });
  },
  componentDidMount: function() {
    var self = this;
    setTimeout(function() {
      var el = document.getElementById(self.state.activeId);
      el && el.scrollIntoViewIfNeeded();
      self.setState({hasActiveId: !!el});
    });
  },
  componentWillReceiveProps: function(next) {
    this.setState(next);
  },

  render: function() {
    var self = this;
    var opts = {
      activeId: self.state.activeId,
      // hiddenField: {name: '___HYPER_CHROME___', value: '1'},
      onChange: onChange,
      onSubmit: this.handleSubmit,
      onUpdateHash: onUpdateHash,
      getValue: getValue
    };

    function onUpdateHash(evt) {
      evt.preventDefault();
      var hash = evt.target.href.split('#')[1];
      history.replaceState('', document.title, '#' + hash);
      window.dispatchEvent(new Event('hashchange'));
    }

    function onChange(evt, path) {
      var update = {};
      update[path] = evt.target.value;
      self.setState(update);
    }

    function getValue(path) {
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
 * Initialize a HyperChrome instance for a given node
 *
 * @param {Object} val
 * @param {Node} el
 * @param {Object?} opts
 */

module.exports = function(val, el) {
  var out = dom(Root, {value: val});
  return React.render(out, el);
};
