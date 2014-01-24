var React = require('react');
var superagent = require('superagent');
var type = require('type');
var d = React.DOM;

var DEFAULT_HEADERS = '{"accept": "application/hyper+json", "authorization": "Bearer ", "cache-control": "max-age=0"}';

var hyper = React.createClass({displayName: 'hyper',
  getInitialState: function() {
    var headers = JSON.parse(window.localStorage['hyper-headers'] || DEFAULT_HEADERS);
    return {
      body: this.props.state,
      text: this.props.text,
      headers: headers
    };
  },

  componentDidMount: function() {
    var self = this;
    window.onpopstate = function(e) {
      self.handleAction(window.location + '');
    };
  },

  handleAction: function(href, method, data, push) {
    this.setState({loading: true});
    var self = this;
    var start = new Date();
    method = (method || 'GET').toUpperCase();
    var req = superagent(method, href);

    req.set(self.state.headers);

    if (data && method === 'GET') req.query(data);
    if (data && method !== 'GET') req.send(data);

    req.end(function(err, res) {
      self.setState({loading: false});
      if (err) return self.setState({err: err});

      self.setState({
        body: res.body,
        text: res.text,
        err: null
      });
      var title = res.body.title || res.body.name || href;
      document.title = title;
      if (window.location === href || method !== 'GET') return;
      if (push) window.history.pushState(true, title, req.url);
    });
    return false;
  },

  render: function() {
    var s = this.state;
    var self = this;

    function createAction(action, method, params) {
      return self.handleAction.bind(self, action, method, params, true);
    }

    var content;
    try {
      content = d.pre({'className': 'content'}, body(s.body, createAction, this.forceUpdate.bind(this)));
    } catch (err) {
      content = [error(err), d.pre({className: 'content'}, s.text)];
    };

    function persistHeaders () {
      window.localStorage.setItem('hyper-headers', JSON.stringify(s.headers));
    }

    function addHeader(e) {
      var inp = e.target.children[0];
      s.headers[inp.value] = '';
      persistHeaders();
      inp.value = '';
      self.forceUpdate();
      return false;
    }

    return d.div({'className': ''},
      error(s.err),
      content,
      d.div({className: 'headers'},
        Object.keys(s.headers).map(function(name) {
          var val = s.headers[name];

          function changeValue(e) {
            s.headers[name] = e.target.value;
            persistHeaders();
            self.forceUpdate();
          }

          function onClick () {
            delete s.headers[name];
            persistHeaders();
            self.forceUpdate();
          }

          return d.div({className: 'header'},
            d.span({value: name}, name + ': '), d.input({type: 'text', key: 'value', value: val, onChange: changeValue}),
            d.a({href: 'javascript:;', onClick: onClick}, 'remove'));
        }),
        d.form({className: 'add-header', onSubmit: addHeader},
          d.input({placeholder: 'New header', name: 'value', type: 'text'}))
      )
    );
  }
});

function body(content, transition, force) {
  var t = type(content);
  var className = 'level ' + t;
  if (t === 'string') return string(content, transition);
  if (t === 'number') return d.div({className: className}, '' + content);
  if (t === 'boolean') return d.div({className: className}, '' + content);
  if (t === 'array') return d.div({className: className},
    content.map(function(val, i) {
      return d.div({className: 'item', key: i}, body(val, transition));
    })
  );
  if (t !== 'object') return d.div({className: className}, content);

  if (content.action) return form(content, transition, force);

  if (content.src) return image(content, transition, force);

  return object(content, transition, force);
}

var links = /^http[s]?:\/\/|^\//;
function string(str, transition) {
  var content = links.test(str)
    ? d.a({href: str, onClick: transition(str)}, str)
    : str;
  return d.div({className: 'level string'}, content);
}

function form(content, transition, force) {
  var ic = 'item';
  var kc = 'level key';
  var inputs = content.input || {};

  function onSubmit(e) {
    var form = e.target;
    var values = {};
    Object.keys(inputs).forEach(function(key) {
      values[key] = inputs[key].value;
    });
    transition(content.action, content.method, values)();
    return false;
  }

  function onChange(key) {
    return function(e) {
      var val = e.target.value;
      inputs[key].value = val;
      force();
      return true;
    };
  }

  return d.form({className: 'object form level', onSubmit: onSubmit},
    d.div({className: ic, key: 'action'}, d.div({className: kc}, 'action'), string(content.action, transition)),
    d.div({className: ic, key: 'method'}, d.div({className: kc}, 'method'), string(content.method || 'GET',  transition)),
    d.div({className: ic, key: 'input'}, d.div({className: kc}, 'input'),
      d.div({className: 'object level'},
        Object.keys(inputs).map(function(key) {
          return d.div({className: ic},
            d.div({className: kc}, key),
            input(key, inputs[key], transition, onChange));
        })
      )
    ),
    d.div({className: ic, key: 'submit'},
      d.input({className: 'level', type: 'submit', value: 'submit'})
    )
  );
}

function input(key, c, transition, onChange) {
  var opts = c.options || [];
  // opts.unshift(null);

  c.required = c.required ? 'required' : undefined;
  c.type = c.type || 'text';

  var props = {
    className: 'level',
    name: key,
    value: c.value,
    onChange: onChange(key)
  };

  var inp = c.type === 'select'
    ? d.select(props,
       (c.options || []).map(function(option) {
         if (!option) return d.option({key: 'blank'}, '');
         return d.option({value: option.value, required: c.required, key: option.name}, option.name || option.value);
       }))
    : d.input(merge(props, c));

  return d.div({key: key, className: 'object level'},
    kvs(c, transition),
    d.div({className: 'item'}, inp)
  );
}

function object(content, transition, force) {
  return d.div({className: 'object level'}, kvs(content, transition, force));
}

function kvs(content, transition, force) {
  return Object.keys(content).map(function(key) {
    if (!content[key]) return;
    return d.div({className: 'item', key: key}, d.div({className: 'level key'}, key), body(content[key], transition, force));
  });
}

function image(content, transition, force) {
  return d.div({className: 'object level'},
    kvs(content, transition, force),
    d.div({className: 'item'},
    d.img({src: content.src, className: 'item level'})));
}

function error(err) {
  return err
    ? d.div({className: 'error'}, d.pre(null, err.message), d.pre(null, err.stack))
    : null;
}

function merge(a, b) {
  if (b) {
    for (var k in b) {
      if (!a[k]) a[k] = b[k];
    }
  }
  return a;
}

module.exports = function(elem) {
  var init = {state: {}};
  if (elem.innerHTML) {
    init.state = JSON.parse(elem.innerHTML);
    init.text = elem.innerHTML;
  }
  React.renderComponent(hyper(init), elem);
};

