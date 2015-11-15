/**
 * @ngdoc here we are configuring the module exposed through the Auction
 *        variable. The method receives an array that has a function as a last
 *        argument. Here, the angular inject the dependencies defined as strings
 *        in the array to the corresponding elements in the function. <br/> The
 *        $routeProvider is used to configure the routes. It maps templateUrl
 *        and optionally a controller to a given path. This is used by the
 *        ng-view directive. It replaces the content of the defining element
 *        with the content of the templateUrl, and connects it to the controller
 *        through the $scope.
 * @see https://docs.angularjs.org/guide/di
 */
Auction.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html'
    });

    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    });

    $routeProvider.when('/admin/auth/pages', {
        templateUrl: 'views/pages.html'
    });

    $routeProvider.when('/admin/players', {
        templateUrl: 'views/admin/players.html',
        controller: 'PlayerController'
    }).when('/admin/persons', {
        templateUrl: 'views/admin/persons.html'
    }).when('/admin/teams', {
        templateUrl: 'views/admin/teams.html'
    }).when('/admin/matches', {
        templateUrl: 'views/admin/matches.html'
    }).when('/admin/news', {
        templateUrl: 'views/admin/news.html'
    }).when('/admin/videos', {
        templateUrl: 'views/admin/videos.html'
    });

    $routeProvider.when('/404', {
        templateUrl: '404.html'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);
