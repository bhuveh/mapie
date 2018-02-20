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
    .controller('HomeController', ['$scope', 'fetchRootScopeService', function($scope, fetchRootScopeService) {
    }])
    
    // View site info details controller here.
    .controller('InfoCoordinatorController', ['$scope', function($scope) {
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
    .controller('EditUserDataController', ['$scope', '$window', 'userService', 'authenticationService', 'fetchRootScopeService', '$location', function($scope, $window, userService, authenticationService, fetchRootScopeService, $location) {
      $scope.user = fetchRootScopeService.GetUser();
      $scope.eu = {
        id : $scope.user.id,
        coId : $scope.user.coId,
        firstname : $scope.user.firstname,
        lastname : $scope.user.lastname,
        email : $scope.user.email,
        phone : $scope.user.phone,
        address : $scope.user.address,
        city : $scope.user.city,
        pincode : $scope.user.pincode,
        usertype : $scope.user.usertype,
        cpassword : $scope.user.cpassword,
        password : $scope.user.password,
      }
      $scope.saveUser = function() {
        $scope.dataLoading = true;
  
        userService.Update($scope.eu)
          .then(function () {
            $scope.msg = 'Changes made!';
            authenticationService.SetCredentials($scope.eu, $scope.user.password);
            $scope.dataLoading = false;
          });     
        $window.alert('Changes to user details saved.');
        $location.path('/edit-user-data');
      };
    }])
  
    // Edit logger locations controller here.
    .controller('EditLoggerController', ['$scope', function($scope) {
    }])
  
    // Add electricity bill controller. Data goes nowhere.
    .controller('AddBillController', ['$scope', '$window', function($scope, $window) {
      $scope.clickButton = function() {
        $window.alert('Bill details have been added.');
      };
    }])
})();