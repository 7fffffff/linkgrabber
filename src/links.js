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

(async function() {
  const queryParams = new URLSearchParams(window.location.search);
  const session = await chrome.storage.session.get('tabData');
  const data = session?.tabData[queryParams.get('tab_id')];
  if (!data) {
    root.render(<LinkList expired={true} />);
    return;
  }
  const {blockedDomains} = await chrome.storage.sync.get(['blockedDomains']);
  document.title = 'Extracted Links for ' + data.source;
  root.render(
    <LinkList
      blockedDomains={blockedDomainsSet(blockedDomains)}
      expired={false}
      links={data.links}
      source={data.source} />
  );
})();