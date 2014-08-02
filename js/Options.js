/** @jsx React.DOM */

var Options = React.createClass({displayName: 'Options',
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
        React.DOM.tr({key: domain}, 
          React.DOM.td({className: "txtM"}, 
            domain
          ), 
          React.DOM.td({className: "action-column"}, 
            React.DOM.button({className: "btn btn-block btn-danger", onClick: this.removeDomain.bind(this, index)}, 
              "remove"
            )
          )
        )
      );
    }, this);
    return (
      React.DOM.div({className: "container-fluid"}, 
        React.DOM.h1(null, "Link Grabber Options"), 
        React.DOM.div({className: "row"}, 
          React.DOM.div({className: "col-sm-6"}, 
            React.DOM.h2(null, "Blocked Domains"), 
            React.DOM.p(null, "Links from blocked domains will not be shown."), 
            React.DOM.table({className: "table table-striped domains-table"}, 
              React.DOM.thead(null, 
                React.DOM.tr(null, 
                  React.DOM.th(null, "domain"), 
                  React.DOM.th(null)
                )
              ), 
              React.DOM.tbody(null, 
                blockedDomains, 
                React.DOM.tr(null, 
                  React.DOM.td(null, 
                    React.DOM.form({onSubmit: this.blockDomain}, 
                      React.DOM.input({
                        type: "text", 
                        className: "form-control", 
                        value: this.state.newBlockedDomain, 
                        onChange: this.handleNewBlockDomainChange})
                    )
                  ), 
                  React.DOM.td({className: "action-column"}, 
                    React.DOM.button({className: "btn btn-block btn-primary", onClick: this.blockDomain}, 
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

React.renderComponent(Options(null), document.getElementById("Options"));