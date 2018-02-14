(function(){
  'use strict';
  
  // Defining our home module here.
  angular.module('home', [])
    // Current User service with API
    /*
    .factory('currentUserService', [ '$http', function ($http) {
      var service = {};
 
      service.GetUserData = GetUserData;
 
      return service;
      
      function GetUserData(id) {
        return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
      }
      
      // private functions
      function handleSuccess(res) {
        return res.data;
      }
      function handleError(error) {
        return function () {
          return { success: false, message: error };
        };
      }
    }])
    */
  
    // Fake user service with local storage.
    .factory('currentUserService', [ '$timeout', '$filter', '$q', function ($timeout, $filter, $q) {
      var service = {};
      
      service.GetUserData = GetUserData;

      return service;
 
      function GetUserData(id) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getUsers(), { id: id });
        var user = filtered.length ? filtered[0] : null;
        deferred.resolve(user);
        return deferred.promise;
      };
 
      // private functions 
      function getUsers() {
        if(!localStorage.users){
          localStorage.users = JSON.stringify([]);
        }
        return JSON.parse(localStorage.users);
      }
    }])
  
    // Home controller here.
    .controller('HomeController', ['$scope', '$rootScope', 'currentUserService', function($scope, $rootScope, currentUserService) {
      (function initController() {
        // Get current user data
        var id = $rootScope.globals.currentUser.id;
        currentUserService.GetUserData(id)
          .then(function (userData) {
            $scope.userData = userData;
            if(userData.coId) {
              $rootScope.globals.currentCoId = userData.coId;
            }
            // Set current coordinator data
            $scope.coId = $rootScope.globals.currentCoId;
            console.log("BUT" + $scope.coId);
        });
      })();      
    }])
  
})();