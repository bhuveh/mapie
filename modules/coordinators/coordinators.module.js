(function(){
  'use strict';
  
  // Defining our coordinators module here.
  angular.module('coordinators', [])
  
  // Coordinators controller here.
  .controller('CoordinatorsController', ['$scope', function($scope) {
    $scope.coordinators = [
      {
        cid: 1,
        sname: "Sunflower",
        address: "Thakur Village, Kandivali (E)",
        city: "Mumbai",
        pincode: 400101,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:01:01"
      },
      {
        cid: 2,
        sname: "Lotus",
        address: "Thakur Village, Kandivali (E)",
        city: "Mumbai",
        pincode: 400101,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:02:01"
      },
      {
        cid: 3,
        sname: "Shuchidham",
        address: "Dindoshi, Goregaon (E)",
        city: "Mumbai",
        pincode: 400101,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:03:01"
      },
      {
        cid: 4,
        sname: "VNIT",
        address: "South Ambazari Road",
        city: "Nagpur",
        pincode: 440011,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:04:01"
      },
      {
        cid: 5,
        sname: "VNIT",
        address: "Bajaj Nagar",
        city: "Nagpur",
        pincode: 440011,
        lastEditBy: "Bhuvi",
        lastEditOn: "18-01-2017 23:05:01"
      }
    ];
  }]);  
})();