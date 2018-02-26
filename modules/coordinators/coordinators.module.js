(function(){
  'use strict';
  
  // Defining our coordinators module here.
  angular.module('coordinators', [ 'ngRoute' ])
  
  // Fake API service to manage coordinators with local storage.
  .factory('coordinatorService', [ '$timeout', '$filter', '$q', '$rootScope', function ($timeout, $filter, $q, $rootScope) {
    var service = {};

    service.GetAll = GetAll;
    service.GetById = GetById;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;
    
    service.SetCurrentCoordinator = SetCurrentCoordinator;

    return service;

    function GetAll() {
      var deferred = $q.defer();
      deferred.resolve(getCoordinators());
      return deferred.promise;
    };

    function GetById(cid) {
      var deferred = $q.defer();
      var filtered = $filter('filter')(getCoordinators(), { cid: cid });
      var coordinator = filtered.length ? filtered[0] : null;
      deferred.resolve(coordinator);
      return deferred.promise;
    };

    function Create(coordinator) {
      var deferred = $q.defer();
      // Simulate api call with $timeout
      $timeout(function () {
        var coordinators = getCoordinators();
        // Assign autogenerated cid
        var lastCoordinator = coordinators[coordinators.length - 1] || { cid: 0 };
        coordinator.cid = lastCoordinator.cid + 1;
        // Save to local storage
        coordinators.push(coordinator);
        setCoordinators(coordinators);
        deferred.resolve({ success: true });
      }, 1000);
      return deferred.promise;
    };

    function Update(coordinator) {
      var deferred = $q.defer();
      var coordinators = getCoordinators();
      for (var i = 0; i < coordinators.length; i++) {
        if (coordinators[i].cid === coordinator.cid) {
          coordinators[i] = coordinator;
          break;
        }
      }
      setCoordinators(coordinators);
      deferred.resolve();
      return deferred.promise;
    };

    function Delete(cid) {
      var deferred = $q.defer();
      var coordinators = getCoordinators();
      for (var i = 0; i < coordinators.length; i++) {
        var coordinator = coordinators[i];
        if (coordinator.cid === cid) {
          coordinators.splice(i, 1);
          break;
        }
      }
      setCoordinators(coordinators);
      deferred.resolve();
      return deferred.promise;
    };
    
    function SetCurrentCoordinator(cid) {
      GetById(cid).then( function(coordinator) {
        $rootScope.globals.currentCoordinator = coordinator;
      });
    };
    
    // private functions

    function getCoordinators() {
      if(!localStorage.coordinators){
        // Demo coordinator if no coordinators found.
        var coordinators = [{
          cid: 1,
          sname: "Demo Coordinator",
          address: "CEPT University",
          city: "Ahmedabad",
          pincode: 380009,
          devices: [ {id: "4434aa34awf2", location: "Living Room"} ],
          lastEditBy: "Researcher",
          lastEditOn: "15-02-2018 15:02:18"
        }];
        localStorage.coordinators = JSON.stringify(coordinators);
      } else {
        // Nothing.
      }
      return JSON.parse(localStorage.coordinators);
    }

    function setCoordinators(coordinators) {
      localStorage.coordinators = JSON.stringify(coordinators);
    }
  }])  
  
  // Manage coordinators controller here.
  .controller('CoordinatorsController', ['$scope', '$route', '$rootScope', '$location', 'coordinatorService', function($scope, $route, $rootScope, $location, coordinatorService) {
    (function initController() {
      // Show all coordinators. Needs loading gif.
      coordinatorService.GetAll()
        .then(function (coordinators) { 
          if(coordinators.length > 0) {
            $scope.coordinators = coordinators;
          } else {
            // No coordinator found?
          };
        });
    })();
    
    $scope.deleteCoordinator = function(cid) {
      coordinatorService.Delete(cid)
        .then(function () {
          $route.reload();
        });
    };
    
    $scope.setCoordinator = function(cid) {
      coordinatorService.SetCurrentCoordinator(cid);
      $location.path('/home');      
    };
  }])
  
  // Edit coordinator controller here.
  .controller('EditCoordinatorController', ['$scope', '$routeParams', '$rootScope', '$location', 'coordinatorService', function($scope, $routeParams, $rootScope, $location, coordinatorService) {
    (function initController() {
      $scope.dataloading = false;
      coordinatorService.GetById($routeParams.cid)
        .then(function (coordinator) {
          if(coordinator !== null) {
            $scope.coordinator = coordinator;
          } else {
            $scope.coordinator = {
              cid: 1,
              sname: "Demo Coordinator",
              address: "CEPT University",
              city: "Ahmedabad",
              pincode: 380009,
              devices: [ {id: "4434aa34awf2", location: "Living Room"} ],
              lastEditBy: "Admin",
              lastEditOn: "18-01-2017 23:01:01"
            };
            $scope.dataloading = true;
            coordinatorService.Create($scope.coordinator)
            .then(function () {
              $scope.dataloading = false;
            });
          };
      });
    })();
    
    var getTimestamp = function() {
      var dt = new Date();      
      var d = dt.getDate();
      if (d.toString().length < 2) 
        d = '0' + d;
      var m = dt.getMonth() + 1;
      if (m.toString().length < 2) 
        m = '0' + m;
      var y = dt.getFullYear();
      var h = dt.getHours();
      if (h.toString().length < 2) 
        h = '0' + h;
      var mi = dt.getMinutes();
      if (mi.toString().length < 2) 
        mi = '0' + mi;
      var s = dt.getSeconds();
      if (s.toString().length < 2) 
        s = '0' + s;
      return d + "-" + m + "-" + y + " " + h + ":" + mi + ":" + s;
    };      
    
    $scope.saveCoordinator = function() {
      $scope.dataloading = true;
      $scope.coordinator.lastEditBy = $rootScope.globals.currentUser.name;
      $scope.coordinator.lastEditOn = getTimestamp();
      coordinatorService.Update($scope.coordinator)
        .then(function () {
          $scope.msg = 'Update successful!';
          $location.path('/coordinators');
        });
    };
  }])  
})();
                                         