import React from 'react';
import {createRoot} from 'react-dom/client';
import LinkList from './components/LinkList';

const target = document.getElementById('LinkList');
const root = createRoot(target);

function blockedDomainsSet(blockedDomains) {
  const set = new Set();
  for (let domain of blockedDomains) {
    domain = domain.trim().toLowerCase();
    if (!domain || domain[0] == '#') {
      continue;
    }
    set.add(domain);
  }
  return set;
}

chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
  chrome.storage.sync.get(null, ({blockedDomains}) => {
    chrome.runtime.getBackgroundPage(page => {
      var data = page.tabData[tabs[0].id];
      if (!data) {
        root.render(<LinkList expired={true} />);
        return;
      }
      document.title = 'Extracted Links for ' + data.source;
      root.render(
        <LinkList
          blockedDomains={blockedDomainsSet(blockedDomains)}
          expired={false}
          links={data.links}
          source={data.source} />
      );
    });
  });
});
