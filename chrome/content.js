// var hyper = require('hyper.chrome');
// hyper(document.getElementById('main'));

(function() {

if (document.body && (document.body.childNodes[0] && document.body.childNodes[0].tagName == "PRE" || document.body.children.length == 0)) {
  loadScript(chrome.extension.getURL('build/build.js'));
}

function loadScript(href) {
  var script = document.createElement('script');
  if (!script) return;
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', href);
  script.setAttribute('onload', "require('hyper.chrome')(document.body.children[0]) && loadStyle(chrome.extension.getURL('build/build.css'))");
  document.getElementsByTagName('head')[0].appendChild(script);
}

function loadStyle(href) {
  var style = document.createElement('link');
  style.setAttribute('href', href);
  style.setAttribute('rel', 'stylesheet');
  document.getElementsByTagName('head')[0].appendChild(style);
}

})();
