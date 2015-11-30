import React from 'react';

const LinkListExpired = React.createClass({
  render: function () {
    return (
      <div className="container-fluid">
        <h1 className="LinkPageHeader">Expired</h1>
        <p>
          Link information has expired and is no longer available.
          Please close this tab and try again.
        </p>
      </div>
    );
  }
});

export default LinkListExpired;
