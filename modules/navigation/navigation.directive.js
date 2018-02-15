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
      controller: function($scope, fetchRootScopeService) {
        $scope.user = fetchRootScopeService.GetUser();
        $scope.coordinator = fetchRootScopeService.GetCoordinator();
        
        $scope.sidebar = false;
        $scope.sidebarButton = 0;
        $scope.toggleSidebar = function() {
          $scope.sidebar = !$scope.sidebar;
        };

        $scope.setSidebarButton = function(button) {
          $scope.sidebarButton = button;
        };
        
        $scope.isButton = function(button) {
          return $scope.sidebarButton == button;
        };
      }
    };
  });