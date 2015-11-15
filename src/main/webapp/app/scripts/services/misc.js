Auction.factory('Translation', ['$resource', function($resource) {
    return $resource('/data/rest/translations/:id', {}, {
        'insert': {
            method: 'POST',
            url: '/data/rest/translations/insert'
        }
    });
}]);
