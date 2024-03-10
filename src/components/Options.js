import React, {useState} from 'react';
import './Options.css';

export default function Options(props) {
  const [newBlockedDomain, setNewBlockedDomain] = useState('');

  const blockDomain = (event) => {
    event.preventDefault();
    const val = newBlockedDomain.toLowerCase().trim();
    if (val === '') {
      return;
    }
    const blockedDomains = props.blockedDomains.slice(0);
    blockedDomains.push(val);
    setNewBlockedDomain('');
    props.setBlockedDomains(blockedDomains);
  };

  const handleNewBlockDomainChange = (event) => {
    setNewBlockedDomain(event.target.value);
  };

  const removeDomain = (index) => {
    const blockedDomains = props.blockedDomains.slice(0);
    blockedDomains.splice(index, 1);
    props.setBlockedDomains(blockedDomains);
  };

  const blockedDomains = props.blockedDomains.map((domain, index) => {
    return (
      <tr key={domain}>
        <td className="txtM">
          {domain}
        </td>
        <td className="BadDomainsActionCol">
          <button className="btn btn-block btn-danger" onClick={removeDomain.bind(null, index)} >
            remove
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="container-fluid">
      <h1>Link Grabber Options</h1>
      <div className="row">
        <div className="col-sm-6">
          <h2>Blocked Domains</h2>
          <p>Links from blocked domains will be hidden by default.</p>
          <table className="table table-striped">
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
                  <form onSubmit={blockDomain}>
                    <input
                      type="text"
                      className="form-control"
                      value={newBlockedDomain}
                      onChange={handleNewBlockDomainChange} />
                  </form>
                </td>
                <td className="BadDomainsActionCol">
                  <button className="btn btn-block btn-primary" onClick={blockDomain}>
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