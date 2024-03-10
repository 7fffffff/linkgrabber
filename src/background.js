const DEFAULT_SETTINGS = {
  blockedDomains: ['bad1.example.com', 'bad2.example.com', 'bad4.example.com'],
};

const tabData = {};
window.tabData = tabData;

function warnLastError() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError); // eslint-disable-line
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, options => {
    chrome.storage.sync.set(options);
  });
  chrome.contextMenus.create({
    id: 'Link Grabber',
    title: 'Link Grabber',
    contexts: ['page'],
    documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*'],
  }, warnLastError);
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.id, {
    file: 'js/contentscript.js',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.executeScript(tab.id, {
    file: 'js/contentscript.js',
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete tabData[tabId];
});

chrome.runtime.onMessage.addListener(({links}, sender, sendResponse) => {
  const tab = sender.tab;
  chrome.tabs.create({
    index: tab.index + 1,
    openerTabId: tab.id,
    url: chrome.runtime.getURL('html/links.html'),
  }, (newTab) => {
    tabData[newTab.id] = {
      source: tab.url,
      links: links,
    };
  });
});