import chrome from 'chrome';
import React from 'react';
import ReactDOM from 'react-dom';
import Options from './components/Options';

function setBlockedDomains (domains) {
  chrome.storage.sync.set({blockedDomains: domains});
}

function render(storage) {
  ReactDOM.render(
    <Options
      blockedDomains={storage.blockedDomains}
      setBlockedDomains={setBlockedDomains} />
    , document.getElementById('Options'));
}

let stored = {};

chrome.storage.onChanged.addListener(function (changes, areaName) {
  for (let key in changes) {
    stored[key] = changes[key].newValue;
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
