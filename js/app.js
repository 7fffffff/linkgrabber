var module = angular.module("LinkGrabber", []);

module.controller("LinksCtrl", ["$scope", function($scope) {
  $scope.status = undefined;
  $scope.dedupCount = 0;
  $scope.links = [];
  $scope.blockedLinks = [];

  $scope.processData = function(data, options) {
    if (!data) {
      $scope.status = 'expired';
      return;
    }

    $scope.source = data.source;
    $scope.links = data.links;

    if (options.dedup) {
      var deduped = dedupLinks($scope.links);
      $scope.dedupCount = $scope.links.length - deduped.length;
      $scope.links = deduped;
    }

    if (options.blockedDomains.length > 0) {
      var blockPattern = domainPattern(options.blockedDomains);

      var t = splitWith($scope.links, function(v){
        return !blockPattern.exec(v.hostname);
      });

      $scope.links = t[0];
      $scope.blockedLinks = t[1];
    }

    $scope.status = 'loaded';
  }

  chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
    chrome.storage.sync.get(null, function(options){
      chrome.runtime.getBackgroundPage(function(page) {
        $scope.$apply(function() {
          $scope.processData(page.tabData[tabs[0].id], options);
        });
      });
    });
  });

}]);

module.controller("OptionsCtrl", ["$scope", function($scope) {
  $scope.addBlockedDomain = function() {
    if (!$scope.newBlockedDomain) {
      return;
    }

    var idx = $scope.blockedDomains.indexOf($scope.newBlockedDomain);

    if (idx < 0) {
      $scope.blockedDomains.push($scope.newBlockedDomain);
      $scope.newBlockedDomain = null;
      chrome.storage.sync.set({blockedDomains: $scope.blockedDomains});
    }
  };

  $scope.deleteBlockedDomain = function(domain) {
    if (!domain) {
      return;
    }

    var idx = $scope.blockedDomains.indexOf(domain);

    if (idx >= 0) {
      $scope.blockedDomains.splice(idx, 1);
      chrome.storage.sync.set({blockedDomains: $scope.blockedDomains});
    }
  };

  chrome.storage.sync.get(null, function(options) {
    $scope.$apply(function(){
      $scope.blockedDomains = options.blockedDomains;
      $scope.priorityDomains = options.priorityDomains;
    })
  });
}]);
