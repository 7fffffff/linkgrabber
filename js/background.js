var DEFAULT_SETTINGS = {
  dedup: true,
  priorityDomains: ["example.com"],
  blockedDomains: ["bad.example.com"]
};

var tabData = {};

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, function(options) {
    console.log("Installed");
    console.log(options);
    chrome.storage.sync.set(options);
  });
});

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  if (message === "showAction") {
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.pageAction.onClicked.addListener(function (tab) {
  var linksPage = chrome.extension.getURL("html/links.html");
  var opener = tab;

  chrome.tabs.sendMessage(opener.id, "getLinks", function(links) {
    chrome.tabs.create({
      index: tab.index+1,
      openerTabId: opener.id,
      url: linksPage
    }, function (tab) {
      tabData[tab.id] = {
        source: opener.url,
        links: links
      };
    });
  });
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delete tabData[tabId];
});
