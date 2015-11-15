/*
 * Directive for generic combo (select)
 *
 */

Auction.directive('radioField', ['crudService', function(crudService) {
    return {
        restrict: 'E',
        templateUrl: 'directives/radio.html',
        scope: {
            // The label for translating entity name
            radioLabel: '@',
            // the model of the date
            radioModel: '=',
            radioDefault: '@',
            trueIcon: '@',
            falseIcon: '@',
            trueLabel: '@',
            falseLabel: '@',
            trueVal: '=',
            falseVal: '=',
            clearable: '='
        },
        controller: function($scope, $element, crudService) {
            $scope.trueValue = $scope.trueVal != null ? $scope.trueVal : true;
            $scope.falseValue = $scope.falseVal != null ? $scope.falseVal : false;

            $scope.clear = function() {
                $scope.radioModel = null;
            }

            if (typeof $scope.radioModel === 'undefined') {
                if ($scope.radioDefault === 'true') {
                    $scope.radioModel = $scope.trueValue;
                } else if ($scope.radioDefault === 'false') {
                    $scope.radioModel = $scope.falseValue;
                }
            }
        }
    };
}]);
