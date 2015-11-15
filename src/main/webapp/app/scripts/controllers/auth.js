Auction.controller('LoginController', ['$scope', '$rootScope', '$location',
    '$cookieStore', 'UserService', 'Auth',

    function($scope, $rootScope, $location, $cookieStore, UserService, Auth) {
        $scope.rememberMe = false;

        $scope.login = function() {
            UserService.authenticate($.param({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }), function(authenticationResult) {
                $rootScope.authToken = authenticationResult.token;
                $rootScope.loginAction = true;
                Auth.authenticate();
                if ($rootScope.returnPath && $rootScope.returnPath != "/login") {
                    $location.path($rootScope.returnPath);
                    delete $rootScope.returnPath;
                } else {
                    $location.path("/");
                }
            });
        };
    }
]);


Auction.controller('UserController', [
    '$scope',
    '$filter',
    '$modal',
    'crudService',
    'ngTableParams',
    function($scope, $filter, $modal, crudService, ngTableParams) {

        var User = crudService('users');

        $scope.saveEmployee = function() {
            User.save($scope.user).$promise.then(function(data) {});

        };

        $scope.changeEmployee = function(_scope, user) {
            $scope.user = user;
        };
    }
]);


Auction.controller('PageGroupController', ['$scope', function($scope) {
    $scope.setBase = function(_scope, base) {
        $scope.entity = base;
    };
    $scope.clearBase = function(_scope) {
        delete $scope.entity;
    };

    $scope.onGroupsInit = function(_scope) {
        _scope.faChange = function(n) {
            if (!n) return;
            _scope.entity.icon = 'fa fa-fw ' + n;
        };
        _scope.renderIcon = function(clean, formated) {
            return "<i class='fa fa-fw " + clean + "'></i> " + formated;
        };
    };

}]);

Auction.controller('PageController', ['$scope', '$modal', '$filter', 'Page',
    function($scope, $modal, $filter, Page) {

        $scope.modalAssign = $modal({
            scope: $scope,
            title: $filter('translate')('eauction.assign_appraisal'),
            template: 'templates/modal-form.tpl.html',
            contentTemplate: 'forms/admin/auth/assign_page.html',
            show: false
        });


        $scope.loadAssignments = function(page) {
            $scope.userRolePages = Page.findAssigned({
                id: page.id
            });
        };

        $scope.assign = function(page) {
            $scope.page = page;
            $scope.assignmentEntity = {};
            $scope.loadAssignments(page);
            $scope.modalAssign.$promise.then($scope.modalAssign.show);
        };

        $scope.save = function() {
            var roles = $scope.assignmentEntity.roles;
            Page.assign({
                page: $scope.page,
                roles: roles
            }, function() {
                $scope.userRolePages.length = 0;
                $scope.loadAssignments($scope.page);
            });
        };

        $scope.onGroupsInit = function(_scope) {
            _scope.assign = $scope.assign;

            _scope.faChange = function(n, o) {
                if (!n) return;
                _scope.entity.icon = 'fa fa-fw ' + n;
            };

            _scope.renderIcon = function(clean, formated) {
                return "<i class='fa fa-fw " + clean + "'></i> " + formated;
            };
        };
    }
]);



Auction.controller('PlayerController', [
    '$scope',
    '$filter',
    '$modal',
    'crudService',
    'ngTableParams',
    function($scope, $filter, $modal, crudService, ngTableParams) {

        $scope.empty = function(crudScope) {
            $scope.crudScope = crudScope;
            $scope.crudScope.hide = function() {
                $scope.crudScope.entity = null;
            };
        };


    }
]);
