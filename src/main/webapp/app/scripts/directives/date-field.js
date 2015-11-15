/*
 * Directive for date field
 *
 */

Auction.directive('dateField', ['crudService', '$filter',
    function(crudService, $filter) {
        return {
            restrict: 'E',
            templateUrl: 'directives/dateField.html',
            scope: {
                // The label for translating entity name
                dateLabel: '@',
                // The name of the date field
                dateName: '@',
                // the model of the date
                dateModel: '=',
                // if it is required
                dateRequired: '=',
                dateMin: '=',
                dateMax: '=',
                showTime: '@'
            },
            compile: function(tElem, attrs) {
                if (attrs.dateRequired == "true") {
                    tElem[0].children[0].children[1].setAttribute("required", true);
                }
                if (!attrs.showTime) {
                    tElem[0].children[0].children[1].setAttribute("disable-timepicker", true);
                }
                return function(scope, elem, attrs) {
                    scope.form = elem.parent().controller('form');
                    scope.fName = attrs.dateName;
                    scope.validationParams = attrs;
                };
            },
            controller: function($scope, $element, crudService) {}
        };
    }
]);
