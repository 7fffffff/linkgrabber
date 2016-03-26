import chrome from 'chrome';

function allLinks () {
  return document.querySelectorAll('a:link:not([href^=javascript])');
}

if (allLinks().length > 0) {
  chrome.extension.sendMessage(null, 'showAction');
  chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    if (message !== 'getLinks') {
      return;
    }
    const elements = allLinks();
    const links = new Array(elements.length);
    for (let i = 0; i < elements.length; i++) {
      links[i] = {
        hash: elements[i].hash,
        host: elements[i].host,
        hostname: elements[i].hostname,
        href: elements[i].href,
        pathname: elements[i].pathname,
        search: elements[i].search,
        text: elements[i].text,
      };
    }
    sendResponse(links);
  });
}
