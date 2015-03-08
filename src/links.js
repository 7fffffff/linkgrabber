var React = require("react");
var LinkList = require("./components/LinkList");

var target = document.getElementById("LinkList");

function domainPattern(domains) {
  // ["foo.com", "bar.com"]
  // /^(?:[\w-]+\.)*(?:foo\.com|bar\.com)+$/i

  if (!domains || domains.length <= 0) {
    return new RegExp("(?!x)x"); // a regex that matches nothing
  }

  for (var i = 0; i < domains.length; i++) {
    domains[i] = domains[i].replace(/\./g, "\\.");
  }

  var s = "^(?:[\\w-]+\\.)*(?:" + domains.join("|") + ")+$";

  return new RegExp(s, "i");
}

function blockDomains(links, blockedDomains) {
  if (!blockedDomains || blockedDomains.length == 0) {
    return links;
  }
  var blockPattern = domainPattern(blockedDomains);
  return links.reduce(function(acc, link) {
    if (!blockPattern.exec(link.hostname)) {
      acc.push(link)
    }
    return acc;
  }, []);
}

chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
  chrome.storage.sync.get(null, function (options) {
    chrome.runtime.getBackgroundPage(function (page) {
      var data = page.tabData[tabs[0].id];
      if (data) {
        document.title = "Extracted Links for " + data.source;
        var links = blockDomains(data.links, options.blockedDomains);
        var component = (
          <LinkList
            links={links}
            source={data.source}
            dedup={options.dedup}
            expired={false} />
        );
        React.render(component, target);
      } else {
        React.render(<LinkList expired={true} />, target);
      }
    });
  });
});