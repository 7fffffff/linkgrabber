var React = require("react");

function dedup (links) {
  var uniq = {};
  return links.reduce(function (memo, link) {
    if (!uniq[link.href]) {
      memo.push(link);
      uniq[link.href] = true;
    }
    return memo;
  }, []);
}

function groupByDomain(links) {
  links = links.slice();
  return links.sort(function (a, b) {
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
}

var LinkList = React.createClass({
  getInitialState: function () {
    return {
      dedup: this.props.dedup,
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
    if (this.props.expired) {
      return (
        <div className="container-fluid">
          <h1>Expired</h1>
          <p>
            Link information has expired and is no longer available.
            Please close this tab and try again.
          </p>
        </div>
      );
    }
    var links = this.props.links.slice();
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
        <h1 className="links-header">{this.props.source}</h1>

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

module.exports = LinkList;