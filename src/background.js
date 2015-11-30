import chrome from 'chrome';

const DEFAULT_SETTINGS = {
  dedup: true,
  priorityDomains: ['example.com'],
  blockedDomains: ['bad.example.com']
};

const tabData = {};
window.tabData = tabData;

function warnLastError() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, options => {
    chrome.storage.sync.set(options);
    chrome.contextMenus.create({
      id: 'Link Grabber',
      title: 'Link Grabber',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*']
    }, warnLastError);
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ['http', 'https', 'file'] },
          css: ['a[href^=http], a[href^=https], a[href^=file]']
        }),
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'openLinksPage') {
    return;
  }
  const linksPage = chrome.extension.getURL('html/links.html');
  chrome.tabs.create({
    index: sender.tab.index + 1,
    openerTabId: sender.tab.id,
    url: linksPage
  }, newTab => {
    tabData[newTab.id] = {
      source: sender.tab.url,
      links: message.links
    };
  });
});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(tab.id, {
    file: '/js/contentscript.js'
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.executeScript(tab.id, {
    file: '/js/contentscript.js'
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete tabData[tabId];
});
