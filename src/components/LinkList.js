import React from 'react';
import cx from 'classnames';
import LinkListEmpty from './LinkListEmpty';
import LinkListExpired from './LinkListExpired';
import './LinkList.css';

function filterLinks (links, s) {
  return links.reduce((memo, link) => {
    if (link.href.indexOf(s) >= 0) {
      memo.push(link);
    }
    return memo;
  }, []);
}

function findDuplicates (links) {
  const uniq = {};
  return links.reduce((memo, link) => {
    if (!uniq[link.href]) {
      memo.push(false);
      uniq[link.href] = true;
    } else {
      memo.push(true)
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
      groupByDomain: false,
      filter: ''
    };
  },
  copyLinks: function (event) {
    const textarea = document.createElement('textarea');
    const selection = window.getSelection();
    const prevRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const copyFrom = document.createRange();
    copyFrom.selectNodeContents(this.linkList)
    selection.removeAllRanges();
    selection.addRange(copyFrom);
    document.execCommand('copy');
    selection.removeAllRanges();
    if (prevRange) {
      selection.addRange(prevRange);
    }
  },
  filterChanged: function (event) {
    this.setState({filter: event.target.value});
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
      return (<LinkListExpired />);
    }
    if (this.props.links.length === 0) {
      return (<LinkListEmpty source={this.props.source} />);
    }
    let links = this.props.links;
    if (this.state.groupByDomain) {
      links = groupByDomain(links);
    }
    if (this.state.filter) {
      links = filterLinks(links, this.state.filter);
    }
    const duplicates = findDuplicates(links);
    const items = links.reduce((memo, link, index) => {
      if (this.state.dedup && duplicates[index]) {
        return memo;
      }
      const itemClassName = cx('LinkListItem', {
        'LinkListItem--duplicate': duplicates[index]
      });
      memo.push(
        <li className={itemClassName} key={index}>
          <a href={link.href}>{link.href}</a>
        </li>
      );
      return memo;
    }, []);
    let status = null;
    if (items.length === 1) {
      status = (
        <div className="form-group LinkPageStatus">
          <p className="form-control-static">
            1 link out of {this.props.links.length} shown
          </p>
        </div>
      )
    } else {
      status = (
        <div className="form-group LinkPageStatus">
          <p className="form-control-static">
            {items.length} links out of {this.props.links.length} shown
          </p>
        </div>
      );
    }
    return (
      <div className="container-fluid">
        <h1 className="LinkPageHeader">{this.props.source}</h1>
        <div className="clearfix">
          <div className="form-inline LinkPageOptionsForm">
            <div className="form-group">
              <div >
                <label className="checkbox-inline">
                  <input type="checkbox" checked={this.state.dedup} onChange={this.toggleDedup} /> Hide duplicate links
                </label>
              </div>
            </div>
            <div className="form-group">
              <div>
                <label className="checkbox-inline">
                  <input type="checkbox" checked={this.state.groupByDomain} onChange={this.toggleGroupByDomain} /> Group by domain
                </label>
              </div>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="substring filter" autoFocus value={this.state.filter} onChange={this.filterChanged} />
            </div>
            <div className="form-group">
              <button className="btn btn-default" disabled={items.length === 0} onClick={this.copyLinks}>
                Copy {items.length}
              </button>
            </div>
            {status}
          </div>
        </div>
        <ul ref={n => this.linkList = n} className="LinkList">
          {items}
        </ul>
      </div>
    );
  }
});

export default LinkList;
