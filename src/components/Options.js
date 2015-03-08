var React = require("react");

var Options = React.createClass({
  blockDomain: function (event) {
    var val = this.state.newBlockedDomain.toLowerCase().trim();
    if (val === "") {
      return;
    }
    var blockedDomains = this.state.blockedDomains.slice(0);
    blockedDomains.push(val);
    this.setState(this.state);
    this.setState({
      newBlockedDomain: "",
      blockedDomains: blockedDomains
    });
    chrome.storage.sync.set({blockedDomains: blockedDomains});
    return false;
  },
  componentDidMount: function () {
    var self = this;
    chrome.storage.sync.get(null, function(options) {
      self.setState({
        blockedDomains: options.blockedDomains || []
      })
    });
  },
  getInitialState: function () {
    return {
      blockedDomains: [],
      newBlockedDomain: ""
    };
  },
  handleNewBlockDomainChange: function (event) {
    this.setState({
      newBlockedDomain: event.target.value
    });
  },
  removeDomain: function (index) {
    var blockedDomains = this.state.blockedDomains.slice(0);
    blockedDomains.splice(index, 1);
    this.setState({
      blockedDomains: blockedDomains
    });
    chrome.storage.sync.set({blockedDomains: blockedDomains});
  },
  render: function () {
    var blockedDomains = this.state.blockedDomains.map(function (domain, index) {
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