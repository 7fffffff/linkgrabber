var chrome = require('chrome');
var React = require('react');
var ReactDOM = require('react-dom');
var Options = require('./components/Options');

function setBlockedDomains (domains) {
  chrome.storage.sync.set({blockedDomains: domains});
}

function render(storage) {
  var component = (
    <Options blockedDomains={storage.blockedDomains} setBlockedDomains={setBlockedDomains} />
  );
  ReactDOM.render(component, document.getElementById('Options'));
}

var stored = {};

chrome.storage.onChanged.addListener(function (changes, areaName) {
  for (var key in changes) {
    var storageChange = changes[key];
    stored[key] = storageChange.newValue;
  }
  render(stored);
});

chrome.storage.sync.get(null, function (items) {
  stored = items;
  if (stored.blockedDomains == null) {
    stored.blockedDomains = [];
  }
  render(stored);
});
