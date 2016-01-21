import chrome from 'chrome';
import React from 'react';
import ReactDOM from 'react-dom';
import LinkList from './components/LinkList';

const target = document.getElementById('LinkList');

function domainPattern(domains) {
  // ['foo.com', 'bar.com']
  // /^(?:[\w-]+\.)*(?:foo\.com|bar\.com)+$/i
  if (!domains || domains.length <= 0) {
    return new RegExp('(?!x)x'); // a regex that matches nothing
  }
  for (let i = 0; i < domains.length; i++) {
    domains[i] = domains[i].replace(/\./g, '\\.');
  }
  const s = '^(?:[\\w-]+\\.)*(?:' + domains.join('|') + ')+$';
  return new RegExp(s, 'i');
}

chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
  chrome.storage.sync.get(null, options => {
    chrome.runtime.getBackgroundPage(page => {
      var data = page.tabData[tabs[0].id];
      if (data) {
        document.title = 'Extracted Links for ' + data.source;
        ReactDOM.render(
          <LinkList
            blockPattern={domainPattern(options.blockedDomains)}
            expired={false}
            links={data.links}
            source={data.source} />
        , target);
      } else {
        ReactDOM.render(<LinkList expired={true} />, target);
      }
    });
  });
});
