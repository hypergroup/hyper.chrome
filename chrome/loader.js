(function() {
var jssrc = document.currentScript.getAttribute('data-script');
var csssrc = document.currentScript.getAttribute('data-style');

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = jssrc;
script.onload = loadHyperChrome;
document.getElementsByTagName('head')[0].appendChild(script);

function loadHyperChrome() {
  var hyper = require('hyper.chrome');
  if (!hyper(document.body.children[0])) return;
  var style = document.createElement('link');
  style.setAttribute('href', csssrc);
  style.setAttribute('rel', 'stylesheet');
  document.getElementsByTagName('head')[0].appendChild(style);
}
})();
