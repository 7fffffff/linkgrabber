(() => {
  const LINK_PROPERTIES = [
    'hash',
    'host',
    'hostname',
    'href',
    'origin',
    'pathname',
    'search',
    'text'
  ];

  const extractLinkProperties = (element) => {
    return LINK_PROPERTIES.reduce((properties, prop) => {
      properties[prop] = element[prop];
      return properties;
    }, {});
  };

  const getValidLinks = () => {
    const selector = 'a:link:not([href^=javascript])';
    return Array.from(document.querySelectorAll(selector))
      .map(extractLinkProperties);
  };

  const sendLinksToExtension = (links) => {
    chrome.runtime.sendMessage(null, {
      type: 'links-found',
      links
    });
  };

  // Main execution
  const links = getValidLinks();
  sendLinksToExtension(links);
})();
