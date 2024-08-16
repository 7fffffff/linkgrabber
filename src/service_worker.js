const DEFAULT_SETTINGS = {
  blockedDomains: ['bad1.example.com', 'bad2.example.com', 'bad4.example.com'],
};

const DEFAULT_SESSION = {
  tabData: {},
};

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

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files:  ['js/contentscript.js'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['js/contentscript.js'],
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.session.get(DEFAULT_SESSION).then(session => {
    delete session.tabData[tabId];
    chrome.storage.session.set(session);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'links-found') {
    const tab = sender.tab;
    chrome.storage.session.get(DEFAULT_SESSION).then(session => {
      session.tabData[tab.id] = {
        source: tab.url,
        links: msg.links,
      };
      return chrome.storage.session.set(session);
    }).then(() => {
      chrome.tabs.create({
        index: tab.index + 1,
        openerTabId: tab.id,
        url: chrome.runtime.getURL('html/links.html') + '?tab_id=' + String(tab.id),
      });
    });
    return;
  }
});