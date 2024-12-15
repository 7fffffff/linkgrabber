import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Options.css';

const BlockedDomainsEditor = ({ blockedDomains, setBlockedDomains }) => {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(false);
    const formData = new FormData(event.target);
    setBlockedDomains(formData.get('blockedDomains').split('\n'));
    setSaved(true);
  };

  return (
    <form className="Options__form" onSubmit={handleSubmit}>
      <div className="Options__help-text">
        <p>Links from blocked domains will be hidden by default</p>
        <p>Enter one domain per line</p>
        <p>Lines starting with <strong>&#35;</strong> will be ignored</p>
        <p><code>example.com</code> will also block <code>www.example.com</code></p>
      </div>
      
      <div className="Options__form-group form-group">
        <textarea
          className="Options__textarea form-control"
          name="blockedDomains"
          rows="15"
          defaultValue={blockedDomains.join('\n')}
        />
      </div>

      <div className="Options__actions">
        <div className="Options__status">
          {saved && <div className="Options__success">Saved</div>}
        </div>
        <button type="submit" className="Options__submit btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

BlockedDomainsEditor.propTypes = {
  blockedDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  setBlockedDomains: PropTypes.func.isRequired
};

const Options = ({ blockedDomains, setBlockedDomains }) => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-sm-6">
        <h2 className="Options__title">Blocked Domains</h2>
        <BlockedDomainsEditor
          blockedDomains={blockedDomains}
          setBlockedDomains={setBlockedDomains}
        />
      </div>
    </div>
  </div>
);

Options.propTypes = {
  blockedDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  setBlockedDomains: PropTypes.func.isRequired
};

export default Options;