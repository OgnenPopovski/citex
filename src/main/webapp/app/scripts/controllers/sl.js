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
