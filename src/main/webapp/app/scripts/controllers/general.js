Auction.controller('HeaderController', [
    '$scope',
    '$location',
    function($scope, $location) {
        $scope.pageGroups = [{
            label: 'Admin',
            icon: 'fa-gears',
            pages: [{
                label: 'persons',
                url: '/admin/persons',
                icon: 'fa-users'
            }, {
                label: 'players',
                url: '/admin/players',
                icon: 'fa-users'
            }, {
                label: 'teams',
                url: '/admin/teams',
                icon: 'fa-users'
            }, {
                label: 'matches',
                url: '/admin/matches',
                icon: 'fa-users'
            }, {
                label: 'news',
                url: '/admin/news',
                icon: 'fa-users'
            }, {
                label: 'videos',
                url: '/admin/videos',
                icon: 'fa-users'
            }]
        }];
        $scope.isActive = function(viewLocation) {
            var re = new RegExp(viewLocation);
            return re.test($location.path());
        };
    }
]);


Auction.controller('LanguageController', [
    '$scope',
    '$translate',
    '$location',
    'crudService',
    function($scope, $translate, $location, crudService) {
        $scope.languages = crudService('languages').query();

        $scope.isActive = function(lang) {
            return $translate.use() == lang;
        };

        $scope.changeLanguage = function(languageKey) {
            $translate.use(languageKey);
            moment.lang(languageKey);
        };
    }
]);
