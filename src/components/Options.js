var React = require('react');

var Options = React.createClass({
  getInitialState: function () {
    return {
      newBlockedDomain: ''
    };
  },
  blockDomain: function (event) {
    event.preventDefault();
    var val = this.state.newBlockedDomain.toLowerCase().trim();
    if (val === '') {
      return;
    }
    var blockedDomains = this.props.blockedDomains.slice(0);
    blockedDomains.push(val);
    this.setState({newBlockedDomain: ''});
    this.props.setBlockedDomains(blockedDomains);
  },
  handleNewBlockDomainChange: function (event) {
    this.setState({
      newBlockedDomain: event.target.value
    });
  },
  removeDomain: function (index) {
    var blockedDomains = this.props.blockedDomains.slice(0);
    blockedDomains.splice(index, 1);
    this.props.setBlockedDomains(blockedDomains);
  },
  render: function () {
    var blockedDomains = this.props.blockedDomains.map(function (domain, index) {
      return (
        <tr key={domain}>
          <td className="txtM">
            {domain}
          </td>
          <td className="action-column">
            <button className="btn btn-block btn-danger" onClick={this.removeDomain.bind(this, index)} >
              remove
            </button>
          </td>
        </tr>
      );
    }, this);
    return (
      <div className="container-fluid">
        <h1>Link Grabber Options</h1>
        <div className="row">
          <div className="col-sm-6">
            <h2>Blocked Domains</h2>
            <p>Links from blocked domains will not be shown.</p>
            <table className="table table-striped domains-table">
              <thead>
                <tr>
                  <th>domain</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {blockedDomains}
                <tr>
                  <td>
                    <form onSubmit={this.blockDomain}>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.newBlockedDomain}
                        onChange={this.handleNewBlockDomainChange} />
                    </form>
                  </td>
                  <td className="action-column">
                    <button className="btn btn-block btn-primary" onClick={this.blockDomain}>
                      add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Options;
