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
		      return $http.get(rootUrl + '/view/device/insta/logs/' + id + '/');
        };
      
        service.getEnergy1 = function() {
		      return $http.get('./sample-data/energy-dummy.json');
        };
      
        service.getEnergy2 = function() {
		      return $http.get('./sample-data/energy-dummy-2.json');
        };
		
        return service;
	}])
  
    // Instantaneous Data Controller.
    .controller('InstController', [ '$scope', 'DataService', function($scope, DataService) {
      $scope.slider = {
        opt: {
          floor: -400,
          ceil: 400,
          step: 1,
          vertical: true,
          hidePointerLabels: true,
          hideLimitLabels: true,
          readOnly: true,
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
      $scope.getColorT = function(val) {
        if (val < 3.125) {
          return '#494ad1';
        } else if (val < 9.375) {
          return '#6074ea';
        } else if (val < 15.625) {
          return '#7fb8ff';
        } else if (val < 21.875) {
          return '#9cfcfc';
        } else if (val < 28.125) {
          return '#b3f7a0';
        } else if (val < 34.375) {
          return '#ffffa8';
        } else if (val < 40.625) {
          return '#ffb663';
        } else if (val < 46.875) {
          return '#ff6d6d';
        } else {
          return '#e2485c';
        }
      };
      $scope.getColorH = function(val) {
        if (val < 6.25) {
          return '#494ad1';
        } else if (val < 18.750) {
          return '#6074ea';
        } else if (val < 31.250) {
          return '#7fb8ff';
        } else if (val < 43.750) {
          return '#9cfcfc';
        } else if (val < 56.250) {
          return '#b3f7a0';
        } else if (val < 68.750) {
          return '#ffffa8';
        } else if (val < 81.250) {
          return '#ffb663';
        } else if (val < 93.750) {
          return '#ff6d6d';
        } else {
          return '#e2485c';
        }
      };
      
      DataService.getInstantaneous("4434aa34awe2")
      .then(function (response) {
          console.log(response.data.data[0]);
          $scope.date = response.data.data[0]["IST_Date"];
          $scope.time = response.data.data[0]["IST_time"];
          $scope.hum = response.data.data[0]["hum"];
          $scope.temp = response.data.data[0]["temp"];
        
          $scope.slider.val = ($scope.temp * 16) - 400;          

          $('#temp-box').css('background-color', $scope.getColorT($scope.temp));
          $('#hum-box').css('background-color', $scope.getColorH($scope.hum));
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
  
    // Heatmap Directive.
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
                .attr("width", 792)
                .attr("height", 300);
            
            var g = svg.append("g").attr("transform", "translate(" + 50 + "," + 10 + ")");

            var rectangles = g.selectAll("rect")
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
            
            var y = d3.scaleLinear()
              .domain([24,0])
              .range([0, 240]);
            
            var yaxis = d3.axisLeft()
              .scale(y);
            
            svg.append("g")
              .attr("transform", "translate(" + 50 + "," + 10 + ")")
              .call(yaxis);
            
            var x = d3.scaleTime()
              .domain([new Date("2016-01-01"), new Date("2016-12-31")])
              .range([0, 732])
              .nice();
            
            var xaxis = d3.axisBottom()
              .scale(x)
              .tickFormat(d3.timeFormat("%b"));
            
            svg.append("g")
              .attr("transform", "translate(" + 50 + "," + 250 + ")")
              .call(xaxis);
            
            svg.append("text")             
                .attr("transform","translate(" + (742) + " ," + 280 + ")")
                .style("text-anchor", "middle")
                .text("Month");
            
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 5)
                .attr("x", -50)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Hour of Day");      
          };
          
          scope.click = function(para) {
            renderChart(para);
          };
        }
      };
    })
  
    // Data Handling Controller.
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
  
    // Energy History Controller.
    
})();