(function(){
  'use strict';
  
  // Defining our coordinators module here.
  angular.module('coordinators', [])
  
  // Coordinators controller here.
  .controller('CoordinatorsController', ['$scope', function($scope) {
    $scope.coordinators = [
      {
        cid: 1,
        sname: "CEPT",
        address: "Vasant Vihar, Navrangpura",
        city: "Ahmedabad",
        pincode: 380009,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:01:01"
      },
      {
        cid: 2,
        sname: "IIM A",
        address: "Vastrapur",
        city: "Ahmedabad",
        pincode: 380015,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:02:01"
      },
      {
        cid: 3,
        sname: "IIT B",
        address: "Powai",
        city: "Mumbai",
        pincode: 400076,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:03:01"
      },
      {
        cid: 4,
        sname: "VNIT",
        address: "South Ambazari Road",
        city: "Nagpur",
        pincode: 440010,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:04:01"
      }
    ];
  }]);  
})();