import React from 'react';

const LinkListEmpty = React.createClass({
  render: function () {
    return (
      <div className="container-fluid">
        <h1 className="LinkPageHeader">{this.props.source}</h1>
        <p>
          No links were found.
        </p>
      </div>
    );
  }
});

export default LinkListEmpty;
