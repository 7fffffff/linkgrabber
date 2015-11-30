import chrome from 'chrome';
const acceptPattern = /^(?:http:|https:|file:)/;

const links = new Array(document.links.length);
links.length = 0;
for (let i = 0; i < document.links.length; i++) {
  if (acceptPattern.exec(document.links[i].href)) {
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

if (links.length > 0) {
  chrome.runtime.sendMessage(null, {
    type: 'openLinksPage',
    links: links
  });
}
