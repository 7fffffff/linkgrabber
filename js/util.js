function domainPattern(domains) {
  // ["foo.com", "bar.com"]
  // /^(?:[\w-]+\.)*(?:foo\.com|bar\.com)+$/i

  if (!domains || domains.length <= 0) {
    return new RegExp("(?!x)x"); // a regex that matches nothing
  }

  for (var i = 0; i < domains.length; i++) {
    domains[i] = domains[i].replace(/\./g, "\\.");
  }

  var s = "^(?:[\\w-]+\\.)*(?:" + domains.join("|") + ")+$";

  return new RegExp(s, "i");
}

function dedupLinks(links) {
  var s = {};
  var d = [];

  for (var i = 0; i < links.length; i++) {
    if (!s[links[i].href]) {
      d.push(links[i]);
      s[links[i].href] = true;
    }
  }

  return d;
}

function splitWith(coll, pred) {
  var x = [];
  var y = [];

  for (var i = 0; i < coll.length; i++) {
    if (pred(coll[i])) {
      x.push(coll[i]);
    } else {
      y.push(coll[i]);
    }
  }

  return [x, y];
}
