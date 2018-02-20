(function(){
  'use strict';
  
  // Defining our main app module here, with dependencies.
  angular.module('app', [ 'loginRegister', 'coordinators', 'home', 'dataHandling', 'ngRoute', 'ngCookies' ])
  
    // Routing here.
    .config(function($routeProvider){
      $routeProvider
        .when('/', {
          controller: 'HomeController',
          templateUrl: './modules/home/home.view.html'
        })
        .when('/login', {
          controller: 'LoginController',
          templateUrl: './modules/login-register/login.view.html'
        })
        .when('/register', {
          controller: 'RegisterController',
          templateUrl: './modules/login-register/register.view.html'
        })
        .when('/coordinators', {
          controller: 'CoordinatorsController',
          templateUrl: './modules/coordinators/coordinators.view.html'
        })
        .when('/edit-coordinator/:cid', {
          controller: 'EditCoordinatorController',
          templateUrl: './modules/coordinators/edit-coordinator.view.html'
        })
        .when('/home', {
          controller: 'HomeController',
          templateUrl: './modules/home/home.view.html'
        })
        .when('/site-info', {
          controller: 'InfoCoordinatorController',
          templateUrl: './modules/home/site-info.view.html'
        })
        .when('/survey', {
          controller: 'SurveyController',
          templateUrl: './modules/home/survey.view.html'
        })
        .when('/edit-user-data', {
          controller: 'EditUserDataController',
          templateUrl: './modules/home/edit-user-data.view.html'
        })
        .when('/edit-logg', {
          controller: 'EditLoggerController',
          templateUrl: './modules/home/edit-log-loc.view.html'
        })
        .when('/add-bill', {
          controller: 'AddBillController',
          templateUrl: './modules/home/add-bill.view.html'
        })
        .when('/data-acqn', {
          templateUrl: './modules/home/data-acqn.view.html'
        })
        .when('/data-expt', {
          templateUrl: './modules/home/data-expt.view.html'
        })
        .when('/data-read', {
          templateUrl: './modules/home/data-read.view.html'
        })
        .when('/handling', {
          //controller: 'DataController',
          templateUrl: './modules/data-handling/data-handling.view.html'
        })
        .otherwise({ redirectTo: '/' });
    })
    
    // Run block for cookies.
    .run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // Keep user logged in after page refresh.
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // Redirect to login page if not logged in.
            if ($location.path() !== '/login' && $location.path() !== '/register' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            };
            // Redirect from researcher pages if not researcher.
            var researcherPage = $.inArray($location.path(), ['/coordinators', '/edit-logg', '/data-acqn', '/data-expt', '/data-read']) !== -1;
            if (researcherPage && !$rootScope.globals.currentUser.usertype) {
                $location.path('/home');
            };
        });
    }])
  
    // Everything controller.
    .controller('RootController', ['$scope', function($scope) {
      $scope.sidebar = {
        button : 0,
        hide : false
      };
    }])
  
})();