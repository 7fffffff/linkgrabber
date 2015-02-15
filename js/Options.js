var Options = React.createClass({displayName: 'Options',
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
        React.createElement("tr", {key: domain}, 
          React.createElement("td", {className: "txtM"}, 
            domain
          ), 
          React.createElement("td", {className: "action-column"}, 
            React.createElement("button", {className: "btn btn-block btn-danger", onClick: this.removeDomain.bind(this, index)}, 
              "remove"
            )
          )
        )
      );
    }, this);
    return (
      React.createElement("div", {className: "container-fluid"}, 
        React.createElement("h1", null, "Link Grabber Options"), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-sm-6"}, 
            React.createElement("h2", null, "Blocked Domains"), 
            React.createElement("p", null, "Links from blocked domains will not be shown."), 
            React.createElement("table", {className: "table table-striped domains-table"}, 
              React.createElement("thead", null, 
                React.createElement("tr", null, 
                  React.createElement("th", null, "domain"), 
                  React.createElement("th", null)
                )
              ), 
              React.createElement("tbody", null, 
                blockedDomains, 
                React.createElement("tr", null, 
                  React.createElement("td", null, 
                    React.createElement("form", {onSubmit: this.blockDomain}, 
                      React.createElement("input", {
                        type: "text", 
                        className: "form-control", 
                        value: this.state.newBlockedDomain, 
                        onChange: this.handleNewBlockDomainChange})
                    )
                  ), 
                  React.createElement("td", {className: "action-column"}, 
                    React.createElement("button", {className: "btn btn-block btn-primary", onClick: this.blockDomain}, 
                      "add"
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

React.render(React.createElement(Options, null), document.getElementById("Options"));