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

function blockDomains(links, blockedDomains) {
  if (!blockedDomains || blockedDomains.length === 0) {
    return links;
  }
  const blockPattern = domainPattern(blockedDomains);
  return links.reduce(function(acc, link) {
    if (!blockPattern.exec(link.hostname)) {
      acc.push(link);
    }
    return acc;
  }, []);
}

chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
  chrome.storage.sync.get(null, function (options) {
    chrome.runtime.getBackgroundPage(function (page) {
      var data = page.tabData[tabs[0].id];
      if (data) {
        document.title = 'Extracted Links for ' + data.source;
        const links = blockDomains(data.links, options.blockedDomains);
        ReactDOM.render(
          <LinkList
            links={links}
            source={data.source}
            dedup={options.dedup}
            expired={false} />
        , target);
      } else {
        ReactDOM.render(<LinkList expired={true} />, target);
      }
    });
  });
});
