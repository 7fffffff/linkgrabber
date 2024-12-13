import React from 'react';
import {useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import LinkListEmpty from './LinkListEmpty';
import LinkListExpired from './LinkListExpired';
import './LinkList.css';

function copyLinks(element) {
  const selection = window.getSelection();
  const prevRange = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
  const tmp = document.createElement('div');
  const links = element.querySelectorAll('a');
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
}

function groupLinksByDomain(links) {
  const indexes = new Array(links.length);
  const rh = new Array(links.length);
  for (let i = 0; i < links.length; i++) {
    indexes[i] = i;
    rh[i] = links[i].hostname.toLowerCase().split('.').reverse().join('.');
  }
  indexes.sort((i, j) => {
    if (rh[i] < rh[j]) {
      return -1;
    }
    if (rh[i] > rh[j]) {
      return 1;
    }
    return i - j;
  });
  return indexes.map(i => links[i]);
}

function mapBlocked(links, blockedDomains) {
  blockedDomains = new Set(blockedDomains);
  return links.map(link => {
    let hostname = link.hostname.toLowerCase();
    const dots = [];
    for (let i = 0; i < hostname.length; i++) {
      if (hostname[i] === '.') {
        dots.push(i);
      }
    }
    if (blockedDomains.has(hostname)) {
      return true;
    }
    for (const dot of dots) {
      if (blockedDomains.has(hostname.substr(dot + 1))) {
        blockedDomains.add(hostname);
        return true;
      }
    }
    return false;
  });
}

function mapDuplicates(links) {
  const uniq = new Set();
  return links.map(link => {
    if (uniq.has(link.href)) {
      return true;
    }
    uniq.add(link.href);
    return false;
  });
}

function rejectSameOrigin(links, sourceUrl) {
  if (!sourceUrl) {
    return links;
  }
  if (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://')) {
    return links;
  }
  const parser = document.createElement('a');
  parser.href = sourceUrl;
  if (!parser.origin) {
    return links;
  }
  return links.filter(link => link.origin !== parser.origin);
}

export default function LinkList(props) {
  const linkListRef = useRef(null);

  const [filter, setFilter] = useState('');
  const [nextFilter, setNextFilter] = useState('');
  const [groupByDomain, setGroupByDomain] = useState(false);
  const [hideBlockedDomains, setHideBlockedDomains] = useState(true);
  const [hideDuplicates, setHideDuplicates] = useState(true);
  const [hideSameOrigin, setHideSameOrigin] = useState(false);

  const applyFilter = debounce(() => setFilter(nextFilter), 100, {trailing: true});
  const filterChanged = (event) => setNextFilter(event.target.value);
  const toggleBlockedLinks = () => setHideBlockedDomains(x => !x);
  const toggleDedup = () => setHideDuplicates(x => !x);
  const toggleGroupByDomain = () => setGroupByDomain(x => !x);
  const toggleHideSameOrigin = () => setHideSameOrigin(x => !x);

  useEffect(() => {
    const h = (event) => {
      const selection = window.getSelection();
      if (selection.type === 'None' || selection.type === 'Caret') {
        copyLinks();
      }
    };
    window.document.addEventListener('copy', h);
    return () => {
      window.document.removeEventListener('copy', h);
    };
  }, []);

  useEffect(applyFilter, [nextFilter]);

  if (props.expired) {
    return (<LinkListExpired />);
  }

  let links = props.links.slice(0);
  if (links.length === 0) {
    return (<LinkListEmpty source={props.source} />);
  }

  if (hideSameOrigin) {
    links = rejectSameOrigin(links, props.source);
  }
  if (groupByDomain) {
    links = groupLinksByDomain(links);
  }

  const blocked = mapBlocked(links, props.blockedDomains);
  const duplicates = mapDuplicates(links);
  const filterLowerCase = filter.trim().toLowerCase();
  const items = links.reduce((memo, link, index) => {
    if (hideDuplicates && duplicates[index]) {
      return memo;
    }
    if (hideBlockedDomains && blocked[index]) {
      return memo;
    }
    if (filterLowerCase) {
      const lowerHref = link.href.toLowerCase();
      if (lowerHref.indexOf(filterLowerCase) < 0) {
        return memo;
      }
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
      <h1 className="LinkPageHeader">{props.source}</h1>
      <div className="clearfix">
        <div className="form-inline LinkPageOptionsForm">
          <div className="form-group">
            <label className="checkbox-inline">
              <input type="checkbox" checked={hideDuplicates} onChange={toggleDedup} /> Hide duplicate links
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" checked={hideBlockedDomains} onChange={toggleBlockedLinks} /> Hide blocked links
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" checked={hideSameOrigin} onChange={toggleHideSameOrigin} /> Hide same origin
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" checked={groupByDomain} onChange={toggleGroupByDomain} /> Group by domain
            </label>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="substring filter" autoFocus value={nextFilter} onChange={filterChanged} />
          </div>
          <div className="form-group LinkPageStatus">
            <button className="btn btn-default" disabled={items.length === 0} onClick={() => copyLinks(linkListRef.current)}>
              Copy {items.length} / {props.links.length}
            </button>
          </div>
        </div>
      </div>
      <ul ref={linkListRef} className="LinkList">
        {items}
      </ul>
    </div>
  );
}
