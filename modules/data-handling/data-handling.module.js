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
          /*
          return $http({
            method: 'GET',
            url: rootUrl + '/view/device/logs/' + id,
            //params: 'limit=10, sort_by=created:desc',
            headers: {'Content-Type':'text/plain'}
          });
          */
        };  
		
        return service;
	}])
  
    // Instantaneous Data Controller.
    .controller('InstController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.data = [];
      
      DataService.getInstantaneous("4434aa34awe2")
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
          var renderChart = function(para) {
            var data = scope.data;
            if (para=="Temperature") { para = "temp"; }
            else if (para=="Humidity") { para = "hum"; };
            
            var colorDomain = d3.extent(data, function(d){
              return d["vals"][para];
            });
            
            var colorMin = d3.min(data, function(d){
              return d["vals"][para];
            });
            var colorMax = d3.max(data, function(d){
              return d["vals"][para];
            });
                    
            var colorScale = d3.scaleLinear()
                .domain(d3.ticks(colorMin, colorMax, 9))
                .range(["#494ad1", "#6074ea", "#7fb8ff", "#9cfcfc", "#b3f7a0", "#ffffa8", "#ffb663", "#ff6d6d", "#e2485c"]);
            
            d3.select(".heatmap").html("");
            
            var svg = d3.select(".heatmap")
              .append("svg")
                .attr("width", 750)
                .attr("height", 250);

            var rectangles = svg.selectAll("rect")
              .data(data)
              .enter()
              .append("rect"); 

            rectangles
                .attr("x", function(d){
                  return d.day * 2; 
                })
                .attr("y", function(d){
                  return d.hour * 10; 
                })
                .attr("width", 2)
                .attr("height", 10)
                .style("fill", function(d){
                  return colorScale(d["vals"][para]); 
                });    
          };
          
          scope.click = function(para) {
            renderChart(para);
          };
        }
      };
    })
  
    // Controller.
    .controller('DataController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.data = [];
      $scope.enabled = false;
      
      var tod = new Date();
      console.log(tod.getDate() + "/" + tod.getMonth() + "/" + tod.getFullYear());
      
      var deviceObject = {
        'start_date': '2016/01/01', 
        'end_date': '2016/12/31',
        //'device_id': '40d63c07dd36'
        'device_id': '4434aa34awe2'
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
        
        // For each day in the required range.
        for (var day = 0; day < dateArr.length; day++) {
          // If the date is in the returned data,
          if (!dataObj.hasOwnProperty(dateArr[day])) {
            continue;
          }
          // For each hour,
          for( var i = 0; i < dataObj[dateArr[day]].length; i++) {
            // Access each element in the array of objects - dataObj[date][i]
            // Find the object's first key - 
            for ( var hr in dataObj[dateArr[day]][i]) {
              if (dataObj[dateArr[day]][i].hasOwnProperty(hr)) {
                // And get the hour and values.
                flatArr.push({
                  day : day,
                  date : dateArr[day],
                  hour : hr,
                  vals : dataObj[dateArr[day]][i][hr]
                });
                break;
              }
            }              
          }          
        };
        $scope.data  = flatArr;
      };
      
      DataService.getCumulative(deviceObject)
      .then(function (response) {
          $scope.enabled = true;
          //console.log(response.data);
          processData(response.data);
        });      
      
    }])    
})();