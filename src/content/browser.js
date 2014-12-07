/**
 * Module dependencies
 */

var React = require('react');
var render = require('hyper-browser');
var superagent = require('superagent');
var dom = React.createElement;
var merge = require('utils-merge');
var renderHeaders = require('./headers');
var storage = require('../../lib/storage');
require('./style.styl');

/**
 * Create the HyperChrome class
 */

var Root = React.createClass({
  displayName: 'HyperChrome',
  getInitialState: function() {
    return {
      value: this.props.value,
      activeId: window.location.hash.replace('#', '')
    };
  },
  componentWillMount: function() {
    var self = this;
    window.addEventListener("hashchange", function() {
      self.setState({activeId: window.location.hash.replace('#', '')});
    }, false);

    storage.on('change', function() {
      self.forceUpdate();
    });
  },
  componentDidMount: function() {
    var self = this;
    setTimeout(function() {
      var el = document.getElementById(self.state.activeId);
      el && el.scrollIntoView();
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
      onSubmit: onSubmit,
      getValue: getValue
    };

    function onSubmit(evt, data) {
      var target = evt.target;
      var method = target.method;
      if (method.toLowerCase() === 'get') return;
      evt.preventDefault();

      superagent(method, target.action)
        .set({'x-hyper-client': 'hyper.chrome'})
        .send(data)
        .end(function(err, res) {
          if (err) return self.setState({error: err});
          if (res.body) return self.setState({value: res.body});
          // TODO what do we do here?
        });
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
        dom('pre', null,
          render(this.state.value, dom, opts)
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
