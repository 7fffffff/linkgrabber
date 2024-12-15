import React from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import LinkList from './components/LinkList';

const createBlockedDomainsSet = (domains) => {
  return new Set(
    domains
      .map(domain => domain.trim().toLowerCase())
      .filter(domain => domain && domain[0] !== '#')
  );
};

const initializeLinkList = async () => {
  const root = createRoot(document.getElementById('LinkList'));
  const queryParams = new URLSearchParams(window.location.search);
  const tabId = queryParams.get('tab_id');

  try {
    const session = await chrome.storage.session.get('tabData');
    const tabData = session?.tabData[tabId];

    if (!tabData) {
      root.render(<LinkList expired={true} />);
      return;
    }

    const { blockedDomains } = await chrome.storage.sync.get(['blockedDomains']);
    const { links, source } = tabData;

    document.title = `Extracted Links for ${source}`;
    
    root.render(
      <LinkList
        blockedDomains={createBlockedDomainsSet(blockedDomains)}
        expired={false}
        links={links}
        source={source}
      />
    );
  } catch (error) {
    console.error('Failed to initialize LinkList:', error);
    root.render(<LinkList expired={true} />);
  }
};

// Define PropTypes for LinkList component
LinkList.propTypes = {
  blockedDomains: PropTypes.instanceOf(Set),
  expired: PropTypes.bool.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    origin: PropTypes.string,
  })),
  source: PropTypes.string
};

// Initialize the application
initializeLinkList();