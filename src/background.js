import chrome from 'chrome';

const DEFAULT_SETTINGS = {
  blockedDomains: ['bad.example.com'],
};

const LINKS_PAGE = chrome.extension.getURL('html/links.html');

const tabData = {};
window.tabData = tabData;

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

function warnLastError() {
  if (chrome.runtime.lastError) {
    console.warn(chrome.runtime.lastError);
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

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  if (message === 'showAction') {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  openLinksPage(tab);
});

chrome.pageAction.onClicked.addListener(openLinksPage);

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete tabData[tabId];
});
