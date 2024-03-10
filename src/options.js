import React from 'react';
import {createRoot} from 'react-dom/client';
import Options from './components/Options';

function setBlockedDomains(domains) {
  const next = [];
  for (let domain of domains) {
    domain = domain.trim();
    if (!domain) {
      continue;
    }
    next.push(domain);
  }
  chrome.storage.sync.set({blockedDomains: next});
}

const root = createRoot(document.getElementById('Options'));

function render(storage) {
  root.render(
    <Options
      blockedDomains={storage.blockedDomains}
      setBlockedDomains={setBlockedDomains} />
  );
}

let stored = {};

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (let key in changes) {
    stored[key] = changes[key].newValue;
  }
  render(stored);
});

chrome.storage.sync.get(null, items => {
  stored = items;
  if (stored.blockedDomains == null) {
    stored.blockedDomains = [];
  }
  render(stored);
});
