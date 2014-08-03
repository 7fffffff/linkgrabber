/** @jsx React.DOM */

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

var LinkList = React.createClass({displayName: 'LinkList',
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
      dedup: true
    };  
  },
  toggleDedup: function () {
    this.state.dedup = !this.state.dedup;
    this.setState(this.state);
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
    links = links.map(function (link, index) {
      return (
        React.DOM.li({key: index}, 
          React.DOM.a({href: link.href}, link.href)
        )
      );
    });
    var filtered = total - links.length;
    return (
      React.DOM.div({className: "container-fluid"}, 
        React.DOM.h1({className: "links-header"}, this.state.source), 

        React.DOM.div({className: "status"}, 
          links.length, " links of out ", total, " shown"
        ), 
        
        React.DOM.div({className: "checkbox"}, 
          React.DOM.label(null, 
            React.DOM.input({type: "checkbox", checked: this.state.dedup, onChange: this.toggleDedup}), " Hide duplicate links"
          )
        ), 

        React.DOM.ul({className: "unstyled links-list"}, 
          links
        )
      )
    );
  }
});

React.renderComponent(LinkList(null), document.getElementById("LinkList"))