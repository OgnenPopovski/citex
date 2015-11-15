/*
 * Generic CRUD resource REST service
 */
Auction.factory('crudService', ['$resource', function($resource) {
    return function(type) {
        return $resource('/data/rest/' + type + '/:id', {}, {
            import: {
                method: 'POST',
                url: "/data/rest/" + type + "/import"
            },
            paged: {
                method: 'GET',
                url: "/data/rest/" + type + "/paged"
            }
        });
    };
}]);
