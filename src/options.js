import chrome from 'chrome';
import {createRoot} from 'react-dom/client';
import Options from './components/Options';

function setBlockedDomains (domains) {
  chrome.storage.sync.set({blockedDomains: domains});
}

function render(storage) {
  const root = createRoot(document.getElementById('Options'));
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
