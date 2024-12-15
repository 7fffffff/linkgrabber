import React from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import Options from './components/Options';

const cleanDomains = (domains) => {
  return domains
    .map(domain => domain.trim())
    .filter(domain => domain.length > 0);
};

const saveBlockedDomains = async (domains) => {
  const cleanedDomains = cleanDomains(domains);
  await chrome.storage.sync.set({ blockedDomains: cleanedDomains });
};

const initializeOptions = async () => {
  const root = createRoot(document.getElementById('Options'));
  let storedData = {};

  const handleStorageChange = (changes) => {
    Object.entries(changes).forEach(([key, { newValue }]) => {
      storedData[key] = newValue;
    });
    renderOptions(storedData);
  };

  const renderOptions = (storage) => {
    root.render(
      <Options
        blockedDomains={storage.blockedDomains || []}
        setBlockedDomains={saveBlockedDomains}
      />
    );
  };

  // Listen for storage changes
  chrome.storage.onChanged.addListener(handleStorageChange);

  try {
    // Initialize with stored data
    const items = await chrome.storage.sync.get(null);
    storedData = {
      ...items,
      blockedDomains: items.blockedDomains || []
    };
    renderOptions(storedData);
  } catch (error) {
    console.error('Failed to initialize Options:', error);
    renderOptions({ blockedDomains: [] });
  }
};

// Define PropTypes for Options component
Options.propTypes = {
  blockedDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  setBlockedDomains: PropTypes.func.isRequired
};

// Initialize the application
initializeOptions();
