(function() {
if (document.body && (document.body.childNodes[0] && document.body.childNodes[0].tagName == "PRE" || document.body.children.length == 0)) {
  var href = chrome.extension.getURL('loader.js');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = href;
  script.setAttribute('data-style', chrome.extension.getURL('build/build.css'));
  script.setAttribute('data-script', chrome.extension.getURL('build/build.js'));
  document.getElementsByTagName('head')[0].appendChild(script);
}
})();
