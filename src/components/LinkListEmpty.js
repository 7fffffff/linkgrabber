import React from 'react';
import PropTypes from 'prop-types';

const LinkListEmpty = ({ source }) => (
  <div className="container-fluid">
    <h1 className="LinkPage__header">{source}</h1>
    <p className="LinkPage__message">No links were found.</p>
  </div>
);

LinkListEmpty.propTypes = {
  source: PropTypes.string
};

export default LinkListEmpty;
