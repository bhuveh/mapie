(function(){
  'use strict';
  
  // Defining our main app module here, with dependencies.
  angular.module('app', [ 'loginRegister', 'coordinators', 'home', 'ngRoute', 'ngCookies' ])
  
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
        .when('/home', {
          controller: 'HomeController',
          templateUrl: './modules/home/home.view.html'
        })
        .otherwise({ redirectTo: '/login' });
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
                console.log("No you're not logged in.");
                $location.path('/login');
            };
            // Redirect from researcher pages if not researcher.
            var researcherPage = $.inArray($location.path(), ['/coordinators']) !== -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (researcherPage && !$rootScope.globals.currentUser.type) {
                console.log("You can't access the select screen!");
                $location.path('/home');
            };
        });
    }]);
})();