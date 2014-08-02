/** @jsx React.DOM */

var Options = React.createClass({
  blockDomain: function (event) {
    var val = this.state.newBlockedDomain.toLowerCase().trim();
    if (val === "") {
      return;
    }
    this.state.blockedDomains.push(val);
    chrome.storage.sync.set({blockedDomains: this.state.blockedDomains});
    this.state.newBlockedDomain = "";
    this.setState(this.state);
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
    this.state.newBlockedDomain = event.target.value;
    this.setState(this.state);
  },
  removeDomain: function (index) {
    this.state.blockedDomains.splice(index, 1)
    chrome.storage.sync.set({blockedDomains: this.state.blockedDomains});
    this.setState(this.state);
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

React.renderComponent(<Options />, document.getElementById("Options"));