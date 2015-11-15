/*
 * Directive for generic CRUD (Create, Read, Update, Delete) of entities
 *
 */

Auction.directive('crud', [
    '$modal',
    '$filter',
    'crudService',
    'ngTableParams',
    'tableParams',
    'toaster',
    'ExternalFunctionsResolver',
    '$injector',
    function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                /**
                 * The label for translating entity name
                 */
                crudTitle: '@',
                /**
                 * The name of the form to be injected from the forms/manytomany
                 * folder
                 */
                crudForm: '@',
                /**
                 * The name of the service to be injected
                 */
                crudService: '@',
                // The url of the rest service and the form name
                crudType: '@',
                // The table params
                crudTableParams: '=',
                groupBy: '@',
                // The crud params
                crudParams: '=',
                /**
                 * Name of the service method for insertion
                 */
                insert: '@',
                /**
                 * Name of the service method for deletion
                 */
                remove: '@',
                /**
                 * Name of the service method for selecting the relevant entities
                 */
                query: '@',
                /**
                 * The parameters that should be added to the query method
                 */
                queryParams: '=',
                /**
                 * Name of the service method for getting an entity by id (for
                 * editing)
                 */
                getById: '@',
                /**
                 * Function invoked when the scope is cleared: function($scope){}
                 */
                onClear: '=',
                /**
                 * Function invoked when the entity is selected: function($scope,
                 * entity){}
                 */
                onSelect: '=',
                /**
                 * Function invoked when new entity is created: function($scope,
                 * emptyEntity){}
                 */
                onNew: '=',
                /**
                 * Function invoked when the entity is ready for editing:
                 * function($scope, entity){}
                 */
                onEdit: '=',
                /**
                 * Function invoked before saving: function($scope, entity){}
                 */
                beforeSave: '=',
                /**
                 * Function invoked after saving: function($scope, entity){}
                 */
                afterSave: '=',
                /**
                 * Function invoked after deleting: : function($scope, entityId){}
                 */
                afterDelete: '=',
                /**
                 * Function that is called after the controller is initialized>
                 * function($scope){}
                 */
                afterInit: '=',
                hideAdd: '=',
                paged: '='
            },
            controller: function($scope, $element, $modal, $filter, crudService,
                ngTableParams, tableParams, toaster, $injector,
                ExternalFunctionsResolver) {
                // Initialize the empty entity object
                $scope.entities = [];

                $scope.displayAdd = !$scope.hideAdd;
                var query = $scope.query || 'query';
                var get = $scope.getById || 'get';
                var rm = $scope.remove || 'delete';
                var save = $scope.insert || 'save';

                var service = null;
                // Get reference to the service
                if ($scope.crudService) {
                    service = $injector.get($scope.crudService);
                } else {
                    service = crudService($scope.crudType);
                }

                // configure table parameters
                if ($scope.crudTableParams) {
                    for (key in $scope.crudTableParams) {
                        tableParams[key] = $scope.crudTableParams[key];
                    }
                }

                var paged = $scope.paged || false;

                var tableCfg = {
                    total: $scope.entities.length, // length
                    // of data
                    getData: function($defer, params) {
                        if (paged) {
                            service.paged(params.url(), function(data) {
                                $scope.entities = data.content;
                                params.total(data.totalElements);
                                $scope.totalElements = data.totalElements;
                                $defer.resolve(data.content);
                            });
                        } else {
                            // filtering
                            var tableFilter = params.filter();

                            function adaptFilter(tableFilter) {
                                var modifiedFilter = {};
                                angular.forEach(tableFilter, function(val, key) {
                                    if (key.indexOf('.') > -1) {
                                        var objs = key.split('.');
                                        var x = modifiedFilter;
                                        for (var i = 0; i < objs.length - 1; i++) {
                                            if (!x[objs[i]]) {
                                                x[objs[i]] = {}
                                            }
                                            x = x[objs[i]];
                                        }
                                        x[objs[objs.length - 1]] = val;
                                    } else {
                                        modifiedFilter[key] = val;
                                    }
                                });
                                return modifiedFilter;
                            }

                            var filteredData = tableFilter ? $filter('filter')(
                                $scope.entities, adaptFilter(tableFilter)) : $scope.entities;
                            // sorting
                            var sortedData = params.sorting() ? $filter('orderBy')(
                                filteredData, params.orderBy()) : $scope.entities;
                            params.total(sortedData.length);
                            $defer.resolve(sortedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                        }
                    }
                };

                if ($scope.groupBy) {
                    var groupBy = ExternalFunctionsResolver.get($scope.groupBy);
                    tableCfg.groupBy = groupBy;
                }

                $scope.table = new ngTableParams(tableParams, tableCfg);

                // Function to reload entities after save or delete
                $scope.reload = function() {
                    if (paged) {
                        $scope.table.reload();
                    } else {
                        function onQueryResults(data) {
                            $scope.entities = data;
                            $scope.table.reload();
                        }
                        if ($scope.queryParams) {
                            service[query]($scope.queryParams, onQueryResults);
                        } else {
                            service[query](onQueryResults);
                        }
                    }
                };
                if (!paged) {
                    $scope.reload();
                }

                var crudForm = $scope.crudForm || $scope.crudType;
                // Create modal dialog for editing entities
                $scope.modalCreate = $modal({
                    scope: $scope,
                    title: $filter('translate')($scope.crudTitle),
                    template: 'templates/modal-form.tpl.html',
                    contentTemplate: 'forms/' + crudForm + '.html',
                    show: false
                });

                // Create modal dialog for deleting entities
                $scope.modalDelete = $modal({
                    scope: $scope,
                    title: $filter('translate')($scope.crudTitle),
                    template: 'templates/modal-delete.tpl.html',
                    content: $filter('translate')('generic.modal_delete_prompt'),
                    show: false
                });

                // Shows modal dialog for editing entities, called on
                // + Add button
                $scope.createNew = function() {
                    $scope.clear();
                    $scope.entity = {};
                    if ($scope.onNew && typeof $scope.onNew === 'function') {
                        $scope.onNew($scope, $scope.entity);
                    } else {
                        $scope.modalCreate.$promise.then($scope.modalCreate.show);
                    }
                };

                // Saves the entity using the REST service
                $scope.save = function() {

                    var bok = $scope.beforeSave && typeof $scope.beforeSave === 'function';
                    if (bok) {
                        $scope.beforeSave($scope, $scope.entity);
                    }
                    service[save]($scope.entity, function() {
                        $scope.reload();
                        toaster.pop('success', $filter('translate')('generic.success'),
                            $filter('translate')("action.saved"));
                        var aok = $scope.afterSave && typeof $scope.afterSave === 'function';
                        if (aok) {
                            $scope.afterSave($scope, $scope.entity);
                        } else {
                            $scope.modalCreate.hide();
                        }
                    });
                };

                // Fetch entity for editing and show modal dialog for
                // editing, called
                // on Edit button
                $scope.edit = function(id) {
                    $scope.clear();
                    service[get]({
                        id: id
                    }, function(data) {
                        $scope.entity = data;
                        if ($scope.onEdit && typeof $scope.onEdit === 'function') {
                            $scope.onEdit($scope, data);
                        } else {
                            $scope.modalCreate.$promise.then($scope.modalCreate.show);
                        }
                    });
                };

                // function that selects an entity
                $scope.select = function(id) {
                    $scope.clear();
                    service[get]({
                        id: id
                    }, function(data) {
                        $scope.entity = data;
                        if ($scope.onSelect && typeof $scope.onSelect === 'function') {
                            $scope.onSelect($scope, data);
                        }
                    });
                };

                // Shows delete modal dialog, called on Delete button
                $scope.deleteDialog = function(id) {
                    $scope.clear();
                    $scope.id = id;
                    $scope.modalDelete.$promise.then($scope.modalDelete.show);
                };

                // Deletes entity using the REST service
                $scope['delete'] = function(id) {
                    service[rm]({
                        id: id
                    }, function() {
                        $scope.clear();
                        $scope.reload();
                        $scope.modalDelete.hide();
                        toaster.pop('success', $filter('translate')('generic.success'),
                            $filter('translate')("action.deleted"));
                        if ($scope.afterDelete && typeof $scope.afterDelete === 'function') {
                            $scope.afterDelete($scope, id);
                        }
                    });
                };

                // Initializes new entity and clears errors
                $scope.clear = function() {
                    $scope.$root.errors = {};
                    delete $scope.entity;
                    delete $scope.id;
                    if ($scope.onClear && typeof $scope.onClear === 'function') {
                        $scope.onClear($scope);
                    }
                };
                if (typeof $scope.afterInit === 'function') {
                    $scope.afterInit($scope);
                }
            },
            controllerAs: 'crudCtrl',
            templateUrl: 'directives/crud.html',
            link: function(scope, element, attrs, ctrl, transclude) {
                // Passing the scope to the transcluded element (the
                // table)
                transclude(scope, function(clone, scope) {
                    element.append(clone);
                });
            }
        };
    }
]);
