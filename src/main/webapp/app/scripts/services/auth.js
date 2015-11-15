Auction.factory('UserService', function($resource) {
    return $resource('/data/rest/user/:action', {}, {
        authenticate: {
            method: 'POST',
            params: {
                'action': 'authenticate'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    });
});

Auction.factory('User', ['$resource', function($resource) {
    return $resource('/data/rest/users/:id', {});
}]);

Auction.factory('Auth', [
    '$rootScope',
    '$cookieStore',
    '$location',
    'UserService',
    function($rootScope, $cookieStore, $location, UserService) {
        return {
            getUser: function(callback, errorCallback) {
                if (!$rootScope.loginAction) {
                    $rootScope.authToken = $cookieStore.get('token');
                    delete $rootScope.loginAction;
                }
                var authToken = $rootScope.authToken || $cookieStore.get('token');
                if (authToken !== undefined) {
                    $rootScope.authToken = authToken;
                    UserService.get(function(u) {
                        $rootScope.user = u;
                        if (callback && typeof callback === 'function') {
                            callback(u);
                        }
                    }, errorCallback);
                } else {
                    if (errorCallback && typeof errorCallback === 'function') {
                        errorCallback();
                    }
                    if ($location.path() != "/login") {
                        $rootScope.returnPath = $location.path();
                    }
                    $location.path("/login");
                }
            },
            authenticate: function(callback) {
                UserService.get(function(u) {
                    $rootScope.user = u;
                });
            },
            checkValidPage: function(user) {
                var path = $location.path();
                if (path === "/") return true;
                for (var i = 0; i < user.rolePages.length; ++i) {
                    var url = user.rolePages[i].url;
                    if (path.indexOf(url) == 0) {
                        $rootScope.activePage = user.rolePages[i];
                        return true;
                    }
                }
                for (var i = 0; i < user.userPages.length; ++i) {
                    var url = user.userPages[i].url;
                    if (path.indexOf(url) == 0) {
                        $rootScope.activePage = user.userPages[i];
                        return true;
                    }
                }
                return false;
            },
            logout: function() {
                delete $rootScope.user;
                delete $rootScope.authToken;
                $cookieStore.remove('token');
                $location.path("/login");
            },
            getToken: function() {
                return authToken;
            }
        };
    }
]);

Auction.factory('PageGroup', ['$resource', function($resource) {
    return $resource('/data/rest/page_groups/:id', {}, {
        'getPages': {
            method: 'GET',
            isArray: true,
            url: "/data/rest/page_groups/pages/by_group/:id"
        },
        'getAllPages': {
            method: 'GET',
            isArray: true,
            url: "/data/rest/page_groups/pages"
        },
        'addPage': {
            method: 'POST',
            url: '/data/rest/page_groups/pages/add'
        },
        'getPageById': {
            method: 'GET',
            url: "/data/rest/page_groups/pages/:id"
        },
        'deletePage': {
            method: 'DELETE',
            url: "/data/rest/page_groups/pages/:id"
        }
    });
}]);


Auction.factory('Page', ['$resource', function($resource) {
    return $resource('/data/rest/pages/:id', {}, {
        'assign': {
            method: 'POST',
            url: '/data/rest/pages/assign'
        },
        'findAssigned': {
            method: 'GET',
            isArray: true,
            url: '/data/rest/pages/:id/assigned_roles'
        }
    });
}]);
