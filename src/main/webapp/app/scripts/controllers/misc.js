Auction.controller('TranslationsController', ['$scope', 'crudService', function($scope, crudService) {
    $scope.onInit = function(crudScope) {
        crudScope.languages = crudService('languages').query();
    };
}]);
