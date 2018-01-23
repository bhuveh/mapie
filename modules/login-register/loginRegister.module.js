(function(){
  'use strict';
  
  // Defining our loginRegister module here.
  angular.module('loginRegister', [])
    
    // Authentication service here.
    .factory('authenticationService',
      ['$http', '$cookies', '$rootScope', '$timeout', 'userService',
      function ($http, $cookies, $rootScope, $timeout, userService) {
        var service = {};
        
        service.Login = function (email, password, callback) {          
          /* Dummy authentication for testing, uses $timeout to simulate api call
          ----------------------------------------------*/
          $timeout(function(){
            var response;
            userService.GetByEmail(email)
              .then(function (user) {
                if (user !== null && user.password === password) {
                  response = { id: user.id, usertype: user.usertype, firstname: user.firstname, success: true };
                } else {
                  response = { sucess: false, message: 'Email or password is incorrect!' };
                }
                callback(response);
              });
          }, 1000 );
          /* Use this for real authentication
           ----------------------------------------------*/
          //$http.post('/api/authenticate', { email: email, password: password })
          //    .success(function (response) {
          //        callback(response);
          //    });
        };

        service.SetCredentials = function (id, usertype, firstname, password) {
          var authdata = base64.encode(id + ':' + usertype + ':' + firstname + ':' + password);
          
          $rootScope.globals = {
            currentUser: {
              id: id,
              type: usertype,
              name: firstname,
              authdata: authdata
            }
          };
          
          // Set default auth header for http requests.
          $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
          
          // Store user details in globals cookie that keeps user logged in for one week or until they log out.
          var cookieExp = new Date();
          cookieExp.setDate(cookieExp.getDate() + 7);
          $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        };

        service.ClearCredentials = function () {
            console.log("Credentials cleared!");
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
        
        // Base64 encoding service used by AuthenticationService
        var base64 = {
          keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
          encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
          },
 
          decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
          }
        };
        
        return service;
    }])
  
    // User service with API
    /*
    .factory('userservice', [ '$http', function ($http) {
      var service = {};
 
      service.GetAll = GetAll;
      service.GetById = GetById;
      service.GetByEmail = GetByEmail;
      service.Create = Create;
      service.Update = Update;
      service.Delete = Delete;
 
      return service;
      
      function GetAll() {
          return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
      } 
      function GetById(id) {
        return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
      }
      function GetByEmail(email) {
        return $http.get('/api/users/' + email).then(handleSuccess, handleError('Error getting user by email'));
      }
      function Create(user) {
        return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
      }
      function Update(user) {
        return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
      }
      function Delete(id) {
        return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
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
    .factory('userService', [ '$timeout', '$filter', '$q', function ($timeout, $filter, $q) {
      var service = {};
      
      service.GetAll = GetAll;
      service.GetById = GetById;
      service.GetByEmail = GetByEmail;
      service.Create = Create;
      service.Update = Update;
      service.Delete = Delete;
 
      return service;
 
      function GetAll() {
        var deferred = $q.defer();
        deferred.resolve(getUsers());
        return deferred.promise;
      };
 
      function GetById(id) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getUsers(), { id: id });
        var user = filtered.length ? filtered[0] : null;
        deferred.resolve(user);
        return deferred.promise;
      };
 
      function GetByEmail(email) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getUsers(), { email: email });
        var user = filtered.length ? filtered[0] : null;
        deferred.resolve(user);
        return deferred.promise;
      };
 
      function Create(user) {
        var deferred = $q.defer();
        // Simulate api call with $timeout
        $timeout(function () {
          GetByEmail(user.email)
            .then(function (duplicateUser) {
              if (duplicateUser !== null) {
                deferred.resolve({ success: false, message: 'Email "' + user.email + '" already has an account!' });
              } else {
                var users = getUsers();
                // Assign autogenerated id
                var lastUser = users[users.length - 1] || { id: 0 };
                user.id = lastUser.id + 1;
                // Save to local storage
                users.push(user);
                setUsers(users);
                deferred.resolve({ success: true });
              }
            });
        }, 1000);
        return deferred.promise;
      };
 
      function Update(user) {
        var deferred = $q.defer();
        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === user.id) {
            users[i] = user;
            break;
          }
        }
        setUsers(users);
        deferred.resolve();
        return deferred.promise;
      };
 
      function Delete(id) {
        var deferred = $q.defer();
        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          if (user.id === id) {
            users.splice(i, 1);
            break;
          }
        }
        setUsers(users);
        deferred.resolve();
        return deferred.promise;
      };
 
      // private functions
 
      function getUsers() {
        if(!localStorage.users){
          localStorage.users = JSON.stringify([]);
        }
        return JSON.parse(localStorage.users);
      }
 
      function setUsers(users) {
        localStorage.users = JSON.stringify(users);
      }
    }])
  
    // Login controller here.
    .controller('LoginController', ['$scope', '$location', 'authenticationService', function($scope, $location, authenticationService) {
      $scope.login = login;
      
      (function initController() {
        // Reset login status
        authenticationService.ClearCredentials();
      })();
      
      function login() {
        $scope.dataLoading = true;
        authenticationService.Login($scope.user.email, $scope.user.password, function(response) {
          if(response.success) {
            console.log("You've logged in!");
            authenticationService.SetCredentials(response.id, response.usertype, response.firstname, $scope.user.password);
            if(response.usertype) {
              console.log("Redirecting to coordinators.");
              $location.path('/coordinators');
            } else {
              console.log("Redirecting to home.");
              $location.path('/home');
            };
          } else {
            console.log("You've not logged in!");
            $scope.error = response.message;
            $scope.dataLoading = false;
          }
        });
      };
    }])
  
    // Register controller here.
    .controller('RegisterController', ['$scope', 'userService', '$location', function($scope, userService, $location) {
      (function initController() {
        // Show all users
        userService.GetAll()
          .then(function (users) {
            console.log(users);
        });
      })();
      
      $scope.register = function(){
        $scope.dataLoading = true;
        $scope.regUser.usertype = true;
        
        if ($scope.regUser.usertype) {
          $scope.regUser.usertype = 1;
        } else {
          $scope.regUser.usertype = 0;
        }
        userService.Create($scope.regUser)
          .then(function (response) {
            if (response.success) {
              console.log('Registration successful!');
              $scope.msg = 'Registration successful!';
              $location.path('/login');
            } else {
              console.log(response.message);
              $scope.dataLoading = false;
            }
          });
      }      
    }])
  
    // Confirm password directive here.
    .directive('confirmPassword', function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel) {
          if (!ngModel) return;
          
          // Watch own value and re-validate on change
          scope.$watch(attrs.ngModel, function() {
            validate();
          });
          
          // Observe the other value and re-validate on change
          attrs.$observe('confirmPassword', function(val) {
            validate();
          });

          var validate = function() {
            var val1 = ngModel.$viewValue;
            var val2 = attrs.confirmPassword;
            ngModel.$setValidity('confirmPassword', val1 === val2);
          };
        }
      };
    });
})();