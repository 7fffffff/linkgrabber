import React from 'react';
import './LinkList.css';

function dedup (links) {
  const uniq = {};
  return links.reduce(function (memo, link) {
    if (!uniq[link.href]) {
      memo.push(link);
      uniq[link.href] = true;
    }
    return memo;
  }, []);
}

function groupByDomain(links) {
  let mapped = links.map((link, i) => {
    return {
      index: i,
      reverseHostname: link.hostname.split('.').reverse().join('.')
    };
  });
  mapped.sort((a, b) => {
    if (a.reverseHostname < b.reverseHostname) {
      return -1;
    }
    if (a.reverseHostname > b.reverseHostname) {
      return 1;
    }
    if (a.index < b.index) {
      return -1;
    }
    if (a.index > b.index) {
      return 1;
    }
    return 0;
  });
  return mapped.map(v => links[v.index]);
}

const LinkList = React.createClass({
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
    let links = this.props.links.slice();
    const total = links.length;
    let noLinksFound = null;
    if (total === 0) {
      noLinksFound = (
        <p>
          No links were found.
        </p>
      );
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

        {noLinksFound}
      </div>
    );
  }
});

export default LinkList;
