var React = require("react");

function dedup (links) {
  var uniq = {};
  var result = [];
  links.forEach(function (link) {
    if (!uniq[link.href]) {
      result.push(link);
      uniq[link.href] = true;
    }
  });
  return result;
}

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

function groupByDomain(links) {
  links.sort(function (a, b) {
    var ahr = a.hostname.split(".").reverse().join(".");
    var bhr = b.hostname.split(".").reverse().join(".");
    if (ahr < bhr) {
      return -1;
    }
    if (ahr > bhr) {
      return 1;
    }
    if (a.pathname < b.pathname) {
      return -1;
    }
    if (a.pathname > b.pathname) {
      return 1;
    }
    if (a.search < b.search) {
      return -1;
    }
    if (a.search > b.search) {
      return 1;
    }
    if (a.hash < b.hash) {
      return -1;
    }
    if (a.hash > b.hash) {
      return 1;
    }
    return 0;
  });
  return links;
}

var LinkList = React.createClass({
  componentDidMount: function () {
    var self = this;
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
      chrome.storage.sync.get(null, function (options) {
        chrome.runtime.getBackgroundPage(function (page) {
          var data = page.tabData[tabs[0].id];
          if (data) {
            self.setState({
              links: blockDomains(data.links, options.blockedDomains),
              source: data.source,
              expired: false,
              dedup: options.dedup
            });
            document.title = "Extracted Links for " + self.state.source;
          } else {
            self.setState({
              expired: true
            })
          }
        });
      });
    });
  },
  getInitialState: function () {
    return {
      links: [],
      source: null,
      expired: false,
      dedup: true,
      groupByDomain: false
    };  
  },
  toggleDedup: function () {
    this.setState({
      dedup: !this.state.dedup
    });
  },
  toggleGroupByDomain: function () {
    this.setState({
      groupByDomain: !this.state.groupByDomain
    });
  },
  render: function () {
    if (this.state.expired) {
      return null;
    }
    var links = this.state.links;
    var total = links.length;
    if (total == 0) {
      return null;
    }
    if (this.state.dedup) {
      links = dedup(links);
    }
    if (this.state.groupByDomain) {
      links = groupByDomain(links); 
    }
    links = links.map(function (link, index) {
      return (
        <li key={index}>
          <a href={link.href}>{link.href}</a>
        </li>
      );
    });
    return (
      <div className="container-fluid">
        <h1 className="links-header">{this.state.source}</h1>

        <div className="status">
          {links.length} links of out {total} shown
        </div>
        
        <div className="links-options checkbox">
          <label>
            <input type="checkbox" checked={this.state.dedup} onChange={this.toggleDedup} /> Hide duplicate links
          </label>
          <label>
            <input type="checkbox" checked={this.state.groupByDomain} onChange={this.toggleGroupByDomain} /> Group by domain
          </label>
        </div>

        <ul className="links-list">
          {links}
        </ul>
      </div>
    );
  }
});

React.render(<LinkList />, document.getElementById("LinkList"))