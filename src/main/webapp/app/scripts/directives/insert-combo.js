/*
 * Directive for generic combo (select)
 *
 */

Auction.directive('insertCombo', [
    'crudService',
    '$modal',
    '$filter',
    'toaster',
    function(crudService, $modal, $filter, toaster) {
        return {
            restrict: 'E',
            scope: {
                // The label for translating entity name
                comboLabel: '@',
                // The url of the rest service and the form name
                comboType: '@',
                comboName: '@',
                comboModel: '=',
                comboProperty: '@',
                comboGroupName: '@',
                comboGroupProperty: '@',
                comboRequired: '='
            },
            compile: function(tElem, attrs) {
                if (attrs.comboRequired == "true") {
                    tElem[0].children[1].children[1].setAttribute("required",
                        true);
                }
                return function(scope, elem, attrs) {
                    // linking function here
                };
            },
            controller: function($scope, $element, crudService) {

                // Get reference to the service
                var service = crudService($scope.comboType);

                // Create modal dialog for editing entities
                var modalCreate = $modal({
                    scope: $scope,
                    title: $filter('translate')($scope.comboLabel),
                    template: '/templates/modal-form.tpl.html',
                    contentTemplate: 'forms/' + $scope.comboType + '.html',
                    show: false
                });

                // Shows modal dialog for editing entities, called on
                // + Add button
                $scope.createNew = function() {
                    $scope.clear();
                    modalCreate.$promise.then(modalCreate.show);
                };

                // Saves the entity using the REST service
                $scope.save = function() {
                    service.save($scope.entity, function() {
                        $scope.reload();
                        modalCreate.hide();
                        toaster.pop('success', $filter('translate')('success'),
                            $filter('translate')($scope.comboLabel) + " " + $filter('translate')("action.saved"));
                    });
                };

                // Initializes new entity and clears errors
                $scope.clear = function() {
                    $scope.$root.errors = {};
                    $scope.entity = {};
                };

                // set the default combo property
                if ($scope.comboProperty == null) {
                    $scope.comboProperty = 'name';
                }

                var property = $scope.comboProperty;
                var groupProp = $scope.comboGroupName;
                var groupNameProp = $scope.comboGroupProperty;

                // Function for highlighting the meching when
                // searching
                $scope.markMatch = function(text, query, escapeMarkup) {
                    var markMatch = window.Select2.util.markMatch;
                    var markup = [];
                    if (query.term) {
                        markMatch(text, query.term, markup, escapeMarkup);
                        return markup.join("");
                    } else {
                        return text;
                    }
                };

                // Function that returns the item display
                $scope.formatItem = function(item, container, query,
                    escapeMarkup) {
                    return $scope
                        .markMatch(item[property], query, escapeMarkup);
                };

                // function for displaying the selected item
                $scope.formatResult = function(item) {
                    if (groupProp && item[groupProp]) {
                        var x = item[groupProp];
                        return x[groupNameProp] + '-' + item[property];

                    } else {
                        return item[property];
                    }
                };

                // Function that searches the term throught the items
                $scope.matcher = function(term, text, item) {
                    if (groupProp && item[groupProp]) {
                        return item[groupNameProp].toUpperCase().indexOf(
                                term.toUpperCase()) >= 0 || item[groupProp][groupNameProp].toUpperCase()
                            .indexOf(term.toUpperCase()) >= 0;
                    } else {
                        return item[property].toUpperCase().indexOf(
                            term.toUpperCase()) >= 0;
                    }
                };

                // The config object for the select2
                $scope.options = {
                    data: {
                        results: [],
                        text: property
                    },
                    formatSelection: $scope.formatResult,
                    formatResult: $scope.formatItem,
                    matcher: $scope.matcher
                };

                // Function for retrieving the combo items
                $scope.reload = function() {
                    service.query(function(data) {
                        var res = {};
                        if (groupProp) {
                            angular.forEach(data, function(val) {
                                var g = val[groupProp];
                                if (!g) {
                                    return;
                                }
                                var id = g[groupNameProp];

                                res[id] = res[id] || {
                                    name: id,
                                    group: g,
                                    children: []
                                };
                                res[id].children.push(val);
                            });
                            var arrayRes = [];

                            angular.forEach(res, function(v, k) {
                                arrayRes.push(v);
                            });
                            $scope.options.data.results = arrayRes;
                        } else {
                            $scope.options.data.results = data;
                        }
                    });
                };

                // fetch the combo items
                $scope.reload();

            },
            templateUrl: '/directives/insert-combo.html'
        };
    }
]);
