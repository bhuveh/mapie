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
      controller: function($scope, fetchRootScopeService, $timeout) {
        $scope.user = fetchRootScopeService.GetUser();
        $scope.coordinator = fetchRootScopeService.GetCoordinator();
        
        $scope.toggleSidebar = function() {
          $scope.sidebar.hide = !$scope.sidebar.hide;
        };

        $scope.setSidebarButton = function(button) {
          $scope.sidebar.button = button;
          $timeout(function() {
            $scope.sidebar.hide = false;
          }, 500);
        };
        
        $scope.isButton = function(button) {
          return $scope.sidebar.button == button;
        };
      }
    };
  });