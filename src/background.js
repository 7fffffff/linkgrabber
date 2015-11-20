import chrome from 'chrome';

const DEFAULT_SETTINGS = {
  dedup: true,
  showContextMenuAction: true,
  priorityDomains: ['example.com'],
  blockedDomains: ['bad.example.com']
};

const tabData = {};
window.tabData = tabData;

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(options) {
    chrome.storage.sync.set(options);
  });
});

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  if (message === 'showAction') {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.storage.sync.get(null, function (options) {
  if (options.showContextMenuAction) {
    chrome.contextMenus.create({
      id: 'Link Grabber',
      title: 'Link Grabber',
      contexts: ['page'],
      documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*']
    });
  } else {
    chrome.contextMenus.remove('Link Grabber');
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  openLinksPage(tab);
});

chrome.pageAction.onClicked.addListener(openLinksPage);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delete tabData[tabId];
});

function openLinksPage (tab) {
  const linksPage = chrome.extension.getURL('html/links.html');
  chrome.tabs.sendMessage(tab.id, 'getLinks', function (links) {
    chrome.tabs.create({
      index: tab.index + 1,
      openerTabId: tab.id,
      url: linksPage
    }, function (newTab) {
      tabData[newTab.id] = {
        source: tab.url,
        links: links
      };
    });
  });
}
