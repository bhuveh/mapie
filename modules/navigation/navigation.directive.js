// Calling our main app module here.
angular.module('app')
  .directive('topbar', function() {
    return {
      restrict: 'E',
      templateUrl: './modules/navigation/topbar.view.html'
    };
  })
  .directive('sidebar', function() {
    return {
      restrict: 'E',
      templateUrl: './modules/navigation/sidebar.view.html',
      controller: function($scope) {
        $scope.sidebar = false;
        $scope.toggleSidebar = function() {
          $scope.sidebar = !$scope.sidebar;
        };

        $scope.sidebarButton = 0;
        $scope.setSidebarButton = function(button) {
          $scope.sidebarButton = button;
        };
        $scope.isButton = function(button) {
          return $scope.sidebarButton == button;
        };
      }
    };
  });