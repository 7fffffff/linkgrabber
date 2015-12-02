import React from 'react';

export default function LinkListEmpty (props) {
  return (
    <div className="container-fluid">
      <h1 className="LinkPageHeader">{props.source}</h1>
      <p>
        No links were found.
      </p>
    </div>
  );
}
