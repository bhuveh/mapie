(function(){
  'use strict';
  
  // Defining our home module here.
  angular.module('home', [ 'rzModule', 'loginRegister', 'coordinators' ])
  
    // Fetch rootScope data service.    
    .factory('fetchRootScopeService', [ '$rootScope', function ($rootScope) {
      var service = {};

      service.GetUser = GetUser;
      service.GetCoordinator = GetCoordinator;
      
      return service;
      
      function GetUser() {
        var user = $rootScope.globals.currentUser;
        return user;
      }
      
      function GetCoordinator() {
        var coordinator = $rootScope.globals.currentCoordinator;
        return coordinator;
      }
    
    }]) 
    
    // Home controller here.
    .controller('HomeController', ['$scope', '$rootScope', 'fetchRootScopeService', function($scope, $rootScope, fetchRootScopeService) {
    }])
    
    // View site info details controller here.
    .controller('InfoCoordinatorController', ['$scope', function($scope) {
      (function initController() {
        
      })();
    }])
  
    // Survey controller, has old slider for now.
    .controller('SurveyController', ['$scope', '$window', function($scope, $window) {
      $scope.slider = {
        val: 0,
        opt: {
          floor: -400,
          ceil: 400,
          step: 1,
          vertical: true,
          hidePointerLabels: true,
          hideLimitLabels: true,
          translate: function(value) {
            return value/100;
          },
          showTicks: 100,
          getLegend: function(value) {
            if(value==-400)
              return 'Very Cold';
            if(value==-300)
              return 'Cold';
            if(value==-200)
              return 'Cool';
            if(value==-100)
              return 'Slightly Cool';
            if(value==0)
              return 'Neutral';
            if(value==100)
              return 'Slightly Warm';
            if(value==200)
              return 'Warm';
            if(value==300)
              return 'Hot';
            if(value==400)
              return 'Very Hot';
            return null;
          },
        }
      };
      $scope.clickButton = function() {
        $window.alert('Your vote has been submitted! Thanks for voting!');
      };
    }])
      
    // Edit user information controller.
    .controller('EditUserDataController', ['$scope', '$window', 'userService', 'authenticationService', function($scope, $window, userService, authenticationService) {     
      $scope.saveUser = function() {
        $scope.dataLoading = true;
  
        userService.Update($scope.user)
          .then(function () {
            console.log('User update successful!');
            $scope.msg = 'Changes made!';
            authenticationService.SetCredentials($scope.user, $scope.user.password);
            $scope.dataLoading = false;
          });     
        $window.alert('Changes to user details saved.');
      };
    }]);
})();