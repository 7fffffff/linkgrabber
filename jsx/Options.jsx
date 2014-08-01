/** @jsx React.DOM */

var Options = React.createClass({
  blockDomain: function (event) {
    var val = this.refs.newField.getDOMNode().value.trim();
    if (val === "") {
      return;
    }
    this.state.blockedDomains.push(val);
    chrome.storage.sync.set({blockedDomains: this.state.blockedDomains});
    this.setState(this.state);
    this.refs.newField.getDOMNode().value = "";
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
      blockedDomains: []
    };
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
          <td className="txtM">{domain}</td>
          <td className="textM txtC action-column">
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
        <div className="row-fluid">
          <div className="span6">
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
                    <form className="nomargins" onSubmit={this.blockDomain}>
                      <input ref="newField" type="text" className="input-block-level" />
                    </form>
                  </td>
                  <td className="txtM txtC action-column">
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