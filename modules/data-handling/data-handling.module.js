(function(){
  'use strict';
  
  // Defining our data handling module here.
  angular.module('dataHandling', [ ])
    
    // Service.
	.factory('DataService', ['$http', function($http) {
        var rootUrl = 'https://pirhoalpha.com';
        var service = {};
      
        service.getCumulative = function(deviceObject) {
		  return $http.post(rootUrl + '/view/device/analysis/', deviceObject);
        };
        service.getInstantaneous = function(id) {
		  return $http.get(rootUrl + '/view/device/logs/' + id);
        };  
		
        return service;
	}])
  
  // Instantaneous Data Controller.
    .controller('InstController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.data = [];
      
      DataService.getInstantaneous("4434aa34awf2")
      .then(function (response) {
          console.log(response.data);
        });      
      
    }])
  
  // Cumulative Data Controller.
    .controller('CumuController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.data = [];
      
      var deviceObject = {
        'start_date': '2018/01/31', 
        'end_date': '2018/02/19',
        'device_id': '40d63c07dd36'
      };
      
      var createDateArray = function(startDate, endDate) {
        var sd = new Date(startDate);
        var ed = new Date(endDate);
        var da = [];
        
        for (var dt = sd; dt <= ed; dt.setDate(dt.getDate() + 1)) {          
          // Match formats.
          var d = dt.getDate();
          if (d.toString().length < 2) 
            d = '0' + d;
          var m = dt.getMonth() + 1;
          if (m.toString().length < 2) 
            m = '0' + m;
          var y = dt.getFullYear();
          da.push(y + "-" + m + "-" + d + " 00:00:00");
        }
        return da;
      };
      
      var dateArr = createDateArray(deviceObject.start_date, deviceObject.end_date);
      
      DataService.getCumulative("deviceObject")
      .then(function (response) {
          console.log(response.data);
        });      
      
    }])  
  
    // Directive.
    .directive('heatmap', function() {
      return {
        restrict: 'E',
        templateUrl: './modules/data-handling/heatmap.view.html',
        controller: 'DataController',
        link: function (scope, element, attrs){
          var data = scope.data;
          var renderChart = function() {
            var colorDomain = d3.extent(data, function(d){
              return d.value;
            });
            var colorScale = d3.scaleLinear()
                .domain(colorDomain)
                .range(["lightblue","blue"]);
            
            var svg = d3.select(".heatmap")
              .append("svg")
                .attr("width", 500)
                .attr("height", 500);

            var rectangles = svg.selectAll("rect")
              .data(data)
              .enter()
              .append("rect"); 

            rectangles
                .attr("x", function(d){
                  return d.day * 50; 
                })
                .attr("y", function(d){
                  return d.week * 50; 
                })
                .attr("width", 50)
                .attr("height", 50)
                .style("fill", function(d){
                  return colorScale(d.value); 
                });    
          };
        }
      };
    })
  
    // Controller.
    .controller('DataController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.data = [];
      
      var deviceObject = {
        'start_date': '2018/01/31', 
        'end_date': '2018/02/19',
        'device_id': '40d63c07dd36'
      };
      
      var createDateArray = function(startDate, endDate) {
        var sd = new Date(startDate);
        var ed = new Date(endDate);
        var da = [];
        
        for (var dt = sd; dt <= ed; dt.setDate(dt.getDate() + 1)) {          
          // Match formats.
          var d = dt.getDate();
          if (d.toString().length < 2) 
            d = '0' + d;
          var m = dt.getMonth() + 1;
          if (m.toString().length < 2) 
            m = '0' + m;
          var y = dt.getFullYear();
          da.push(y + "-" + m + "-" + d + " 00:00:00");
        }
        return da;
      };
      
      var dateArr = createDateArray(deviceObject.start_date, deviceObject.end_date);
      
      var processData = function(dataObj) {
        var flatArr = [];
        // For each date in the response data,
        for (var date in dataObj) {
          if (!dataObj.hasOwnProperty(date)) {
            continue;
          }
          // If the date is in the requested dates,
          if(dateArr.indexOf(date) > -1) {
            // For each hour,
            for( var i = 0; i < dataObj[date].length; i++) {
              // Access each element in the array of objects - dataObj[date][i]
              // Find the object's first key - 
              for ( var hr in dataObj[date][i]) {
                if (dataObj[date][i].hasOwnProperty(hr)) {
                  // And get the hour and values.
                  flatArr.push({
                    date : date,
                    hour : hr,
                    vals : dataObj[date][i][hr]
                  });
                  break;
                }
              }              
            }
          }
        };
        $scope.data  = flatArr;
      }      
      
      DataService.get(deviceObject)
      .then(function (response) {
          //console.log(response.data);
          processData(response.data);
        });      
      
    }])    
})();