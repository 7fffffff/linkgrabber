import React from 'react';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import LinkListEmpty from './LinkListEmpty';
import LinkListExpired from './LinkListExpired';
import './LinkList.css';

function filterLinks(links, s) {
  const lowerS = s.toLowerCase();
  return links.reduce((memo, link) => {
    const lowerHref = link.href.toLowerCase();
    if (lowerHref.indexOf(lowerS) >= 0) {
      memo.push(link);
    }
    return memo;
  }, []);
}

function findBlockedLinks(links, pattern) {
  return links.reduce((acc, link) => {
    if (pattern && pattern.exec(link.hostname)) {
      acc.push(true);
    } else {
      acc.push(false);
    }
    return acc;
  }, []);
}

function findDuplicates(links) {
  const uniq = {};
  return links.reduce((memo, link) => {
    if (!uniq[link.href]) {
      memo.push(false);
      uniq[link.href] = true;
    } else {
      memo.push(true);
    }
    return memo;
  }, []);
}

function groupByDomain(links) {
  let mapped = links.map((link, i) => {
    return {
      index: i,
      reverseHostname: link.hostname.split('.').reverse().join('.'),
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

function hideSameHost(links, sourceUrl) {
  if (!sourceUrl) {
    return links;
  }
  if (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://')) {
    return links;
  }
  const parser = document.createElement('a');
  parser.href = sourceUrl;
  if (!parser.hostname) {
    return links;
  }
  return links.filter(link => link.hostname !== parser.hostname);
}

class LinkList extends React.Component {
  state = {
    filter: '',
    groupByDomain: false,
    hideSameHost: false,
    nextFilter: '',
    showDuplicates: false,
    showBlockedDomains: false,
  };

  componentWillMount() {
    this.applyFilter = debounce(this.applyFilter, 100, { trailing: true });
  }

  applyFilter = () => {
    this.setState({ filter: this.state.nextFilter });
  };

  copyLinks = (event) => {
    const selection = window.getSelection();
    const prevRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const tmp = document.createElement('div');
    const links = this.linkList.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
      const clone = links[i].cloneNode(true);
      delete (clone.dataset.reactid);
      tmp.appendChild(clone);
      tmp.appendChild(document.createElement('br'));
    }
    document.body.appendChild(tmp);
    const copyFrom = document.createRange();
    copyFrom.selectNodeContents(tmp);
    selection.removeAllRanges();
    selection.addRange(copyFrom);
    document.execCommand('copy');
    document.body.removeChild(tmp);
    selection.removeAllRanges();
    if (prevRange) {
      selection.addRange(prevRange);
    }
  };

  filterChanged = (event) => {
    this.setState({ nextFilter: event.target.value }, this.applyFilter);
  };

  toggleBlockedLinks = () => {
    this.setState({
      showBlockedDomains: !this.state.showBlockedDomains,
    });
  };

  toggleDedup = () => {
    this.setState({
      showDuplicates: !this.state.showDuplicates,
    });
  };

  toggleGroupByDomain = () => {
    this.setState({
      groupByDomain: !this.state.groupByDomain,
    });
  };

  toggleHideSameHost = () => {
    this.setState({
      hideSameHost: !this.state.hideSameHost,
    });
  }

  render() {
    if (this.props.expired) {
      return (<LinkListExpired />);
    }
    let links = this.props.links.slice(0);
    if (links.length === 0) {
      return (<LinkListEmpty source={this.props.source} />);
    }
    if (this.state.hideSameHost) {
      links = hideSameHost(links, this.props.source);
    }
    if (this.state.groupByDomain) {
      links = groupByDomain(links);
    }
    if (this.state.filter) {
      links = filterLinks(links, this.state.filter);
    }
    const blocked = findBlockedLinks(links, this.props.blockPattern);
    const duplicates = findDuplicates(links);
    const items = links.reduce((memo, link, index) => {
      if (!this.state.showDuplicates && duplicates[index]) {
        return memo;
      }
      if (!this.state.showBlockedDomains && blocked[index]) {
        return memo;
      }
      const itemClassName = cx('LinkListItem', {
        'LinkListItem--blocked': blocked[index],
        'LinkListItem--duplicate': duplicates[index],
      });
      memo.push(
        <li key={index} className={itemClassName}>
          <a href={link.href} target="_blank">{link.href}</a>
        </li>
      );
      return memo;
    }, []);
    return (
      <div className="container-fluid">
        <h1 className="LinkPageHeader">{this.props.source}</h1>
        <div className="clearfix">
          <div className="form-inline LinkPageOptionsForm">
            <div className="form-group">
              <label className="checkbox-inline">
                <input type="checkbox" checked={this.state.showDuplicates} onChange={this.toggleDedup} /> Show duplicate links
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-inline">
                <input type="checkbox" checked={this.state.showBlockedDomains} onChange={this.toggleBlockedLinks} /> Show blocked links
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-inline">
                <input type="checkbox" checked={this.state.groupByDomain} onChange={this.toggleGroupByDomain} /> Group by domain
              </label>
            </div>
            <div className="form-group">
              <label className="checkbox-inline">
                <input type="checkbox" checked={this.state.hideSameHost} onChange={this.toggleHideSameHost} /> Hide same hostname
              </label>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="substring filter" autoFocus value={this.state.nextFilter} onChange={this.filterChanged} />
            </div>
            <div className="form-group LinkPageStatus">
              <button className="btn btn-default" disabled={items.length === 0} onClick={this.copyLinks}>
                Copy {items.length} / {this.props.links.length}
              </button>
            </div>
          </div>
        </div>
        <ul ref={n => this.linkList = n} className="LinkList">
          {items}
        </ul>
      </div>
    );
  }
}

export default LinkList;
