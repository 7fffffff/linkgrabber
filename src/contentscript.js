(function () {
  const elements = document.querySelectorAll('a:link:not([href^=javascript])');
  const links = new Array(elements.length);
  for (let i = 0; i < elements.length; i++) {
    links[i] = {
      hash: elements[i].hash,
      host: elements[i].host,
      hostname: elements[i].hostname,
      href: elements[i].href,
      origin: elements[i].origin,
      pathname: elements[i].pathname,
      search: elements[i].search,
      text: elements[i].text,
    };
  }
  chrome.runtime.sendMessage(null, {type: 'links-found', links: links});
})();
