var chrome = require('chrome');
var rejectPattern = /^javascript:|mailto:/;
var hasLinks = false;

for (let i = 0; i < document.links.length; i++) {
  if (!rejectPattern.exec(document.links[i].href)) {
    hasLinks = true;
    break;
  }
}

if (hasLinks) {
  chrome.extension.sendMessage(null, 'showAction');

  chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    if (message !== 'getLinks') {
      return;
    }

    var links = new Array(document.links.length);
    links.length = 0;

    for (let i = 0; i < document.links.length; i++) {
      if (!rejectPattern.exec(document.links[i].href)) {
        links.push({
          hash: document.links[i].hash,
          host: document.links[i].host,
          hostname: document.links[i].hostname,
          href: document.links[i].href,
          pathname: document.links[i].pathname,
          search: document.links[i].search,
          text: document.links[i].text
        });
      }
    }

    sendResponse(links);
  });
}
