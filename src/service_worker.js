const DEFAULT_SETTINGS = {
  blockedDomains: [
    'bad1.example.com',
    'bad2.example.com',
    'bad4.example.com'
  ]
};

const DEFAULT_SESSION = {
  tabData: {}
};

const CONTENT_SCRIPT_PATH = 'js/contentscript.js';
const LINKS_PAGE_PATH = 'html/links.html';

const handleError = () => {
  if (chrome.runtime.lastError) {
    console.warn('Chrome runtime error:', chrome.runtime.lastError);
  }
};

const createContextMenu = () => {
  chrome.contextMenus.create({
    id: 'Link Grabber',
    title: 'Link Grabber',
    contexts: ['page'],
    documentUrlPatterns: [
      'http://*/*',
      'https://*/*',
      'file://*/*'
    ]
  }, handleError);
};

const executeContentScript = async (tab) => {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [CONTENT_SCRIPT_PATH]
  });
};

const handleTabRemoval = async (tabId) => {
  const session = await chrome.storage.session.get(DEFAULT_SESSION);
  delete session.tabData[tabId];
  await chrome.storage.session.set(session);
};

const handleLinksFound = async (msg, sender) => {
  const { tab } = sender;
  const session = await chrome.storage.session.get(DEFAULT_SESSION);
  
  // Store the found links in session storage
  session.tabData[tab.id] = {
    source: tab.url,
    links: msg.links
  };
  await chrome.storage.session.set(session);

  // Open links page in new tab
  await chrome.tabs.create({
    index: tab.index + 1,
    openerTabId: tab.id,
    url: `${chrome.runtime.getURL(LINKS_PAGE_PATH)}?tab_id=${tab.id}`
  });
};

// Event Listeners
chrome.runtime.onInstalled.addListener(async () => {
  const options = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  await chrome.storage.sync.set(options);
  createContextMenu();
});

chrome.action.onClicked.addListener(executeContentScript);
chrome.contextMenus.onClicked.addListener((_, tab) => executeContentScript(tab));
chrome.tabs.onRemoved.addListener(handleTabRemoval);

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'links-found') {
    handleLinksFound(msg, sender);
    return true; // Keep message channel open for async response
  }
});