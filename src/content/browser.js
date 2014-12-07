/**
 * Module dependencies
 */

var React = require('react');
var render = require('hyper-browser');
var superagent = require('superagent');
var dom = React.createElement;
var merge = require('utils-merge');
var renderHeaders = require('./headers');
require('./style.css');

/**
 * Create the HyperChrome class
 */

var Root = React.createClass({
  displayName: 'HyperChrome',
  getInitialState: function() {
    return {};
  },
  componentWillMount: function() {
    var self = this;
  },
  componentDidMount: function() {
    setTimeout(function() {
      var el = document.getElementById(window.location.hash.replace('#', ''));
      el && el.scrollIntoView();
    });
  },
  componentWillReceiveProps: function(next) {
    this.setState(next);
  },

  render: function() {
    var self = this;
    var opts = {
      // hiddenField: {name: '___HYPER_CHROME___', value: '1'},
      onChange: onChange,
      onSubmit: onSubmit,
      getValue: getValue
    };

    function onSubmit(inputs, evt) {
      var target = evt.target;
      var method = target.method;
      if (method.toLowerCase() === 'get') return;
      // We'll need to wait until chrome can modify the requestBody or
      // json form submission is ready
      evt.preventDefault();
      var obj = inputs.reduce(function(acc, input) {
        acc[input.name] = self.state[input.path];
        return acc;
      }, {});

      superagent(method, target.action)
        .send(obj)
        .end(function(err, res) {
          if (err) return self.setState({error: err});
          console.log(res);
        });
    }

    function onChange(path, evt) {
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
          render(this.props.value, dom, opts)
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
