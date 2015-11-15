/*
 * Directive for generic combo (select)
 * 
 */

HrDirectives.directive('includeExclude', function() {
  return {
    restrict: 'E',
    scope: {
      included: '=',
      excluded: '=',
      property: '@',
      title: '@',
      onAdd: '=',
      onRemove: '='
    },
    controller: function($scope, $element) {
      
      $scope.add = function(index) {
        if($scope.onAdd && typeof $scope.onAdd === 'function') {
          $scope.onAdd(index, $scope.excluded[index]);
        }
        $scope.included.push($scope.excluded[index]);
        $scope.excluded.splice(index, 1);
      };

      $scope.remove = function(index) {
        if($scope.onRemove && typeof $scope.onRemove === 'function') {
          $scope.onRemove(index, $scope.included[index]);
        }
        $scope.excluded.push($scope.included[index]);
        $scope.included.splice(index, 1);
      };
    },
    templateUrl: 'directives/includeExclude.html'
  };
});
