/*
 * Directive for generic CRUD (Create, Read, Update, Delete) of entities
 * 
 */

Auction.directive('subCrud', [
    '$modal',
    '$filter',
    'crudService',
    'ngTableParams',
    'tableParams',
    'toaster',
    'ExternalFunctionsResolver',
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
          /**
           * The field name of the containing entity
           */
          baseName: '@',
          /**
           * The id of the containing entity
           */
          baseId: '=',
          /**
           * Boolean. Whether the modal dialog should stay opened after the
           * initial save of the entity. Useful when some additional data that
           * requires the id should be entered
           */
          openedAfterInsert: '@',
          /**
           * Name of the service method for insertion
           */
          add: '@',
          /**
           * Name of the service method for deletion
           */
          remove: '@',
          /**
           * Name of the service method for selecting the relevant entities
           */
          query: '@',
          /**
           * Name of the service method for getting an entity by id (for
           * editing)
           */
          getById: '@',
          /**
           * If the crud uses ng-table. Defaults to false.
           */
          hasNgTable: '=',
          /**
           * grouping field or function from ExternalFucntions service
           */
          groupBy: '@',
          /**
           * The table params
           */
          crudTableParams: '=',
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
          /**
           * If the button for new entity needs to be displayed. True by default
           */
          showAdd: '='

        },
        controller: function($scope, $element, $modal, $filter, crudService,
                ngTableParams, tableParams, toaster, $injector,
                ExternalFunctionsResolver) {

          $scope.btnAddShow = true;
          $scope.$watch('showAdd', function(n) {
            if (n == true || n == false) {
              $scope.btnAddShow = n;
            }
          });

          // Create modal dialog for editing entities
          $scope.modalCreate = $modal({
            scope: $scope,
            title: $filter('translate')($scope.crudTitle),
            template: 'templates/modal-form.tpl.html',
            contentTemplate: 'forms/manytomany/' + $scope.crudForm + '.html',
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

          // Initialize the empty entity object
          // $scope.entity = {};
          // Initialize the entities
          $scope.entities = [];

          // Get reference to the service
          var service = $injector.get($scope.crudService);

          // if crudTableParams is provided, override default values
          if ($scope.crudTableParams) {
            for (key in $scope.crudTableParams) {
              tableParams[key] = $scope.crudTableParams[key];
            }
          }

          if ($scope.hasNgTable == true) {
            var tableCfg = {
              total: $scope.entities.length, // length of data
              getData: function($defer, params) {
                // filtering
                var filteredData = params.filter() ? $filter('filter')(
                        $scope.entities, params.filter()) : $scope.entities;
                // sorting
                var sortedData = params.sorting() ? $filter('orderBy')(
                        filteredData, params.orderBy()) : $scope.entities;
                params.total(sortedData.length);
                $defer.resolve(sortedData.slice((params.page() - 1)
                        * params.count(), params.page() * params.count()));
              }
            };
            if ($scope.groupBy) {
              var groupBy = ExternalFunctionsResolver.get($scope.groupBy);
              tableCfg.groupBy = groupBy;
            }
            // crate the results table
            $scope.table = new ngTableParams(tableParams, tableCfg);
          }

          // Function to reload entities after save or delete
          $scope.reload = function(callback) {
            if ($scope.baseId != null) {
              $scope.entities = [];
              service[$scope.query]({
                id: $scope.baseId
              }, function(data) {
                $scope.entities = data;
                if ($scope.hasNgTable == true) {
                  $scope.table.reload();
                }
                if (callback && typeof callback === 'function') {
                  callback(data);
                }

              });
            }
          };

          $scope.$watch('baseId', function(n, o) {
            if (n == null || n === o) return;
            $scope.reload();
          });
          // Load entities and initialize table
          $scope.reload();

          // Shows modal dialog for editing entities, called on + Add button
          $scope.createNew = function() {
            $scope.clear();
            $scope.entity = {};
            if ($scope.onNew && typeof $scope.onNew === 'function') {
              $scope.onNew($scope, $scope.entity);
            } else {
              $scope.modalCreate.$promise.then($scope.modalCreate.show);
            }
          };

          // Fetch entity for editing and show modal dialog for editing, called
          // on Edit button
          $scope.edit = function(id) {
            $scope.clear();
            service[$scope.getById]({
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
            service.get({
              id: id
            }, function(data) {
              $scope.entity = data;
              if ($scope.onSelect && typeof $scope.onSelect === 'function') {
                $scope.onSelect($scope, data);
              }
            });
          };

          // Saves the entity using the REST service
          $scope.save = function() {
            // set the parent entity
            if ($scope.baseName) {
              $scope.entity[$scope.baseName] = {
                id: $scope.baseId
              };
            }

            if ($scope.openedAfterInsert == "true") {
              // invoke the predefined before save action, if configured
              if ($scope.entity.id) {
                $scope._isInitialInsert = false;
              } else {
                $scope._isInitialInsert = true;
              }
            } else {
              // invoke the before save action, if configured
              var bok = $scope.beforeSave
                      && typeof $scope.beforeSave === 'function';
              if (bok) {
                $scope.beforeSave($scope, $scope.entity);
              }
            }

            // invoke the save Rest service
            service[$scope.add]($scope.entity, function(data) {

              $scope.entity = data;
              toaster.pop('success', $filter('translate')('success'), $filter(
                      'translate')($scope.crudTitle)
                      + " " + $filter('translate')("action.saved"));

              // reload the entities
              $scope.reload();

              if ($scope.openedAfterInsert == "true") {
                // invoke the predefined after save action
                if (!$scope._isInitialInsert) {
                  $scope.modalCreate.hide();
                }
              } else {
                // invoke the after save action, if configured
                var aok = $scope.afterSave
                        && typeof $scope.afterSave === 'function';
                if (aok) {
                  $scope.afterSave($scope, $scope.entity);
                } else {
                  $scope.modalCreate.hide();
                  $scope.clear();
                }
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
            service[$scope.remove]({
              id: id
            }, function() {
              $scope.reload();
              $scope.modalDelete.hide();
              toaster.pop('success', $filter('translate')('success'), $filter(
                      'translate')($scope.crudTitle)
                      + " " + $filter('translate')("action.deleted"));
              if ($scope.afterDelete
                      && typeof $scope.afterDelete === 'function') {
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
        templateUrl: 'directives/sub-crud.html',
        link: function(scope, element, attrs, ctrl, transclude) {
          // Passing the scope to the transcluded element (the table)
          transclude(scope, function(clone, scope) {
            element.append(clone);
          });
        }
      };
    }]);